"""
Pytest configuration and global test fixtures for ScamShield AI.
"""

import pytest
from ..database.connection import db
from ..services.auth_service import seed_default_admin


@pytest.fixture(autouse=True, scope="session")
def setup_test_environment():
    """Ensure database connection and admin account are seeded before running tests."""
    db.connect()
    seed_default_admin()
