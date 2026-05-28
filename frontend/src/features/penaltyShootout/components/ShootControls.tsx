import { Crosshair, MoveDownLeft, MoveDown, MoveDownRight } from "lucide-react";
import { motion } from "framer-motion";
import { useShootoutStore } from "../store/shootoutStore";
import type { Direction } from "../types/shootout.types";

const options: Array<{ direction: Direction; label: string; Icon: typeof MoveDown }> = [
  { direction: "left", label: "Left", Icon: MoveDownLeft },
  { direction: "center", label: "Center", Icon: MoveDown },
  { direction: "right", label: "Right", Icon: MoveDownRight },
];

export function ShootControls() {
  const { selectedDirection, setDirection, shoot, phase } = useShootoutStore();
  const disabled = phase !== "aiming";

  return (
    <div className="shootout-hud space-y-3 rounded-2xl border border-cyan-200/20 p-3 backdrop-blur-xl">
      <div className="grid grid-cols-3 gap-2">
        {options.map(({ direction, label, Icon }) => {
          const active = selectedDirection === direction;
          return (
            <motion.button
              key={direction}
              type="button"
              disabled={disabled}
              onClick={() => setDirection(direction)}
              whileHover={!disabled ? { y: -2 } : undefined}
              whileTap={!disabled ? { scale: 0.96 } : undefined}
              className={`relative flex h-14 overflow-hidden items-center justify-center gap-2 rounded-xl border font-mono text-[10px] font-black uppercase tracking-[0.16em] transition sm:h-16 ${
                active
                  ? "border-cyan-200 bg-cyan-300/18 text-cyan-100 shadow-[0_0_24px_rgba(0,240,255,0.32)]"
                  : "border-white/10 bg-white/6 text-white/60 hover:border-cyan-200/45 hover:bg-cyan-300/8"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="shot-direction-active"
                  className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.18),transparent_64%)]"
                />
              )}
              <Icon size={16} className="relative" />
              <span className="relative">{label}</span>
            </motion.button>
          );
        })}
      </div>

      <motion.button
        type="button"
        disabled={disabled}
        onClick={shoot}
        whileHover={!disabled ? { scale: 1.02 } : undefined}
        whileTap={!disabled ? { scale: 0.97 } : undefined}
        className="relative flex h-13 w-full overflow-hidden items-center justify-center gap-2 rounded-xl border border-[#32ff7e]/60 bg-[#32ff7e]/16 font-mono text-sm font-black uppercase tracking-[0.2em] text-[#d8ffe8] shadow-[0_0_30px_rgba(50,255,126,0.28)] transition disabled:cursor-not-allowed disabled:opacity-45"
      >
        <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/14 to-transparent" />
        <Crosshair size={17} className="relative" />
        <span className="relative">Strike</span>
      </motion.button>
    </div>
  );
}
