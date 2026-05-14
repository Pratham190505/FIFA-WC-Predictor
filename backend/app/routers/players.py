from fastapi import APIRouter, Query
from app.controllers.players_controller import get_players_by_team, get_top_valued_players, search_players

router = APIRouter()


@router.get("/top-valued")
async def top_valued(limit: int = Query(20, ge=1, le=50)):
    """Get the most valuable players across all WC nations."""
    return await get_top_valued_players(limit)


@router.get("/search")
async def search(
    q: str = Query(..., min_length=2, example="Mbappe"),
    limit: int = Query(10, ge=1, le=30),
):
    """Search players by name."""
    return await search_players(q, limit)


@router.get("/team/{team_name}")
async def players_by_team(
    team_name: str,
    limit: int = Query(25, ge=1, le=50),
):
    """Get all players for a specific national team, sorted by market value."""
    return await get_players_by_team(team_name, limit)