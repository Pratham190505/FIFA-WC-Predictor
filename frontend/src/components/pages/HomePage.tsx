import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Trophy } from "lucide-react";
import { ParticleBackground } from "../layout/ParticleBackground";
import { NeonButton } from "../ui/NeonButton";
import { GlassCard } from "../ui/GlassCard";
import { SectionTitle } from "../ui/SectionTitle";
import { TeamCard } from "../cards/TeamCard";
import { ProbabilityBar } from "../ui/ProbabilityBar";
import { CountUp } from "../ui/CountUp";
import { TEAMS, teamById } from "@/data/mockData";
import { Globe3D } from "../three/Globe3D";
import TeamFlag from "../ui/TeamFlag";

export function HomePage() {
  const topTeams = [...TEAMS].sort((a, b) => a.fifaRank - b.fifaRank).slice(0, 6);
  const featured = {
    homeId: "BRA",
    awayId: "ARG",
    homeProb: 48,
    awayProb: 30,
    predictedScore: [2, 1] as const,
  };
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
              Explore match forecasts, bracket runs, and team form from one focused dashboard.
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
            
            <div className="absolute -inset-4 -z-10 bg-linear-to-br from-neon-cyan/20 to-neon-violet/20 blur-3xl rounded-full" />
          </motion.div>
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
    </>
  );
}
