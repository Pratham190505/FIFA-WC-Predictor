import { create } from "zustand";

export type Direction = "left" | "center" | "right";
export type GamePhase =
  | "idle"
  | "aiming"
  | "shooting"
  | "result"
  | "ai_turn"
  | "ai_result"
  | "finished";

export interface Round {
  playerDir: Direction | null;
  playerGoal: boolean | null;
  aiDir: Direction | null;
  aiGoal: boolean | null;
}

interface ShootoutState {
  isOpen: boolean;
  phase: GamePhase;
  playerScore: number;
  aiScore: number;
  currentRound: number;
  totalRounds: number;
  rounds: Round[];
  power: number;
  goalkeeperDive: Direction | null;
  ballDir: Direction | null;
  commentary: string;
  winner: "player" | "ai" | "draw" | null;

  // actions
  openGame: () => void;
  closeGame: () => void;
  setPower: (p: number) => void;
  shoot: (dir: Direction) => void;
  nextRound: () => void;
  restartGame: () => void;
}

const COMMENTARIES = {
  pre: [
    "The pressure is on! Pick your spot.",
    "Can you beat the keeper? Choose wisely.",
    "The crowd holds its breath…",
    "This is your moment. Make it count.",
    "Nerves of steel needed here.",
  ],
  goal: [
    "GOOOAL! Absolute rocket! 🚀",
    "TOP CORNER BRILLIANCE! Unstoppable!",
    "The net is bulging! What a strike! ⚽",
    "The keeper had no chance! Clinical finish!",
    "WHAT A FINISH! The crowd goes wild! 🎉",
  ],
  save: [
    "INCREDIBLE SAVE! The keeper read it!",
    "Denied! He guessed the right way!",
    "The keeper was too smart for you!",
    "Fingertip save! So close! 😤",
    "He got down low and stopped it!",
  ],
  miss: [
    "MISSED! Over the bar! The crowd groans.",
    "Off the post! So unlucky!",
    "Blazed wide! The pressure got to him.",
    "Skied it! Not your finest moment.",
  ],
  ai_goal: [
    "The AI finds the net… keeper wrong-footed.",
    "Ruthless finish from the AI. 1 more.",
    "Straight in! Your keeper guessed wrong.",
    "Clinical. The AI keeps the pressure on.",
  ],
  ai_save: [
    "YOUR KEEPER SAVES IT! Brilliant stop!",
    "Denied! You guessed the right corner!",
    "The AI striker can't believe it!",
    "Your keeper is a HERO! 🧤",
  ],
  win: [
    "🏆 YOU WIN THE SHOOTOUT! CHAMPION!",
    "🎉 INCREDIBLE! You beat the AI keeper!",
  ],
  lose: [
    "💔 SO CLOSE! The AI wins it this time.",
    "😔 Tough luck. The keeper was too good today.",
  ],
  draw: ["🤝 It's a DRAW! Honours even!"],
};

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function aiDecide(): Direction {
  const r = Math.random();
  return r < 0.4 ? "left" : r < 0.8 ? "right" : "center";
}

function determineGoal(
  shootDir: Direction,
  keeperDive: Direction,
  power: number
): boolean {
  if (shootDir !== keeperDive) return true;
  // same direction — save based on power
  return power >= 80; // very powerful shot beats keeper even if correct guess
}

const initialRounds = (): Round[] =>
  Array(5).fill(null).map(() => ({
    playerDir: null,
    playerGoal: null,
    aiDir: null,
    aiGoal: null,
  }));

export const useShootoutStore = create<ShootoutState>((set, get) => ({
  isOpen: false,
  phase: "idle",
  playerScore: 0,
  aiScore: 0,
  currentRound: 0,
  totalRounds: 5,
  rounds: initialRounds(),
  power: 50,
  goalkeeperDive: null,
  ballDir: null,
  commentary: randomFrom(COMMENTARIES.pre),
  winner: null,

  openGame: () =>
    set({
      isOpen: true,
      phase: "aiming",
      playerScore: 0,
      aiScore: 0,
      currentRound: 0,
      rounds: initialRounds(),
      power: 50,
      goalkeeperDive: null,
      ballDir: null,
      commentary: randomFrom(COMMENTARIES.pre),
      winner: null,
    }),

  closeGame: () => set({ isOpen: false }),

  setPower: (p) => set({ power: Math.max(10, Math.min(100, p)) }),

  shoot: (dir) => {
    const { power, currentRound, rounds, playerScore } = get();
    const keeperDive = aiDecide();
    const isGoal = determineGoal(dir, keeperDive, power);

    const updatedRounds = [...rounds];
    updatedRounds[currentRound] = {
      ...updatedRounds[currentRound],
      playerDir: dir,
      playerGoal: isGoal,
    };

    set({
      phase: "shooting",
      ballDir: dir,
      goalkeeperDive: keeperDive,
      playerScore: isGoal ? playerScore + 1 : playerScore,
      rounds: updatedRounds,
      commentary: isGoal
        ? randomFrom(COMMENTARIES.goal)
        : randomFrom(COMMENTARIES.save),
    });

    // After player shoots, trigger AI turn
    setTimeout(() => {
      const { playerScore: ps, aiScore: as_, currentRound: cr, totalRounds } = get();

      // AI shoots
      const aiShootDir = aiDecide();
      const aiKeeperDive = aiDecide();
      const aiIsGoal = determineGoal(aiShootDir, aiKeeperDive, 65);

      const newAiScore = aiIsGoal ? as_ + 1 : as_;
      const newRounds = [...get().rounds];
      newRounds[cr] = { ...newRounds[cr], aiDir: aiShootDir, aiGoal: aiIsGoal };

      const lastRound = cr + 1 >= totalRounds;

      set({
        phase: "ai_result",
        aiScore: newAiScore,
        rounds: newRounds,
        commentary: aiIsGoal
          ? randomFrom(COMMENTARIES.ai_goal)
          : randomFrom(COMMENTARIES.ai_save),
      });

      setTimeout(() => {
        if (lastRound) {
          const finalPlayer = get().playerScore;
          const finalAi = get().aiScore;
          const w =
            finalPlayer > finalAi
              ? "player"
              : finalAi > finalPlayer
              ? "ai"
              : "draw";
          set({
            phase: "finished",
            winner: w,
            commentary:
              w === "player"
                ? randomFrom(COMMENTARIES.win)
                : w === "ai"
                ? randomFrom(COMMENTARIES.lose)
                : randomFrom(COMMENTARIES.draw),
          });
        } else {
          set({
            phase: "aiming",
            currentRound: cr + 1,
            goalkeeperDive: null,
            ballDir: null,
            commentary: randomFrom(COMMENTARIES.pre),
          });
        }
      }, 1800);
    }, 2000);
  },

  nextRound: () =>
    set({
      phase: "aiming",
      goalkeeperDive: null,
      ballDir: null,
    }),

  restartGame: () =>
    set({
      phase: "aiming",
      playerScore: 0,
      aiScore: 0,
      currentRound: 0,
      rounds: initialRounds(),
      power: 50,
      goalkeeperDive: null,
      ballDir: null,
      commentary: randomFrom(COMMENTARIES.pre),
      winner: null,
    }),
}));