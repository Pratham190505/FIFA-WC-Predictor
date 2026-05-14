import { useState } from "react";
import { predictAPI } from "../lib/api";

export interface PredictResult {
  home_team: string;
  away_team: string;
  home_win_prob: number;
  draw_prob: number;
  away_win_prob: number;
  predicted_home_goals: number;
  predicted_away_goals: number;
  confidence: number;
  predicted_winner: string;
  key_factors: string[];
  home_elo: number;
  away_elo: number;
}

// Maps your frontend team names/IDs to backend team names
const TEAM_NAME_MAP: Record<string, string> = {
  BRA: "Brazil", ARG: "Argentina", FRA: "France", ENG: "England",
  ESP: "Spain", POR: "Portugal", GER: "Germany", NED: "Netherlands",
  BEL: "Belgium", ITA: "Italy", CRO: "Croatia", URU: "Uruguay",
  USA: "United States", MEX: "Mexico", JPN: "Japan", MAR: "Morocco",
  SEN: "Senegal", SUI: "Switzerland", DEN: "Denmark", POL: "Poland",
  SRB: "Serbia", ECU: "Ecuador", AUS: "Australia", KOR: "South Korea",
  TUN: "Tunisia", CRC: "Costa Rica", CMR: "Cameroon", GHA: "Ghana",
  QAT: "Qatar", KSA: "Saudi Arabia", CAN: "Canada", WAL: "Wales",
};

export function resolveTeamName(idOrName: string): string {
  return TEAM_NAME_MAP[idOrName] ?? idOrName;
}

export function usePredict() {
  const [result, setResult] = useState<PredictResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const predict = async (
    homeTeamId: string,
    awayTeamId: string,
    isNeutral = true
  ) => {
    setLoading(true);
    setError(null);
    setResult(null);

    const homeTeam = resolveTeamName(homeTeamId);
    const awayTeam = resolveTeamName(awayTeamId);

    try {
      const res = await predictAPI.predictMatch({
        home_team: homeTeam,
        away_team: awayTeam,
        is_neutral: isNeutral,
      });
      setResult(res.data);
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      setError(
        detail ||
          "Prediction failed. Make sure the backend is running and models are trained."
      );
    } finally {
      setLoading(false);
    }
  };

  return { predict, result, loading, error };
}