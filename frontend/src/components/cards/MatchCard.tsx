import { motion } from "framer-motion";
import { GlassCard } from "../ui/GlassCard";
import { ProbabilityBar } from "../ui/ProbabilityBar";
import { StatBadge } from "../ui/StatBadge";
import { teamById, type MatchPrediction } from "@/data/mockData";
import TeamFlag from "../ui/TeamFlag";

export function MatchCard({ match }: { match: MatchPrediction }) {
  const home = teamById(match.homeId);
  const away = teamById(match.awayId);
  const favored = match.homeProb >= match.awayProb ? "home" : "away";
  return (
    <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.25 }} className="min-w-[280px]">
      <GlassCard glow="cyan" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-mono tracking-widest uppercase text-text-muted">Match Prediction</span>
          <StatBadge tone={match.confidence >= 75 ? "win" : match.confidence >= 60 ? "info" : "draw"}>{match.confidence}% conf</StatBadge>
        </div>
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex flex-col items-center text-center flex-1">
            <TeamFlag country={home.name} size="md" className="mb-1" />
            <span className="font-display text-base tracking-wide">{home.name}</span>
            <span className="text-[10px] font-mono text-text-muted">#{home.fifaRank}</span>
          </div>
          <span className="font-display text-xs text-text-muted tracking-widest">VS</span>
          <div className="flex flex-col items-center text-center flex-1">
            <TeamFlag country={away.name} size="md" className="mb-1" />
            <span className="font-display text-base tracking-wide">{away.name}</span>
            <span className="text-[10px] font-mono text-text-muted">#{away.fifaRank}</span>
          </div>
        </div>
        <ProbabilityBar label={home.name} value={match.homeProb} color={favored === "home" ? "cyan" : "muted"} />
        <div className="h-2" />
        <ProbabilityBar label="Draw" value={match.drawProb} color="muted" />
        <div className="h-2" />
        <ProbabilityBar label={away.name} value={match.awayProb} color={favored === "away" ? "violet" : "muted"} />
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted">Predicted</span>
          <span className="font-mono text-lg font-bold tracking-wide">
            {match.predictedScore[0]} <span className="text-text-muted">—</span> {match.predictedScore[1]}
          </span>
        </div>
      </GlassCard>
    </motion.div>
  );
}
