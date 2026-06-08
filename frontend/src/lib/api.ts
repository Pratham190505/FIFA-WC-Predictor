import api from "./axios";
import { DEFAULT_SIMULATION_COUNT, type SimulationCount } from "./simulation";

// ── Auth ──────────────────────────────────────────────────
export const authAPI = {
  register: (data: {
    username: string;
    email: string;
    password: string;
    full_name?: string;
  }) => api.post("/auth/register", data),

  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),

  refresh: (refresh_token: string) =>
    api.post("/auth/refresh", { refresh_token }),

  me: () => api.get("/auth/me"),

  changePassword: (data: {
    current_password: string;
    new_password: string;
  }) => api.put("/auth/change-password", data),

  logout: () => api.post("/auth/logout"),
};

// ── Predictions ───────────────────────────────────────────
export const predictAPI = {
  predictMatch: (data: {
    home_team: string;
    away_team: string;
    is_neutral?: boolean;
  }) => api.post("/predict/match", data),

  getHistory: (limit = 20) =>
    api.get(`/predict/history?limit=${limit}`),
};

// ── Tournament Simulator ──────────────────────────────────
export const simulateAPI = {
  runTournament: (n_simulations: SimulationCount = DEFAULT_SIMULATION_COUNT) =>
    api.post("/simulate/tournament", { n_simulations }),
};

// ── Analytics ─────────────────────────────────────────────
export const analyticsAPI = {
  getDashboard: () => api.get("/analytics/dashboard"),
  getAttackRankings: (limit = 32) =>
    api.get(`/analytics/attack-rankings?limit=${limit}`),
  getDefenseRankings: (limit = 32) =>
    api.get(`/analytics/defense-rankings?limit=${limit}`),
  getTopScorers: (limit = 20) =>
    api.get(`/analytics/top-scorers?limit=${limit}`),
  getTeamForm: (team?: string) =>
    api.get(`/analytics/team-form${team ? `?team=${team}` : ""}`),
  getH2H: (team_a: string, team_b: string) =>
    api.get(`/analytics/h2h?team_a=${encodeURIComponent(team_a)}&team_b=${encodeURIComponent(team_b)}`),
  getPredictionAccuracy: () => api.get("/analytics/prediction-accuracy"),
  getConfederationStats: () => api.get("/analytics/confederation-stats"),
};

// ── Teams ─────────────────────────────────────────────────
export const teamsAPI = {
  getAllTeams: () => api.get("/teams/"),
  getTeam: (name: string) =>
    api.get(`/teams/${encodeURIComponent(name)}`),
  compareTeams: (team_a: string, team_b: string) =>
    api.get(
      `/teams/compare?team_a=${encodeURIComponent(team_a)}&team_b=${encodeURIComponent(team_b)}`
    ),
};

// ── Players ──────────────────────────────────────────────
export const playersAPI = {
  getByTeam: (team: string, limit = 25) =>
    api.get(`/players/team/${encodeURIComponent(team)}?limit=${limit}`),
  getTopValued: (limit = 20) =>
    api.get(`/players/top-valued?limit=${limit}`),
  searchPlayers: (q: string, limit = 10) =>
    api.get(`/players/search?q=${encodeURIComponent(q)}&limit=${limit}`),
};
