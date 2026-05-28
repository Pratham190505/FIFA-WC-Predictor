import { AnimatePresence, motion } from "framer-motion";
import { PenaltyShootout } from "./PenaltyShootout";
import { useShootoutStore } from "../store/shootoutStore";
import "../styles/shootout.css";

export function ShootoutFloatingButton() {
  const isOpen = useShootoutStore((state) => state.isOpen);
  const openGame = useShootoutStore((state) => state.openGame);

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            type="button"
            aria-label="Open penalty shootout mini-game"
            onClick={openGame}
            initial={{ opacity: 0, y: 20, scale: 0.7 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.7 }}
            whileHover={{ scale: 1.1, y: -3 }}
            whileTap={{ scale: 0.94 }}
            className="shootout-fab-pulse fixed bottom-5 right-5 z-80 grid h-16 w-16 place-items-center rounded-full border border-cyan-300/60 bg-[#061632] text-3xl shadow-2xl outline-none transition-transform sm:bottom-8 sm:right-8 sm:h-18 sm:w-18"
          >
            <span className="absolute inset-1 rounded-full border border-white/10 bg-[radial-gradient(circle_at_50%_0%,rgba(0,240,255,0.22),transparent_60%)]" />
            <span className="relative drop-shadow-[0_0_12px_rgba(255,255,255,0.85)]">⚽</span>
          </motion.button>
        )}
      </AnimatePresence>

      <PenaltyShootout />
    </>
  );
}
