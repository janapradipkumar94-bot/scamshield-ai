"""
Health Check endpoint.
"""

from fastapi import APIRouter
from ...database.connection import db
from ...services.scan_service import text_classifier

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("")
def health_check():
    """Verify application uptime, database mode, and ML model status."""
    return {
        "status": "healthy",
        "service": "ScamShield AI API",
        "database": {
            "connected": db.is_connected,
            "engine": "in_memory_engine" if db.is_memory_fallback else "mongodb"
        },
        "ml_models": {
            "text_classifier_loaded": text_classifier.is_loaded(),
            "model_type": text_classifier.metrics.get("model_name") if text_classifier.metrics else "Heuristic"
        }
    }
