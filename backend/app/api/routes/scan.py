"""
Scan API routes: Text, URL, and Email threat analysis endpoints.
"""

from datetime import datetime, timezone
from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from ...schemas.scan import ScanTextRequest, ScanURLRequest, ScanEmailRequest, ScanResponse
from ...services.scan_service import (
    text_classifier,
    url_analyzer,
    email_analyzer,
    save_scan_record
)
from ...services.auth_service import get_optional_current_user
from ...core.config import settings

router = APIRouter(prefix="/scan", tags=["Scanning"])


@router.post("/text", response_model=ScanResponse)
def scan_text(
    payload: ScanTextRequest,
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_current_user)
):
    """
    Analyze suspicious text/SMS content for social engineering, financial fraud, or credential theft.
    """
    content = payload.text.strip()
    if not content:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail="Content cannot be empty"
        )
    if len(content) > settings.MAX_TEXT_LENGTH:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Content exceeds maximum allowed size of {settings.MAX_TEXT_LENGTH} characters"
        )

    # Perform ML Text Analysis
    result = text_classifier.predict(content)
    now_iso = datetime.now(timezone.utc).isoformat()

    # Save to history if user requested and authenticated
    scan_id = None
    if payload.save_history and current_user:
        scan_id = save_scan_record(
            user_id=current_user["_id"],
            input_type="text",
            raw_content=content,
            scan_result=result,
            save_raw_input=payload.save_raw_input
        )

    return ScanResponse(
        label=result["label"],
        risk_score=result["risk_score"],
        risk_level=result["risk_level"],
        input_type="text",
        confidence=result.get("confidence"),
        reasons=result["reasons"],
        top_features=result.get("top_features", []),
        recommendation=result["recommendation"],
        model_type=result["model_type"],
        is_model_trained=result.get("is_model_trained", True),
        disclaimer=result["disclaimer"],
        scan_id=scan_id,
        timestamp=now_iso,
        metadata={
            "embedded_urls": result.get("embedded_urls", []),
            "evaluation_accuracy": result.get("evaluation_accuracy")
        }
    )


@router.post("/url", response_model=ScanResponse)
def scan_url(
    payload: ScanURLRequest,
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_current_user)
):
    """
    Analyze submitted URL for topological, lexical, and brand impersonation markers.
    Never navigates to or executes remote targets.
    """
    url_target = payload.url.strip()
    if not url_target:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail="URL cannot be empty"
        )
    if len(url_target) > 2048:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="URL exceeds maximum length of 2048 characters"
        )

    # Perform static heuristic and structural analysis
    result = url_analyzer.analyze(url_target)
    now_iso = datetime.now(timezone.utc).isoformat()

    scan_id = None
    if payload.save_history and current_user:
        scan_id = save_scan_record(
            user_id=current_user["_id"],
            input_type="url",
            raw_content=url_target,
            scan_result=result,
            save_raw_input=payload.save_raw_input
        )

    return ScanResponse(
        label=result["label"],
        risk_score=result["risk_score"],
        risk_level=result["risk_level"],
        input_type="url",
        confidence=0.85,
        reasons=result["reasons"],
        top_features=[f"Host: {result.get('hostname')}"],
        recommendation=result["recommendation"],
        model_type=result["model_type"],
        is_model_trained=False,  # Clearly declared as heuristic assessment
        disclaimer=result["disclaimer"],
        scan_id=scan_id,
        timestamp=now_iso,
        metadata={
            "hostname": result.get("hostname"),
            "features": result.get("features"),
            "https_security_notice": result.get("https_security_notice")
        }
    )


@router.post("/email", response_model=ScanResponse)
def scan_email(
    payload: ScanEmailRequest,
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_current_user)
):
    """
    Analyze pasted email content (headers, body text, and embedded links).
    """
    content = payload.email_content.strip()
    if not content:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail="Email content cannot be empty"
        )
    if len(content) > 25000:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="Email content exceeds maximum allowed length of 25,000 characters"
        )

    result = email_analyzer.analyze(
        email_content=content,
        sender=payload.sender or "",
        subject=payload.subject or ""
    )
    now_iso = datetime.now(timezone.utc).isoformat()

    scan_id = None
    if payload.save_history and current_user:
        scan_id = save_scan_record(
            user_id=current_user["_id"],
            input_type="email",
            raw_content=content,
            scan_result=result,
            save_raw_input=payload.save_raw_input
        )

    return ScanResponse(
        label=result["label"],
        risk_score=result["risk_score"],
        risk_level=result["risk_level"],
        input_type="email",
        confidence=0.90,
        reasons=result["reasons"],
        top_features=result.get("top_features", []),
        recommendation=result["recommendation"],
        model_type=result["model_type"],
        is_model_trained=result.get("is_model_trained", True),
        disclaimer=result["disclaimer"],
        scan_id=scan_id,
        timestamp=now_iso,
        metadata={
            "parsed_sender": result.get("parsed_sender"),
            "parsed_subject": result.get("parsed_subject"),
            "url_analysis": result.get("url_analysis", [])
        }
    )
