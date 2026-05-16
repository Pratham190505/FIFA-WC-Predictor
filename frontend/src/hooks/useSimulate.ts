import { useRef, useState } from "react";
import { simulateAPI } from "../lib/api";
import { DEFAULT_SIMULATION_COUNT, type SimulationCount } from "../lib/simulation";

export interface SimulateResult {
  group_stage: Record<string, {
    standings: Array<{ team: string; pts: number; gf: number; ga: number; gd: number }>;
    matches: Array<{
      home: string; away: string; score: string;
      winner: string; home_win_prob: number; away_win_prob: number;
    }>;
  }>;
  qualified_teams: string[];
  bracket: {
    round_of_16: BracketMatch[];
    quarter_finals: BracketMatch[];
    semi_finals: BracketMatch[];
    final: BracketMatch[];
    third_place: BracketMatch | null;
    winner: string;
  };
  champion_probabilities: Record<string, number>;
  finalist_probabilities: Record<string, number>;
  n_simulations: SimulationCount;
}

interface BracketMatch {
  home: string;
  away: string;
  winner: string;
  score: string;
  home_win_prob: number;
  away_win_prob: number;
}

export function useSimulate() {
  const [result, setResult] = useState<SimulateResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inFlightRef = useRef(false);

  const simulate = async (nSimulations: SimulationCount = DEFAULT_SIMULATION_COUNT) => {
    if (inFlightRef.current) {
      return;
    }

    inFlightRef.current = true;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await simulateAPI.runTournament(nSimulations);
      setResult(res.data);
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          "Simulation failed. Make sure the backend is running."
      );
    } finally {
      inFlightRef.current = false;
      setLoading(false);
    }
  };

  return { simulate, result, loading, error };
}
