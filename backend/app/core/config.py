from pydantic_settings import BaseSettings
import os


class Settings(BaseSettings):
    # MongoDB
    MONGODB_URL:      str = "mongodb+srv://fifa_admin:fifa%40345@fifa-predictor-cluster.eti7f5l.mongodb.net/?appName=fifa-predictor-cluster"
    DATABASE_NAME:    str = "fifa_predictor"

    # JWT
    SECRET_KEY:                    str = "change-this-secret-in-production-minimum-32-chars"
    ALGORITHM:                     str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES:   int = 60
    REFRESH_TOKEN_EXPIRE_DAYS:     int = 7

    # App
    APP_ENV:      str = "development"
    FRONTEND_URL: str = "http://localhost:5173"

    # ML model paths — resolved relative to project root
    MODELS_DIR: str = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    "models"
)

    class Config:
        env_file = ".env"
        extra    = "ignore"


settings = Settings()
