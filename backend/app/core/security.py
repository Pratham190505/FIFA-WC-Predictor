from datetime import datetime, timedelta
from typing import Optional

from jose import JWTError, jwt
from passlib.context import CryptContext

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.core.config import settings

# -------------------------------------------------------------------

# PASSWORD CONFIG

# -------------------------------------------------------------------

pwd_context = CryptContext(
schemes=["bcrypt"],
deprecated="auto"
)

oauth2_scheme = OAuth2PasswordBearer(
tokenUrl="/api/auth/login",
auto_error=False
)

# -------------------------------------------------------------------

# PASSWORD FUNCTIONS

# -------------------------------------------------------------------

def hash_password(password: str) -> str:

    
    # bcrypt supports max 72 bytes
    password = password[:72]

    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:

    
    # bcrypt supports max 72 bytes
    plain = plain[:72]

    return pwd_context.verify(plain, hashed)


# -------------------------------------------------------------------

# JWT TOKENS

# -------------------------------------------------------------------

def create_access_token(
data: dict,
expires_delta: Optional[timedelta] = None
) -> str:

    
    to_encode = data.copy()

    expire = datetime.utcnow() + (
        expires_delta
        or timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    to_encode.update({
        "exp": expire,
        "type": "access"
    })

    return jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )


def create_refresh_token(data: dict) -> str:

    
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(
        days=settings.REFRESH_TOKEN_EXPIRE_DAYS
    )

    to_encode.update({
        "exp": expire,
        "type": "refresh"
    })

    return jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    

def decode_token(token: str) -> dict:

    
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )

        return payload

    except JWTError:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    

# -------------------------------------------------------------------

# CURRENT USER

# -------------------------------------------------------------------

async def get_current_user(
token: str = Depends(oauth2_scheme)
):

    
    from app.core.database import get_db
    from bson import ObjectId

    payload = decode_token(token)

    if payload.get("type") != "access":
        raise HTTPException(
            status_code=401,
            detail="Invalid token type"
        )

    user_id: str = payload.get("sub")

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Token missing subject"
        )

    db = get_db()

    user = await db.users.find_one({
        "_id": ObjectId(user_id)
    })

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    return user
    

async def get_current_active_user(
current_user=Depends(get_current_user)
):

    
    if not current_user.get("is_active", True):

        raise HTTPException(
            status_code=400,
            detail="Inactive user account"
        )

    return current_user
    
