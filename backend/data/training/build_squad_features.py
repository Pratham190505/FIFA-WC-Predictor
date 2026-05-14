import os
import pandas as pd
import numpy as np

# ── Path setup ────────────────────────────────────────────
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_RAW   = os.path.join(SCRIPT_DIR, "..", "raw")
PROCESSED  = os.path.join(SCRIPT_DIR, "..", "processed")
MODELS_DIR = os.path.join(SCRIPT_DIR, "..", "..", "models")

os.makedirs(PROCESSED, exist_ok=True)
os.makedirs(MODELS_DIR, exist_ok=True)
# ─────────────────────────────────────────────────────────


def build_squad_features():
    print("=" * 50)
    print("STEP 2: Building Squad Features")
    print("=" * 50)

    players = pd.read_csv(os.path.join(DATA_RAW, "players.csv"))
    nt      = pd.read_csv(os.path.join(DATA_RAW, "national_teams.csv"))
    pv      = pd.read_csv(os.path.join(DATA_RAW, "player_valuations.csv"), parse_dates=["date"])

    print(f"Players loaded:           {len(players)}")
    print(f"National teams loaded:    {len(nt)}")
    print(f"Player valuations loaded: {len(pv)}")

    # Get latest valuation per player from historical data
    latest_vals = (
        pv.sort_values("date")
        .groupby("player_id")["market_value_in_eur"]
        .last()
        .reset_index()
        .rename(columns={"market_value_in_eur": "latest_value"})
    )
    players = players.merge(latest_vals, on="player_id", how="left")

    # Use market_value_in_eur first, fall back to latest_value
    players["mv"] = players["market_value_in_eur"].fillna(players["latest_value"]).fillna(0)

    squad_features = []

    for _, team_row in nt.iterrows():
        team_name = team_row["name"]

        team_players = players[
            players["country_of_citizenship"] == team_name
        ].copy()

        mv = team_players["mv"].dropna()
        mv = mv[mv > 0]

        top5_value = (
            team_players.nlargest(5, "mv")["mv"].sum()
            if len(team_players) >= 5 else mv.sum()
        )

        caps  = team_players["international_caps"].dropna()
        goals = team_players["international_goals"].dropna()

        pos_counts    = team_players["position"].value_counts()
        n_attackers   = int(pos_counts.get("Attack",     0))
        n_defenders   = int(pos_counts.get("Defender",   0))
        n_midfielders = int(pos_counts.get("Midfield",   0))
        n_goalkeepers = int(pos_counts.get("Goalkeeper", 0))

        total_mv = team_row.get("total_market_value", None)
        if pd.isna(total_mv) or total_mv == 0:
            total_mv = float(mv.sum())
        else:
            total_mv = float(total_mv)

        squad_features.append({
            "team":                   team_name,
            "fifa_ranking":           float(team_row.get("fifa_ranking", 100)),
            "confederation":          str(team_row.get("confederation", "Unknown")),
            "squad_size":             int(team_row.get("squad_size", 23)),
            "average_age":            float(team_row.get("average_age", 27.0)),
            "total_market_value_eur": total_mv,
            "top5_player_value":      float(top5_value) if not np.isnan(float(top5_value)) else 0.0,
            "median_player_value":    float(mv.median()) if len(mv) > 0 else 0.0,
            "avg_caps":               float(caps.mean()) if len(caps) > 0 else 0.0,
            "avg_intl_goals":         float(goals.mean()) if len(goals) > 0 else 0.0,
            "players_over_20m":       int((mv >= 20_000_000).sum()),
            "players_over_50m":       int((mv >= 50_000_000).sum()),
            "n_attackers":            n_attackers,
            "n_defenders":            n_defenders,
            "n_midfielders":          n_midfielders,
            "n_goalkeepers":          n_goalkeepers,
        })

    # Wales manual fallback — missing from national_teams.csv
    existing_teams = [s["team"] for s in squad_features]
    if "Wales" not in existing_teams:
        squad_features.append({
            "team": "Wales", "fifa_ranking": 63.0, "confederation": "UEFA",
            "squad_size": 26, "average_age": 27.5,
            "total_market_value_eur": 180_000_000.0,
            "top5_player_value": 80_000_000.0,
            "median_player_value": 5_000_000.0,
            "avg_caps": 35.0, "avg_intl_goals": 0.8,
            "players_over_20m": 2, "players_over_50m": 0,
            "n_attackers": 6, "n_defenders": 8,
            "n_midfielders": 8, "n_goalkeepers": 3,
        })
        print("Added Wales manually (missing from national_teams.csv)")

    df = pd.DataFrame(squad_features)
    df.to_csv(os.path.join(PROCESSED, "squad_features.csv"), index=False)

    print(f"\n✅ STEP 2 COMPLETE — Squad features saved!")
    print(f"Teams with features: {len(df)}")

    wc_teams = [
        "Brazil", "France", "Argentina", "England",
        "Germany", "Spain", "Portugal", "Netherlands"
    ]
    sample = df[df["team"].isin(wc_teams)][[
        "team", "fifa_ranking", "total_market_value_eur",
        "top5_player_value", "players_over_20m", "avg_caps"
    ]]
    print("\nSample — top WC teams:")
    print(sample.sort_values("fifa_ranking").to_string(index=False))

    return df


if __name__ == "__main__":
    build_squad_features()