import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import { PageHeader } from "../ui/SectionTitle";
import { GlassCard } from "../ui/GlassCard";
import { NeonButton } from "../ui/NeonButton";
import { ProbabilityBar } from "../ui/ProbabilityBar";
import { StatBadge, FormBadges } from "../ui/StatBadge";
import { TEAMS, teamById, sumGoals } from "@/data/mockData";
import { useApp } from "@/store/appContext";
import TeamFlag from "../ui/TeamFlag";
import { usePredict } from "../../hooks/usePredict";

function TeamSelect({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  const team = teamById(value);
  return (
    <label className="block">
      <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-2 block">
        {label}
      </span>
      <div className="relative">
        <div className="glass rounded-xl px-4 h-14 flex items-center gap-3 hover:border-white/20 transition-colors">
          <TeamFlag country={team.name} size="sm" />
          <span className="font-display text-lg tracking-wide flex-1">{team.name}</span>
          <span className="font-mono text-xs text-text-muted">#{team.fifaRank}</span>
          <ChevronDown size={16} className="text-text-muted" />
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            aria-label={label}
          >
            {TEAMS.map((t) => (
              <option key={t.id} value={t.id} className="bg-surface">
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </label>
  );
}

export function PredictPage() {
  const { selectedHomeId, selectedAwayId, setSelectedHomeId, setSelectedAwayId } = useApp();
  const { predict, result: apiResult, loading: apiLoading, error: apiError } = usePredict();

  const handlePredict = async () => {
    if (selectedHomeId === selectedAwayId) return;
    await predict(selectedHomeId, selectedAwayId, true);
  };

  const home = teamById(selectedHomeId);
  const away = teamById(selectedAwayId);
  const displayResult = apiResult
    ? {
        home: teamById(selectedHomeId),
        away: teamById(selectedAwayId),
        r: {
          homeProb: apiResult.home_win_prob,
          drawProb: apiResult.draw_prob,
          awayProb: apiResult.away_win_prob,
          score: [apiResult.predicted_home_goals, apiResult.predicted_away_goals] as [
            number,
            number,
          ],
          confidence: apiResult.confidence,
        },
      }
    : null;

  const stats = [
    {
      label: "FIFA Rank",
      h: home.fifaRank,
      a: away.fifaRank,
      lowerIsBetter: true,
      format: (v: number) => `#${v}`,
    },
    {
      label: "ELO Rating",
      h: home.elo,
      a: away.elo,
      lowerIsBetter: false,
      format: (v: number) => v.toString(),
    },
    {
      label: "Goals Scored (L10)",
      h: sumGoals(home.goalsScored),
      a: sumGoals(away.goalsScored),
      lowerIsBetter: false,
      format: (v: number) => v.toString(),
    },
    {
      label: "Goals Conceded (L10)",
      h: sumGoals(home.goalsConceded),
      a: sumGoals(away.goalsConceded),
      lowerIsBetter: true,
      format: (v: number) => v.toString(),
    },
    {
      label: "Squad Value",
      h: home.squadValueM,
      a: away.squadValueM,
      lowerIsBetter: false,
      format: (v: number) => `€${v}M`,
    },
    {
      label: "Avg Age",
      h: home.avgAge,
      a: away.avgAge,
      lowerIsBetter: false,
      format: (v: number) => v.toFixed(1),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-20">
      <PageHeader
        eyebrow="AI Forecast"
        title="MATCH PREDICTION"
        subtitle="Pick two teams. Our model evaluates ELO, form, squad value and sentiment to forecast the outcome."
      />

      <div className="grid lg:grid-cols-[1fr_1.4fr] gap-6">
        {/* SELECTOR */}
        <GlassCard glow="cyan" className="h-fit">
          <h3 className="font-display text-2xl tracking-wide mb-6">Select teams</h3>
          <div className="space-y-5">
            <TeamSelect value={selectedHomeId} onChange={setSelectedHomeId} label="Team A (Home)" />
            <div className="text-center font-display text-sm tracking-[0.4em] text-text-muted">
              VS
            </div>
            <TeamSelect value={selectedAwayId} onChange={setSelectedAwayId} label="Team B (Away)" />
            <NeonButton
              onClick={handlePredict}
              loading={apiLoading}
              variant="primary"
              size="lg"
              className="w-full"
            >
              {apiLoading ? (
                "Computing..."
              ) : (
                <>
                  <Sparkles size={16} /> Predict Match
                </>
              )}
            </NeonButton>
            {selectedHomeId === selectedAwayId && (
              <p className="text-xs text-danger text-center">
                Pick two different teams.
              </p>
            )}
            {apiError && (
              <div className="glass rounded-xl p-4 border border-danger/30 mt-4">
                <p className="text-sm text-danger">{apiError}</p>
                <p className="text-xs text-text-muted mt-1">
                  Backend must be running: cd backend && uvicorn main:app --reload --port 8000
                </p>
              </div>
            )}
          </div>
        </GlassCard>

        {/* RESULTS */}
        <div className="min-h-105">
          <AnimatePresence mode="wait">
            {displayResult && !apiLoading && (
              <motion.div
                key={`${displayResult.home.id}-${displayResult.away.id}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5 }}
              >
                <GlassCard glow="violet">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-neon-cyan">
                        Forecast
                      </p>
                      <h3 className="font-display text-3xl tracking-wide mt-1">
                        Predicted Outcome
                      </h3>
                    </div>
                    <StatBadge
                      tone={
                        displayResult.r.confidence >= 75
                          ? "win"
                          : displayResult.r.confidence >= 60
                            ? "info"
                            : "draw"
                      }
                    >
                      {displayResult.r.confidence >= 75
                        ? "High"
                        : displayResult.r.confidence >= 60
                          ? "Medium"
                          : "Low"}{" "}
                      - {displayResult.r.confidence}%
                    </StatBadge>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-4 mb-8">
                    <div className="text-center">
                      <div className="mb-2 flex justify-center">
                        <TeamFlag country={displayResult.home.name} size="2xl" />
                      </div>
                      <div className="font-display text-xl tracking-wide">{displayResult.home.name}</div>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-2">
                        Predicted score
                      </p>
                      <p className="font-mono text-6xl font-bold neon-text">
                        {displayResult.r.score[0]}
                        <span className="text-text-muted mx-2">-</span>
                        {displayResult.r.score[1]}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="mb-2 flex justify-center">
                        <TeamFlag country={displayResult.away.name} size="2xl" />
                      </div>
                      <div className="font-display text-xl tracking-wide">{displayResult.away.name}</div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <ProbabilityBar
                      label={`${displayResult.home.name} win`}
                      value={displayResult.r.homeProb}
                      color="cyan"
                    />
                    <ProbabilityBar label="Draw" value={displayResult.r.drawProb} color="muted" />
                    <ProbabilityBar
                      label={`${displayResult.away.name} win`}
                      value={displayResult.r.awayProb}
                      color="violet"
                    />
                  </div>

                  <div className="border-t border-white/5 pt-5">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-neon-cyan mb-3">
                      Key match insights
                    </p>
                    <ul className="space-y-2">
                      {apiResult?.key_factors.map((factor, i) => (
                        <li key={i} className="flex gap-3 text-sm text-text-muted">
                          <span className="text-neon-cyan font-mono">▸</span>
                          <span>{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </GlassCard>
              </motion.div>
            )}
            {apiLoading && (
              <div className="h-full min-h-105 flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-block h-12 w-12 rounded-full border-4 border-neon-cyan/30 border-t-neon-cyan animate-spin" />
                  <p className="mt-4 text-sm font-mono uppercase tracking-widest text-text-muted">
                    Computing forecast...
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* COMPARISON TABLE */}
      <section className="mt-12">
        <GlassCard>
          <h3 className="font-display text-2xl tracking-wide mb-5">Team Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] font-mono uppercase tracking-widest text-text-muted border-b border-white/5">
                  <th className="pb-3 text-center">
                    <span className="inline-flex items-center justify-center gap-2">
                      <TeamFlag country={home.name} size="sm" /> {home.name}
                    </span>
                  </th>
                  <th className="pb-3 text-center">Metric</th>
                  <th className="pb-3 text-center">
                    <span className="inline-flex items-center justify-center gap-2">
                      <TeamFlag country={away.name} size="sm" /> {away.name}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.map((s) => {
                  const hWins = s.lowerIsBetter ? s.h < s.a : s.h > s.a;
                  const aWins = s.lowerIsBetter ? s.a < s.h : s.a > s.h;
                  return (
                    <tr key={s.label} className="border-b border-white/5 last:border-0">
                      <td
                        className={`py-3 text-center font-mono font-semibold ${hWins ? "text-neon-cyan" : "text-text-muted"}`}
                      >
                        {s.format(s.h)}
                      </td>
                      <td className="py-3 text-center text-xs uppercase tracking-widest text-text-muted">
                        {s.label}
                      </td>
                      <td
                        className={`py-3 text-center font-mono font-semibold ${aWins ? "text-neon-violet" : "text-text-muted"}`}
                      >
                        {s.format(s.a)}
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <td className="py-3 text-center">
                    <div className="inline-block">
                      <FormBadges form={home.form} />
                    </div>
                  </td>
                  <td className="py-3 text-center text-xs uppercase tracking-widest text-text-muted">
                    Form (L5)
                  </td>
                  <td className="py-3 text-center">
                    <div className="inline-block">
                      <FormBadges form={away.form} />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Sentiment strip */}
          <div className="mt-6 pt-6 border-t border-white/5">
            <div className="flex items-center gap-2 mb-3">
              <span className="relative inline-block w-2 h-2 rounded-full bg-neon-cyan">
                <span className="absolute inset-0 rounded-full bg-neon-cyan animate-ping" />
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-neon-cyan">
                Fan Sentiment
              </span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">😍</span>
                <div className="flex-1">
                  <ProbabilityBar label={home.name} value={home.sentiment.positive} color="cyan" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔥</span>
                <div className="flex-1">
                  <ProbabilityBar
                    label={away.name}
                    value={away.sentiment.positive}
                    color="violet"
                  />
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}
