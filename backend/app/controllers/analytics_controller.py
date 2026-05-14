from app.core.ml_loader import get_models
from fastapi import HTTPException


def get_analytics_data() -> dict:
    models    = get_models()
    analytics = models.get("analytics")
    if not analytics:
        raise HTTPException(status_code=503, detail="Analytics data not loaded")
    return analytics


async def get_attack_rankings(limit: int = 32) -> list:
    data = get_analytics_data()
    return data["attack_rankings"][:limit]


async def get_defense_rankings(limit: int = 32) -> list:
    data = get_analytics_data()
    return data["defense_rankings"][:limit]


async def get_top_scorers(limit: int = 20) -> list:
    data = get_analytics_data()
    return data.get("top_scorers", [])[:limit]


async def get_team_form(team: str = None) -> list:
    data      = get_analytics_data()
    form_list = data.get("team_form", [])
    if team:
        return [f for f in form_list if f["team"].lower() == team.lower()]
    return form_list


async def get_h2h(team_a: str, team_b: str) -> dict:
    data = get_analytics_data()
    h2h  = data.get("h2h_matrix", {})

    win_rate_a = h2h.get(team_a, {}).get(team_b, 50.0)
    win_rate_b = h2h.get(team_b, {}).get(team_a, 50.0)

    return {
        "team_a":        team_a,
        "team_b":        team_b,
        "team_a_win_rate": win_rate_a,
        "team_b_win_rate": win_rate_b,
        "total_h2h_matches_in_model": "see historical data",
    }


async def get_monthly_accuracy() -> list:
    data = get_analytics_data()
    return data.get("monthly_accuracy", [])


async def get_confederation_stats() -> list:
    data = get_analytics_data()
    return data.get("confederation_stats", [])


async def get_full_dashboard() -> dict:
    data = get_analytics_data()
    return {
        "top_attack":          data["attack_rankings"][:10],
        "top_defense":         data["defense_rankings"][:10],
        "top_scorers":         data.get("top_scorers", [])[:10],
        "recent_form":         data.get("team_form", []),
        "monthly_accuracy":    data.get("monthly_accuracy", []),
        "confederation_stats": data.get("confederation_stats", []),
    }