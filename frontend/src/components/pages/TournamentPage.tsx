import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Play, RotateCcw, Trophy } from "lucide-react";

import { PageHeader, SectionTitle } from "../ui/SectionTitle";
import { GlassCard } from "../ui/GlassCard";
import { NeonButton } from "../ui/NeonButton";
import { StatBadge } from "../ui/StatBadge";
import TeamFlag from "../ui/TeamFlag";

import { useSimulate } from "../../hooks/useSimulate";
import { getFlagUrl } from "@/data/flagMap";
import {
  DEFAULT_SIMULATION_COUNT,
  SIMULATION_COUNTS,
  type SimulationCount,
} from "@/lib/simulation";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";

import { CHART_COLORS, tooltipStyle } from "../charts/ChartTheme";

type BracketMatch = {
  home: string;
  away: string;
  winner: string;
  score: string;
  home_win_prob: number;
  away_win_prob: number;
};

type Standing = {
  team: string;
  pts: number;
  gf: number;
  ga: number;
  gd: number;
};

const RUN_LABELS: Record<SimulationCount, string> = {
  50: "50",
  75: "75",
  100: "100",
};

function MatchBox({
  m,
  highlight = false,
}: {
  m: BracketMatch;
  highlight?: boolean;
}) {
  const [homeScore = "-", awayScore = "-"] = m.score?.split("-") ?? [];

  return (
    <div
      className={`glass rounded-lg p-2.5 text-xs ${
        highlight ? "border-neon-gold/60 glow-gold" : ""
      }`}
    >
      <div
        className={`flex items-center justify-between gap-2 ${
          m.winner === m.home ? "text-neon-cyan" : "text-text-muted"
        }`}
      >
        <span className="flex items-center gap-1.5 truncate">
          <TeamFlag country={m.home} size="sm" />
          <span className="font-display tracking-wide truncate">{m.home}</span>
        </span>

        <span className="font-mono font-bold">{homeScore.trim()}</span>
      </div>

      <div
        className={`flex items-center justify-between gap-2 mt-1 ${
          m.winner === m.away ? "text-neon-violet" : "text-text-muted"
        }`}
      >
        <span className="flex items-center gap-1.5 truncate">
          <TeamFlag country={m.away} size="sm" />
          <span className="font-display tracking-wide truncate">{m.away}</span>
        </span>

        <span className="font-mono font-bold">{awayScore.trim()}</span>
      </div>
    </div>
  );
}

