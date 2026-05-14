import { Link, useLocation } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Menu, X, Trophy } from "lucide-react";
import { NeonButton } from "../ui/NeonButton";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { to: "/" as const, label: "Home" },
  { to: "/predict" as const, label: "Predict" },
  { to: "/tournament" as const, label: "Tournament" },
  { to: "/teams" as const, label: "Teams" },
  { to: "/analytics" as const, label: "Analytics" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="glass-strong border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="relative inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-violet text-[#04121a] group-hover:glow-cyan transition-all">
              <Trophy size={18} strokeWidth={2.5} />
            </span>
            <span className="font-display text-2xl tracking-widest neon-text hidden sm:inline">MatchMind AI</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link key={l.to} to={l.to}
                className="relative px-4 py-2 text-sm font-display tracking-widest uppercase text-text-muted hover:text-text-primary transition-colors"
                activeProps={{ className: "text-neon-cyan" }}
                activeOptions={{ exact: l.to === "/" }}>
                {({ isActive }) => (<>{l.label}{isActive && (<motion.span layoutId="navUnderline" className="absolute left-3 right-3 -bottom-0.5 h-0.5 bg-neon-cyan rounded-full glow-cyan" />)}</>)}
              </Link>
            ))}
          </nav>
          <div className="hidden md:block"><Link to="/predict"><NeonButton variant="outline" size="sm">Get Started</NeonButton></Link></div>
          <button className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg glass text-text-primary" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={20} /></button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 md:hidden bg-bg/80 backdrop-blur-sm" onClick={() => setOpen(false)}>
            <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
              className="absolute right-0 top-0 bottom-0 w-72 glass-strong border-l border-white/10 p-6 flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-8">
                <span className="font-display text-xl tracking-widest neon-text">Menu</span>
                <button onClick={() => setOpen(false)} aria-label="Close" className="w-10 h-10 rounded-lg glass inline-flex items-center justify-center"><X size={18} /></button>
              </div>
              <nav className="flex flex-col gap-1">
                {links.map((l) => (
                  <Link key={l.to} to={l.to} className="px-4 py-3 rounded-lg font-display text-base tracking-widest uppercase text-text-muted hover:text-neon-cyan hover:bg-white/5 transition-colors"
                    activeProps={{ className: "text-neon-cyan bg-white/5" }} activeOptions={{ exact: l.to === "/" }}>{l.label}</Link>
                ))}
              </nav>
              <div className="mt-auto"><Link to="/predict"><NeonButton variant="primary" className="w-full">Get Started</NeonButton></Link></div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
