"""
ScamShield AI — Main FastAPI Application Entry Point.
"""

import time
from collections import defaultdict
from contextlib import asynccontextmanager
from typing import Dict, List
from fastapi import FastAPI, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .core.config import settings
from .database.connection import db
from .services.auth_service import seed_default_admin
from .services.scan_service import text_classifier
from .api.routes import (
    health_router,
    scan_router,
    auth_router,
    history_router,
    reports_router,
    admin_router
)

# In-memory IP rate limiter: IP -> list of timestamps
_rate_limits: Dict[str, List[float]] = defaultdict(list)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- Startup ---
    print(f"[*] Starting {settings.PROJECT_NAME} in {settings.ENVIRONMENT} mode...")
    db.connect()
    seed_default_admin()
    if not text_classifier.is_loaded():
        print("[!] Warning: Text classifier model file not found. Ensure training/train_text_model.py has been executed.")
    else:
        print("[OK] Machine learning text scam classifier loaded successfully.")
    
    yield
    # --- Shutdown ---
    print(f"[*] Shutting down {settings.PROJECT_NAME}...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-Powered Scam Detection System API with TF-IDF, Logistic Regression, Heuristic Cybersecurity, and Role-Based Protection.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_origin_regex=r"https?://.*(vercel\.app|onrender\.com|github\.io|netlify\.app|railway\.app|localhost|127\.0\.0\.1).*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def rate_limiting_middleware(request: Request, call_next):
    """
    In-memory IP rate limiting middleware.
    Restricts requests per minute according to settings.RATE_LIMIT_PER_MINUTE.
    Exempts static docs or health checks.
    """
    path = request.url.path
    if path in ("/api/health", "/docs", "/openapi.json", "/favicon.ico"):
        return await call_next(request)

    client_ip = request.client.host if request.client else "unknown"
    now = time.time()
    window_start = now - 60.0

    # Prune old timestamps
    timestamps = [t for t in _rate_limits[client_ip] if t > window_start]
    if len(timestamps) >= settings.RATE_LIMIT_PER_MINUTE:
        return JSONResponse(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            content={"detail": "Too many requests. Rate limit exceeded. Please wait a moment."}
        )

    timestamps.append(now)
    _rate_limits[client_ip] = timestamps

    response = await call_next(request)
    return response


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Catch-all exception handler to prevent leaking sensitive system traces or credentials.
    """
    # Print internally for debugging
    print(f"[ERROR] Unhandled exception on {request.method} {request.url.path}: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred. Sensitive information protected."}
    )


# Mount API Routes
app.include_router(health_router, prefix="/api")
app.include_router(scan_router, prefix="/api")
app.include_router(auth_router, prefix="/api")
app.include_router(history_router, prefix="/api")
app.include_router(reports_router, prefix="/api")
app.include_router(admin_router, prefix="/api")


@app.get("/")
def root():
    return {
        "project": settings.PROJECT_NAME,
        "status": "online",
        "documentation": "/docs",
        "health": "/api/health"
    }
