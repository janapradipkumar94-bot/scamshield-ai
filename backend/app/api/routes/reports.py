"""
Reports & Feedback API routes.
Allows users to submit suspicious content for analyst review and rate scam detection accuracy.
"""

import uuid
from datetime import datetime, timezone
from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from ...schemas.scan import ReportCreate, FeedbackCreate
from ...database.connection import db
from ...services.auth_service import get_optional_current_user

router = APIRouter(tags=["Reports & Feedback"])


@router.post("/reports", status_code=status.HTTP_201_CREATED)
def submit_report(
    payload: ReportCreate,
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_current_user)
):
    """
    Submit a suspicious text, URL, or email sample for cybersecurity investigation.
    """
    report_id = str(uuid.uuid4())
    user_email = "Anonymous"
    if current_user and not payload.anonymous:
        user_email = current_user.get("email")

    doc = {
        "_id": report_id,
        "user_id": current_user["_id"] if (current_user and not payload.anonymous) else None,
        "user_email": user_email,
        "input_type": payload.input_type,
        "category": payload.category or "General Suspicious",
        "content_preview": payload.content[:150] + ("..." if len(payload.content) > 150 else ""),
        "full_content": payload.content,
        "user_notes": payload.user_notes,
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "admin_notes": None
    }
    db.reports.insert_one(doc)
    return {
        "message": "Report submitted successfully for security investigation.",
        "report_id": report_id,
        "status": "pending"
    }


@router.post("/feedback", status_code=status.HTTP_201_CREATED)
def submit_feedback(
    payload: FeedbackCreate,
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_current_user)
):
    """
    Submit model accuracy feedback or user satisfaction review.
    """
    feedback_id = str(uuid.uuid4())
    doc = {
        "_id": feedback_id,
        "scan_id": payload.scan_id,
        "user_id": current_user["_id"] if current_user else None,
        "user_email": current_user.get("email") if current_user else "Guest",
        "rating": payload.rating,
        "feedback_text": payload.feedback_text,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    db.feedback.insert_one(doc)
    return {
        "message": "Thank you for helping improve ScamShield AI detection accuracy.",
        "feedback_id": feedback_id
    }
