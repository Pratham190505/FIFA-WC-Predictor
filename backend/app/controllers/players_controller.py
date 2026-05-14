import pandas as pd
import os
from fastapi import HTTPException
from app.core.config import settings


def load_players_df() -> pd.DataFrame:
    path = os.path.join(os.path.dirname(settings.MODELS_DIR), "raw", "players.csv")
    if not os.path.exists(path):
        raise HTTPException(status_code=503, detail="Players data file not found")
    return pd.read_csv(path)


async def get_players_by_team(team_name: str, limit: int = 25) -> list:
    df = load_players_df()

    team_players = df[
        df["country_of_citizenship"] == team_name
    ].copy()

    if team_players.empty:
        raise HTTPException(status_code=404, detail=f"No players found for team: {team_name}")

    team_players = team_players.sort_values("market_value_in_eur", ascending=False).head(limit)

    result = []
    for _, row in team_players.iterrows():
        result.append({
            "name":                  str(row.get("name", "")),
            "position":              str(row.get("position", "")),
            "sub_position":          str(row.get("sub_position", "")),
            "nationality":           str(row.get("country_of_citizenship", "")),
            "current_club":          str(row.get("current_club_name", "")),
            "market_value_eur":      float(row["market_value_in_eur"]) if pd.notna(row.get("market_value_in_eur")) else 0,
            "highest_market_value":  float(row["highest_market_value_in_eur"]) if pd.notna(row.get("highest_market_value_in_eur")) else 0,
            "international_caps":    int(row["international_caps"]) if pd.notna(row.get("international_caps")) else 0,
            "international_goals":   int(row["international_goals"]) if pd.notna(row.get("international_goals")) else 0,
            "foot":                  str(row.get("foot", "")),
            "height_in_cm":          int(row["height_in_cm"]) if pd.notna(row.get("height_in_cm")) else 0,
            "age":                   int(row["age"]) if pd.notna(row.get("age")) else 0,
        })

    return result


async def get_top_valued_players(limit: int = 20) -> list:
    df = load_players_df()

    top = df.nlargest(limit, "market_value_in_eur")
    result = []
    for _, row in top.iterrows():
        result.append({
            "name":             str(row.get("name", "")),
            "nationality":      str(row.get("country_of_citizenship", "")),
            "position":         str(row.get("position", "")),
            "sub_position":     str(row.get("sub_position", "")),
            "current_club":     str(row.get("current_club_name", "")),
            "market_value_eur": float(row["market_value_in_eur"]) if pd.notna(row.get("market_value_in_eur")) else 0,
        })
    return result


async def search_players(query: str, limit: int = 10) -> list:
    df = load_players_df()

    mask    = df["name"].str.contains(query, case=False, na=False)
    results = df[mask].head(limit)

    return [
        {
            "name":             str(row.get("name", "")),
            "nationality":      str(row.get("country_of_citizenship", "")),
            "position":         str(row.get("position", "")),
            "current_club":     str(row.get("current_club_name", "")),
            "market_value_eur": float(row["market_value_in_eur"]) if pd.notna(row.get("market_value_in_eur")) else 0,
        }
        for _, row in results.iterrows()
    ]