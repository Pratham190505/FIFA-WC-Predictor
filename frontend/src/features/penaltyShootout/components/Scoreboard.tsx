import { motion } from "framer-motion";
import { useShootoutStore } from "../store/shootoutStore";

export function Scoreboard() {
  const { playerScore, aiScore, currentRound, totalRounds, rounds, difficulty } = useShootoutStore();

  return (
    <motion.div
      layout
      className="shootout-hud relative overflow-hidden rounded-2xl border border-cyan-300/25 px-4 py-3 backdrop-blur-xl"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-cyan-200/80 to-transparent" />
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-200/70">You</p>
          <motion.p layout className="font-mono text-3xl font-black tabular-nums text-[#32ff7e] drop-shadow-[0_0_14px_rgba(50,255,126,0.55)]">
            {playerScore}
          </motion.p>
        </div>

        <div className="text-center">
          <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/62">
            You vs AI Goalkeeper
          </p>
          <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.22em] text-cyan-100/52">
            Round {Math.min(currentRound + 1, totalRounds)} / {totalRounds} / {difficulty}
          </p>
          <div className="mt-2 flex items-center justify-center gap-1.5">
            {rounds.map((round, index) => (
              <motion.span
                key={index}
                layout
                className="h-3 w-7 rounded-full border border-white/25"
                style={{
                  background:
                    round.playerOutcome === "goal"
                      ? "linear-gradient(90deg,#32ff7e,#c8ffe0)"
                      : round.playerOutcome
                        ? "linear-gradient(90deg,#ff3d57,#ff9aaa)"
                        : "rgba(255,255,255,0.08)",
                  boxShadow: index === currentRound ? "0 0 14px rgba(0,240,255,0.8)" : undefined,
                }}
              />
            ))}
          </div>
        </div>

        <div className="text-right">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-red-200/70">Saves</p>
          <motion.p layout className="font-mono text-3xl font-black tabular-nums text-[#ff3d57] drop-shadow-[0_0_14px_rgba(255,61,87,0.5)]">
            {aiScore}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
