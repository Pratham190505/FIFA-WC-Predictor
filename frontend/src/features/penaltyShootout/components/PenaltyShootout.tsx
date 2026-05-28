import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Ball } from "./Ball";
import { CommentaryBox } from "./CommentaryBox";
import { DifficultyPanel } from "./DifficultyPanel";
import { EndScreen } from "./EndScreen";
import { Goalkeeper } from "./Goalkeeper";
import { PowerMeter } from "./PowerMeter";
import { Scoreboard } from "./Scoreboard";
import { ShootControls } from "./ShootControls";
import { useShootoutStore } from "../store/shootoutStore";
import { startCrowdAmbience, stopCrowdAmbience } from "../utils/soundManager";
import "../styles/shootout.css";

function StadiumScene() {
  return (
    <div className="absolute inset-0 overflow-hidden shootout-stadium">
      <div className="shootout-crowd absolute inset-x-0 top-0 h-[34%] opacity-55 blur-[1.2px]" />
      <div className="shootout-light-beam absolute left-[11%] top-0 h-[58%] w-28 -rotate-12" />
      <div className="shootout-light-beam absolute right-[10%] top-0 h-[58%] w-28 rotate-12 [animation-delay:1.1s]" />
      <div className="absolute left-[8%] top-0 h-56 w-56 rounded-full bg-cyan-200/25 blur-3xl" />
      <div className="absolute right-[8%] top-0 h-56 w-56 rounded-full bg-white/22 blur-3xl" />
      <div className="absolute inset-x-0 top-[28%] h-px bg-cyan-100/25 shadow-[0_0_34px_rgba(0,240,255,0.78)]" />
      <div className="shootout-grass absolute inset-x-0 bottom-0 h-[46%]" />
      <div className="absolute inset-x-0 bottom-[23%] h-px bg-white/15" />
      <div className="absolute bottom-8 left-1/2 h-24 w-72 -translate-x-1/2 rounded-t-full border-t border-white/18 shadow-[0_-20px_60px_rgba(0,0,0,0.32)] sm:w-96" />
      <div className="shootout-fog absolute inset-0" />
      <div className="shootout-vignette absolute inset-0" />
    </div>
  );
}

function GoalFrame({ isGoalFlash }: { isGoalFlash: boolean }) {
  return (
    <div className="relative h-56 w-[min(88vw,610px)] sm:h-64">
      <div className="absolute left-1/2 top-9 h-28 w-[78%] -translate-x-1/2 rounded-[50%] bg-black/55 blur-2xl" />
      <div className="shootout-net absolute inset-x-4 top-5 h-44 rounded-t-md border-x-[7px] border-t-[7px] border-white/90 shadow-[0_0_34px_rgba(245,247,250,0.38),inset_0_0_24px_rgba(0,0,0,0.4)] sm:h-52" />
      <div className="absolute inset-x-4 top-5 h-44 rounded-t-md bg-linear-to-b from-cyan-200/12 via-transparent to-black/50 sm:h-52" />
      <div className="absolute left-3 top-5 h-44 w-3 rounded-full bg-linear-to-r from-white to-slate-300 shadow-[0_0_18px_rgba(255,255,255,0.45)] sm:h-52" />
      <div className="absolute right-3 top-5 h-44 w-3 rounded-full bg-linear-to-l from-white to-slate-300 shadow-[0_0_18px_rgba(255,255,255,0.45)] sm:h-52" />
      <div className="absolute inset-x-3 top-4 h-3 rounded-full bg-linear-to-b from-white to-slate-300 shadow-[0_0_18px_rgba(255,255,255,0.45)]" />
      {isGoalFlash && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.75, 0] }}
          transition={{ duration: 0.7 }}
          className="absolute inset-x-4 top-5 h-44 rounded-t-sm bg-[#32ff7e]/25 sm:h-52"
        />
      )}
    </div>
  );
}

export function PenaltyShootout() {
  const {
    isOpen,
    closeGame,
    phase,
    goalkeeperDive,
    ballDirection,
    lastOutcome,
    shotSpeed,
  } = useShootoutStore();

  const shooting = phase === "shooting" || phase === "roundResult";

  useEffect(() => {
    if (!isOpen) {
      stopCrowdAmbience();
      return;
    }

    startCrowdAmbience();

    return () => stopCrowdAmbience();
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-90 bg-black/86 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`relative h-full w-full overflow-hidden text-white ${lastOutcome === "goal" && phase === "roundResult" ? "shootout-camera-hit" : ""}`}
            initial={{ scale: 1.04, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.02, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <StadiumScene />

            <button
              type="button"
              aria-label="Close penalty shootout"
              onClick={closeGame}
              className="absolute right-4 top-4 z-50 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-black/35 text-white/70 backdrop-blur-xl transition hover:border-white/35 hover:text-white sm:right-6 sm:top-6"
            >
              <X size={18} />
            </button>

            <div className="relative z-10 mx-auto grid h-full w-full max-w-7xl grid-rows-[auto_1fr_auto] px-4 py-4 sm:px-6">
              <header className="mx-auto w-full max-w-2xl pt-2 text-center sm:pt-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.36em] text-cyan-200/70">
                  Classic Penalty Shootout
                </p>
                <h2 className="mt-1 font-display text-3xl tracking-wide text-white drop-shadow-[0_0_24px_rgba(0,240,255,0.36)] sm:text-4xl xl:text-5xl">
                  Penalty Shootout
                </h2>
                <div className="mt-3">
                  <Scoreboard />
                </div>
              </header>

              <main className="relative grid min-h-0 grid-cols-1 items-center gap-4 lg:grid-cols-[210px_1fr_220px]">
                <div className="order-2 hidden self-end lg:order-1 lg:block">
                  <PowerMeter />
                </div>

                <div className="order-1 flex min-h-0 flex-col items-center justify-center lg:order-2">
                  <div className="relative flex h-90 w-full items-start justify-center sm:h-102.5">
                    <GoalFrame isGoalFlash={shooting && lastOutcome === "goal"} />
                    <Goalkeeper dive={goalkeeperDive} />
                    <div className="absolute bottom-10 left-1/2 z-30 -translate-x-1/2">
                      <Ball
                        direction={ballDirection}
                        outcome={lastOutcome}
                        speed={shotSpeed}
                        active={shooting}
                      />
                    </div>
                  </div>
                </div>

                <div className="order-3 self-start">
                  <DifficultyPanel />
                </div>
              </main>

              <footer className="grid gap-3 pb-3 lg:grid-cols-[minmax(260px,360px)_1fr_220px] lg:items-end">
                <div className="order-2 lg:order-1">
                  <CommentaryBox />
                </div>
                <div className="order-1 mx-auto w-full max-w-3xl lg:order-2">
                  <ShootControls />
                </div>
                <div className="order-3 lg:hidden">
                  <PowerMeter />
                </div>
              </footer>
            </div>

            {phase === "finished" && <EndScreen />}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
