import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCcw, ChevronLeft } from "lucide-react";
import { useShootoutStore, Direction } from "../store/shootoutStore";

// ── Stadium Background ────────────────────────────────────
function StadiumBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Deep night sky */}
      <div className="absolute inset-0 bg-linear-to-b from-[#020818] via-[#051230] to-[#0a1f3a]" />

      {/* Stadium floodlights */}
      {[10, 90].map((x) => (
        <div
          key={x}
          className="absolute top-0"
          style={{ left: `${x}%`, transform: "translateX(-50%)" }}
        >
          <div className="w-1 h-20 bg-linear-to-b from-[#aad4ff]/60 to-transparent" />
          <div
            className="absolute top-0 w-40 h-48"
            style={{
              background: `radial-gradient(ellipse at center top, rgba(100,180,255,0.18) 0%, transparent 70%)`,
              transform: "translateX(-50%)",
              left: "50%",
            }}
          />
        </div>
      ))}

      {/* Blurred crowd rows */}
      <div className="absolute top-0 left-0 right-0 h-28 overflow-hidden">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute left-0 right-0 flex gap-0.5"
            style={{ top: `${i * 36}px`, opacity: 0.25 - i * 0.07 }}
          >
            {Array(60).fill(0).map((_, j) => (
              <div
                key={j}
                className="flex-1 h-7 rounded-full"
                style={{
                  background: `hsl(${200 + Math.random() * 60}deg, 30%, ${25 + Math.random() * 20}%)`,
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Pitch */}
      <div className="absolute bottom-0 left-0 right-0 h-56">
        <div className="absolute inset-0 bg-linear-to-t from-[#0d3b1f] via-[#0f4523] to-[#0a2e18]" />
        {/* Grass stripes */}
        {Array(8).fill(0).map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0"
            style={{
              left: `${i * 12.5}%`,
              width: "12.5%",
              background: i % 2 === 0
                ? "rgba(255,255,255,0.025)"
                : "transparent",
            }}
          />
        ))}
        {/* Penalty spot */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white/40" />
        {/* Penalty arc */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-52 h-28 rounded-t-full border-t-2 border-white/15"
          style={{ borderLeft: "2px solid rgba(255,255,255,0.1)", borderRight: "2px solid rgba(255,255,255,0.1)" }}
        />
      </div>

      {/* Center fog */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% 65%, rgba(30,100,255,0.06) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

// ── Goalpost ──────────────────────────────────────────────
function Goalpost() {
  return (
    <div className="relative mx-auto" style={{ width: "340px", height: "160px" }}>
      {/* Back net */}
      <div
        className="absolute inset-0 rounded-t-sm overflow-hidden"
        style={{
          background:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.07) 0px, rgba(255,255,255,0.07) 1px, transparent 1px, transparent 18px), repeating-linear-gradient(90deg, rgba(255,255,255,0.07) 0px, rgba(255,255,255,0.07) 1px, transparent 1px, transparent 18px)",
        }}
      />
      {/* Net shadow */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/50" />

      {/* Posts */}
      {/* Left post */}
      <div className="absolute left-0 top-0 bottom-0 w-3 bg-linear-to-r from-[#c8d8f0] to-[#e8f2ff] rounded-sm shadow-[0_0_12px_rgba(200,220,255,0.6)]" />
      {/* Right post */}
      <div className="absolute right-0 top-0 bottom-0 w-3 bg-linear-to-l from-[#c8d8f0] to-[#e8f2ff] rounded-sm shadow-[0_0_12px_rgba(200,220,255,0.6)]" />
      {/* Crossbar */}
      <div className="absolute top-0 left-0 right-0 h-3 bg-linear-to-b from-[#e8f2ff] to-[#c8d8f0] rounded-sm shadow-[0_0_12px_rgba(200,220,255,0.6)]" />

      {/* Goal glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(100,180,255,0.12) 0%, transparent 60%)",
        }}
      />
    </div>
  );
}

// ── Goalkeeper ────────────────────────────────────────────
function Goalkeeper({ dive }: { dive: Direction | null }) {
  const x = dive === "left" ? -110 : dive === "right" ? 110 : 0;
  const rotate = dive === "left" ? -35 : dive === "right" ? 35 : 0;

  return (
    <motion.div
      className="absolute bottom-2 left-1/2"
      style={{ translateX: "-50%" }}
      animate={{ x, rotate }}
      transition={
        dive
          ? { type: "spring", stiffness: 280, damping: 20 }
          : { duration: 0 }
      }
    >
      {/* Body */}
      <div className="relative flex flex-col items-center">
        {/* Head */}
        <div className="w-9 h-9 rounded-full bg-linear-to-b from-[#f5c89a] to-[#e8a870] border-2 border-[#1E90FF]/40 mb-0.5 shadow-lg" />
        {/* Gloves */}
        <div className="absolute top-3 -left-5 w-5 h-4 rounded-full bg-[#1E90FF] shadow-[0_0_8px_rgba(30,144,255,0.6)]" />
        <div className="absolute top-3 -right-5 w-5 h-4 rounded-full bg-[#1E90FF] shadow-[0_0_8px_rgba(30,144,255,0.6)]" />
        {/* Torso */}
        <div className="w-12 h-14 rounded-xl bg-linear-to-b from-[#1E90FF] to-[#0a50a0] shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-bold text-xs tracking-wider opacity-60">GK</span>
          </div>
        </div>
        {/* Legs */}
        <div className="flex gap-1.5 mt-0.5">
          <div className="w-5 h-8 rounded-b-xl bg-linear-to-b from-[#111] to-[#222]" />
          <div className="w-5 h-8 rounded-b-xl bg-linear-to-b from-[#111] to-[#222]" />
        </div>
      </div>
    </motion.div>
  );
}

// ── Ball ──────────────────────────────────────────────────
function Ball({ dir, shooting }: { dir: Direction | null; shooting: boolean }) {
  const targetX = dir === "left" ? -100 : dir === "right" ? 100 : 0;
  const targetY = shooting ? -120 : 0;

  return (
    <motion.div
      className="w-10 h-10 rounded-full relative"
      style={{
        background:
          "radial-gradient(circle at 35% 35%, #fff 0%, #e0e0e0 40%, #888 100%)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.5), inset 0 -3px 6px rgba(0,0,0,0.3)",
      }}
      animate={{ x: targetX, y: targetY, scale: shooting ? 0.55 : 1 }}
      transition={
        shooting
          ? { type: "spring", stiffness: 120, damping: 18, duration: 0.6 }
          : { duration: 0 }
      }
    >
      {/* Ball pattern */}
      <svg
        viewBox="0 0 40 40"
        className="absolute inset-0 w-full h-full opacity-30"
      >
        <circle cx="20" cy="20" r="8" fill="none" stroke="#000" strokeWidth="1.5" />
        <path d="M20 12 L14 16 L16 22 L24 22 L26 16 Z" fill="#000" opacity="0.4" />
      </svg>
    </motion.div>
  );
}

// ── Power Meter ───────────────────────────────────────────
function PowerMeter() {
  const { power, setPower, phase } = useShootoutStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dirRef = useRef(1);

  useEffect(() => {
    if (phase !== "aiming") return;
    // Auto-oscillate power
    intervalRef.current = setInterval(() => {
      setPower(
        (() => {
          const next = power + dirRef.current * 2.5;
          if (next >= 100) dirRef.current = -1;
          if (next <= 10) dirRef.current = 1;
          return next;
        })()
      );
    }, 40);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [phase, power]);

  const color =
    power < 40
      ? "#32FF7E"
      : power < 70
      ? "#FFD700"
      : "#FF4D4D";

  const segments = 20;

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-[9px] font-mono uppercase tracking-[0.15em] text-white/40">Power</p>
      <div
        className="relative w-8 rounded-full overflow-hidden border border-white/10"
        style={{ height: "120px", background: "rgba(0,0,0,0.5)" }}
      >
        {/* Segments */}
        {Array(segments).fill(0).map((_, i) => {
          const threshold = ((segments - i) / segments) * 100;
          const active = power >= threshold;
          const segColor =
            threshold < 40
              ? "#32FF7E"
              : threshold < 70
              ? "#FFD700"
              : "#FF4D4D";
          return (
            <div
              key={i}
              className="absolute left-0 right-0 mx-1 rounded-sm transition-all duration-75"
              style={{
                height: "4px",
                bottom: `${(i / segments) * 112 + 4}px`,
                background: active ? segColor : "rgba(255,255,255,0.08)",
                boxShadow: active ? `0 0 6px ${segColor}` : "none",
              }}
            />
          );
        })}
      </div>
      <p
        className="font-mono text-xs font-bold"
        style={{ color }}
      >
        {Math.round(power)}%
      </p>
    </div>
  );
}

// ── Scoreboard ────────────────────────────────────────────
function Scoreboard() {
  const { playerScore, aiScore, currentRound, totalRounds, rounds } =
    useShootoutStore();

  return (
    <div className="text-center">
      {/* Round indicator */}
      <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#1E90FF]/70 mb-1">
        Round {Math.min(currentRound + 1, totalRounds)} / {totalRounds}
      </p>

      {/* Score row */}
      <div className="flex items-center justify-center gap-4">
        <div className="text-center">
          <p className="text-[9px] font-mono uppercase tracking-widest text-white/40">You</p>
          <p
            className="font-mono text-4xl font-black tabular-nums"
            style={{
              color: "#32FF7E",
              textShadow: "0 0 20px rgba(50,255,126,0.6)",
            }}
          >
            {playerScore}
          </p>
        </div>
        <div
          className="font-mono text-xl text-white/30 font-bold"
          style={{ lineHeight: 1 }}
        >
          —
        </div>
        <div className="text-center">
          <p className="text-[9px] font-mono uppercase tracking-widest text-white/40">AI</p>
          <p
            className="font-mono text-4xl font-black tabular-nums"
            style={{
              color: "#FF4D4D",
              textShadow: "0 0 20px rgba(255,77,77,0.6)",
            }}
          >
            {aiScore}
          </p>
        </div>
      </div>

      {/* Penalty indicators */}
      <div className="flex items-center justify-center gap-3 mt-3">
        {/* Player */}
        <div className="flex gap-1">
          {rounds.map((r, i) => (
            <div
              key={`p${i}`}
              className="w-3.5 h-3.5 rounded-full border"
              style={{
                background:
                  r.playerGoal === true
                    ? "#32FF7E"
                    : r.playerGoal === false
                    ? "#FF4D4D"
                    : "transparent",
                borderColor:
                  i === currentRound
                    ? "rgba(255,255,255,0.7)"
                    : "rgba(255,255,255,0.2)",
                boxShadow:
                  r.playerGoal === true
                    ? "0 0 8px rgba(50,255,126,0.8)"
                    : r.playerGoal === false
                    ? "0 0 8px rgba(255,77,77,0.5)"
                    : "none",
              }}
            />
          ))}
        </div>
        <div className="w-px h-4 bg-white/20" />
        {/* AI */}
        <div className="flex gap-1">
          {rounds.map((r, i) => (
            <div
              key={`a${i}`}
              className="w-3.5 h-3.5 rounded-full border"
              style={{
                background:
                  r.aiGoal === true
                    ? "#FF4D4D"
                    : r.aiGoal === false
                    ? "#32FF7E"
                    : "transparent",
                borderColor: "rgba(255,255,255,0.2)",
                boxShadow:
                  r.aiGoal === true
                    ? "0 0 8px rgba(255,77,77,0.8)"
                    : r.aiGoal === false
                    ? "0 0 8px rgba(50,255,126,0.5)"
                    : "none",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Commentary ────────────────────────────────────────────
function CommentaryBox() {
  const { commentary, phase } = useShootoutStore();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={commentary}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35 }}
        className="text-center px-4"
      >
        <p
          className="font-mono text-sm font-bold tracking-wide"
          style={{
            color:
              phase === "finished"
                ? "#FFD700"
                : phase === "shooting" || phase === "result"
                ? "#1E90FF"
                : "rgba(255,255,255,0.75)",
            textShadow:
              phase === "finished" ? "0 0 20px rgba(255,215,0,0.6)" : "none",
          }}
        >
          {commentary}
        </p>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Shoot Controls ────────────────────────────────────────
function ShootControls() {
  const { phase, shoot } = useShootoutStore();
  const disabled = phase !== "aiming";

  const buttons: { dir: Direction; label: string; emoji: string }[] = [
    { dir: "left", label: "LEFT", emoji: "◀" },
    { dir: "center", label: "CENTER", emoji: "▲" },
    { dir: "right", label: "RIGHT", emoji: "▶" },
  ];

  return (
    <div className="flex items-center justify-center gap-3">
      {buttons.map(({ dir, label, emoji }) => (
        <motion.button
          key={dir}
          onClick={() => !disabled && shoot(dir)}
          disabled={disabled}
          whileHover={!disabled ? { scale: 1.06, y: -2 } : {}}
          whileTap={!disabled ? { scale: 0.93 } : {}}
          className="relative flex flex-col items-center justify-center rounded-2xl border transition-all duration-200"
          style={{
            width: "88px",
            height: "64px",
            background: disabled
              ? "rgba(255,255,255,0.04)"
              : "linear-gradient(135deg, rgba(30,144,255,0.2) 0%, rgba(30,144,255,0.08) 100%)",
            borderColor: disabled
              ? "rgba(255,255,255,0.08)"
              : "rgba(30,144,255,0.5)",
            boxShadow: disabled
              ? "none"
              : "0 0 16px rgba(30,144,255,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          <span
            className="text-lg mb-0.5"
            style={{ color: disabled ? "rgba(255,255,255,0.2)" : "#1E90FF" }}
          >
            {emoji}
          </span>
          <span
            className="font-mono text-[9px] tracking-[0.15em] font-bold"
            style={{ color: disabled ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.7)" }}
          >
            {label}
          </span>
          {/* Glow pulse when active */}
          {!disabled && (
            <div
              className="absolute inset-0 rounded-2xl animate-pulse"
              style={{
                background: "radial-gradient(ellipse at 50% 100%, rgba(30,144,255,0.15) 0%, transparent 70%)",
              }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
}

// ── End Screen ────────────────────────────────────────────
function EndScreen() {
  const { winner, playerScore, aiScore, restartGame, closeGame } =
    useShootoutStore();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute inset-0 flex flex-col items-center justify-center z-20"
      style={{
        background: "rgba(2,8,24,0.92)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Trophy / result icon */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-7xl mb-4"
      >
        {winner === "player" ? "🏆" : winner === "ai" ? "😔" : "🤝"}
      </motion.div>

      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="font-mono text-2xl font-black tracking-wider mb-1 text-center px-6"
        style={{
          color:
            winner === "player"
              ? "#FFD700"
              : winner === "ai"
              ? "#FF4D4D"
              : "#1E90FF",
          textShadow:
            winner === "player"
              ? "0 0 30px rgba(255,215,0,0.7)"
              : "none",
        }}
      >
        {winner === "player"
          ? "SHOOTOUT WIN!"
          : winner === "ai"
          ? "SHOOTOUT LOSS"
          : "IT'S A DRAW"}
      </motion.h2>

      {/* Final score */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center gap-4 my-5"
      >
        <div className="text-center">
          <p className="text-[9px] font-mono text-white/40 uppercase tracking-widest">You</p>
          <p
            className="font-mono text-5xl font-black"
            style={{ color: "#32FF7E", textShadow: "0 0 20px rgba(50,255,126,0.5)" }}
          >
            {playerScore}
          </p>
        </div>
        <p className="font-mono text-2xl text-white/30">—</p>
        <div className="text-center">
          <p className="text-[9px] font-mono text-white/40 uppercase tracking-widest">AI</p>
          <p
            className="font-mono text-5xl font-black"
            style={{ color: "#FF4D4D", textShadow: "0 0 20px rgba(255,77,77,0.5)" }}
          >
            {aiScore}
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65 }}
        className="flex gap-3 mt-2"
      >
        <button
          onClick={restartGame}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-sm font-bold border transition-all hover:scale-105 active:scale-95"
          style={{
            background: "linear-gradient(135deg, rgba(30,144,255,0.25), rgba(30,144,255,0.1))",
            borderColor: "rgba(30,144,255,0.6)",
            color: "#1E90FF",
            boxShadow: "0 0 20px rgba(30,144,255,0.25)",
          }}
        >
          <RotateCcw size={14} /> PLAY AGAIN
        </button>
        <button
          onClick={closeGame}
          className="px-6 py-3 rounded-xl font-mono text-sm font-bold border border-white/15 text-white/50 hover:border-white/30 hover:text-white/80 transition-all"
        >
          CLOSE
        </button>
      </motion.div>
    </motion.div>
  );
}

// ── Main Game Modal ───────────────────────────────────────
export function PenaltyShootout() {
  const { isOpen, phase, ballDir, goalkeeperDive, closeGame } = useShootoutStore();

  const shooting = phase === "shooting" || phase === "ai_result";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(4px)" }}
        >
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
            className="relative w-full max-w-sm overflow-hidden rounded-3xl border"
            style={{
              background: "#051230",
              borderColor: "rgba(30,144,255,0.2)",
              boxShadow:
                "0 0 0 1px rgba(30,144,255,0.08), 0 40px 80px rgba(0,0,0,0.7), 0 0 60px rgba(30,144,255,0.08)",
              minHeight: "600px",
            }}
          >
            <StadiumBackground />

            {/* Close button */}
            <button
              onClick={closeGame}
              className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full flex items-center justify-center border border-white/10 text-white/40 hover:text-white/80 hover:border-white/30 transition-all"
              style={{ background: "rgba(0,0,0,0.4)" }}
            >
              <X size={14} />
            </button>

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full" style={{ minHeight: "600px" }}>
              {/* Title */}
              <div className="pt-5 pb-2 text-center">
                <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#1E90FF]/60">
                  MatchMind Mini Game
                </p>
                <h2
                  className="font-mono text-lg font-black tracking-widest"
                  style={{ color: "#F5F7FA", textShadow: "0 0 20px rgba(30,144,255,0.4)" }}
                >
                  PENALTY SHOOTOUT
                </h2>
              </div>

              {/* Scoreboard */}
              <div className="px-4 pb-3">
                <Scoreboard />
              </div>

              {/* Game area */}
              <div className="relative flex-1 flex flex-col items-center justify-end pb-4 px-6">
                {/* Goal + keeper */}
                <div
                  className="relative w-full flex justify-center mb-3"
                  style={{ height: "180px" }}
                >
                  {/* Goalpost sits in the middle */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2">
                    <Goalpost />
                  </div>
                  {/* Keeper inside the goal */}
                  <div className="absolute top-12 left-1/2 -translate-x-1/2">
                    <Goalkeeper dive={goalkeeperDive} />
                  </div>
                  {/* Net flash on goal */}
                  {shooting && ballDir && goalkeeperDive && ballDir !== goalkeeperDive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.6, 0] }}
                      transition={{ duration: 0.5, times: [0, 0.3, 1] }}
                      className="absolute inset-0 rounded-lg"
                      style={{ background: "rgba(50,255,126,0.2)" }}
                    />
                  )}
                </div>

                {/* Ball */}
                <div className="flex justify-center mb-4">
                  <Ball dir={ballDir} shooting={shooting} />
                </div>

                {/* Power + direction controls */}
                <div className="flex items-center gap-4 w-full">
                  <PowerMeter />
                  <div className="flex-1 flex flex-col gap-3">
                    <ShootControls />
                  </div>
                  {/* Curve dial placeholder */}
                  <div className="flex flex-col items-center gap-1">
                    <p className="text-[9px] font-mono uppercase tracking-widest text-white/30">Spin</p>
                    <div
                      className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center"
                      style={{ background: "rgba(255,255,255,0.04)" }}
                    >
                      <div
                        className="w-4 h-4 rounded-full border-2"
                        style={{ borderColor: "#1E90FF", borderTopColor: "transparent" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Commentary */}
                <div className="mt-4 w-full">
                  <div
                    className="rounded-xl px-4 py-3 border text-center"
                    style={{
                      background: "rgba(0,0,0,0.4)",
                      borderColor: "rgba(30,144,255,0.15)",
                      backdropFilter: "blur(6px)",
                    }}
                  >
                    <CommentaryBox />
                  </div>
                </div>
              </div>
            </div>

            {/* End screen overlay */}
            {phase === "finished" && <EndScreen />}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
