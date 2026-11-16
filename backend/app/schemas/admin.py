"""
Admin management and analytics schemas.
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class AdminStats(BaseModel):
    total_scans: int
    total_users: int
    high_risk_scans: int
    suspicious_scans: int
    low_risk_scans: int
    total_reports: int
    pending_reports: int
    scans_by_type: Dict[str, int]
    system_health: str
    model_status: Dict[str, Any]


class ReportItem(BaseModel):
    id: str
    user_email: Optional[str]
    input_type: str
    category: str
    content_preview: str
    user_notes: Optional[str]
    status: str  # "pending", "verified_scam", "false_positive", "resolved"
    created_at: str
    admin_notes: Optional[str] = None


class ReportStatusUpdate(BaseModel):
    status: str = Field(..., pattern=r"^(pending|verified_scam|false_positive|resolved)$")
    admin_notes: Optional[str] = Field(None, max_length=1000)


class UserManagementItem(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    created_at: str
    total_scans: int = 0
