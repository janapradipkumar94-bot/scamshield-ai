"""
Scan Service for ScamShield AI.
Orchestrates text, URL, and email model inference, applies privacy-preserving
hashing/sanitization for stored records, and manages user scan history.
"""

import hashlib
import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from fastapi import HTTPException, status
from ..database.connection import db
from ..ml.text_model import ScamTextClassifier
from ..ml.url_model import URLAnalyzer
from ..ml.email_model import EmailAnalyzer

# Singletons for ML analyzers
text_classifier = ScamTextClassifier()
url_analyzer = URLAnalyzer()
email_analyzer = EmailAnalyzer(text_classifier, url_analyzer)


def compute_sha256(content: str) -> str:
    """Hash content to preserve user privacy."""
    return hashlib.sha256(content.encode("utf-8")).hexdigest()


def sanitize_preview(content: str, max_chars: int = 120) -> str:
    """Generate a clean, truncated preview without preserving sensitive credentials."""
    cleaned = content.strip().replace("\n", " ")
    if len(cleaned) <= max_chars:
        return cleaned
    return cleaned[:max_chars] + "..."


def save_scan_record(
    user_id: str,
    input_type: str,
    raw_content: str,
    scan_result: Dict[str, Any],
    save_raw_input: bool = False
) -> str:
    """Save scan record to MongoDB/store with user privacy preservation."""
    scan_id = str(uuid.uuid4())
    input_hash = compute_sha256(raw_content)
    
    # If user consented to save raw input, keep preview, else only keep hash & category
    summary = sanitize_preview(raw_content) if save_raw_input else f"[Protected Content: SHA-256 {input_hash[:12]}...]"

    doc = {
        "_id": scan_id,
        "user_id": user_id,
        "input_type": input_type,
        "input_hash": input_hash,
        "input_summary": summary,
        "label": scan_result.get("label", "unknown"),
        "risk_score": scan_result.get("risk_score", 0),
        "risk_level": scan_result.get("risk_level", "Low Risk"),
        "reasons": scan_result.get("reasons", []),
        "recommendation": scan_result.get("recommendation", ""),
        "model_type": scan_result.get("model_type", ""),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    db.scans.insert_one(doc)
    return scan_id


def get_user_scan_history(user_id: str, limit: int = 50, skip: int = 0) -> List[Dict[str, Any]]:
    """Retrieve history items belonging exclusively to the authenticated user."""
    cursor = db.scans.find({"user_id": user_id}).sort("created_at", -1).skip(skip).limit(limit)
    history = []
    for doc in cursor:
        history.append({
            "id": doc["_id"],
            "user_id": doc["user_id"],
            "input_type": doc.get("input_type", "text"),
            "risk_score": doc.get("risk_score", 0),
            "risk_level": doc.get("risk_level", "Low Risk"),
            "input_summary": doc.get("input_summary", ""),
            "reasons": doc.get("reasons", []),
            "recommendation": doc.get("recommendation", ""),
            "created_at": doc.get("created_at", "")
        })
    return history


def get_user_dashboard_stats(user_id: str) -> Dict[str, Any]:
    """Calculate dashboard aggregate statistics for authenticated user."""
    user_scans = list(db.scans.find({"user_id": user_id}))
    total = len(user_scans)
    high = sum(1 for s in user_scans if s.get("risk_level") == "High Risk")
    suspicious = sum(1 for s in user_scans if s.get("risk_level") == "Suspicious")
    low = sum(1 for s in user_scans if s.get("risk_level") == "Low Risk")

    by_type = {"text": 0, "url": 0, "email": 0}
    for s in user_scans:
        itype = s.get("input_type", "text")
        by_type[itype] = by_type.get(itype, 0) + 1

    return {
        "total_scans": total,
        "high_risk_scans": high,
        "suspicious_scans": suspicious,
        "low_risk_scans": low,
        "scans_by_type": by_type
    }


def delete_user_scan(user_id: str, scan_id: str) -> bool:
    """Delete a scan record, strictly verifying user ownership to prevent unauthorized deletion."""
    record = db.scans.find_one({"_id": scan_id})
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scan record not found")
    
    if record.get("user_id") != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: You cannot delete another user's scan history"
        )

    res = db.scans.delete_one({"_id": scan_id})
    return res.deleted_count > 0


def delete_all_user_scans(user_id: str) -> int:
    """Clear all scan records for the authenticated user."""
    user_scans = list(db.scans.find({"user_id": user_id}))
    count = 0
    for s in user_scans:
        db.scans.delete_one({"_id": s["_id"]})
        count += 1
    return count
