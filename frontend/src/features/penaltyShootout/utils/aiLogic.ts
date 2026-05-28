import type { Difficulty, Direction, ShotOutcome } from "../types/shootout.types";

const DIRECTIONS: Direction[] = ["left", "center", "right"];

const difficultyPrediction: Record<Difficulty, number> = {
  easy: 0.06,
  normal: 0.3,
  hard: 0.62,
  expert: 0.88,
};

export const difficultyDiveSettings: Record<Difficulty, { duration: number; stiffness: number; delay: number }> = {
  easy: { duration: 0.8, stiffness: 130, delay: 0.3 },
  normal: { duration: 0.6, stiffness: 220, delay: 0.18 },
  hard: { duration: 0.42, stiffness: 350, delay: 0.1 },
  expert: { duration: 0.28, stiffness: 520, delay: 0.04 },
};

export function pickGoalkeeperDive(
  playerDirection: Direction,
  power: number,
  difficulty: Difficulty,
): Direction {
  const pressureModifier = power > 88 ? -0.04 : power < 38 ? 0.1 : 0;
  const pressureRead = Math.max(0.04, Math.min(0.94, difficultyPrediction[difficulty] + pressureModifier));

  if (Math.random() < pressureRead) {
    return playerDirection;
  }

  const weighted: Direction[] =
    playerDirection === "center"
      ? ["left", "right", "left", "right", "center"]
      : ["center", ...DIRECTIONS, playerDirection === "left" ? "right" : "left"];

  return weighted[Math.floor(Math.random() * weighted.length)];
}

export function resolveAiPenalty(
  round: number,
  playerScore: number,
  aiScore: number,
  difficulty: Difficulty,
): ShotOutcome {
  const difficultyBonus: Record<Difficulty, number> = {
    easy: -0.08,
    normal: 0,
    hard: 0.07,
    expert: 0.12,
  };
  const chasingBonus = playerScore > aiScore ? 0.08 : 0;
  const lateRoundPressure = round >= 3 ? -0.08 : 0;
  const goalChance = Math.min(
    0.88,
    Math.max(0.42, 0.66 + chasingBonus + lateRoundPressure + difficultyBonus[difficulty]),
  );
  const roll = Math.random();

  if (roll < goalChance) return "goal";
  if (roll < goalChance + 0.25) return "save";
  return "miss";
}
