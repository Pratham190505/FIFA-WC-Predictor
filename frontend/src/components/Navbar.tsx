import { Link } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useAuth } from "../store/appContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/predict", label: "Predict" },
  { to: "/tournament", label: "Tournament" },
  { to: "/teams", label: "Teams" },
  { to: "/analytics", label: "Analytics" },
] as const;

export function Navbar() {
  const { logout, user } = useAuth();

  return (
    <header className="sticky top-0 z-50 glass-strong border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <img src="/footyverse-logo.png" alt="FootyVerse" className="h-10 w-auto rounded-sm" />
          <span className="font-display text-2xl tracking-widest neon-text">FootyVerse</span>
        </Link>
        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-1 sm:flex sm:gap-2">
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
          <span className="hidden max-w-28 truncate text-xs text-text-muted lg:inline">{user?.username}</span>
          <button
            type="button"
            onClick={logout}
            aria-label="Log out"
            title="Log out"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-white/5 text-text-muted transition-colors hover:text-white"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
