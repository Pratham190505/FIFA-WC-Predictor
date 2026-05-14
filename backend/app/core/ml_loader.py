import os
import joblib
import torch
import torch.nn as nn
from app.core.config import settings

# ── Global model registry ─────────────────────────────────
_models = {}

FEATURE_COLS = [
    "home_elo", "home_fifa_rank", "home_total_mv", "home_top5_mv",
    "home_avg_age", "home_avg_caps", "home_stars", "home_elite",
    "home_winrate", "home_gd_avg", "home_form",
    "away_elo", "away_fifa_rank", "away_total_mv", "away_top5_mv",
    "away_avg_age", "away_avg_caps", "away_stars", "away_elite",
    "away_winrate", "away_gd_avg", "away_form",
    "delta_elo", "delta_rank", "delta_mv", "delta_form", "delta_winrate",
    "is_neutral", "home_pens", "away_pens",
]


# ── Model architecture definitions (must match training) ──

class MatchPredictor(nn.Module):
    def __init__(self, input_dim=30):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, 256), nn.BatchNorm1d(256), nn.GELU(), nn.Dropout(0.3),
            nn.Linear(256, 128),       nn.BatchNorm1d(128), nn.GELU(), nn.Dropout(0.25),
            nn.Linear(128, 64),        nn.GELU(), nn.Dropout(0.15),
            nn.Linear(64, 32),         nn.GELU(),
            nn.Linear(32, 3),
        )
    def forward(self, x):
        return self.net(x)


class ScorePredictor(nn.Module):
    def __init__(self, input_dim=30):
        super().__init__()
        self.shared   = nn.Sequential(
            nn.Linear(input_dim, 128), nn.GELU(), nn.Dropout(0.2),
            nn.Linear(128, 64),        nn.GELU(),
        )
        self.home_out = nn.Linear(64, 1)
        self.away_out = nn.Linear(64, 1)

    def forward(self, x):
        s = self.shared(x)
        return torch.relu(self.home_out(s)), torch.relu(self.away_out(s))


def load_all_models():
    """Load all ML models and data files once at server startup."""
    global _models
    mdir = settings.MODELS_DIR

    try:
        # ── Scaler + feature cols ─────────────────────────
        _models["scaler"]       = joblib.load(os.path.join(mdir, "scaler.pkl"))
        _models["feature_cols"] = joblib.load(os.path.join(mdir, "feature_cols.pkl"))
        _models["elo_ratings"]  = joblib.load(os.path.join(mdir, "elo_ratings.pkl"))
        _models["analytics"]    = joblib.load(os.path.join(mdir, "analytics_data.pkl"))
        print("✅ Scaler, ELO, analytics loaded")

        # ── Match predictor ───────────────────────────────
        input_dim   = len(_models["feature_cols"])
        match_model = MatchPredictor(input_dim)
        match_model.load_state_dict(
            torch.load(os.path.join(mdir, "match_predictor.pt"), map_location="cpu")
        )
        match_model.eval()
        _models["match_predictor"] = match_model
        print("✅ Match predictor loaded")

        # ── Score predictor ───────────────────────────────
        score_model = ScorePredictor(input_dim)
        score_model.load_state_dict(
            torch.load(os.path.join(mdir, "score_predictor.pt"), map_location="cpu")
        )
        score_model.eval()
        _models["score_predictor"] = score_model
        print("✅ Score predictor loaded")

        # ── Squad features ────────────────────────────────
        import pandas as pd
        processed = os.path.join(
    os.path.dirname(mdir), "data", "processed"
)
        _models["squad"]    = pd.read_csv(os.path.join(processed, "squad_features.csv")).set_index("team")
        _models["elo_curr"] = pd.read_csv(os.path.join(processed, "current_elo.csv"))
        _models["results"] = pd.read_csv(
    os.path.join(
        os.path.dirname(mdir),
        "data",
        "raw",
        "results.csv"
    ),
    parse_dates=["date"]
)
        _models["results"] = _models["results"].dropna(subset=["home_score", "away_score"])
        print("✅ Squad + results data loaded")

    except FileNotFoundError as e:
        print(f"⚠️  Model file not found: {e}")
        print("   Run training scripts first, then restart the server.")


def get_models() -> dict:
    return _models