"""
Tests for Authentication, Authorization, Token Verification,
User Scan History Isolation, and Security Protections.
"""

import uuid
from fastapi.testclient import TestClient
from ..main import app

client = TestClient(app)


def test_user_registration_and_login():
    unique_email = f"user_{uuid.uuid4().hex[:8]}@example.com"
    reg_data = {
        "email": unique_email,
        "password": "StrongPassword123!",
        "full_name": "Test Security User"
    }
    
    # 1. Register
    reg_res = client.post("/api/auth/register", json=reg_data)
    assert reg_res.status_code == 201
    reg_json = reg_res.json()
    assert "access_token" in reg_json
    assert reg_json["user"]["email"] == unique_email
    assert reg_json["user"]["role"] == "user"

    # 2. Duplicate registration should be rejected
    dup_res = client.post("/api/auth/register", json=reg_data)
    assert dup_res.status_code == 400

    # 3. Login with correct password
    login_res = client.post("/api/auth/login", json={"email": unique_email, "password": "StrongPassword123!"})
    assert login_res.status_code == 200
    login_token = login_res.json()["access_token"]

    # 4. Login with incorrect password
    bad_login = client.post("/api/auth/login", json={"email": unique_email, "password": "WrongPassword"})
    assert bad_login.status_code == 401

    # 5. Access protected /me route
    headers = {"Authorization": f"Bearer {login_token}"}
    me_res = client.get("/api/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["email"] == unique_email

    # 6. Access protected route without token
    unauth_res = client.get("/api/auth/me")
    assert unauth_res.status_code == 401


def test_scan_history_and_cross_user_isolation():
    # User 1
    u1_email = f"u1_{uuid.uuid4().hex[:8]}@example.com"
    r1 = client.post("/api/auth/register", json={"email": u1_email, "password": "Password123!", "full_name": "User One"})
    t1 = r1.json()["access_token"]
    h1 = {"Authorization": f"Bearer {t1}"}

    # User 2
    u2_email = f"u2_{uuid.uuid4().hex[:8]}@example.com"
    r2 = client.post("/api/auth/register", json={"email": u2_email, "password": "Password123!", "full_name": "User Two"})
    t2 = r2.json()["access_token"]
    h2 = {"Authorization": f"Bearer {t2}"}

    # User 1 scans and saves
    scan_res = client.post(
        "/api/scan/text",
        json={"text": "URGENT KYC update required click here: http://fake-kyc.xyz", "save_history": True, "save_raw_input": False},
        headers=h1
    )
    assert scan_res.status_code == 200
    scan_id = scan_res.json()["scan_id"]
    assert scan_id is not None

    # User 1 history contains the scan
    hist1 = client.get("/api/history", headers=h1)
    assert hist1.status_code == 200
    scans1 = hist1.json()["scans"]
    assert any(s["id"] == scan_id for s in scans1)

    # User 2 history MUST NOT contain User 1's scan
    hist2 = client.get("/api/history", headers=h2)
    assert hist2.status_code == 200
    scans2 = hist2.json()["scans"]
    assert not any(s["id"] == scan_id for s in scans2)

    # User 2 attempts to delete User 1's scan -> MUST BE REJECTED with 403 Forbidden
    del_attack = client.delete(f"/api/history/{scan_id}", headers=h2)
    assert del_attack.status_code == 403

    # User 1 deletes their own scan -> Succeeds with 200
    del_legit = client.delete(f"/api/history/{scan_id}", headers=h1)
    assert del_legit.status_code == 200