function GroupCard({
  group,
  standings,
}: {
  group: string;
  standings: Standing[];
}) {
  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="font-display text-2xl tracking-wider neon-text">
          {group}
        </span>

        <StatBadge tone="info">4 teams</StatBadge>
      </div>

      <table className="w-full text-xs">
        <thead>
          <tr className="text-[10px] font-mono uppercase tracking-widest text-text-muted">
            <th className="text-left pb-1">Team</th>
            <th className="pb-1">P</th>
            <th className="pb-1">GD</th>
          </tr>
        </thead>

        <tbody>
          {standings.map((s, i) => {
            const flagUrl = getFlagUrl(s.team, 40);

            return (
              <tr
                key={s.team}
                className={`border-t border-white/5 ${
                  i < 2 ? "text-success" : "text-text-muted"
                }`}
              >
                <td className="py-1.5 flex items-center gap-1.5">
                  {flagUrl && (
                    <img
                      src={flagUrl}
                      alt={`${s.team} flag`}
                      loading="lazy"
                      className="inline-block h-4 w-6 rounded-[3px] border border-white/10 object-cover"
                    />
                  )}

                  <span className="font-display">{s.team}</span>
                </td>

                <td className="py-1.5 text-center font-mono font-bold">
                  {s.pts}
                </td>

                <td className="py-1.5 text-center font-mono">
                  {s.gd > 0 ? "+" : ""}
                  {s.gd}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </GlassCard>
  );
}

export function TournamentPage() {
  const { simulate, result, loading, error } = useSimulate();
  const [runs, setRuns] = useState<SimulationCount>(DEFAULT_SIMULATION_COUNT);

  useEffect(() => {
    if (result?.bracket.winner) {
      setTimeout(() => {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.3 },
          colors: ["#ffd700", "#00f0ff", "#7b2fff"],
        });
      }, 600);
    }
  }, [result?.bracket.winner]);

  const champion = result?.bracket.winner;

  const chartData = result
    ? Object.entries(result.champion_probabilities)
        .slice(0, 8)
        .map(([name, pct]) => ({ name, pct }))
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <PageHeader
          eyebrow="Monte Carlo"
          title="WORLD CUP SIMULATOR"
          subtitle="Run hundreds of simulations and watch the bracket unfold."
        />

        <div className="flex flex-wrap gap-3">
          <NeonButton
            variant="primary"
            loading={loading}
            disabled={loading}
            onClick={() => simulate(runs)}
          >
            <Play size={16} />
            Run Simulation
          </NeonButton>

          <NeonButton
            variant="ghost"
            disabled={loading}
            onClick={() => {
              setRuns(DEFAULT_SIMULATION_COUNT);
            }}
          >
            <RotateCcw size={16} />
            Reset
          </NeonButton>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
          {error}
        </div>
      )}

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted">
          Simulations:
        </span>

        {SIMULATION_COUNTS.map((n) => (
          <button
            key={n}
            onClick={() => {
              setRuns(n);
            }}
            disabled={loading}
            className={`px-4 py-2 rounded-lg font-mono text-xs border transition-all ${
              runs === n
                ? "bg-neon-cyan/15 border-neon-cyan/50 text-neon-cyan"
                : "glass text-text-muted hover:text-text-primary"
            }`}
          >
            {RUN_LABELS[n]}
          </button>
        ))}
      </div>

      {result && (
        <>
          <SectionTitle eyebrow="Stage 1" title="Group Stage" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {Object.entries(result.group_stage).map(([groupName, groupData]) => (
              <GroupCard
                key={groupName}
                group={groupName}
                standings={groupData.standings}
              />
            ))}
          </div>
        </>
      )}

      {result && champion && (
        <>
          <SectionTitle eyebrow="Stage 2" title="Knockout Bracket" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <GlassCard
              glow="gold"
              className="text-center animate-pulse-glow border-neon-gold/50"
            >
              <Trophy size={36} className="mx-auto mb-3 text-neon-gold" />

              <p className="text-[10px] font-mono uppercase tracking-widest text-neon-gold mb-2">
                Champion
              </p>

              <div className="mb-2 flex justify-center">
                <TeamFlag country={champion} size="2xl" />
              </div>

              <p className="font-display text-4xl tracking-wide neon-text-gold">
                {champion}
              </p>
            </GlassCard>
          </motion.div>

          <div className="overflow-x-auto pb-4">
            <div className="grid grid-cols-4 gap-4 md:gap-6 min-w-250">
              {[
                { round: "Round of 16", matches: result.bracket.round_of_16 },
                { round: "Quarter-Final", matches: result.bracket.quarter_finals },
                { round: "Semi-Final", matches: result.bracket.semi_finals },
                { round: "Final", matches: result.bracket.final },
              ].map((col, ci) => (
                <div key={col.round} className="space-y-3">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-neon-cyan mb-2">
                    {col.round}
                  </p>

                  {col.matches.map((m, mi) => (
                    <motion.div
                      key={`${col.round}-${m.home}-${m.away}-${mi}`}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: ci * 0.15 + mi * 0.04,
                      }}
                    >
                      <MatchBox m={m} highlight={ci === 3} />
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16">
            <SectionTitle
              eyebrow="Monte Carlo"
              title="Championship Probability"
            />

            <GlassCard>
              <div className="h-105">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{
                      top: 10,
                      right: 30,
                      left: 80,
                      bottom: 10,
                    }}
                  >
                    <XAxis
                      type="number"
                      stroke={CHART_COLORS.muted}
                      fontSize={11}
                      tickFormatter={(v) => `${v}%`}
                    />

                    <YAxis
                      type="category"
                      dataKey="name"
                      stroke={CHART_COLORS.muted}
                      fontSize={12}
                      width={100}
                    />

                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(v) => [`${v}%`, "Champion %"]}
                    />

                    <Bar
                      dataKey="pct"
                      fill={CHART_COLORS.cyan}
                      radius={[0, 8, 8, 0]}
                    >
                      {chartData.map((_, i) => (
                        <Cell key={i} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>
        </>
      )}
    </div>
  );
}
