import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  glow?: "cyan" | "violet" | "gold" | "none";
}

export function GlassCard({ className, glow = "none", children, ...rest }: Props) {
  const glowClass =
    glow === "cyan" ? "hover:glow-cyan hover:border-neon-cyan/40" :
    glow === "violet" ? "hover:glow-violet hover:border-neon-violet/40" :
    glow === "gold" ? "hover:glow-gold hover:border-neon-gold/50" :
    "hover:border-white/20";
  return (
    <div className={cn("glass rounded-2xl p-5 transition-all duration-300", glowClass, className)} {...rest}>
      {children}
    </div>
  );
}
