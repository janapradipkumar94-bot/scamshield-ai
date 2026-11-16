"""
Scan, history, report, and feedback schemas.
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class ScanTextRequest(BaseModel):
    text: str = Field(..., min_length=3, max_length=10000, description="Suspicious text or SMS message")
    save_history: bool = Field(False, description="Whether to save this scan to user history")
    save_raw_input: bool = Field(False, description="User consent to store raw text rather than anonymized hash")


class ScanURLRequest(BaseModel):
    url: str = Field(..., min_length=3, max_length=2048, description="Target website URL to analyze")
    save_history: bool = Field(False, description="Whether to save this scan to user history")
    save_raw_input: bool = Field(False, description="User consent to store raw URL")


class ScanEmailRequest(BaseModel):
    email_content: str = Field(..., min_length=5, max_length=25000, description="Email body content or raw email")
    sender: Optional[str] = Field(None, max_length=256, description="Sender email address")
    subject: Optional[str] = Field(None, max_length=500, description="Email subject line")
    save_history: bool = Field(False, description="Whether to save this scan to user history")
    save_raw_input: bool = Field(False, description="User consent to store raw content")


class ScanResponse(BaseModel):
    label: str
    risk_score: int = Field(..., ge=0, le=100)
    risk_level: str  # "Low Risk", "Suspicious", "High Risk"
    input_type: str  # "text", "url", "email"
    confidence: Optional[float] = None
    reasons: List[str] = []
    top_features: List[str] = []
    recommendation: str
    model_type: str
    is_model_trained: bool = True
    disclaimer: str
    scan_id: Optional[str] = None
    timestamp: str
    metadata: Optional[Dict[str, Any]] = None


class HistoryItem(BaseModel):
    id: str
    user_id: str
    input_type: str
    risk_score: int
    risk_level: str
    input_summary: str
    reasons: List[str] = []
    recommendation: str
    created_at: str


class ReportCreate(BaseModel):
    input_type: str = Field(..., description="'text', 'url', or 'email'")
    content: str = Field(..., min_length=3, max_length=10000, description="Reported fraudulent content")
    category: Optional[str] = Field("other", description="Suspected fraud category")
    user_notes: Optional[str] = Field(None, max_length=1000, description="User context or additional notes")
    anonymous: bool = Field(False, description="Submit anonymously without user attribution")


class FeedbackCreate(BaseModel):
    scan_id: Optional[str] = None
    rating: int = Field(..., ge=1, le=5, description="Satisfaction rating from 1 to 5")
    feedback_text: Optional[str] = Field(None, max_length=2000, description="User comments or model feedback")
