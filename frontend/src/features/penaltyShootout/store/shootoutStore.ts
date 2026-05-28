import { create } from "zustand";
import { pickGoalkeeperDive } from "../utils/aiLogic";
import { openingCommentary, playerShotCommentary, finalCommentary } from "../utils/commentary";
import { resolveShot } from "../utils/shotPhysics";
import { playShootoutSound, preloadShootoutSounds, stopCrowdAmbience } from "../utils/soundManager";
import type { Difficulty, Direction, RoundResult, ShootoutState, Winner } from "../types/shootout.types";

interface ShootoutActions {
  openGame: () => void;
  closeGame: () => void;
  restartGame: () => void;
  setDirection: (direction: Direction) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setPower: (power: number) => void;
  shoot: () => void;
}

type ShootoutStore = ShootoutState & ShootoutActions;

const TOTAL_ROUNDS = 5;
let pendingTimers: number[] = [];

function clearPendingTimers() {
  pendingTimers.forEach((timer) => window.clearTimeout(timer));
  pendingTimers = [];
}

function createRounds(): RoundResult[] {
  return Array.from({ length: TOTAL_ROUNDS }, () => ({
    playerDirection: null,
    goalkeeperDive: null,
    playerOutcome: null,
    aiOutcome: null,
  }));
}

function createInitialState(isOpen = false, difficulty: Difficulty = "normal"): ShootoutState {
  return {
    isOpen,
    phase: isOpen ? "aiming" : "ready",
    playerScore: 0,
    aiScore: 0,
    currentRound: 0,
    totalRounds: TOTAL_ROUNDS,
    rounds: createRounds(),
    selectedDirection: "center",
    power: 62,
    goalkeeperDive: null,
    ballDirection: null,
    lastOutcome: null,
    shotSpeed: 0.85,
    commentary: openingCommentary(),
    winner: null,
    difficulty,
  };
}

function getWinner(playerScore: number, aiScore: number): Winner {
  if (playerScore > aiScore) return "player";
  if (aiScore > playerScore) return "ai";
  return "draw";
}

export const useShootoutStore = create<ShootoutStore>((set, get) => ({
  ...createInitialState(false),

  openGame: () => {
    clearPendingTimers();
    preloadShootoutSounds();
    set(createInitialState(true, get().difficulty));
  },

  closeGame: () => {
    clearPendingTimers();
    stopCrowdAmbience();
    set({ isOpen: false, goalkeeperDive: null, ballDirection: null, lastOutcome: null });
  },

  restartGame: () => {
    clearPendingTimers();
    preloadShootoutSounds();
    set(createInitialState(true, get().difficulty));
  },

  setDirection: (selectedDirection) => set({ selectedDirection }),

  setDifficulty: (difficulty) => set({ difficulty }),

  setPower: (power) => set({ power: Math.max(10, Math.min(100, power)) }),

  shoot: () => {
    const state = get();

    if (state.phase !== "aiming") return;

    playShootoutSound("kick");

    const goalkeeperDive = pickGoalkeeperDive(state.selectedDirection, state.power, state.difficulty);
    const playerShot = resolveShot(
      state.selectedDirection,
      goalkeeperDive,
      state.power,
      state.difficulty,
    );
    const playerScore = state.playerScore + (playerShot.goal ? 1 : 0);
    const aiScore = state.aiScore + (playerShot.goal ? 0 : 1);
    const rounds = [...state.rounds];

    rounds[state.currentRound] = {
      playerDirection: state.selectedDirection,
      goalkeeperDive,
      playerOutcome: playerShot.outcome,
      aiOutcome: playerShot.goal ? "miss" : "save",
    };

    set({
      phase: "shooting",
      goalkeeperDive,
      ballDirection: state.selectedDirection,
      lastOutcome: playerShot.outcome,
      shotSpeed: playerShot.speed,
      commentary: playerShotCommentary(playerShot.outcome),
    });

    const resultTimer = window.setTimeout(() => {
      playShootoutSound(playerShot.goal ? "goal" : "save");
      set({
        phase: "roundResult",
        playerScore,
        aiScore,
        rounds,
        commentary: playerShotCommentary(playerShot.outcome),
      });
    }, 900);
    pendingTimers.push(resultTimer);

    const nextTimer = window.setTimeout(() => {
      const isFinalRound = state.currentRound + 1 >= state.totalRounds;

      if (isFinalRound) {
        const winner = getWinner(playerScore, aiScore);
        set({
          phase: "finished",
          winner,
          commentary: finalCommentary(winner),
          goalkeeperDive: null,
          ballDirection: null,
          lastOutcome: null,
        });
        return;
      }

      set({
        phase: "aiming",
        currentRound: state.currentRound + 1,
        goalkeeperDive: null,
        ballDirection: null,
        lastOutcome: null,
        selectedDirection: "center",
        power: 62,
        commentary: openingCommentary(),
      });
    }, 2100);
    pendingTimers.push(nextTimer);
  },
}));
