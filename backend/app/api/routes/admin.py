"""
Admin API routes: Role-protected administrative oversight and governance.
"""

from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Depends, Query
from ...schemas.admin import AdminStats, ReportItem, ReportStatusUpdate, UserManagementItem
from ...services.auth_service import get_current_admin
from ...services.admin_service import (
    get_system_stats,
    list_all_users,
    update_user_role,
    list_reports,
    update_report_status,
    list_feedback
)

router = APIRouter(prefix="/admin", tags=["Admin"], dependencies=[Depends(get_current_admin)])


@router.get("/stats", response_model=AdminStats)
def get_stats():
    """Retrieve system-wide aggregated telemetry and model performance metadata."""
    return get_system_stats()


@router.get("/reports", response_model=List[ReportItem])
def get_reports(status: Optional[str] = Query(None, description="Filter by status: pending, verified_scam, etc.")):
    """Retrieve list of user-submitted suspicious content reports."""
    return list_reports(status_filter=status)


@router.patch("/reports/{report_id}")
def modify_report_status(report_id: str, payload: ReportStatusUpdate):
    """Update review classification and security notes for a reported submission."""
    updated = update_report_status(
        report_id=report_id,
        new_status=payload.status,
        admin_notes=payload.admin_notes
    )
    return {"message": "Report status updated", "report": updated}


@router.get("/users", response_model=List[UserManagementItem])
def get_users():
    """List registered users and their scan volume."""
    return list_all_users()


@router.patch("/users/{user_id}/role")
def change_role(
    user_id: str,
    new_role: str = Query(..., pattern=r"^(user|admin)$"),
    admin: Dict[str, Any] = Depends(get_current_admin)
):
    """Modify user role. Cannot demote the currently acting admin."""
    updated = update_user_role(target_user_id=user_id, new_role=new_role, admin_user_id=admin["_id"])
    return {"message": "User role updated successfully", "user_id": user_id, "role": updated["role"]}


@router.get("/feedback")
def get_feedback():
    """View user ratings and model accuracy feedback submissions."""
    return list_feedback()
