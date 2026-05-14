import { cn } from "@/lib/utils";

type Tone = "win" | "draw" | "loss" | "info" | "gold" | "violet" | "danger";

const tones: Record<Tone, string> = {
  win: "bg-success/15 text-success border-success/40",
  draw: "bg-white/10 text-text-muted border-white/15",
  loss: "bg-danger/15 text-danger border-danger/40",
  info: "bg-neon-cyan/15 text-neon-cyan border-neon-cyan/40",
  gold: "bg-neon-gold/15 text-neon-gold border-neon-gold/40",
  violet: "bg-neon-violet/20 text-neon-violet border-neon-violet/40",
  danger: "bg-danger/15 text-danger border-danger/40",
};

export function StatBadge({ tone = "info", children, className }: { tone?: Tone; children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-[11px] font-mono font-semibold tracking-wider", tones[tone], className)}>
      {children}
    </span>
  );
}

export function FormBadges({ form }: { form: ("W"|"D"|"L")[] }) {
  return (
    <div className="flex gap-1">
      {form.slice(-5).map((r, i) => (
        <StatBadge key={i} tone={r === "W" ? "win" : r === "D" ? "draw" : "loss"} className="w-6 h-6 p-0 text-[10px]">{r}</StatBadge>
      ))}
    </div>
  );
}
