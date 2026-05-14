import { useEffect, useState } from "react";
import { analyticsAPI } from "../lib/api";

export interface AnalyticsDashboard {
  top_attack: Array<{
    team: string; goals_per_game: number;
    attack_score: number; squad_value_bn: number; elo: number;
  }>;
  top_defense: Array<{
    team: string; goals_conceded_per_game: number;
    defense_score: number; elo: number;
  }>;
  top_scorers: Array<{
    scorer: string; goals: number; penalties: number;
  }>;
  recent_form: Array<{
    team: string; form_last10: string;
    wins: number; draws: number; losses: number;
  }>;
  monthly_accuracy: Array<{
    month: string; accuracy: number; n_matches: number;
  }>;
  confederation_stats: Array<{
    confederation: string; avg_attack: number;
    avg_elo: number; team_count: number;
  }>;
}

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    analyticsAPI
      .getDashboard()
      .then((res) => setData(res.data))
      .catch((err) =>
        setError(err.response?.data?.detail || "Failed to load analytics")
      )
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}