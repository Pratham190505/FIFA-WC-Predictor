import os
import pandas as pd
import numpy as np
import joblib

# ── Path setup ────────────────────────────────────────────
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_RAW   = os.path.join(SCRIPT_DIR, "..", "raw")
PROCESSED  = os.path.join(SCRIPT_DIR, "..", "processed")
MODELS_DIR = os.path.join(SCRIPT_DIR, "..", "..", "models")

os.makedirs(PROCESSED, exist_ok=True)
os.makedirs(MODELS_DIR, exist_ok=True)
# ─────────────────────────────────────────────────────────

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


def encode_form(team, date, results_df, n=10):
    """Compute form stats for a team from their last N matches before given date."""
    mask = (
        ((results_df["home_team"] == team) | (results_df["away_team"] == team)) &
        (results_df["date"] < date)
    )
    recent = results_df[mask].sort_values("date").tail(n)

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

    total = wins + draws + losses
    win_rate   = wins / total if total > 0 else 0.5
    form_score = (wins * 3 + draws) / (total * 3) if total > 0 else 0.5
    return win_rate, float(np.mean(goal_diffs)), form_score


def get_elo_before(team, date, elo_hist):
    """Get a team's ELO rating just before a given date."""
    h = elo_hist[(elo_hist["home_team"] == team) & (elo_hist["date"] < date)]
    a = elo_hist[(elo_hist["away_team"] == team) & (elo_hist["date"] < date)]

    if len(h) == 0 and len(a) == 0:
        return 1500.0
    elif len(h) == 0:
        return float(a.iloc[-1]["elo_away_after"])
    elif len(a) == 0:
        return float(h.iloc[-1]["elo_home_after"])
    else:
        if h.iloc[-1]["date"] >= a.iloc[-1]["date"]:
            return float(h.iloc[-1]["elo_home_after"])
        else:
            return float(a.iloc[-1]["elo_away_after"])


