"""
Test healthcheck endpoint, system readiness, and basic application info.
"""

from fastapi.testclient import TestClient
from ..main import app

client = TestClient(app)


def test_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["project"] == "ScamShield AI"
    assert data["status"] == "online"


def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "database" in data
    assert "ml_models" in data
    assert data["ml_models"]["text_classifier_loaded"] is True
