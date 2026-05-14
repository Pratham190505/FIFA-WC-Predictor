import numpy as np
import torch
import pandas as pd
from datetime import datetime
from bson import ObjectId

from app.core.ml_loader import get_models
from app.core.database import get_db
from app.models.prediction import MatchPredictRequest


def encode_form(team: str, results: pd.DataFrame, n: int = 10):
    """Compute form stats for a team from their last N matches."""
    mask   = (results["home_team"] == team) | (results["away_team"] == team)
    recent = results[mask].sort_values("date").tail(n)

    if len(recent) == 0:
        return 0.5, 0.0, 0.5

    wins = draws = losses = 0
    goal_diffs = []

    for _, r in recent.iterrows():
        is_home  = r["home_team"] == team
        scored   = r["home_score"] if is_home else r["away_score"]
        conceded = r["away_score"] if is_home else r["home_score"]
        gd       = scored - conceded
        goal_diffs.append(gd)
        if   gd > 0: wins   += 1
        elif gd == 0: draws += 1
        else:         losses += 1

    total      = wins + draws + losses
    win_rate   = wins / total if total > 0 else 0.5
    form_score = (wins * 3 + draws) / (total * 3) if total > 0 else 0.5
    return win_rate, float(np.mean(goal_diffs)), form_score


def build_feature_vector(home: str, away: str, is_neutral: bool, models: dict) -> np.ndarray:
    """Build the 30-dimensional feature vector for a match."""
    squad       = models["squad"]
    elo_ratings = models["elo_ratings"]
    results     = models["results"]

    def get_squad(team):
        if team in squad.index:
            s = squad.loc[team]
            return {
                "fifa_rank": float(s.get("fifa_ranking",           80)),
                "total_mv":  float(s.get("total_market_value_eur", 100_000_000)),
                "top5_mv":   float(s.get("top5_player_value",      20_000_000)),
                "avg_age":   float(s.get("average_age",            27.0)),
                "avg_caps":  float(s.get("avg_caps",               30.0)),
                "stars":     float(s.get("players_over_20m",       2)),
                "elite":     float(s.get("players_over_50m",       0)),
            }
        return {"fifa_rank":80,"total_mv":100e6,"top5_mv":20e6,
                "avg_age":27,"avg_caps":30,"stars":2,"elite":0}

    sh  = get_squad(home)
    sa  = get_squad(away)
    eh  = float(elo_ratings.get(home, 1500))
    ea  = float(elo_ratings.get(away, 1500))

    h_wr, h_gd, h_form = encode_form(home, results)
    a_wr, a_gd, a_form = encode_form(away, results)

    vector = [
        # Home
        eh / 2500,
        1 / (sh["fifa_rank"] + 1),
        sh["total_mv"] / 1e9,
        sh["top5_mv"]  / 1e8,
        sh["avg_age"]  / 30,
        sh["avg_caps"] / 100,
        sh["stars"]    / 10,
        sh["elite"]    / 5,
        h_wr, h_gd / 5, h_form,
        # Away
        ea / 2500,
        1 / (sa["fifa_rank"] + 1),
        sa["total_mv"] / 1e9,
        sa["top5_mv"]  / 1e8,
        sa["avg_age"]  / 30,
        sa["avg_caps"] / 100,
        sa["stars"]    / 10,
        sa["elite"]    / 5,
        a_wr, a_gd / 5, a_form,
        # Deltas
        (eh - ea) / 500,
        (sa["fifa_rank"] - sh["fifa_rank"]) / 100,
        (sh["total_mv"] - sa["total_mv"]) / 1e9,
        h_form - a_form,
        h_wr - a_wr,
        # Context
        int(is_neutral),
        0, 0,   # penalty context unknown pre-match
    ]

    return np.array([vector], dtype=np.float32)


async def predict_match(req: MatchPredictRequest, user_id: str = None) -> dict:
    models = get_models()

    if not models:
        from fastapi import HTTPException
        raise HTTPException(status_code=503, detail="ML models not loaded. Run training scripts first.")

    # Build feature vector
    x_raw = build_feature_vector(req.home_team, req.away_team, req.is_neutral, models)
    x     = models["scaler"].transform(x_raw)
    x_t   = torch.FloatTensor(x)

    with torch.no_grad():
        # Match result probabilities
        logits = models["match_predictor"](x_t)
        probs  = torch.softmax(logits, dim=1).numpy()[0]

        # Predicted scoreline
        sh, sa = models["score_predictor"](x_t)
        pred_home_goals = max(0, round(float(sh[0][0])))
        pred_away_goals = max(0, round(float(sa[0][0])))

    away_win_prob = round(float(probs[0]) * 100, 1)
    draw_prob     = round(float(probs[1]) * 100, 1)
    home_win_prob = round(float(probs[2]) * 100, 1)
    confidence    = round(float(max(probs)) * 100, 1)

    # Determine predicted winner
    if probs[2] > probs[0] and probs[2] > probs[1]:
        predicted_winner = req.home_team
    elif probs[0] > probs[2] and probs[0] > probs[1]:
        predicted_winner = req.away_team
    else:
        predicted_winner = "Draw"

    # Key factors explanation
    elo_ratings = models["elo_ratings"]
    squad       = models["squad"]
    elo_h = elo_ratings.get(req.home_team, 1500)
    elo_a = elo_ratings.get(req.away_team, 1500)

    key_factors = []
    if abs(elo_h - elo_a) > 50:
        stronger = req.home_team if elo_h > elo_a else req.away_team
        key_factors.append(f"{stronger} has a stronger ELO rating (+{abs(elo_h - elo_a):.0f} pts)")

    if req.home_team in squad.index and req.away_team in squad.index:
        mv_h = float(squad.loc[req.home_team, "total_market_value_eur"])
        mv_a = float(squad.loc[req.away_team, "total_market_value_eur"])
        if abs(mv_h - mv_a) > 50_000_000:
            richer = req.home_team if mv_h > mv_a else req.away_team
            key_factors.append(f"{richer} has a significantly higher squad value")

    if not req.is_neutral:
        key_factors.append(f"{req.home_team} benefits from home advantage")

    if len(key_factors) == 0:
        key_factors.append("Teams are closely matched across all metrics")

    result = {
        "home_team":              req.home_team,
        "away_team":              req.away_team,
        "home_win_prob":          home_win_prob,
        "draw_prob":              draw_prob,
        "away_win_prob":          away_win_prob,
        "predicted_home_goals":   pred_home_goals,
        "predicted_away_goals":   pred_away_goals,
        "confidence":             confidence,
        "predicted_winner":       predicted_winner,
        "key_factors":            key_factors,
        "home_elo":               round(elo_h, 1),
        "away_elo":               round(elo_a, 1),
    }

    # Save prediction to MongoDB if user is logged in
    if user_id:
        db = get_db()
        await db.predictions.insert_one({
            "user_id":              user_id,
            "home_team":            req.home_team,
            "away_team":            req.away_team,
            "home_win_prob":        home_win_prob,
            "draw_prob":            draw_prob,
            "away_win_prob":        away_win_prob,
            "predicted_home_goals": pred_home_goals,
            "predicted_away_goals": pred_away_goals,
            "predicted_winner":     predicted_winner,
            "confidence":           confidence,
            "created_at":           datetime.utcnow(),
        })

    return result


async def get_prediction_history(user_id: str, limit: int = 20) -> list:
    db   = get_db()
    cursor = db.predictions.find(
        {"user_id": user_id}
    ).sort("created_at", -1).limit(limit)

    history = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
        history.append(doc)

    return history