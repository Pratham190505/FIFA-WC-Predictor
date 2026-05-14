import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { PageHeader } from "../ui/SectionTitle";
import { GlassCard } from "../ui/GlassCard";
import { TeamCard } from "../cards/TeamCard";
import { StatBadge, FormBadges } from "../ui/StatBadge";
import { TEAMS, type Team, type Confederation, sumGoals } from "@/data/mockData";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { CHART_COLORS, tooltipStyle } from "../charts/ChartTheme";
import TeamFlag from "../ui/TeamFlag";

const CONFEDS: ("ALL" | Confederation)[] = ["ALL", "UEFA", "CONMEBOL", "CONCACAF", "AFC", "CAF"];

export function TeamsPage() {
  const [q, setQ] = useState("");
  const [conf, setConf] = useState<"ALL" | Confederation>("ALL");
  const [topN, setTopN] = useState<10 | 20 | 99>(99);
  const [selected, setSelected] = useState<Team | null>(null);

  const filtered = useMemo(() => {
    return TEAMS.filter((t) => conf === "ALL" || t.confederation === conf)
      .filter((t) => t.name.toLowerCase().includes(q.toLowerCase()))
      .filter((t) => t.fifaRank <= topN)
      .sort((a, b) => a.fifaRank - b.fifaRank);
  }, [q, conf, topN]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-20">
      <PageHeader
        eyebrow="Squad data"
        title="TEAMS EXPLORER"
        subtitle="Browse all 32 World Cup teams. Click a card for full analytics."
      />

      <GlassCard className="mb-8">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search team…"
              className="w-full glass rounded-xl h-12 pl-11 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-cyan/50"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {CONFEDS.map((c) => (
              <button
                key={c}
                onClick={() => setConf(c)}
                className={`px-3 h-12 rounded-xl font-mono text-xs border transition-all ${conf === c ? "bg-neon-cyan/15 border-neon-cyan/50 text-neon-cyan" : "glass text-text-muted hover:text-text-primary"}`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {(
              [
                ["Top 10", 10],
                ["Top 20", 20],
                ["All", 99],
              ] as const
            ).map(([l, n]) => (
              <button
                key={l}
                onClick={() => setTopN(n)}
                className={`px-3 h-12 rounded-xl font-mono text-xs border transition-all ${topN === n ? "bg-neon-violet/15 border-neon-violet/50 text-neon-violet" : "glass text-text-muted hover:text-text-primary"}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t) => (
          <TeamCard key={t.id} team={t} onClick={() => setSelected(t)} />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-text-muted py-12">
            No teams match.
          </p>
        )}
      </div>

      <AnimatePresence>
        {selected && <TeamDetailModal team={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}

function TeamDetailModal({ team, onClose }: { team: Team; onClose: () => void }) {
  const goalsData = team.goalsScored.map((g, i) => ({
    m: i + 1,
    scored: g,
    conceded: team.goalsConceded[i],
  }));
  const sentimentData = [
    { name: "Positive", value: team.sentiment.positive, color: CHART_COLORS.success },
    { name: "Neutral", value: team.sentiment.neutral, color: CHART_COLORS.muted },
    { name: "Negative", value: team.sentiment.negative, color: CHART_COLORS.danger },
  ];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-bg/85 backdrop-blur-sm overflow-y-auto p-4 md:p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-5xl mx-auto glass-strong rounded-3xl border border-white/10 p-6 md:p-10 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-lg glass flex items-center justify-center hover:border-white/30"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
          <TeamFlag country={team.name} size="2xl" className="w-32! h-20! md:w-40! md:h-24!" />
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-neon-cyan">
              {team.confederation}
            </p>
            <h2 className="font-display text-5xl md:text-6xl tracking-wide neon-text">
              {team.name}
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <StatBadge tone="info">FIFA #{team.fifaRank}</StatBadge>
              <StatBadge tone="violet">ELO {team.elo}</StatBadge>
              <StatBadge tone="gold">€{team.squadValueM}M</StatBadge>
              <StatBadge tone="draw">Avg age {team.avgAge.toFixed(1)}</StatBadge>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <GlassCard>
            <p className="text-[10px] font-mono uppercase tracking-widest text-neon-cyan mb-3">
              Last 10 matches
            </p>
            <FormBadges form={team.form.slice(-10)} />
            <div className="grid grid-cols-3 mt-4 text-center">
              <div>
                <p className="font-mono text-2xl text-success">
                  {team.form.filter((x) => x === "W").length}
                </p>
                <p className="text-[10px] text-text-muted uppercase tracking-widest">
                  W
                </p>
              </div>
              <div>
                <p className="font-mono text-2xl text-text-muted">
                  {team.form.filter((x) => x === "D").length}
                </p>
                <p className="text-[10px] text-text-muted uppercase tracking-widest">
                  D
                </p>
              </div>
              <div>
                <p className="font-mono text-2xl text-danger">
                  {team.form.filter((x) => x === "L").length}
                </p>
                <p className="text-[10px] text-text-muted uppercase tracking-widest">
                  L
                </p>
              </div>
            </div>
          </GlassCard>
          <GlassCard>
            <p className="text-[10px] font-mono uppercase tracking-widest text-neon-cyan mb-3">
              Goals trend (L10)
            </p>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={goalsData}>
                  <XAxis dataKey="m" stroke={CHART_COLORS.muted} fontSize={10} />
                  <YAxis stroke={CHART_COLORS.muted} fontSize={10} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line
                    type="monotone"
                    dataKey="scored"
                    stroke={CHART_COLORS.cyan}
                    strokeWidth={2.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="conceded"
                    stroke={CHART_COLORS.danger}
                    strokeWidth={2.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs font-mono text-text-muted mt-2">
              Scored {sumGoals(team.goalsScored)} · Conceded {sumGoals(team.goalsConceded)}
            </p>
          </GlassCard>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <GlassCard>
            <p className="text-[10px] font-mono uppercase tracking-widest text-neon-cyan mb-3">
              Fan sentiment
            </p>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    dataKey="value"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                  >
                    {sentimentData.map((d, i) => (
                      <Cell key={i} fill={d.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-around text-xs">
              {sentimentData.map((s) => (
                <div key={s.name} className="text-center">
                  <span
                    className="inline-block w-2 h-2 rounded-full mr-1.5"
                    style={{ background: s.color }}
                  />
                  <span className="font-mono">{s.value}%</span>
                  <p className="text-[10px] text-text-muted uppercase">{s.name}</p>
                </div>
              ))}
            </div>
          </GlassCard>
          <GlassCard>
            <p className="text-[10px] font-mono uppercase tracking-widest text-neon-cyan mb-3">
              Key players
            </p>
            <div className="space-y-2">
              {team.players.map((p) => (
                <div
                  key={p.name}
                  className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                >
                  <div>
                    <p className="font-display text-sm tracking-wide">{p.name}</p>
                    <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
                      {p.position}
                    </p>
                  </div>
                  <span className="font-mono text-sm neon-text-gold">€{p.marketValueM}M</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </motion.div>
    </motion.div>
  );
}
