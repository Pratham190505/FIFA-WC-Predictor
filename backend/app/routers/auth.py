from fastapi import APIRouter, Depends
from app.models.user import UserRegister, UserLogin, TokenRefresh, ChangePassword, TokenResponse, UserResponse, MessageResponse
from app.controllers.auth_controller import register_user, login_user, refresh_access_token, get_profile, change_password
from app.core.security import get_current_active_user

router = APIRouter()


@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(data: UserRegister):
    """
    Register a new user.
    - Password must be at least 8 characters
    - Password must contain at least one special character
    """
    return await register_user(data)


@router.post("/login", response_model=TokenResponse)
async def login(data: UserLogin):
    """Login with email and password. Returns access + refresh tokens."""
    return await login_user(data)


@router.post("/refresh")
async def refresh(data: TokenRefresh):
    """Get a new access token using a valid refresh token."""
    return await refresh_access_token(data.refresh_token)


@router.get("/me", response_model=UserResponse)
async def me(current_user=Depends(get_current_active_user)):
    """Get the currently authenticated user's profile."""
    return await get_profile(current_user)


@router.put("/change-password", response_model=MessageResponse)
async def update_password(
    data: ChangePassword,
    current_user=Depends(get_current_active_user)
):
    """Change the current user's password."""
    return await change_password(current_user, data.current_password, data.new_password)


@router.post("/logout", response_model=MessageResponse)
async def logout(current_user=Depends(get_current_active_user)):
    """
    Logout endpoint. Client should discard stored tokens.
    (Stateless JWT — no server-side invalidation needed unless you add a blocklist.)
    """
    return {"message": "Logged out successfully"}
