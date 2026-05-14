import { Link } from "@tanstack/react-router";
import { Trophy } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/predict", label: "Predict" },
  { to: "/tournament", label: "Tournament" },
  { to: "/teams", label: "Teams" },
  { to: "/analytics", label: "Analytics" },
] as const;

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 glass-strong border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-lg bg-linear-to-br from-neon-cyan to-neon-violet flex items-center justify-center glow-cyan">
            <Trophy className="h-4 w-4 text-black" />
          </div>
          <span className="font-display text-2xl tracking-wider neon-text">FootyVerse</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-text-muted hover:text-white transition-colors rounded-md"
              activeProps={{ className: "px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-white rounded-md bg-white/5 border border-white/10" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