def build_features():
    print("=" * 50)
    print("STEP 3: Building Feature Matrix")
    print("=" * 50)

    results  = pd.read_csv(os.path.join(DATA_RAW, "results.csv"),   parse_dates=["date"])
    squad    = pd.read_csv(os.path.join(PROCESSED, "squad_features.csv"))
    elo_hist = pd.read_csv(os.path.join(PROCESSED, "elo_history.csv"), parse_dates=["date"])
    goals_df = pd.read_csv(os.path.join(DATA_RAW, "goalscorers.csv"))

    # Only post-1990 — modern football era
    results = results[results["date"] >= "1990-01-01"].copy()
    results = results.dropna(subset=["home_score", "away_score"]).reset_index(drop=True)
    print(f"Matches after 1990: {len(results)}")

    tournament_weights = {
        "FIFA World Cup":                       2.0,
        "UEFA Euro":                            2.0,
        "Copa América":                         2.0,
        "African Cup of Nations":               1.8,
        "AFC Asian Cup":                        1.5,
        "CONCACAF Gold Cup":                    1.5,
        "Gold Cup":                             1.5,
        "FIFA World Cup qualification":         1.5,
        "UEFA Euro qualification":              1.3,
        "African Cup of Nations qualification": 1.2,
        "AFC Asian Cup qualification":          1.2,
        "UEFA Nations League":                  1.2,
        "Friendly":                             0.7,
    }

    squad_dict = squad.set_index("team").to_dict("index")

    def get_squad(team):
        s = squad_dict.get(team, {})
        return {
            "fifa_rank": float(s.get("fifa_ranking",           100)),
            "total_mv":  float(s.get("total_market_value_eur", 100_000_000)),
            "top5_mv":   float(s.get("top5_player_value",      20_000_000)),
            "avg_age":   float(s.get("average_age",            27.0)),
            "avg_caps":  float(s.get("avg_caps",               30.0)),
            "stars":     float(s.get("players_over_20m",       2)),
            "elite":     float(s.get("players_over_50m",       0)),
        }

    rows     = []
    max_date = results["date"].max()
    total    = len(results)

    print(f"Engineering features for {total} matches (this takes ~5-8 mins)...")

    for idx, match in results.iterrows():
        if idx % 3000 == 0 and idx > 0:
            pct = round(idx / total * 100, 1)
            print(f"  {idx}/{total} ({pct}%) done...")

        home = match["home_team"]
        away = match["away_team"]
        date = match["date"]
        hs   = float(match["home_score"])
        as_  = float(match["away_score"])

        # Result label: 0=away win, 1=draw, 2=home win
        if   hs > as_: result = 2
        elif hs < as_: result = 0
        else:          result = 1

        # Form
        h_wr, h_gd, h_form = encode_form(home, date, results)
        a_wr, a_gd, a_form = encode_form(away, date, results)

        # ELO
        elo_h = get_elo_before(home, date, elo_hist)
        elo_a = get_elo_before(away, date, elo_hist)

        # Squad
        sq_h = get_squad(home)
        sq_a = get_squad(away)

        # Penalty context from goalscorers
        date_str   = date.strftime("%Y-%m-%d")
        match_goals = goals_df[
            (goals_df["date"] == date_str) &
            (goals_df["home_team"] == home) &
            (goals_df["away_team"] == away)
        ]
        home_pens = int(match_goals[
            (match_goals["team"] == home) & (match_goals["penalty"] == True)
        ].shape[0])
        away_pens = int(match_goals[
            (match_goals["team"] == away) & (match_goals["penalty"] == True)
        ].shape[0])

        # Sample weight: recent matches + important tournaments matter more
        days_ago = (max_date - date).days
        recency  = float(np.exp(-days_ago / 730))
        t_weight = tournament_weights.get(str(match["tournament"]), 1.0)

        rows.append({
            # Home features
            "home_elo":       elo_h / 2500,
            "home_fifa_rank": 1 / (sq_h["fifa_rank"] + 1),
            "home_total_mv":  sq_h["total_mv"] / 1e9,
            "home_top5_mv":   sq_h["top5_mv"]  / 1e8,
            "home_avg_age":   sq_h["avg_age"]  / 30,
            "home_avg_caps":  sq_h["avg_caps"] / 100,
            "home_stars":     sq_h["stars"]    / 10,
            "home_elite":     sq_h["elite"]    / 5,
            "home_winrate":   h_wr,
            "home_gd_avg":    h_gd / 5,
            "home_form":      h_form,
            # Away features
            "away_elo":       elo_a / 2500,
            "away_fifa_rank": 1 / (sq_a["fifa_rank"] + 1),
            "away_total_mv":  sq_a["total_mv"] / 1e9,
            "away_top5_mv":   sq_a["top5_mv"]  / 1e8,
            "away_avg_age":   sq_a["avg_age"]  / 30,
            "away_avg_caps":  sq_a["avg_caps"] / 100,
            "away_stars":     sq_a["stars"]    / 10,
            "away_elite":     sq_a["elite"]    / 5,
            "away_winrate":   a_wr,
            "away_gd_avg":    a_gd / 5,
            "away_form":      a_form,
            # Delta features
            "delta_elo":      (elo_h - elo_a) / 500,
            "delta_rank":     (sq_a["fifa_rank"] - sq_h["fifa_rank"]) / 100,
            "delta_mv":       (sq_h["total_mv"] - sq_a["total_mv"]) / 1e9,
            "delta_form":     h_form - a_form,
            "delta_winrate":  h_wr - a_wr,
            # Context
            "is_neutral":     int(match["neutral"]),
            "home_pens":      home_pens,
            "away_pens":      away_pens,
            # Targets
            "result":         result,
            "home_score":     hs,
            "away_score":     as_,
            # Sample weight
            "sample_weight":  recency * t_weight,
        })

    df = pd.DataFrame(rows)
    df.to_csv(os.path.join(PROCESSED, "match_dataset.csv"), index=False)

    # Save feature column list for use in model + API
    joblib.dump(FEATURE_COLS, os.path.join(MODELS_DIR, "feature_cols.pkl"))

    print(f"\n✅ STEP 3 COMPLETE — Feature matrix saved!")
    print(f"Shape: {df.shape}")
    print(f"Result distribution: {df['result'].value_counts().sort_index().to_dict()}")
    print("  (0=Away win, 1=Draw, 2=Home win)")
    return df


if __name__ == "__main__":
    build_features()