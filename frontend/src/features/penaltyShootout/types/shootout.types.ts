export type Direction = "left" | "center" | "right";

export type GamePhase = "ready" | "aiming" | "shooting" | "roundResult" | "finished";

export type ShotOutcome = "goal" | "save" | "miss";

export type Winner = "player" | "ai" | "draw";

export type Difficulty = "easy" | "normal" | "hard" | "expert";

export interface RoundResult {
  playerDirection: Direction | null;
  goalkeeperDive: Direction | null;
  playerOutcome: ShotOutcome | null;
  aiOutcome: ShotOutcome | null;
}

export interface ShotResolution {
  direction: Direction;
  goalkeeperDive: Direction;
  power: number;
  outcome: ShotOutcome;
  goal: boolean;
  speed: number;
  accuracy: number;
}

export interface ShootoutState {
  isOpen: boolean;
  phase: GamePhase;
  playerScore: number;
  aiScore: number;
  currentRound: number;
  totalRounds: number;
  rounds: RoundResult[];
  selectedDirection: Direction;
  power: number;
  goalkeeperDive: Direction | null;
  ballDirection: Direction | null;
  lastOutcome: ShotOutcome | null;
  shotSpeed: number;
  commentary: string;
  winner: Winner | null;
  difficulty: Difficulty;
}
