import { AnimatePresence, motion } from "framer-motion";
import { Radio } from "lucide-react";
import { useShootoutStore } from "../store/shootoutStore";

export function CommentaryBox() {
  const commentary = useShootoutStore((state) => state.commentary);

  return (
    <div className="shootout-hud relative overflow-hidden rounded-2xl border border-cyan-300/25 px-4 py-3 backdrop-blur-xl">
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(0,240,255,0.18),transparent_58%)]"
        animate={{ opacity: [0.45, 0.85, 0.45] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="flex items-center gap-3">
        <Radio size={16} className="relative shrink-0 text-cyan-200 drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]" />
        <AnimatePresence mode="wait">
          <motion.p
            key={commentary}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="relative font-mono text-xs font-bold uppercase tracking-[0.14em] text-white/86 sm:text-sm"
          >
            {commentary}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
