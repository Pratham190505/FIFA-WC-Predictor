import numpy as np
import torch
import random
from app.core.ml_loader import get_models
from app.controllers.predict_controller import build_feature_vector


# ── Default WC 2022 Groups ────────────────────────────────
DEFAULT_GROUPS = {
    "A": ["Qatar",       "Ecuador",      "Senegal",       "Netherlands"],
    "B": ["England",     "Iran",         "United States", "Wales"],
    "C": ["Argentina",   "Saudi Arabia", "Mexico",        "Poland"],
    "D": ["France",      "Australia",    "Denmark",       "Tunisia"],
    "E": ["Spain",       "Costa Rica",   "Germany",       "Japan"],
    "F": ["Belgium",     "Canada",       "Morocco",       "Croatia"],
    "G": ["Brazil",      "Serbia",       "Switzerland",   "Cameroon"],
    "H": ["Portugal",    "Ghana",        "Uruguay",       "South Korea"],
}


def simulate_single_match(home: str, away: str, models: dict, knockout: bool = False):
    """
    Simulate one match. Returns (winner, prob_home, prob_draw, prob_away, score_h, score_a).
    In knockout mode draws are resolved by penalty shootout.
    """
    try:
        x_raw = build_feature_vector(home, away, True, models)   # WC = neutral venue
        x     = models["scaler"].transform(x_raw)
        x_t   = torch.FloatTensor(x)

        with torch.no_grad():
            probs     = torch.softmax(models["match_predictor"](x_t), dim=1).numpy()[0]
            sh, sa    = models["score_predictor"](x_t)
            pred_sh   = max(0, round(float(sh[0][0])))
            pred_sa   = max(0, round(float(sa[0][0])))

    except Exception:
        # Fallback to ELO-based probability if model fails
        elo_h = models["elo_ratings"].get(home, 1500)
        elo_a = models["elo_ratings"].get(away, 1500)
        exp_h = 1 / (1 + 10 ** ((elo_a - elo_h) / 400))
        probs = [1 - exp_h - 0.25, 0.25, exp_h]
        probs = np.array([max(0, p) for p in probs])
        probs = probs / probs.sum()
        pred_sh, pred_sa = 1, 1

    # Stochastic outcome sampling
    outcome = np.random.choice(["away", "draw", "home"], p=probs)

    if knockout and outcome == "draw":
        # Penalty shootout — roughly 50/50
        outcome   = "home" if random.random() < 0.5 else "away"
        pred_sh   = pred_sa   = max(pred_sh, pred_sa, 1)

    winner = home if outcome == "home" else (away if outcome == "away" else None)

    return winner, round(float(probs[2])*100,1), round(float(probs[1])*100,1), round(float(probs[0])*100,1), pred_sh, pred_sa


def run_group_stage(groups: dict, models: dict):
    """Run a full group stage. Returns (group_results, qualified_teams)."""
    from itertools import combinations

    group_results   = {}
    qualified_teams = []   # 1st + 2nd from each group, in group order

    for group_name, teams in groups.items():
        standings = {t: {"pts": 0, "gf": 0, "ga": 0, "gd": 0} for t in teams}
        matches   = []

        for home, away in combinations(teams, 2):
            winner, ph, pd_, pa, sh, sa = simulate_single_match(home, away, models, knockout=False)

            standings[home]["gf"] += sh
            standings[home]["ga"] += sa
            standings[home]["gd"] += sh - sa
            standings[away]["gf"] += sa
            standings[away]["ga"] += sh
            standings[away]["gd"] += sa - sh

            if   winner == home: standings[home]["pts"] += 3
            elif winner == away: standings[away]["pts"] += 3
            else:
                standings[home]["pts"] += 1
                standings[away]["pts"] += 1

            matches.append({
                "home":          home,
                "away":          away,
                "score":         f"{sh}-{sa}",
                "winner":        winner or "Draw",
                "home_win_prob": ph,
                "draw_prob":     pd_,
                "away_win_prob": pa,
            })

        sorted_teams = sorted(
            standings.items(),
            key=lambda x: (x[1]["pts"], x[1]["gd"], x[1]["gf"]),
            reverse=True
        )

        group_results[group_name] = {
            "standings": [
                {"team": t, "pts": s["pts"], "gf": s["gf"], "ga": s["ga"], "gd": s["gd"]}
                for t, s in sorted_teams
            ],
            "matches": matches,
        }

        qualified_teams.append(sorted_teams[0][0])   # 1st place
        qualified_teams.append(sorted_teams[1][0])   # 2nd place

    return group_results, qualified_teams


