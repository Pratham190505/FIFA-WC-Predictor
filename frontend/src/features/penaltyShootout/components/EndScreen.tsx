import { motion } from "framer-motion";
import { RotateCcw, X } from "lucide-react";
import { useShootoutStore } from "../store/shootoutStore";

export function EndScreen() {
  const { winner, playerScore, aiScore, restartGame, closeGame } = useShootoutStore();
  const title =
    winner === "player" ? "Shootout Won" : winner === "ai" ? "Shootout Lost" : "Level After Five";
  const won = winner === "player";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`absolute inset-0 z-40 grid place-items-center p-5 backdrop-blur-md ${
        won ? "bg-emerald-950/78" : winner === "ai" ? "bg-red-950/80" : "bg-[#020817]/86"
      }`}
    >
      {won && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 34 }).map((_, index) => (
            <motion.span
              key={index}
              className="absolute h-2 w-1 rounded-sm bg-cyan-200"
              style={{
                left: `${(index * 29) % 100}%`,
                top: "-8%",
                background: index % 3 === 0 ? "#32ff7e" : index % 3 === 1 ? "#00f0ff" : "#f5f7fa",
              }}
              animate={{ y: ["0vh", "112vh"], rotate: [0, 220], opacity: [0, 1, 0.2] }}
              transition={{ duration: 2.8 + (index % 5) * 0.25, repeat: Infinity, delay: index * 0.04 }}
            />
          ))}
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className={`shootout-hud w-full max-w-md rounded-3xl border p-6 text-center ${
          won
            ? "border-[#32ff7e]/40 shadow-[0_0_70px_rgba(50,255,126,0.22)]"
            : winner === "ai"
              ? "border-[#ff3d57]/38 shadow-[0_0_70px_rgba(255,61,87,0.2)]"
              : "border-cyan-200/25 shadow-[0_0_60px_rgba(0,240,255,0.16)]"
        }`}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-cyan-200/70">
          Full Time
        </p>
        <h3 className="mt-2 font-display text-5xl tracking-wide text-white drop-shadow-[0_0_24px_rgba(0,240,255,0.35)]">
          {title}
        </h3>
        <div className="my-6 flex items-center justify-center gap-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">You</p>
            <p className="font-mono text-6xl font-black text-[#32ff7e]">{playerScore}</p>
          </div>
          <span className="font-mono text-3xl text-white/25">-</span>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">AI</p>
            <p className="font-mono text-6xl font-black text-[#ff3d57]">{aiScore}</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={restartGame}
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-cyan-200/50 bg-cyan-300/15 font-mono text-xs font-black uppercase tracking-[0.18em] text-cyan-50 shadow-[0_0_22px_rgba(0,240,255,0.16)] transition hover:scale-[1.02]"
          >
            <RotateCcw size={16} /> Replay
          </button>
          <button
            type="button"
            onClick={closeGame}
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/4 font-mono text-xs font-black uppercase tracking-[0.18em] text-white/70 transition hover:border-white/35"
          >
            <X size={16} /> Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
