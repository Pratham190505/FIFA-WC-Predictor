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


def goals_avg(team, results, n=20):
    """Average goals scored per game — last N completed matches only."""
    mask   = (results["home_team"] == team) | (results["away_team"] == team)
    recent = results[mask].sort_values("date").tail(n)
    scored = []
    for _, r in recent.iterrows():
        val = r["home_score"] if r["home_team"] == team else r["away_score"]
        if not pd.isna(val):
            scored.append(val)
    return float(np.mean(scored)) if scored else 0.0


def goals_conceded_avg(team, results, n=20):
    """Average goals conceded per game — last N completed matches only."""
    mask   = (results["home_team"] == team) | (results["away_team"] == team)
    recent = results[mask].sort_values("date").tail(n)
    conceded = []
    for _, r in recent.iterrows():
        val = r["away_score"] if r["home_team"] == team else r["home_score"]
        if not pd.isna(val):
            conceded.append(val)
    return float(np.mean(conceded)) if conceded else 0.0


def build_analytics():
    print("=" * 50)
    print("STEP 5: Building Analytics Data")
    print("=" * 50)

    # Load data
    results  = pd.read_csv(os.path.join(DATA_RAW,  "results.csv"),     parse_dates=["date"])
    squad    = pd.read_csv(os.path.join(PROCESSED, "squad_features.csv"))
    goals_df = pd.read_csv(os.path.join(DATA_RAW,  "goalscorers.csv"))
    elo_curr = pd.read_csv(os.path.join(PROCESSED, "current_elo.csv"))

    # Drop future unplayed matches (NaN scores)
    results = results.dropna(subset=["home_score", "away_score"]).copy()
    print(f"Completed matches loaded: {len(results)}")

    elo_dict = dict(zip(elo_curr["team"], elo_curr["elo"]))

    wc_teams = [
        "Brazil",       "Argentina",    "France",       "Germany",
        "Spain",        "England",      "Portugal",     "Netherlands",
        "Japan",        "South Korea",  "United States","Mexico",
        "Morocco",      "Senegal",      "Australia",    "Croatia",
        "Belgium",      "Switzerland",  "Uruguay",      "Colombia",
        "Denmark",      "Poland",       "Serbia",       "Ecuador",
        "Cameroon",     "Ghana",        "Tunisia",      "Saudi Arabia",
        "Iran",         "Qatar",        "Canada",       "Wales",
    ]

    # ── 1. ATTACK & DEFENSE RANKINGS ─────────────────────
    print("\nComputing attack and defense rankings...")
    attack_data  = []
    defense_data = []

    for team in wc_teams:
        sq_row = squad[squad["team"] == team]
        if sq_row.empty:
            total_mv      = 100_000_000.0
            confederation = ""
        else:
            sq            = sq_row.iloc[0]
            total_mv      = float(sq["total_market_value_eur"])
            confederation = str(sq.get("confederation", ""))

        ga  = goals_avg(team, results)
        gca = goals_conceded_avg(team, results)
        elo = elo_dict.get(team, 1500)

        # Attack score: goals per game + squad value + ELO
        attack_score  = round(ga * 40 + (total_mv / 1e9) * 15 + (elo / 2000) * 10, 2)
        # Defense score: inverse of goals conceded + squad value + ELO
        defense_score = round((1 / (gca + 0.1)) * 40 + (total_mv / 1e9) * 10 + (elo / 2000) * 8, 2)

        attack_data.append({
            "team":           team,
            "goals_per_game": round(ga,  2),
            "attack_score":   attack_score,
            "squad_value_bn": round(total_mv / 1e9, 2),
            "elo":            round(elo, 0),
            "confederation":  confederation,
        })
        defense_data.append({
            "team":                    team,
            "goals_conceded_per_game": round(gca, 2),
            "defense_score":           defense_score,
            "elo":                     round(elo, 0),
            "confederation":           confederation,
        })

    attack_df  = (pd.DataFrame(attack_data)
                    .sort_values("attack_score", ascending=False)
                    .reset_index(drop=True))
    defense_df = (pd.DataFrame(defense_data)
                    .sort_values("defense_score", ascending=False)
                    .reset_index(drop=True))

    # ── 2. TOP SCORERS (all time, from goalscorers.csv) ──
    print("Computing top scorers...")
    top_scorers = (
        goals_df[goals_df["own_goal"] == False]
        .groupby("scorer")
        .agg(
            goals     =("scorer",  "count"),
            penalties =("penalty", "sum"),
        )
        .reset_index()
        .sort_values("goals", ascending=False)
        .head(20)
    )

    # ── 3. TEAM FORM — last 10 matches since 2022 ────────
    print("Computing recent team form...")
    recent_results = results[results["date"] >= "2022-01-01"].copy()
    form_data = []

    for team in wc_teams:
        mask   = (recent_results["home_team"] == team) | (recent_results["away_team"] == team)
        recent = recent_results[mask].sort_values("date").tail(10)
        form   = []
        for _, r in recent.iterrows():
            scored   = r["home_score"] if r["home_team"] == team else r["away_score"]
            conceded = r["away_score"] if r["home_team"] == team else r["home_score"]
            if   scored > conceded:  form.append("W")
            elif scored == conceded: form.append("D")
            else:                    form.append("L")

        form_data.append({
            "team":        team,
            "form_last10": "".join(form),
            "wins":        form.count("W"),
            "draws":       form.count("D"),
            "losses":      form.count("L"),
        })

    form_df = pd.DataFrame(form_data)

    # ── 4. HEAD-TO-HEAD MATRIX (top 16 attack teams) ─────
    print("Computing H2H matrix...")
    top16 = attack_df.head(16)["team"].tolist()
    h2h   = {}

    for ta in top16:
        h2h[ta] = {}
        for tb in top16:
            if ta == tb:
                h2h[ta][tb] = None
                continue

            h2h_matches = results[
                ((results["home_team"] == ta) & (results["away_team"] == tb)) |
                ((results["home_team"] == tb) & (results["away_team"] == ta))
            ]

            if len(h2h_matches) == 0:
                h2h[ta][tb] = 50.0
                continue

            wins = sum(
                1 for _, r in h2h_matches.iterrows()
                if (r["home_team"] == ta and r["home_score"] > r["away_score"]) or
                   (r["away_team"] == ta and r["away_score"] > r["home_score"])
            )
            h2h[ta][tb] = round(wins / len(h2h_matches) * 100, 1)

    # ── 5. MONTHLY PREDICTION ACCURACY (ELO baseline) ────
    print("Computing monthly prediction accuracy...")
    test          = results[results["date"] >= "2022-01-01"].copy()
    test["month"] = test["date"].dt.to_period("M")
    monthly_acc   = []

    for month, group in test.groupby("month"):
        correct = total = 0
        for _, r in group.iterrows():
            elo_h     = elo_dict.get(r["home_team"], 1500)
            elo_a     = elo_dict.get(r["away_team"], 1500)
            # Simple ELO-based prediction (home +50 bonus)
            predicted = 2 if (elo_h + 50) > elo_a else 0
            actual    = (2 if r["home_score"] > r["away_score"]
                         else 1 if r["home_score"] == r["away_score"]
                         else 0)
            if predicted == actual:
                correct += 1
            total += 1

        if total > 0:
            monthly_acc.append({
                "month":     str(month),
                "accuracy":  round(correct / total * 100, 1),
                "n_matches": total,
            })

    # ── 6. CONFEDERATION BREAKDOWN ───────────────────────
    print("Computing confederation stats...")
    conf_stats = (
        attack_df.groupby("confederation")
        .agg(
            avg_attack  =("attack_score",   "mean"),
            avg_elo     =("elo",            "mean"),
            team_count  =("team",           "count"),
        )
        .reset_index()
        .round(2)
        .to_dict("records")
    )

    # ── SAVE ALL ──────────────────────────────────────────
    analytics = {
        "attack_rankings":   attack_df.to_dict("records"),
        "defense_rankings":  defense_df.to_dict("records"),
        "top_scorers":       top_scorers.to_dict("records"),
        "team_form":         form_df.to_dict("records"),
        "h2h_matrix":        h2h,
        "monthly_accuracy":  monthly_acc,
        "confederation_stats": conf_stats,
    }

    out_path = os.path.join(MODELS_DIR, "analytics_data.pkl")
    joblib.dump(analytics, out_path)

    print(f"\n✅ STEP 5 COMPLETE — analytics_data.pkl saved to models/")
    print(f"\nTop 5 Attack:")
    print(attack_df.head(5)[["team", "goals_per_game", "attack_score"]].to_string(index=False))
    print(f"\nTop 5 Defense:")
    print(defense_df.head(5)[["team", "goals_conceded_per_game", "defense_score"]].to_string(index=False))
    print(f"\nTop 5 Scorers (all time):")
    print(top_scorers.head(5).to_string(index=False))

    return analytics


if __name__ == "__main__":
    build_analytics()