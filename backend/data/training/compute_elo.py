import os
import pandas as pd
import numpy as np
import joblib

# ── Path setup (works from ANY working directory) ─────────
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))       # backend/data/training/
DATA_RAW   = os.path.join(SCRIPT_DIR, "..", "raw")            # backend/data/raw/
PROCESSED  = os.path.join(SCRIPT_DIR, "..", "processed")      # backend/data/processed/
MODELS_DIR = os.path.join(SCRIPT_DIR, "..", "..", "models")   # backend/models/

os.makedirs(PROCESSED, exist_ok=True)
os.makedirs(MODELS_DIR, exist_ok=True)
# ─────────────────────────────────────────────────────────


def compute_elo():
    print("=" * 50)
    print("STEP 1: Computing ELO Ratings")
    print("=" * 50)

    results = pd.read_csv(os.path.join(DATA_RAW, "results.csv"), parse_dates=["date"])
    print(f"Loaded {len(results)} matches")

    # Former country name mapping
    former_path = os.path.join(DATA_RAW, "former_names.csv")
    if os.path.exists(former_path):
        former   = pd.read_csv(former_path)
        name_map = dict(zip(former.iloc[:, 0], former.iloc[:, 1]))
    else:
        name_map = {
            "Soviet Union":      "Russia",
            "Czechoslovakia":    "Czech Republic",
            "German DR":         "Germany",
            "Yugoslavia":        "Serbia",
            "Zaire":             "DR Congo",
            "Rhodesia":          "Zimbabwe",
            "Dutch East Indies": "Indonesia",
        }

    def normalise(name):
        return name_map.get(name, name)

    results["home_team"] = results["home_team"].apply(normalise)
    results["away_team"] = results["away_team"].apply(normalise)

    tournament_weights = {
        "FIFA World Cup":                       2.0,
        "FIFA World Cup qualification":         1.5,
        "Copa América":                         1.5,
        "UEFA Euro":                            1.5,
        "African Cup of Nations":               1.3,
        "AFC Asian Cup":                        1.3,
        "CONCACAF Gold Cup":                    1.3,
        "Gold Cup":                             1.3,
        "UEFA Nations League":                  1.2,
        "UEFA Euro qualification":              1.2,
        "African Cup of Nations qualification": 1.1,
        "AFC Asian Cup qualification":          1.1,
        "Friendly":                             0.8,
    }

    K_BASE  = 32
    DEFAULT = 1500
    elo     = {}

    def get_elo(team):
        return elo.get(team, DEFAULT)

    def expected_score(ra, rb):
        return 1 / (1 + 10 ** ((rb - ra) / 400))

    elo_history    = []
    results_sorted = results.sort_values("date").reset_index(drop=True)

    print(f"Computing ELO for {len(results_sorted)} matches...")

    for idx, row in results_sorted.iterrows():
        if idx % 10000 == 0 and idx > 0:
            print(f"  {idx}/{len(results_sorted)} done...")

        home = row["home_team"]
        away = row["away_team"]
        hs   = row["home_score"]
        as_  = row["away_score"]

        if pd.isna(hs) or pd.isna(as_):
            continue

        k_mult     = tournament_weights.get(str(row["tournament"]), 1.0)
        home_bonus = 0 if row["neutral"] else 50

        ra = get_elo(home) + home_bonus
        rb = get_elo(away)
        ea = expected_score(ra, rb)
        eb = expected_score(rb, ra)

        if   hs > as_: sa, sb = 1.0, 0.0
        elif hs < as_: sa, sb = 0.0, 1.0
        else:          sa, sb = 0.5, 0.5

        gd = abs(int(hs) - int(as_))
        if   gd <= 1: gd_mult = 1.00
        elif gd == 2: gd_mult = 1.50
        elif gd == 3: gd_mult = 1.75
        else:         gd_mult = 2.00

        K = K_BASE * k_mult * gd_mult

        elo_home_before = get_elo(home)
        elo_away_before = get_elo(away)

        elo[home] = elo_home_before + K * (sa - ea)
        elo[away] = elo_away_before + K * (sb - eb)

        elo_history.append({
            "date":            row["date"],
            "home_team":       home,
            "away_team":       away,
            "elo_home_before": round(elo_home_before, 2),
            "elo_away_before": round(elo_away_before, 2),
            "elo_home_after":  round(elo[home], 2),
            "elo_away_after":  round(elo[away], 2),
        })

    elo_df = pd.DataFrame(elo_history)
    elo_df.to_csv(os.path.join(PROCESSED, "elo_history.csv"), index=False)

    current_elo = pd.DataFrame([
        {"team": t, "elo": round(r, 1)} for t, r in elo.items()
    ]).sort_values("elo", ascending=False).reset_index(drop=True)
    current_elo.to_csv(os.path.join(PROCESSED, "current_elo.csv"), index=False)

    joblib.dump(elo, os.path.join(MODELS_DIR, "elo_ratings.pkl"))

    print("\n✅ STEP 1 COMPLETE — ELO saved!")
    print(f"Teams rated: {len(elo)}")
    print("\nTop 20 ELO Ratings:")
    print(current_elo.head(20).to_string(index=False))
    return elo, elo_df


if __name__ == "__main__":
    compute_elo()