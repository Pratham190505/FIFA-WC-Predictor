import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: number;
  color?: "cyan" | "violet" | "muted" | "gold" | "success";
  className?: string;
}

const colorMap: Record<string, string> = {
  cyan: "from-neon-cyan to-neon-cyan/60",
  violet: "from-neon-violet to-neon-violet/60",
  muted: "from-white/30 to-white/10",
  gold: "from-neon-gold to-neon-gold/60",
  success: "from-success to-success/60",
};

export function ProbabilityBar({ label, value, color = "cyan", className }: Props) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-text-muted font-medium">{label}</span>
        <span className="font-mono font-semibold text-text-primary">{value.toFixed(0)}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className={cn("h-full bg-gradient-to-r rounded-full", colorMap[color])}
        />
      </div>
    </div>
  );
}
