from fastapi import APIRouter, Query
from app.controllers.teams_controller import get_all_teams, get_team_detail, compare_teams

router = APIRouter()


@router.get("/")
async def list_teams():
    """Get all teams with basic stats sorted by FIFA ranking."""
    return await get_all_teams()


@router.get("/compare")
async def compare(
    team_a: str = Query(..., example="Brazil"),
    team_b: str = Query(..., example="France"),
):
    """Compare two teams side by side across all metrics."""
    return await compare_teams(team_a, team_b)


@router.get("/{team_name}")
async def team_detail(team_name: str):
    """Get detailed stats for a specific team."""
    return await get_team_detail(team_name)