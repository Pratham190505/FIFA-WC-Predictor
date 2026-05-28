import type { Difficulty, Direction, ShotOutcome, ShotResolution } from "../types/shootout.types";

export function resolveShot(
  direction: Direction,
  goalkeeperDive: Direction,
  power: number,
  difficulty: Difficulty,
): ShotResolution {
  const normalizedPower = Math.max(10, Math.min(100, power));
  const speed = 0.55 + normalizedPower / 180;
  const accuracyPenalty: Record<Difficulty, number> = {
    easy: 0.04,
    normal: 0,
    hard: -0.05,
    expert: -0.1,
  };
  const baseAccuracy = normalizedPower > 88 ? 0.72 : normalizedPower < 25 ? 0.76 : 0.94;
  const accuracy = Math.max(0.58, Math.min(0.98, baseAccuracy + accuracyPenalty[difficulty]));
  const missPressure: Record<Difficulty, number> = {
    easy: -0.03,
    normal: 0,
    hard: 0.04,
    expert: 0.08,
  };
  const baseMissChance = normalizedPower > 90 ? 0.2 : normalizedPower < 22 ? 0.16 : 0.05;
  const missChance = Math.max(0.02, Math.min(0.34, baseMissChance + missPressure[difficulty]));
  const saveThreshold: Record<Difficulty, number> = {
    easy: 54,
    normal: 78,
    hard: 92,
    expert: 101,
  };
  const powerBeatsKeeperChance: Record<Difficulty, number> = {
    easy: 0.9,
    normal: 0.55,
    hard: 0.2,
    expert: 0.04,
  };
  const reactionSaveChance: Record<Difficulty, number> = {
    easy: 0,
    normal: 0.03,
    hard: 0.13,
    expert: 0.28,
  };

  let outcome: ShotOutcome;

  if (Math.random() > accuracy || Math.random() < missChance) {
    outcome = "miss";
  } else if (goalkeeperDive === direction && normalizedPower < saveThreshold[difficulty]) {
    outcome = "save";
  } else if (goalkeeperDive === direction && normalizedPower >= saveThreshold[difficulty]) {
    outcome = Math.random() < powerBeatsKeeperChance[difficulty] ? "goal" : "save";
  } else if (
    Math.random() <
    reactionSaveChance[difficulty] +
      (direction === "center" ? 0.12 : 0) +
      (normalizedPower < 45 ? 0.1 : 0) -
      (normalizedPower > 82 ? 0.08 : 0)
  ) {
    outcome = "save";
  } else {
    outcome = "goal";
  }

  return {
    direction,
    goalkeeperDive,
    power: normalizedPower,
    outcome,
    goal: outcome === "goal",
    speed,
    accuracy,
  };
}

export function directionToX(direction: Direction | null): number {
  if (direction === "left") return -132;
  if (direction === "right") return 132;
  return 0;
}
