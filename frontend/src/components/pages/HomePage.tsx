import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Trophy } from "lucide-react";
import { ParticleBackground } from "../layout/ParticleBackground";
import { NeonButton } from "../ui/NeonButton";
import { GlassCard } from "../ui/GlassCard";
import { SectionTitle } from "../ui/SectionTitle";
import { MatchCard } from "../cards/MatchCard";
import { TeamCard } from "../cards/TeamCard";
import { ProbabilityBar } from "../ui/ProbabilityBar";
import { CountUp } from "../ui/CountUp";
import { TEAMS, TRENDING, teamById } from "@/data/mockData";
import { Globe3D } from "../three/Globe3D";
import TeamFlag from "../ui/TeamFlag";

export function HomePage() {
  const topTeams = [...TEAMS].sort((a, b) => a.fifaRank - b.fifaRank).slice(0, 6);
  const featured = TRENDING[0];
  const fHome = teamById(featured.homeId);
  const fAway = teamById(featured.awayId);
  const { scrollY } = useScroll();
  const globeOpacity = useTransform(scrollY, [0, 500], [0.85, 0]);
  const globeScale = useTransform(scrollY, [0, 800], [1, 0.7]);

  return (
    <>
      <section className="relative min-h-svh flex items-center pt-24 pb-12">
        <ParticleBackground />
        <motion.div
          aria-hidden
          style={{ opacity: globeOpacity, scale: globeScale }}
          className="absolute inset-0 pointer-events-auto"
        >
          <Globe3D />
        </motion.div>
        <div className="relative max-w-7xl mx-auto px-4 md:px-8 grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center w-full">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6"
            >
              <Sparkles size={14} className="text-neon-cyan" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-text-muted">
                Powered by AI · 94% accuracy
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="font-display text-6xl sm:text-7xl md:text-8xl leading-[0.9] tracking-wide"
            >
              <span className="neon-text">PREDICT</span>
              <br />
              <span className="text-text-primary">THE BEAUTIFUL</span>
              <br />
              <span className="neon-text-gold">GAME.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-6 text-lg text-text-muted max-w-xl"
            >
              AI-powered FIFA World Cup predictions, tournament simulations and deep team analytics
              — all in one futuristic dashboard.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link to="/predict">
                <NeonButton variant="primary" size="lg">
                  Predict a Match <ArrowRight size={18} />
                </NeonButton>
              </Link>
              <Link to="/tournament">
                <NeonButton variant="outline" size="lg">
                  Simulate Tournament
                </NeonButton>
              </Link>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative animate-float"
          >
            <GlassCard glow="cyan" className="relative">
              <div className="flex items-center justify-between mb-5">
                <span className="text-[10px] font-mono tracking-widest uppercase text-neon-cyan">
                  Live AI Prediction
                </span>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-success">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />{" "}
                  LIVE
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="text-center">
                  <div className="mb-2 flex justify-center">
                    <TeamFlag country={fHome.name} size="xl" />
                  </div>
                  <div className="font-display text-xl tracking-wide">{fHome.name}</div>
                  <div className="font-mono text-3xl mt-1 neon-text">{featured.homeProb}%</div>
                </div>
                <div className="font-display text-3xl text-text-muted">VS</div>
                <div className="text-center">
                  <div className="mb-2 flex justify-center">
                    <TeamFlag country={fAway.name} size="xl" />
                  </div>
                  <div className="font-display text-xl tracking-wide">{fAway.name}</div>
                  <div className="font-mono text-3xl mt-1" style={{ color: "var(--neon-violet)" }}>
                    {featured.awayProb}%
                  </div>
                </div>
              </div>
              <ProbabilityBar label="Win probability" value={featured.homeProb} color="cyan" />
              <div className="mt-4 flex items-center justify-between pt-4 border-t border-white/5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted">
                  Predicted
                </span>
                <span className="font-mono text-2xl font-bold">
                  {featured.predictedScore[0]}{" "}
                  <span className="text-text-muted">—</span>{" "}
                  {featured.predictedScore[1]}
                </span>
              </div>
            </GlassCard>
            <div className="absolute -inset-4 -z-10 bg-linear-to-br from-neon-cyan/20 to-neon-violet/20 blur-3xl rounded-full" />
          </motion.div>
        </div>
      </section>

      <section className="relative max-w-7xl mx-auto px-4 md:px-8 py-16">
        <SectionTitle eyebrow="Live feed" title="Trending Predictions" />
        <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {TRENDING.map((m) => (
            <MatchCard key={m.id} match={m} />
          ))}
        </div>
      </section>

      <section className="relative max-w-7xl mx-auto px-4 md:px-8 py-16">
        <SectionTitle eyebrow="Power rankings" title="Top Teams" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {topTeams.map((t) => (
            <TeamCard key={t.id} team={t} />
          ))}
        </div>
      </section>

      <section className="relative py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="rounded-3xl glass-strong border border-white/10 p-8 md:p-12 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-neon-violet/20 blur-3xl rounded-full" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-neon-cyan/20 blur-3xl rounded-full" />
            <div className="relative grid gap-8 md:grid-cols-3">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-neon-cyan mb-2">
                  Championship favorite
                </p>
                <p className="font-display text-3xl tracking-wide">🇧🇷 Brazil</p>
                <p className="font-mono text-4xl neon-text mt-2">
                  <CountUp end={18.4} decimals={1} suffix="%" />
                </p>
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-neon-cyan mb-2">
                  Most predicted upset
                </p>
                <p className="font-display text-3xl tracking-wide">🇲🇦 vs 🇧🇪</p>
                <p className="font-mono text-4xl mt-2" style={{ color: "var(--neon-violet)" }}>
                  <CountUp end={32} suffix="%" /> chance
                </p>
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-neon-cyan mb-2">
                  Total simulations
                </p>
                <p className="font-display text-3xl tracking-wide">All time</p>
                <p className="font-mono text-4xl neon-text-gold mt-2">
                  <CountUp end={1284931} />
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { label: "Simulations", end: 10000, suffix: "+", icon: Zap },
            { label: "Teams analyzed", end: 32, suffix: "", icon: Trophy },
            { label: "Prediction accuracy", end: 94, suffix: "%", icon: Sparkles },
            { label: "Predictions made", end: 500000, suffix: "+", icon: Trophy },
          ].map((s) => (
            <GlassCard key={s.label} glow="cyan" className="text-center">
              <s.icon size={20} className="mx-auto mb-3 text-neon-cyan" />
              <p className="font-mono text-3xl md:text-4xl font-bold neon-text">
                <CountUp end={s.end} suffix={s.suffix} />
              </p>
              <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted mt-2">
                {s.label}
              </p>
            </GlassCard>
          ))}
        </div>
      </section>
    </>
  );
}
