import { Zap } from "lucide-react";
import { useShootoutStore } from "../store/shootoutStore";

export function PowerMeter() {
  const power = useShootoutStore((state) => state.power);
  const setPower = useShootoutStore((state) => state.setPower);
  const disabled = useShootoutStore((state) => state.phase !== "aiming");

  return (
    <div className="shootout-hud rounded-2xl border border-white/10 p-3 backdrop-blur-xl">
      <div className="mb-3 flex items-center justify-between gap-4">
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white/65">
          <Zap size={13} className="text-[#32ff7e]" /> Power
        </span>
        <span className="font-mono text-sm font-black text-cyan-200">{Math.round(power)}%</span>
      </div>
      <div className="flex items-end justify-center gap-4">
        <div className="relative h-40 w-12 overflow-hidden rounded-full border border-white/15 bg-black/45 p-1 shadow-[inset_0_0_18px_rgba(0,0,0,0.75)]">
          <div className="shootout-power-track absolute inset-1 rounded-full opacity-30" />
          <div
            className="absolute bottom-1 left-1 right-1 rounded-full bg-linear-to-t from-[#32ff7e] via-[#ffd84d] to-[#ff3d57] shadow-[0_0_18px_rgba(50,255,126,0.55)] transition-all duration-200"
            style={{ height: `${power}%` }}
          />
          <div className="absolute inset-x-1 top-[25%] h-px bg-red-200/45" />
          <div className="absolute inset-x-1 top-[58%] h-px bg-yellow-200/45" />
        </div>

        <div className="relative h-40 flex-1">
          <input
            type="range"
            min={10}
            max={100}
            value={power}
            disabled={disabled}
            onChange={(event) => setPower(Number(event.target.value))}
            className="absolute left-1/2 top-1/2 h-3 w-40 -translate-x-1/2 -translate-y-1/2 -rotate-90 cursor-pointer accent-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <div className="absolute right-0 top-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[#ff3d57]">
            Max
          </div>
          <div className="absolute right-0 top-[42%] font-mono text-[9px] uppercase tracking-[0.12em] text-[#ffd84d]">
            Risk
          </div>
          <div className="absolute bottom-1 right-0 font-mono text-[9px] uppercase tracking-[0.12em] text-[#32ff7e]">
            Safe
          </div>
        </div>
      </div>
    </div>
  );
}
