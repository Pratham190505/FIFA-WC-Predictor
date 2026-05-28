import { useState, useMemo } from "react";
import { PageHeader, SectionTitle } from "../ui/SectionTitle";
import { GlassCard } from "../ui/GlassCard";
import { CountUp } from "../ui/CountUp";
import { TEAMS, type Confederation, sumGoals, avg } from "@/data/mockData";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { CHART_COLORS, tooltipStyle } from "../charts/ChartTheme";
import TeamFlag from "../ui/TeamFlag";

const CONFEDS: ("ALL" | Confederation)[] = ["ALL", "UEFA", "CONMEBOL", "CONCACAF", "AFC", "CAF"];

export function AnalyticsPage() {
  const [conf, setConf] = useState<"ALL" | Confederation>("ALL");
  const [teamA, setTeamA] = useState("BRA");
  const [teamB, setTeamB] = useState("FRA");

  const teams = useMemo(
    () => (conf === "ALL" ? TEAMS : TEAMS.filter((t) => t.confederation === conf)),
    [conf],
  );

  const radarData = useMemo(() => {
    const a = TEAMS.find((t) => t.id === teamA)!;
    const b = TEAMS.find((t) => t.id === teamB)!;
    const norm = (v: number, max: number) => Math.round((v / max) * 100);
    return [
      {
        metric: "Attack",
        a: norm(sumGoals(a.goalsScored), 30),
        b: norm(sumGoals(b.goalsScored), 30),
      },
      {
        metric: "Defense",
        a: norm(20 - sumGoals(a.goalsConceded), 20),
        b: norm(20 - sumGoals(b.goalsConceded), 20),
      },
      { metric: "ELO", a: norm(a.elo - 1700, 450), b: norm(b.elo - 1700, 450) },
      { metric: "Squad", a: norm(a.squadValueM, 1400), b: norm(b.squadValueM, 1400) },
      {
        metric: "Form",
        a: a.form.filter((f) => f === "W").length * 10,
        b: b.form.filter((f) => f === "W").length * 10,
      },
      { metric: "Sentiment", a: a.sentiment.positive, b: b.sentiment.positive },
    ];
  }, [teamA, teamB]);

  const attacking = [...teams]
    .sort((a, b) => sumGoals(b.goalsScored) - sumGoals(a.goalsScored))
    .slice(0, 10)
    .map((t) => ({ name: t.name, flag: t.flag, goals: sumGoals(t.goalsScored) }));
  const defensive = [...teams]
    .sort((a, b) => sumGoals(a.goalsConceded) - sumGoals(b.goalsConceded))
    .slice(0, 10)
    .map((t) => ({ name: t.name, conceded: sumGoals(t.goalsConceded) }));
  const heatmap = [...teams].sort((a, b) => b.sentiment.positive - a.sentiment.positive);
  const regional = (["UEFA", "CONMEBOL", "CONCACAF", "AFC", "CAF"] as Confederation[]).map((c) => {
    const list = TEAMS.filter((t) => t.confederation === c);
    return {
      confederation: c,
      count: list.length,
      avgElo: Math.round(avg(list.map((t) => t.elo))),
    };
  });

  const a = TEAMS.find((t) => t.id === teamA)!;
  const b = TEAMS.find((t) => t.id === teamB)!;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-20">
      <PageHeader
        eyebrow="Deep dive"
        title="ANALYTICS"
        subtitle="Cross-team metrics, sentiment trends and prediction accuracy at a glance."
      />

      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        <aside className="space-y-4">
          <GlassCard>
            <p className="text-[10px] font-mono uppercase tracking-widest text-neon-cyan mb-3">
              Confederation
            </p>
            <div className="flex flex-wrap gap-2">
              {CONFEDS.map((c) => (
                <button
                  key={c}
                  onClick={() => setConf(c)}
                  className={`px-3 py-1.5 rounded-md font-mono text-[10px] border ${conf === c ? "bg-neon-cyan/15 border-neon-cyan/50 text-neon-cyan" : "glass text-text-muted"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </GlassCard>
          <GlassCard>
            <p className="text-[10px] font-mono uppercase tracking-widest text-neon-cyan mb-3">
              Compare teams
            </p>
            <label className="block mb-3">
              <span className="text-[10px] font-mono uppercase text-text-muted">
                Team A
              </span>
              <select
                value={teamA}
                onChange={(e) => setTeamA(e.target.value)}
                className="w-full mt-1 glass rounded-lg h-10 px-3 text-sm bg-surface"
              >
                {TEAMS.map((t) => (
                  <option key={t.id} value={t.id} className="bg-surface">
                    {t.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-[10px] font-mono uppercase text-text-muted">
                Team B
              </span>
              <select
                value={teamB}
                onChange={(e) => setTeamB(e.target.value)}
                className="w-full mt-1 glass rounded-lg h-10 px-3 text-sm bg-surface"
              >
                {TEAMS.map((t) => (
                  <option key={t.id} value={t.id} className="bg-surface">
                    {t.name}
                  </option>
                ))}
              </select>
            </label>
          </GlassCard>
          <GlassCard>
            <p className="text-[10px] font-mono uppercase tracking-widest text-neon-cyan mb-3">
              Filtered
            </p>
            <p className="font-mono text-3xl neon-text">
              <CountUp end={teams.length} /> teams
            </p>
          </GlassCard>
        </aside>

        <main className="space-y-6">
          {/* RADAR */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <SectionTitle eyebrow="Head to head" title="Team Radar" className="mb-0" />
              <div className="hidden sm:flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-neon-cyan" />
                  <TeamFlag country={a.name} size="sm" /> {a.name}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-neon-violet" />
                  <TeamFlag country={b.name} size="sm" /> {b.name}
                </span>
              </div>
            </div>
            <div className="h-90">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="75%">
                  <PolarGrid stroke={CHART_COLORS.grid} />
                  <PolarAngleAxis dataKey="metric" stroke={CHART_COLORS.muted} fontSize={11} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Radar
                    name={a.name}
                    dataKey="a"
                    stroke={CHART_COLORS.cyan}
                    fill={CHART_COLORS.cyan}
                    fillOpacity={0.25}
                  />
                  <Radar
                    name={b.name}
                    dataKey="b"
                    stroke={CHART_COLORS.violet}
                    fill={CHART_COLORS.violet}
                    fillOpacity={0.25}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <div className="grid md:grid-cols-2 gap-6">
            <GlassCard>
              <SectionTitle eyebrow="Goals scored" title="Top Attacking" className="mb-4" />
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attacking} layout="vertical" margin={{ left: 60, right: 20 }}>
                    <defs>
                      <linearGradient id="atk" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={CHART_COLORS.violet} />
                        <stop offset="100%" stopColor={CHART_COLORS.cyan} />
                      </linearGradient>
                    </defs>
                    <XAxis type="number" stroke={CHART_COLORS.muted} fontSize={10} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      stroke={CHART_COLORS.muted}
                      fontSize={10}
                      width={80}
                    />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      cursor={{ fill: "rgba(255,255,255,0.04)" }}
                    />
                    <Bar dataKey="goals" fill="url(#atk)" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
            <GlassCard>
              <SectionTitle eyebrow="Goals conceded" title="Defensive Strength" className="mb-4" />
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={defensive} layout="vertical" margin={{ left: 60, right: 20 }}>
                    <XAxis type="number" stroke={CHART_COLORS.muted} fontSize={10} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      stroke={CHART_COLORS.muted}
                      fontSize={10}
                      width={80}
                    />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      cursor={{ fill: "rgba(255,255,255,0.04)" }}
                    />
                    <Bar dataKey="conceded" fill={CHART_COLORS.success} radius={[0, 6, 6, 0]}>
                      {defensive.map((_, i) => (
                        <Cell key={i} fillOpacity={1 - i * 0.07} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>

          <GlassCard>
            <SectionTitle eyebrow="Sentiment heatmap" title="All Teams" className="mb-4" />
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-120">
                <thead>
                  <tr className="text-[10px] font-mono uppercase tracking-widest text-text-muted border-b border-white/5">
                    <th className="text-left pb-2">Team</th>
                    <th className="pb-2">Positive</th>
                    <th className="pb-2">Neutral</th>
                    <th className="pb-2">Negative</th>
                  </tr>
                </thead>
                <tbody>
                  {heatmap.slice(0, 16).map((t) => {
                    const cell = (v: number, type: "pos" | "neg") => {
                      const color =
                        type === "pos"
                          ? v >= 65
                            ? "bg-success/30"
                            : v >= 50
                              ? "bg-neon-gold/25"
                              : "bg-danger/25"
                          : v >= 15
                            ? "bg-danger/30"
                            : v >= 10
                              ? "bg-neon-gold/25"
                              : "bg-success/20";
                      return (
                        <td className={`py-2 px-3 text-center font-mono text-xs rounded ${color}`}>
                          {v}%
                        </td>
                      );
                    };
                    return (
                      <tr key={t.id} className="border-b border-white/5">
                        <td className="py-2">
                          <span className="inline-flex items-center gap-2">
                            <TeamFlag country={t.name} size="sm" />
                            <span className="font-display tracking-wide">{t.name}</span>
                          </span>
                        </td>
                        {cell(t.sentiment.positive, "pos")}
                        <td className="py-2 px-3 text-center font-mono text-xs text-text-muted">
                          {t.sentiment.neutral}%
                        </td>
                        {cell(t.sentiment.negative, "neg")}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </GlassCard>

          <div>
            <SectionTitle eyebrow="By region" title="Regional Dominance" />
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {regional.map((r) => (
                <GlassCard key={r.confederation} glow="cyan" className="text-center">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-neon-cyan">
                    {r.confederation}
                  </p>
                  <p className="font-mono text-3xl font-bold neon-text mt-2">
                    <CountUp end={r.avgElo} />
                  </p>
                  <p className="text-[10px] font-mono text-text-muted mt-1">
                    avg ELO · {r.count} teams
                  </p>
                </GlassCard>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
