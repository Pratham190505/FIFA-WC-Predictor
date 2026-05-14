import { Link } from "@tanstack/react-router";
import { Trophy } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid gap-8 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-violet text-[#04121a]">
              <Trophy size={18} strokeWidth={2.5} />
            </span>
            <span className="font-display text-xl tracking-widest neon-text">MatchMind AI</span>
          </div>
          <p className="text-sm text-text-muted max-w-xs">AI-powered FIFA World Cup predictions, tournament simulations & deep team analytics.</p>
        </div>
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-neon-cyan mb-3">Explore</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/predict" className="text-text-muted hover:text-neon-cyan transition-colors">Predict</Link></li>
            <li><Link to="/tournament" className="text-text-muted hover:text-neon-cyan transition-colors">Tournament</Link></li>
            <li><Link to="/teams" className="text-text-muted hover:text-neon-cyan transition-colors">Teams</Link></li>
            <li><Link to="/analytics" className="text-text-muted hover:text-neon-cyan transition-colors">Analytics</Link></li>
          </ul>
        </div>
        <div className="md:text-right">
          <p className="text-[10px] font-mono uppercase tracking-widest text-neon-cyan mb-3">Powered By</p>
          <p className="font-display text-2xl tracking-widest"><span className="neon-text">AI ENGINE v3.2</span></p>
          <p className="text-xs font-mono text-text-muted mt-2">© 2026 MatchMind. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
