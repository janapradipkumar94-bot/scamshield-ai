from .health import router as health_router
from .scan import router as scan_router
from .auth import router as auth_router
from .history import router as history_router
from .reports import router as reports_router
from .admin import router as admin_router

__all__ = [
    "health_router",
    "scan_router",
    "auth_router",
    "history_router",
    "reports_router",
    "admin_router"
]