def run_knockout_bracket(qualified: list, models: dict):
    """
    Run R16 → QF → SF → Final.
    WC bracket: 1A vs 2B, 1C vs 2D, 1E vs 2F, 1G vs 2H (and mirrors).
    qualified list order: [1A,2A, 1B,2B, 1C,2C, 1D,2D, 1E,2E, 1F,2F, 1G,2G, 1H,2H]
    """
    # Standard FIFA World Cup R16 matchups
    r16_pairs = [
        (qualified[0],  qualified[3]),   # 1A vs 2B
        (qualified[8],  qualified[11]),  # 1E vs 2F
        (qualified[4],  qualified[7]),   # 1C vs 2D
        (qualified[12], qualified[15]),  # 1G vs 2H
        (qualified[2],  qualified[1]),   # 1B vs 2A  (note: intentional)
        (qualified[10], qualified[9]),   # 1F vs 2E
        (qualified[6],  qualified[5]),   # 1D vs 2C
        (qualified[14], qualified[13]),  # 1H vs 2G
    ]

    bracket = {
        "round_of_16":   [],
        "quarter_finals": [],
        "semi_finals":    [],
        "third_place":    None,
        "final":          [],
        "winner":         None,
    }

    round_names   = ["round_of_16", "quarter_finals", "semi_finals", "final"]
    current_round = r16_pairs
    semi_losers   = []

    for round_name in round_names:
        next_round = []
        for home, away in current_round:
            winner, ph, pd_, pa, sh, sa = simulate_single_match(home, away, models, knockout=True)
            bracket[round_name].append({
                "home":          home,
                "away":          away,
                "winner":        winner,
                "score":         f"{sh}-{sa}",
                "home_win_prob": ph,
                "away_win_prob": pa,
            })
            next_round.append(winner)

            # Track semi-final losers for 3rd place match
            if round_name == "semi_finals":
                loser = home if winner == away else away
                semi_losers.append(loser)

        if round_name == "final":
            bracket["winner"] = next_round[0] if next_round else None
        else:
            current_round = [
                (next_round[i], next_round[i + 1])
                for i in range(0, len(next_round) - 1, 2)
            ]

    # 3rd place match
    if len(semi_losers) == 2:
        w3, ph3, _, pa3, sh3, sa3 = simulate_single_match(semi_losers[0], semi_losers[1], models, knockout=True)
        bracket["third_place"] = {
            "home":    semi_losers[0],
            "away":    semi_losers[1],
            "winner":  w3,
            "score":   f"{sh3}-{sa3}",
            "home_win_prob": ph3,
            "away_win_prob": pa3,
        }

    return bracket


async def simulate_tournament(n_simulations: int = 1000, custom_groups: dict = None) -> dict:
    models = get_models()

    if not models:
        from fastapi import HTTPException
        raise HTTPException(status_code=503, detail="ML models not loaded")

    groups = custom_groups or DEFAULT_GROUPS

    champion_counts = {}
    finalist_counts = {}

    print(f"Running {n_simulations} simulations...")

    for i in range(n_simulations):
        _, qualified = run_group_stage(groups, models)
        bracket      = run_knockout_bracket(qualified, models)

        champ = bracket.get("winner")
        if champ:
            champion_counts[champ] = champion_counts.get(champ, 0) + 1

        # Track finalists
        if bracket.get("final"):
            for match in bracket["final"]:
                for team in [match["home"], match["away"]]:
                    finalist_counts[team] = finalist_counts.get(team, 0) + 1

    # Convert to percentages
    champion_probs = {
        t: round(c / n_simulations * 100, 2)
        for t, c in sorted(champion_counts.items(), key=lambda x: -x[1])
    }
    finalist_probs = {
        t: round(c / n_simulations * 100, 2)
        for t, c in sorted(finalist_counts.items(), key=lambda x: -x[1])
    }

    # Run one deterministic simulation for bracket display
    group_results, qualified = run_group_stage(groups, models)
    bracket                  = run_knockout_bracket(qualified, models)

    return {
        "group_stage":            group_results,
        "qualified_teams":        qualified,
        "bracket":                bracket,
        "champion_probabilities": champion_probs,
        "finalist_probabilities": finalist_probs,
        "n_simulations":          n_simulations,
    }