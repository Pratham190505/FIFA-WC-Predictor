import pandas as pd
from fastapi import HTTPException
from app.core.ml_loader import get_models


def get_team_data(team_name: str) -> dict:
    models = get_models()
    squad  = models.get("squad")
    if squad is None:
        raise HTTPException(status_code=503, detail="Team data not loaded")

    if team_name not in squad.index:
        raise HTTPException(status_code=404, detail=f"Team '{team_name}' not found")

    row = squad.loc[team_name]
    elo = models["elo_ratings"].get(team_name, 1500)

    # Recent form from results
    results = models["results"]
    mask    = (results["home_team"] == team_name) | (results["away_team"] == team_name)
    recent  = results[mask].sort_values("date").tail(10)

    form = []
    for _, r in recent.iterrows():
        scored   = r["home_score"] if r["home_team"] == team_name else r["away_score"]
        conceded = r["away_score"] if r["home_team"] == team_name else r["home_score"]
        if   scored > conceded:  form.append("W")
        elif scored == conceded: form.append("D")
        else:                    form.append("L")

    return {
        "team":                   team_name,
        "fifa_ranking":           int(row.get("fifa_ranking", 0)),
        "elo_rating":             round(elo, 1),
        "confederation":          str(row.get("confederation", "")),
        "squad_size":             int(row.get("squad_size", 0)),
        "average_age":            float(row.get("average_age", 0)),
        "total_market_value_eur": float(row.get("total_market_value_eur", 0)),
        "top5_player_value":      float(row.get("top5_player_value", 0)),
        "players_over_20m":       int(row.get("players_over_20m", 0)),
        "players_over_50m":       int(row.get("players_over_50m", 0)),
        "avg_caps":               float(row.get("avg_caps", 0)),
        "form_last10":            "".join(form),
        "wins":                   form.count("W"),
        "draws":                  form.count("D"),
        "losses":                 form.count("L"),
    }


async def get_all_teams() -> list:
    models = get_models()
    squad  = models.get("squad")
    if squad is None:
        raise HTTPException(status_code=503, detail="Team data not loaded")

    elo_ratings = models["elo_ratings"]
    teams       = []

    for team_name, row in squad.iterrows():
        elo = elo_ratings.get(team_name, 1500)
        teams.append({
            "team":              team_name,
            "fifa_ranking":      int(row.get("fifa_ranking", 99)),
            "elo_rating":        round(elo, 1),
            "confederation":     str(row.get("confederation", "")),
            "total_market_value_eur": float(row.get("total_market_value_eur", 0)),
            "average_age":       float(row.get("average_age", 27)),
            "players_over_20m":  int(row.get("players_over_20m", 0)),
        })

    return sorted(teams, key=lambda x: x["fifa_ranking"])


async def get_team_detail(team_name: str) -> dict:
    return get_team_data(team_name)


async def compare_teams(team_a: str, team_b: str) -> dict:
    a = get_team_data(team_a)
    b = get_team_data(team_b)

    return {
        "team_a": a,
        "team_b": b,
        "comparison": {
            "elo_diff":    round(a["elo_rating"] - b["elo_rating"], 1),
            "rank_diff":   b["fifa_ranking"] - a["fifa_ranking"],
            "mv_diff_eur": a["total_market_value_eur"] - b["total_market_value_eur"],
            "better_elo":  team_a if a["elo_rating"] > b["elo_rating"] else team_b,
            "better_rank": team_a if a["fifa_ranking"] < b["fifa_ranking"] else team_b,
            "better_squad_value": team_a if a["total_market_value_eur"] > b["total_market_value_eur"] else team_b,
        }
    }