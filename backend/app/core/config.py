"""
Configuration settings for ScamShield AI Backend.
Loads environment variables using Pydantic Settings with safe defaults.
"""

import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "ScamShield AI"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Security & Tokens
    SECRET_KEY: str = "scamshield-development-secret-key-32-bytes-secure"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    # Database
    MONGODB_URI: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "scamshield_ai"

    # CORS
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000"

    # Rate Limiting & Input Validation
    RATE_LIMIT_PER_MINUTE: int = 60
    MAX_TEXT_LENGTH: int = 10000

    # Admin seed credentials
    ADMIN_EMAIL: str = "admin@scamshield.ai"
    ADMIN_PASSWORD: str = "AdminSecurePassword123!"

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
