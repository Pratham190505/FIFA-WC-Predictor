from fastapi import APIRouter, Depends, Query
from typing import Optional

from app.models.prediction import MatchPredictRequest, MatchPredictResponse
from app.controllers.predict_controller import predict_match, get_prediction_history
from app.core.security import get_current_active_user, oauth2_scheme
from jose import JWTError
from app.core.security import decode_token

router = APIRouter()


async def get_optional_user(token: Optional[str] = Depends(oauth2_scheme)):
    """Returns current user if token present, else None (allows guest predictions)."""
    if not token:
        return None
    try:
        payload = decode_token(token)
        return payload.get("sub")
    except Exception:
        return None


@router.post("/match", response_model=MatchPredictResponse)
async def predict_match_endpoint(
    req: MatchPredictRequest,
    user_id: Optional[str] = Depends(get_optional_user),
):
    """
    Predict match outcome between two teams.
    - Works for both guests and authenticated users
    - Saves prediction history for authenticated users
    """
    return await predict_match(req, user_id=user_id)


@router.get("/history")
async def prediction_history(
    limit: int = Query(20, ge=1, le=100),
    current_user=Depends(get_current_active_user),
):
    """Get authenticated user's prediction history (requires login)."""
    user_id = str(current_user["_id"])
    return await get_prediction_history(user_id, limit=limit)