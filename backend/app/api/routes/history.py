"""
History API routes: User-specific scan records and dashboard metrics.
"""

from typing import Dict, Any, List
from fastapi import APIRouter, Depends, status
from ...schemas.scan import HistoryItem
from ...services.scan_service import (
    get_user_scan_history,
    get_user_dashboard_stats,
    delete_user_scan,
    delete_all_user_scans
)
from ...services.auth_service import get_current_user

router = APIRouter(prefix="/history", tags=["History"])


@router.get("", response_model=Dict[str, Any])
def get_history(
    current_user: Dict[str, Any] = Depends(get_current_user),
    limit: int = 50,
    skip: int = 0
):
    """
    Retrieve authenticated user's scan history and aggregate stats.
    Strictly isolated: users only see their own scans.
    """
    user_id = current_user["_id"]
    history = get_user_scan_history(user_id=user_id, limit=limit, skip=skip)
    stats = get_user_dashboard_stats(user_id=user_id)

    return {
        "stats": stats,
        "scans": history
    }


@router.delete("/{scan_id}", status_code=status.HTTP_200_OK)
def delete_scan(
    scan_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Delete a specific scan record owned by the authenticated user."""
    delete_user_scan(user_id=current_user["_id"], scan_id=scan_id)
    return {"message": "Scan record deleted successfully", "scan_id": scan_id}


@router.delete("", status_code=status.HTTP_200_OK)
def clear_all_history(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Clear all scan records for the authenticated user."""
    count = delete_all_user_scans(user_id=current_user["_id"])
    return {"message": f"Successfully deleted {count} scan record(s)"}
