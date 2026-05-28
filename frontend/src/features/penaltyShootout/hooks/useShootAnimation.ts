import { directionToX } from "../utils/shotPhysics";
import type { Direction, ShotOutcome } from "../types/shootout.types";

export function useShootAnimation(
  direction: Direction | null,
  outcome: ShotOutcome | null,
  speed: number,
) {
  const targetX = directionToX(direction);
  const targetY = outcome === "miss" ? -260 : -194;
  const curveX = direction === "left" ? -22 : direction === "right" ? 22 : 0;
  const duration = Math.max(0.34, 0.94 - speed * 0.3);

  return {
    ball: {
      initial: { x: 0, y: 0, scale: 1, rotate: 0 },
      animate: direction
        ? {
            x: [0, targetX * 0.52 + curveX, targetX],
            y: [0, targetY * 0.58, targetY],
            scale: outcome === "miss" ? 0.46 : 0.54,
            rotate: direction === "left" ? -540 : direction === "right" ? 540 : 360,
            filter: ["blur(0px)", "blur(1.4px)", "blur(0px)"],
          }
        : { x: 0, y: 0, scale: 1, rotate: 0, filter: "blur(0px)" },
      transition: { duration, ease: [0.16, 1, 0.3, 1] as const },
    },
    keeper: {
      x: directionToX(direction) * 0.72,
      rotate: direction === "left" ? -24 : direction === "right" ? 24 : 0,
    },
  };
}
