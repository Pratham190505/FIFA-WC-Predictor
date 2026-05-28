import { motion } from "framer-motion";
import { useShootAnimation } from "../hooks/useShootAnimation";
import type { Direction, ShotOutcome } from "../types/shootout.types";

export function Ball({
  direction,
  outcome,
  speed,
  active,
}: {
  direction: Direction | null;
  outcome: ShotOutcome | null;
  speed: number;
  active: boolean;
}) {
  const animation = useShootAnimation(active ? direction : null, outcome, speed);

  return (
    <div className="relative">
      <motion.div
        className="absolute left-1/2 top-10.5 h-4 w-14 -translate-x-1/2 rounded-full bg-black/45 blur-md"
        animate={{ scale: active ? 0.45 : 1, opacity: active ? 0.18 : 0.42 }}
        transition={{ duration: active ? 0.45 : 0.2, ease: "easeInOut" }}
      />
      <motion.div
        className="shootout-ball relative h-12 w-12 rounded-full shadow-[0_14px_26px_rgba(0,0,0,0.45),inset_0_-4px_8px_rgba(0,0,0,0.28)]"
        initial={animation.ball.initial}
        animate={
          active
            ? animation.ball.animate
            : { x: 0, y: 0, scale: 1, rotate: 0, filter: "blur(0px)" }
        }
        transition={
          active
            ? animation.ball.transition
            : { duration: 0.2 }
        }
      />
    </div>
  );
}
