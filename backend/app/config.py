from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # App
    APP_NAME: str = "ZeroMind"
    APP_ENV: str = "development"
    DEBUG: bool = True
    BACKEND_URL: str = "http://localhost:8000"
    FRONTEND_URL: str = "http://localhost:5173"
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"

    # Database
    DATABASE_URL: str = "sqlite:///./zeromind.db"
    REDIS_URL: str = "redis://localhost:6379/0"

    # Auth
    JWT_SECRET_KEY: str = "zeromind-super-secret-key-change-in-production-2026"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Google OAuth2 (optional)
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None

    # LLM APIs (FREE)
    GEMINI_API_KEY: str = ""
    GROQ_API_KEY: str = ""

    # Agent Config
    PRIMARY_LLM: str = "gemini"
    FALLBACK_LLM: str = "groq"
    MAX_AGENT_STEPS: int = 10
    LLM_CACHE_TTL_SECONDS: int = 21600  # 6 hours
    RATE_LIMIT_RPM: int = 15

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
