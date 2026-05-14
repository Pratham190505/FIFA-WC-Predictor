import { motion } from "framer-motion";
import { GlassCard } from "../ui/GlassCard";
import { FormBadges, StatBadge } from "../ui/StatBadge";
import type { Team } from "@/data/mockData";
import TeamFlag from "../ui/TeamFlag";

export function TeamCard({ team, onClick }: { team: Team; onClick?: () => void }) {
  const sentimentTone = team.sentiment.positive >= 65 ? "bg-success" : team.sentiment.positive >= 50 ? "bg-neon-gold" : "bg-danger";
  return (
    <motion.button
      type="button" onClick={onClick}
      whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.25 }}
      className="text-left w-full"
    >
      <GlassCard glow="violet" className="h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <TeamFlag country={team.name} size="lg" />
            <div>
              <h3 className="font-display text-xl tracking-wide leading-none">{team.name}</h3>
              <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted mt-1">{team.confederation}</p>
            </div>
          </div>
          <StatBadge tone="info">#{team.fifaRank}</StatBadge>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <p className="text-[10px] font-mono uppercase text-text-muted tracking-widest">ELO</p>
            <p className="font-mono text-xl font-bold neon-text">{team.elo}</p>
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase text-text-muted tracking-widest">Squad</p>
            <p className="font-mono text-xl font-bold">€{team.squadValueM}M</p>
          </div>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <FormBadges form={team.form} />
          <div className="flex items-center gap-2">
            <span className={`relative inline-block w-2.5 h-2.5 rounded-full ${sentimentTone}`}>
              <span className={`absolute inset-0 rounded-full ${sentimentTone} animate-ping opacity-60`} />
            </span>
            <span className="text-[10px] font-mono text-text-muted">{team.sentiment.positive}%</span>
          </div>
        </div>
      </GlassCard>
    </motion.button>
  );
}
