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

function BracketTeamLine({
  team,
  score,
  winner,
}: {
  team: string;
  score: string;
  winner: boolean;
}) {
  const flagUrl = getFlagUrl(team, 40);

  return (
    <div
      className={`flex h-6 items-center justify-between border border-slate-300 bg-white px-1.5 text-[11px] shadow-sm ${
        winner ? "font-bold text-slate-950" : "text-slate-700"
      }`}
    >
      <span className="flex min-w-0 items-center gap-1.5">
        {flagUrl && (
          <img
            src={flagUrl}
            alt={`${team} flag`}
            loading="lazy"
            className="h-3.5 w-5 shrink-0 border border-slate-300 object-cover"
          />
        )}
        <span className="truncate font-mono">{team}</span>
      </span>
      <span className="ml-2 shrink-0 font-mono text-[10px] text-slate-500">{score.trim()}</span>
    </div>
  );
}

function KnockoutMatchCard({
  match,
  style,
  final = false,
}: {
  match: BracketMatch;
  style: React.CSSProperties;
  final?: boolean;
}) {
  const [homeScore = "-", awayScore = "-"] = match.score?.split("-") ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35 }}
      className={`absolute z-10 w-56 ${final ? "drop-shadow-[0_0_18px_rgba(255,215,0,0.5)]" : ""}`}
      style={style}
    >
      <BracketTeamLine
        team={match.home}
        score={homeScore}
        winner={match.winner === match.home}
      />
      <BracketTeamLine
        team={match.away}
        score={awayScore}
        winner={match.winner === match.away}
      />
    </motion.div>
  );
}

function Connector({
  fromX,
  toX,
  fromY,
  toY,
}: {
  fromX: number;
  toX: number;
  fromY: number;
  toY: number;
}) {
  const midX = fromX + (toX - fromX) / 2;
  const top = Math.min(fromY, toY);
  const height = Math.abs(toY - fromY);

  return (
    <>
      <div
        className="absolute z-0 h-0.5 bg-white/80"
        style={{ left: fromX, top: fromY, width: midX - fromX }}
      />
      <div
        className="absolute z-0 w-0.5 bg-white/80"
        style={{ left: midX, top, height }}
      />
      <div
        className="absolute z-0 h-0.5 bg-white/80"
        style={{ left: midX, top: toY, width: toX - midX }}
      />
    </>
  );
}

function RoundLabel({ children, style }: { children: React.ReactNode; style: React.CSSProperties }) {
  return (
    <p
      className="absolute top-0 font-mono text-[10px] uppercase tracking-[0.22em] text-white/75"
      style={style}
    >
      {children}
    </p>
  );
}

function WorldCupBracket({
  roundOf16,
  quarterFinals,
  semiFinals,
  final,
  champion,
}: {
  roundOf16: BracketMatch[];
  quarterFinals: BracketMatch[];
  semiFinals: BracketMatch[];
  final: BracketMatch[];
  champion: string;
}) {
  const cardWidth = 224;
  const cardHeight = 48;
  const x = {
    r16: 24,
    qf: 314,
    sf: 604,
    final: 842,
    champion: 1004,
  };
  const y = {
    r16: roundOf16.map((_, index) => 54 + index * 82),
    qf: quarterFinals.map((_, index) => 95 + index * 164),
    sf: semiFinals.map((_, index) => 177 + index * 328),
    final: final.map((_, index) => 341 + index * 82),
  };

  return (
    <div className="overflow-x-auto pb-4">
      <div className="relative h-190 min-w-305 overflow-hidden rounded-xl border border-cyan-200/20 bg-[#0573ad] shadow-[inset_0_0_80px_rgba(0,0,0,0.28)]">
        <div className="absolute inset-0 opacity-25 grid-overlay" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_35%_45%,rgba(255,255,255,0.12),transparent_45%),linear-gradient(135deg,rgba(0,240,255,0.16),transparent_48%,rgba(0,0,0,0.16))]" />

        <RoundLabel style={{ left: x.r16, top: 20 }}>Round of 16</RoundLabel>
        <RoundLabel style={{ left: x.qf, top: 20 }}>Quarter-finals</RoundLabel>
        <RoundLabel style={{ left: x.sf, top: 20 }}>Semi-finals</RoundLabel>
        <RoundLabel style={{ left: x.final, top: 300 }}>Final</RoundLabel>

        {quarterFinals.map((_, index) => (
          <Connector
            key={`r16-qf-${index}`}
            fromX={x.r16 + cardWidth}
            toX={x.qf}
            fromY={y.r16[index * 2] + cardHeight / 2}
            toY={y.qf[index] + cardHeight / 2}
          />
        ))}
        {semiFinals.map((_, index) => (
          <Connector
            key={`qf-sf-${index}`}
            fromX={x.qf + cardWidth}
            toX={x.sf}
            fromY={y.qf[index * 2] + cardHeight / 2}
            toY={y.sf[index] + cardHeight / 2}
          />
        ))}
        {final.map((_, index) => (
          <Connector
            key={`sf-final-${index}`}
            fromX={x.sf + cardWidth}
            toX={x.final}
            fromY={y.sf[index * 2] + cardHeight / 2}
            toY={y.final[index] + cardHeight / 2}
          />
        ))}
        {final[0] && (
          <Connector
            fromX={x.final + cardWidth}
            toX={x.champion}
            fromY={y.final[0] + cardHeight / 2}
            toY={y.final[0] + cardHeight / 2}
          />
        )}

        {roundOf16.map((match, index) => (
          <KnockoutMatchCard
            key={`r16-${match.home}-${match.away}-${index}`}
            match={match}
            style={{ left: x.r16, top: y.r16[index] }}
          />
        ))}
        {quarterFinals.map((match, index) => (
          <KnockoutMatchCard
            key={`qf-${match.home}-${match.away}-${index}`}
            match={match}
            style={{ left: x.qf, top: y.qf[index] }}
          />
        ))}
        {semiFinals.map((match, index) => (
          <KnockoutMatchCard
            key={`sf-${match.home}-${match.away}-${index}`}
            match={match}
            style={{ left: x.sf, top: y.sf[index] }}
          />
        ))}
        {final.map((match, index) => (
          <KnockoutMatchCard
            key={`final-${match.home}-${match.away}-${index}`}
            match={match}
            final
            style={{ left: x.final, top: y.final[index] }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          className="absolute z-20 w-44 text-center"
          style={{ left: x.champion, top: 257 }}
        >
          <Trophy size={50} className="mx-auto mb-3 text-neon-gold drop-shadow-[0_0_14px_rgba(255,215,0,0.75)]" />
          <p className="mb-2 text-[10px] font-mono uppercase tracking-widest text-white/80">
            Champions
          </p>
          <div className="border border-yellow-300 bg-yellow-400 px-2 py-2 text-sm font-black uppercase tracking-wide text-slate-950 shadow-[0_0_20px_rgba(255,215,0,0.5)]">
            {champion}
          </div>
        </motion.div>
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

          <WorldCupBracket
            roundOf16={result.bracket.round_of_16}
            quarterFinals={result.bracket.quarter_finals}
            semiFinals={result.bracket.semi_finals}
            final={result.bracket.final}
            champion={champion}
          />

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
