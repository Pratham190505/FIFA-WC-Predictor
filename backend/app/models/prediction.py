from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# ── Match Prediction ──────────────────────────────────────

class MatchPredictRequest(BaseModel):
    home_team:  str = Field(..., example="Brazil")
    away_team:  str = Field(..., example="Argentina")
    is_neutral: bool = Field(False, description="True if played on neutral ground")


class MatchPredictResponse(BaseModel):
    home_team:         str
    away_team:         str
    home_win_prob:     float
    draw_prob:         float
    away_win_prob:     float
    predicted_home_goals: int
    predicted_away_goals: int
    confidence:        float
    predicted_winner:  str
    key_factors:       List[str]
    home_elo:          float
    away_elo:          float


# ── Tournament Simulation ─────────────────────────────────

class SimulateRequest(BaseModel):
    n_simulations: int = Field(1000, ge=100, le=50000)
    custom_groups: Optional[dict] = None


class TeamStanding(BaseModel):
    team: str
    pts:  int
    gf:   int
    ga:   int
    gd:   int


class GroupResult(BaseModel):
    standings: List[TeamStanding]
    matches:   List[dict]


class BracketMatch(BaseModel):
    home:          str
    away:          str
    winner:        str
    score:         str
    home_win_prob: float
    away_win_prob: float


class SimulateResponse(BaseModel):
    group_stage:              dict
    qualified_teams:          List[str]
    bracket:                  dict
    champion_probabilities:   dict
    finalist_probabilities:   dict
    n_simulations:            int


# ── Analytics ─────────────────────────────────────────────

class TeamRanking(BaseModel):
    team:          str
    score:         float
    goals_per_game: Optional[float] = None
    goals_conceded_per_game: Optional[float] = None
    elo:           Optional[float] = None
    confederation: Optional[str]   = None


class PredictionHistory(BaseModel):
    id:            str
    home_team:     str
    away_team:     str
    home_win_prob: float
    draw_prob:     float
    away_win_prob: float
    predicted_home_goals: int
    predicted_away_goals: int
    created_at:    datetime