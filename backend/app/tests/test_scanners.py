"""
Unit and integration tests for ScamShield AI scan endpoints:
Text, URL, and Email threat analysis.
"""

from fastapi.testclient import TestClient
from ..main import app

client = TestClient(app)


def test_scan_text_scam_message():
    scam_msg = "Dear Customer your SBI YONO account is suspended! Update your Pan Card immediately at http://sbi-kyc-verify.xyz or electricity cutoff tonight."
    res = client.post("/api/scan/text", json={"text": scam_msg})
    assert res.status_code == 200
    data = res.json()
    assert data["risk_score"] >= 70
    assert data["risk_level"] == "High Risk"
    assert data["label"] == "scam"
    assert len(data["reasons"]) > 0
    assert "disclaimer" in data
    assert "recommendation" in data
    assert "model_type" in data


def test_scan_text_legitimate_message():
    legit_msg = "Hey Sarah, are we still meeting for lunch today at 1:30 PM? Let me know so I can reserve the table."
    res = client.post("/api/scan/text", json={"text": legit_msg})
    assert res.status_code == 200
    data = res.json()
    assert data["risk_score"] < 40
    assert data["risk_level"] in ("Low Risk", "Suspicious")
    assert "disclaimer" in data


def test_scan_text_empty_input():
    res = client.post("/api/scan/text", json={"text": "   "})
    assert res.status_code == 422


def test_scan_text_too_long():
    long_text = "A" * 10500
    res = client.post("/api/scan/text", json={"text": long_text})
    assert res.status_code in (413, 422)


def test_scan_url_phishing_structure():
    url = "http://192.168.1.1/paypal-account-verify/login.php"
    res = client.post("/api/scan/url", json={"url": url})
    assert res.status_code == 200
    data = res.json()
    assert data["risk_score"] >= 70
    assert data["risk_level"] == "High Risk"
    assert "Host is an IP address" in " ".join(data["reasons"])
    assert "https_security_notice" in data["metadata"]


def test_scan_url_suspicious_tld_and_brand():
    url = "https://sbi-reward-points-bonus.xyz/claim"
    res = client.post("/api/scan/url", json={"url": url})
    assert res.status_code == 200
    data = res.json()
    assert data["risk_score"] >= 70
    assert "xyz" in " ".join(data["reasons"]).lower()
    assert "sbi" in " ".join(data["reasons"]).lower()


def test_scan_url_legitimate():
    url = "https://www.google.com"
    res = client.post("/api/scan/url", json={"url": url})
    assert res.status_code == 200
    data = res.json()
    assert data["risk_score"] < 40
    assert data["risk_level"] == "Low Risk"


def test_scan_url_empty():
    res = client.post("/api/scan/url", json={"url": "  "})
    assert res.status_code == 422


def test_scan_email_spoofed_phishing():
    payload = {
        "email_content": "Dear Customer, Your Netflix membership payment failed. Verify your card details now: http://netflix-renew-billing.top",
        "sender": "netflix-support@gmail.com",
        "subject": "Payment Failed - Account Suspended"
    }
    res = client.post("/api/scan/email", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["risk_score"] >= 65
    assert data["risk_level"] in ("Suspicious", "High Risk")
    assert any("public free email provider" in r for r in data["reasons"])


def test_scan_email_empty():
    res = client.post("/api/scan/email", json={"email_content": " "})
    assert res.status_code == 422
