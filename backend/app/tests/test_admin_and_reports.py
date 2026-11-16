"""
Tests for Admin role protection, aggregate analytics, suspicious-content reports, and feedback.
"""

import uuid
from fastapi.testclient import TestClient
from ..main import app
from ..core.config import settings

client = TestClient(app)


def get_admin_token() -> str:
    res = client.post(
        "/api/auth/login",
        json={"email": settings.ADMIN_EMAIL, "password": settings.ADMIN_PASSWORD}
    )
    assert res.status_code == 200
    return res.json()["access_token"]


def test_admin_role_enforcement():
    # Regular user
    u_email = f"regular_{uuid.uuid4().hex[:8]}@example.com"
    u_res = client.post("/api/auth/register", json={"email": u_email, "password": "Password123!", "full_name": "Regular User"})
    u_token = u_res.json()["access_token"]
    u_headers = {"Authorization": f"Bearer {u_token}"}

    # Regular user attempting admin endpoint -> 403 Forbidden
    forbidden_res = client.get("/api/admin/stats", headers=u_headers)
    assert forbidden_res.status_code == 403

    # Admin user -> 200 OK
    admin_token = get_admin_token()
    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    stats_res = client.get("/api/admin/stats", headers=admin_headers)
    assert stats_res.status_code == 200
    stats = stats_res.json()
    assert "total_scans" in stats
    assert "total_users" in stats
    assert "system_health" in stats
    assert stats["system_health"] == "operational"


def test_suspicious_report_lifecycle():
    # 1. User submits report
    report_payload = {
        "input_type": "text",
        "content": "Fraud message claiming 1 Crore lottery from KBC",
        "category": "lottery_scam",
        "user_notes": "Received on WhatsApp from unknown number",
        "anonymous": False
    }
    rep_res = client.post("/api/reports", json=report_payload)
    assert rep_res.status_code == 201
    rep_id = rep_res.json()["report_id"]

    # 2. Admin retrieves reports
    admin_token = get_admin_token()
    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    list_res = client.get("/api/admin/reports", headers=admin_headers)
    assert list_res.status_code == 200
    reports = list_res.json()
    assert any(r["id"] == rep_id for r in reports)

    # 3. Admin updates status
    patch_res = client.patch(
        f"/api/admin/reports/{rep_id}",
        json={"status": "verified_scam", "admin_notes": "Confirmed social engineering scam pattern"},
        headers=admin_headers
    )
    assert patch_res.status_code == 200
    assert patch_res.json()["report"]["status"] == "verified_scam"

    # 4. Invalid status rejected
    bad_patch = client.patch(
        f"/api/admin/reports/{rep_id}",
        json={"status": "invalid_status_value"},
        headers=admin_headers
    )
    assert bad_patch.status_code == 422


def test_user_feedback():
    fb_payload = {
        "rating": 5,
        "feedback_text": "Accurately flagged the fake job offer with great reasoning!"
    }
    res = client.post("/api/feedback", json=fb_payload)
    assert res.status_code == 201
    assert "feedback_id" in res.json()
