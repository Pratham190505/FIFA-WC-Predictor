from fastapi import APIRouter, Query
from app.controllers.analytics_controller import (
    get_attack_rankings,
    get_defense_rankings,
    get_top_scorers,
    get_team_form,
    get_h2h,
    get_monthly_accuracy,
    get_confederation_stats,
    get_full_dashboard,
)

router = APIRouter()


@router.get("/dashboard")
async def full_dashboard():
    """Get the complete analytics dashboard data in one call."""
    return await get_full_dashboard()


@router.get("/attack-rankings")
async def attack_rankings(limit: int = Query(32, ge=1, le=32)):
    """Get teams ranked by attacking strength score."""
    return await get_attack_rankings(limit)


@router.get("/defense-rankings")
async def defense_rankings(limit: int = Query(32, ge=1, le=32)):
    """Get teams ranked by defensive strength score."""
    return await get_defense_rankings(limit)


@router.get("/top-scorers")
async def top_scorers(limit: int = Query(20, ge=1, le=50)):
    """Get all-time top international goal scorers from the dataset."""
    return await get_top_scorers(limit)


@router.get("/team-form")
async def team_form(team: str = Query(None)):
    """Get recent form for all teams or a specific team."""
    return await get_team_form(team)


@router.get("/h2h")
async def head_to_head(
    team_a: str = Query(..., example="Brazil"),
    team_b: str = Query(..., example="Argentina"),
):
    """Get head-to-head record between two teams."""
    return await get_h2h(team_a, team_b)


@router.get("/prediction-accuracy")
async def prediction_accuracy():
    """Get monthly prediction accuracy (ELO-based baseline)."""
    return await get_monthly_accuracy()


@router.get("/confederation-stats")
async def confederation_stats():
    """Get average attack score and ELO by confederation."""
    return await get_confederation_stats()