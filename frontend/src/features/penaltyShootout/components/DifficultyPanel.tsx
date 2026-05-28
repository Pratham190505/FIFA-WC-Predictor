import { Gauge } from "lucide-react";
import { useShootoutStore } from "../store/shootoutStore";
import type { Difficulty } from "../types/shootout.types";

const levels: Array<{ value: Difficulty; label: string; hint: string }> = [
  { value: "easy", label: "Easy", hint: "slow dives / forgiving saves" },
  { value: "normal", label: "Normal", hint: "balanced keeper reads" },
  { value: "hard", label: "Hard", hint: "fast dives / smarter reads" },
  { value: "expert", label: "Expert", hint: "elite reads / punishing saves" },
];

export function DifficultyPanel() {
  const { difficulty, setDifficulty, phase } = useShootoutStore();
  const locked = phase === "shooting" || phase === "roundResult";
  const active = levels.find((level) => level.value === difficulty) ?? levels[1];

  return (
    <aside className="shootout-hud rounded-2xl border border-cyan-200/20 p-3 backdrop-blur-xl">
      <div className="mb-3 flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg border border-cyan-200/25 bg-cyan-300/10 text-cyan-100">
          <Gauge size={16} />
        </span>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-cyan-100/80">
            Difficulty
          </p>
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/35">
            Keeper AI
          </p>
        </div>
      </div>

      <div className="relative">
        <select
          value={difficulty}
          disabled={locked}
          onChange={(event) => setDifficulty(event.target.value as Difficulty)}
          className="h-12 w-full appearance-none rounded-xl border border-cyan-200/45 bg-[#061827] px-3 pr-9 font-mono text-xs font-black uppercase tracking-[0.18em] text-white outline-none transition hover:border-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {levels.map((level) => (
            <option key={level.value} value={level.value} className="bg-[#061827] text-white">
              {level.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-cyan-100">
          v
        </span>
        <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-white/45">
          {active.hint}
        </p>
      </div>
    </aside>
  );
}
