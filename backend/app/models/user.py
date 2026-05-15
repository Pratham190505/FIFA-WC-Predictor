from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
from datetime import datetime


# ── Request schemas ───────────────────────────────────────

class UserRegister(BaseModel):
    username:  str       = Field(..., min_length=3, max_length=30)
    email:     EmailStr
    password:  str       = Field(..., min_length=8, max_length=64)
    full_name: Optional[str] = Field(None, max_length=100)

    @field_validator("password")
    @classmethod
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not any(c in "!@#$%^&*()-_=+[]{}|;:,.<>?/" for c in v):
            raise ValueError("Password must contain at least one special character")
        return v

    @field_validator("username")
    @classmethod
    def validate_username(cls, v):
        if not v.replace("_", "").replace("-", "").isalnum():
            raise ValueError("Username can only contain letters, numbers, hyphens and underscores")
        return v.lower()


class UserLogin(BaseModel):
    email:    EmailStr
    password: str


class TokenRefresh(BaseModel):
    refresh_token: str


class ChangePassword(BaseModel):
    current_password: str
    new_password:     str = Field(..., min_length=8)

    @field_validator("new_password")
    @classmethod
    def validate_new_password(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not any(c in "!@#$%^&*()-_=+[]{}|;:,.<>?/" for c in v):
            raise ValueError("Password must contain at least one special character")
        return v


# ── Response schemas ──────────────────────────────────────

class UserResponse(BaseModel):
    id:         str
    username:   str
    email:      str
    full_name:  Optional[str]
    is_active:  bool
    created_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token:  str
    refresh_token: str
    token_type:    str = "bearer"
    user:          UserResponse


class MessageResponse(BaseModel):
    message: str
