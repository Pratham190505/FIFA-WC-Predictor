import { cn } from "@/lib/utils";

export function SectionTitle({ title, eyebrow, className }: { title: string; eyebrow?: string; className?: string }) {
  return (
    <div className={cn("flex items-center gap-4 mb-6", className)}>
      <span className="block w-1 h-8 bg-gradient-to-b from-neon-cyan to-neon-violet rounded-full" />
      <div>
        {eyebrow && <p className="text-[10px] tracking-[0.3em] uppercase text-neon-cyan font-mono">{eyebrow}</p>}
        <h2 className="font-display text-3xl md:text-4xl tracking-wide text-text-primary">{title}</h2>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, eyebrow }: { title: string; subtitle?: string; eyebrow?: string }) {
  return (
    <div className="mb-10 md:mb-14">
      {eyebrow && <p className="text-[11px] tracking-[0.4em] uppercase text-neon-cyan font-mono mb-3">{eyebrow}</p>}
      <h1 className="font-display text-5xl md:text-7xl tracking-wide leading-none">
        <span className="neon-text">{title}</span>
      </h1>
      {subtitle && <p className="mt-4 text-base md:text-lg text-text-muted max-w-2xl">{subtitle}</p>}
    </div>
  );
}
