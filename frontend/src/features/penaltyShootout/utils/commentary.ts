import type { ShotOutcome, Winner } from "../types/shootout.types";

const lines = {
  ready: [
    "The pressure is on!",
    "Pick your corner and trust the strike.",
    "The stadium is holding its breath.",
  ],
  goal: [
    "WHAT A FINISH!",
    "Top-tier penalty. No chance for the keeper.",
    "Ice cold from the spot.",
    "The net snaps back. Brilliant strike.",
  ],
  save: [
    "INCREDIBLE SAVE!",
    "The keeper read it perfectly.",
    "Denied by a massive stop.",
    "Strong hands from the goalkeeper.",
  ],
  miss: [
    "Off target under pressure.",
    "That one flashes wide.",
    "Too much power, not enough precision.",
  ],
  aiGoal: [
    "The AI converts and keeps the pressure alive.",
    "Clean finish from the opposition.",
    "Your keeper goes the wrong way.",
  ],
  aiStop: [
    "The AI fails from the spot.",
    "Your side survives that penalty.",
    "Huge let-off. The shootout stays alive.",
  ],
  win: ["YOU WIN THE SHOOTOUT!", "Clutch penalties. You take the shootout."],
  loss: ["The AI wins the shootout.", "So close, but the AI edges it."],
  draw: ["Honours even after five rounds.", "A deadlock after the final kick."],
};

function sample(values: string[]): string {
  return values[Math.floor(Math.random() * values.length)];
}

export function openingCommentary(): string {
  return sample(lines.ready);
}

export function playerShotCommentary(outcome: ShotOutcome): string {
  return sample(lines[outcome]);
}

export function aiShotCommentary(outcome: ShotOutcome): string {
  return outcome === "goal" ? sample(lines.aiGoal) : sample(lines.aiStop);
}

export function finalCommentary(winner: Winner): string {
  if (winner === "player") return sample(lines.win);
  if (winner === "ai") return sample(lines.loss);
  return sample(lines.draw);
}
