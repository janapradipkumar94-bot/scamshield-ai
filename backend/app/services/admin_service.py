"""
Admin management service for ScamShield AI.
Provides aggregate system statistics, user administration, report review, and feedback inspection.
"""

from datetime import datetime, timezone
from typing import Dict, Any, List
from fastapi import HTTPException, status
from ..database.connection import db
from .scan_service import text_classifier


def get_system_stats() -> Dict[str, Any]:
    """Retrieve system-wide aggregate telemetry for administrator dashboard."""
    all_scans = list(db.scans.find())
    all_users = list(db.users.find())
    all_reports = list(db.reports.find())

    total_scans = len(all_scans)
    total_users = len(all_users)
    total_reports = len(all_reports)

    high = sum(1 for s in all_scans if s.get("risk_level") == "High Risk")
    suspicious = sum(1 for s in all_scans if s.get("risk_level") == "Suspicious")
    low = sum(1 for s in all_scans if s.get("risk_level") == "Low Risk")

    pending_reports = sum(1 for r in all_reports if r.get("status") == "pending")

    by_type = {"text": 0, "url": 0, "email": 0}
    for s in all_scans:
        itype = s.get("input_type", "text")
        by_type[itype] = by_type.get(itype, 0) + 1

    return {
        "total_scans": total_scans,
        "total_users": total_users,
        "high_risk_scans": high,
        "suspicious_scans": suspicious,
        "low_risk_scans": low,
        "total_reports": total_reports,
        "pending_reports": pending_reports,
        "scans_by_type": by_type,
        "system_health": "operational",
        "model_status": {
            "text_model_loaded": text_classifier.is_loaded(),
            "model_type": "TF-IDF + Logistic Regression",
            "evaluation_accuracy": text_classifier.metrics.get("accuracy") if text_classifier.metrics else None,
            "metrics": text_classifier.metrics
        }
    }


def list_all_users() -> List[Dict[str, Any]]:
    """List registered users with scan metrics for administrator management."""
    users = list(db.users.find().sort("created_at", -1))
    result = []
    for u in users:
        user_id = u["_id"]
        scan_count = db.scans.count_documents({"user_id": user_id})
        result.append({
            "id": user_id,
            "email": u.get("email"),
            "full_name": u.get("full_name"),
            "role": u.get("role", "user"),
            "created_at": u.get("created_at", ""),
            "total_scans": scan_count
        })
    return result


def update_user_role(target_user_id: str, new_role: str, admin_user_id: str) -> Dict[str, Any]:
    """Change user role (e.g., promote to admin or demote). Prevents self-demotion."""
    if target_user_id == admin_user_id and new_role != "admin":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Administrators cannot demote their own account"
        )

    target = db.users.find_one({"_id": target_user_id})
    if not target:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Target user not found")

    db.users.update_one({"_id": target_user_id}, {"$set": {"role": new_role}})
    target["role"] = new_role
    return target


def list_reports(status_filter: str = None) -> List[Dict[str, Any]]:
    """List suspicious-content reports submitted by users."""
    q = {}
    if status_filter and status_filter != "all":
        q["status"] = status_filter
    reports = list(db.reports.find(q).sort("created_at", -1))
    out = []
    for r in reports:
        out.append({
            "id": r["_id"],
            "user_email": r.get("user_email", "Anonymous"),
            "input_type": r.get("input_type", "text"),
            "category": r.get("category", "General Fraud"),
            "content_preview": r.get("content_preview", ""),
            "user_notes": r.get("user_notes"),
            "status": r.get("status", "pending"),
            "created_at": r.get("created_at", ""),
            "admin_notes": r.get("admin_notes")
        })
    return out


def update_report_status(report_id: str, new_status: str, admin_notes: str = None) -> Dict[str, Any]:
    """Update review status of a submitted suspicious report."""
    report = db.reports.find_one({"_id": report_id})
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")

    update_fields = {
        "status": new_status,
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    if admin_notes is not None:
        update_fields["admin_notes"] = admin_notes

    db.reports.update_one({"_id": report_id}, {"$set": update_fields})
    report.update(update_fields)
    return report


def list_feedback() -> List[Dict[str, Any]]:
    """Retrieve user feedback entries."""
    feedbacks = list(db.feedback.find().sort("created_at", -1).limit(50))
    return feedbacks
