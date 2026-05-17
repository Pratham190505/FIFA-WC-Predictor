from datetime import datetime
from bson import ObjectId
from fastapi import HTTPException, status

from app.core.database import get_db
from app.core.security import (
hash_password,
verify_password,
create_access_token,
create_refresh_token,
decode_token,
)

from app.models.user import UserRegister, UserLogin

def serialize_user(user: dict) -> dict:
    """Convert MongoDB user document to response-safe dict."""
    return {
    "id": str(user["_id"]),
    "username": user["username"],
    "email": user["email"],
    "full_name": user.get("full_name"),
    "is_active": user.get("is_active", True),
    "created_at": user["created_at"],
    }

# -------------------------------------------------------------------

# REGISTER USER

# -------------------------------------------------------------------

async def register_user(data: UserRegister) -> dict:

    db = get_db()

    # Prevent bcrypt 72-byte crash
    if len(data.password.encode("utf-8")) > 72:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password cannot exceed 72 characters",
        )

    # Check email uniqueness
    if await db.users.find_one({"email": data.email}):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        )

# Check username uniqueness
    if await db.users.find_one({"username": data.username}):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This username is already taken",
        )

    # Create user document
    user_doc = {
        "username": data.username,
        "email": data.email,
        "full_name": data.full_name,
        "password": hash_password(data.password),
        "is_active": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }

    result = await db.users.insert_one(user_doc)

    user_doc["_id"] = result.inserted_id

    user_id = str(result.inserted_id)

    access_token = create_access_token({"sub": user_id})

    refresh_token = create_refresh_token({"sub": user_id})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": serialize_user(user_doc),
    }

# -------------------------------------------------------------------

# LOGIN USER

# -------------------------------------------------------------------

async def login_user(data: UserLogin) -> dict:

    db = get_db()

    # Prevent bcrypt 72-byte crash
    if len(data.password.encode("utf-8")) > 72:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password cannot exceed 72 characters",
        )

    user = await db.users.find_one({"email": data.email})

    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is disabled",
        )

    # Update last login
    await db.users.update_one(
        {"_id": user["_id"]},
        {"$set": {"last_login": datetime.utcnow()}},
    )

    user_id = str(user["_id"])

    access_token = create_access_token({"sub": user_id})

    refresh_token = create_refresh_token({"sub": user_id})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": serialize_user(user),
    }

# -------------------------------------------------------------------

# REFRESH TOKEN

# -------------------------------------------------------------------

async def refresh_access_token(refresh_token: str) -> dict:


    payload = decode_token(refresh_token)

    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=401,
            detail="Invalid refresh token",
        )

    user_id = payload.get("sub")

    db = get_db()

    user = await db.users.find_one(
        {"_id": ObjectId(user_id)}
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found",
        )

    new_access_token = create_access_token(
        {"sub": user_id}
    )

    return {
        "access_token": new_access_token,
        "token_type": "bearer",
    }

# -------------------------------------------------------------------

# GET PROFILE

# -------------------------------------------------------------------

async def get_profile(current_user: dict) -> dict:
    return serialize_user(current_user)

# -------------------------------------------------------------------

# CHANGE PASSWORD

# -------------------------------------------------------------------

async def change_password(
    current_user: dict,
    current_password: str,
    new_password: str,
    ) -> dict:


    if not verify_password(
        current_password,
        current_user["password"],
    ):
        raise HTTPException(
            status_code=400,
            detail="Current password is incorrect",
        )

    # Prevent bcrypt 72-byte crash
    if len(new_password.encode("utf-8")) > 72:
        raise HTTPException(
            status_code=400,
            detail="Password cannot exceed 72 characters",
        )

    db = get_db()

    await db.users.update_one(
        {"_id": current_user["_id"]},
        {
            "$set": {
                "password": hash_password(new_password),
                "updated_at": datetime.utcnow(),
            }
        },
    )

    return {
        "message": "Password changed successfully"
    }
