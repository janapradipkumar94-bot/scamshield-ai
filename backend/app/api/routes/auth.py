"""
Authentication API endpoints: Registration, Login, Logout, and Current User Profile.
"""

from datetime import timedelta
from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from ...schemas.auth import UserRegister, UserLogin, UserOut, Token
from ...services.auth_service import (
    register_user,
    authenticate_user,
    get_current_user
)
from ...core.security import create_access_token
from ...core.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(payload: UserRegister):
    """Register a new user account with secure password hashing and return JWT token."""
    user = register_user(payload)
    token = create_access_token({"sub": user["_id"], "email": user["email"], "role": user["role"]})
    user_out = UserOut(
        id=user["_id"],
        email=user["email"],
        full_name=user["full_name"],
        role=user["role"],
        created_at=user.get("created_at")
    )
    return Token(access_token=token, token_type="bearer", user=user_out)


@router.post("/login", response_model=Token)
def login(payload: UserLogin):
    """Authenticate with email and password and receive a signed JWT token."""
    user = authenticate_user(payload.email, payload.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )

    token = create_access_token({"sub": user["_id"], "email": user["email"], "role": user.get("role", "user")})
    user_out = UserOut(
        id=user["_id"],
        email=user["email"],
        full_name=user["full_name"],
        role=user.get("role", "user"),
        created_at=user.get("created_at")
    )
    return Token(access_token=token, token_type="bearer", user=user_out)


@router.post("/logout")
def logout(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Acknowledge logout session."""
    return {"message": "Successfully logged out. Please discard token on client."}


@router.get("/me", response_model=UserOut)
def get_me(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Retrieve currently authenticated user profile."""
    return UserOut(
        id=current_user["_id"],
        email=current_user["email"],
        full_name=current_user["full_name"],
        role=current_user.get("role", "user"),
        created_at=current_user.get("created_at")
    )
