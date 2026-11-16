"""
Authentication & Authorization service.
Handles registration, login, JWT claims, role-based checks, and admin bootstrap.
"""

import uuid
from datetime import datetime, timezone
from typing import Optional, Dict, Any
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from ..database.connection import db
from ..core.security import hash_password, verify_password, create_access_token, decode_access_token
from ..core.config import settings
from ..schemas.auth import UserRegister, UserOut

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)


def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    return db.users.find_one({"email": email.strip().lower()})


def get_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
    return db.users.find_one({"_id": user_id})


def register_user(user_data: UserRegister, role: str = "user") -> Dict[str, Any]:
    email = user_data.email.strip().lower()
    existing = get_user_by_email(email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    user_id = str(uuid.uuid4())
    user_doc = {
        "_id": user_id,
        "email": email,
        "full_name": user_data.full_name.strip(),
        "password_hash": hash_password(user_data.password),
        "role": role,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    db.users.insert_one(user_doc)
    return user_doc


def authenticate_user(email: str, password: str) -> Optional[Dict[str, Any]]:
    user = get_user_by_email(email)
    if not user:
        return None
    if not verify_password(password, user.get("password_hash", "")):
        return None
    return user


def seed_default_admin():
    """Ensure an administrator account exists upon startup."""
    admin_email = settings.ADMIN_EMAIL.strip().lower()
    admin = get_user_by_email(admin_email)
    if not admin:
        admin_id = str(uuid.uuid4())
        admin_doc = {
            "_id": admin_id,
            "email": admin_email,
            "full_name": "ScamShield Security Administrator",
            "password_hash": hash_password(settings.ADMIN_PASSWORD),
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        db.users.insert_one(admin_doc)
        print(f"[OK] Seeded initial admin account: {admin_email}")


async def get_current_user(token: Optional[str] = Depends(oauth2_scheme)) -> Dict[str, Any]:
    """Dependency: Require authenticated active user."""
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token required",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
            headers={"WWW-Authenticate": "Bearer"}
        )

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token payload missing subject identifier"
        )

    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account no longer exists"
        )
    return user


async def get_optional_current_user(token: Optional[str] = Depends(oauth2_scheme)) -> Optional[Dict[str, Any]]:
    """Dependency: Extract user if bearer token is provided, without raising 401 if missing."""
    if not token:
        return None
    payload = decode_access_token(token)
    if not payload:
        return None
    user_id = payload.get("sub")
    if not user_id:
        return None
    return get_user_by_id(user_id)


async def get_current_admin(current_user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
    """Dependency: Require administrative privileges."""
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: Administrative privileges required"
        )
    return current_user
