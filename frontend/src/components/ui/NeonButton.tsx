import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "gold" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const NeonButton = forwardRef<HTMLButtonElement, Props>(
  ({ variant = "primary", size = "md", loading, className, children, disabled, ...rest }, ref) => {
    const sizes = { sm: "h-9 px-4 text-xs", md: "h-11 px-6 text-sm", lg: "h-14 px-8 text-base" };
    const variants = {
      primary: "bg-neon-cyan text-[#04121a] hover:glow-cyan hover:brightness-110 border border-neon-cyan",
      outline: "bg-transparent text-neon-cyan border border-neon-cyan/60 hover:bg-neon-cyan/10 hover:glow-cyan",
      gold: "bg-neon-gold text-[#1a1200] hover:glow-gold hover:brightness-110 border border-neon-gold",
      ghost: "bg-white/5 text-text-primary border border-white/10 hover:bg-white/10 hover:border-white/20",
    };
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-display tracking-wider uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
          sizes[size], variants[variant], className,
        )}
        {...rest}
      >
        {loading ? <span className="inline-block h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" /> : null}
        {children}
      </button>
    );
  },
);
NeonButton.displayName = "NeonButton";
