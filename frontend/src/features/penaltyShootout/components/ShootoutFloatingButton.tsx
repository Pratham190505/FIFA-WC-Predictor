import { motion, AnimatePresence } from "framer-motion";
import { useShootoutStore } from "../store/shootoutStore";

export function ShootoutFloatingButton() {
  const { openGame, isOpen } = useShootoutStore();

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 22, delay: 0.8 }}
          className="fixed bottom-8 right-8 z-40"
        >
          {/* Ping rings */}
          <div className="absolute inset-0 rounded-full animate-ping"
            style={{ background: "rgba(30,144,255,0.25)", animationDuration: "2s" }} />
          <div className="absolute inset-0 rounded-full animate-ping"
            style={{ background: "rgba(50,255,126,0.1)", animationDuration: "2.5s", animationDelay: "0.5s" }} />

          <motion.button
            onClick={openGame}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            className="relative w-16 h-16 rounded-full flex flex-col items-center justify-center border group"
            style={{
              background: "linear-gradient(135deg, #0B1E3D 0%, #0a2060 50%, #051230 100%)",
              borderColor: "rgba(30,144,255,0.6)",
              boxShadow:
                "0 0 0 1px rgba(30,144,255,0.15), 0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(30,144,255,0.3)",
            }}
          >
            {/* Football emoji */}
            <span className="text-xl leading-none mb-0.5 group-hover:rotate-12 transition-transform duration-300">
              ⚽
            </span>
            <span
              className="font-mono text-[7px] font-black tracking-wider leading-none"
              style={{ color: "rgba(30,144,255,0.9)" }}
            >
              PLAY
            </span>

            {/* Inner glow ring */}
            <div
              className="absolute inset-1 rounded-full border border-[#1E90FF]/20 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 0%, rgba(30,144,255,0.12) 0%, transparent 60%)",
              }}
            />
          </motion.button>

          {/* Tooltip */}
          <div
            className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap px-3 py-1.5 rounded-lg border pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              background: "rgba(5,18,48,0.95)",
              borderColor: "rgba(30,144,255,0.3)",
            }}
          >
            <p className="font-mono text-xs text-white/70">Penalty Shootout</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
