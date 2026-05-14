# MatchMind AI — World Cup Prediction Platform

A premium, dark-mode, neon-glass sports analytics frontend with 5 fully-populated pages, mock data, Recharts visualizations, and rich Framer Motion animation. Portfolio-grade polish, fully responsive.

## Design system

Colors (CSS variables in `src/styles.css`):
- bg `#050810`, surface `#0d1424`, primary cyan `#00f0ff`, violet `#7b2fff`, gold `#ffd700`
- text `#f0f4ff`, muted `#6b7fa3`, success `#00e676`, danger `#ff3d57`

Typography (Google Fonts):
- Display: **Bebas Neue** / Barlow Condensed
- Body: **DM Sans**
- Numeric/stats: **JetBrains Mono**

Visual language:
- Glassmorphism cards: `backdrop-blur-md bg-white/5 border border-white/10`
- Neon gradient text on key headings (cyan → violet)
- Subtle SVG grid overlay + animated blob/particle background on hero
- Box-shadow neon glows on hover (300ms ease)
- Dark mode only

## Pages & routes (TanStack Router, file-based)

```text
src/routes/
  __root.tsx          → Navbar + Outlet + Footer + page transitions
  index.tsx           → Home (/)
  predict.tsx         → Match Prediction (/predict)
  tournament.tsx      → Tournament Simulator (/tournament)
  teams.tsx           → Teams Explorer (/teams)
  analytics.tsx       → Analytics Dashboard (/analytics)
```

Each route sets its own `head()` metadata (title + description + OG).

### Home `/`
Sticky glass navbar (logo + nav + "Get Started" CTA, mobile drawer) → Hero (full-vh, animated blob/particle bg, gradient headline "PREDICT THE BEAUTIFUL GAME", dual CTAs, floating mock prediction card) → Trending Predictions horizontal scroll of MatchCards → Top Teams 3-col grid → Tournament Insights gradient strip with count-up stats → 4-counter stats bar → Footer.

### Predict `/predict`
Two-panel: left team selector (two dropdowns w/ flag, Predict button w/ loading state); right results panel (animated entrance, three probability bars Team A / Draw / Team B, large mono scoreline "2 — 1", confidence badge, 3 key insights). Below: side-by-side comparison table (FIFA Rank, ELO, GF/GA last 10, form, squad value) with winning row highlighted. Fan Sentiment strip with two emoji bars + pulse dot.

### Tournament `/tournament`
Header with Run / Reset buttons + simulation count slider (1k/10k/100k). 8 group cards (A–H) with mini standings, top 2 highlighted green. Knockout bracket: R16 → QF → SF → Final → Champion, SVG connector lines, staggered Framer Motion reveal per round. Champion card with glowing gold border + confetti burst. Championship probability horizontal BarChart (top 8, violet→cyan gradient).

### Teams `/teams`
Search input + confederation filter + Top 10/20/All toggle. Responsive grid of TeamCards. Click opens a Team Detail dialog (modal) with: large flag header, stat row, last-10 form bar sequence, goals trend LineChart, sentiment donut PieChart, 3–5 key player cards.

### Analytics `/analytics`
Sidebar (confederation + metric filters) + dashboard grid:
- RadarChart comparing two selected teams over 6 metrics (neon fills)
- Top Attacking Teams horizontal BarChart
- Defensive Strength BarChart
- Prediction Accuracy LineChart with gradient area
- Sentiment heatmap table (color-coded cells)
- Regional dominance stat cards (avg ELO per confederation)

## Shared components

```text
src/components/
  ui/         GlassCard, NeonButton, StatBadge, ProbabilityBar,
              SectionTitle, PageHeader, LoadingSpinner, CountUp
  cards/      MatchCard, TeamCard, GroupCard, PlayerCard
  charts/     ProbabilityBarChart, RadarCompare, FormTrend,
              SentimentDonut, AccuracyTrend
  layout/     Navbar, Footer, MobileDrawer, ParticleBackground, GridOverlay
  pages/      HomePage, PredictPage, TournamentPage, TeamsPage, AnalyticsPage
```

## Mock data (`src/data/mockData.ts`)

- 32 World Cup teams: name, flag emoji, confederation, FIFA rank, ELO, form (last 10 W/D/L), goals scored/conceded last 10, squad value, sentiment {pos/neu/neg}, key players
- Sample trending predictions (6)
- Pre-built tournament structure: 8 groups + bracket scaffold
- Accuracy-trend time series

## State

- React `useState` per page; one `AppContext` (`src/store/appContext.tsx`) for cross-page selections (e.g. last predicted matchup, simulation results)
- Custom hooks: `useCountUp` (viewport-triggered), `useSimulation` (deterministic mock simulator producing groups + bracket + probabilities from team ELO + randomness seeded by sim count)

## Animations (Framer Motion)

- Route transitions: `AnimatePresence` fade+slide in `__root.tsx`
- Cards: `whileHover={{ scale: 1.02, y: -4 }}` + neon shadow
- Probability bars: width 0 → final on mount
- Stats counters: count-up on viewport entry (IntersectionObserver)
- Tournament bracket: `staggerChildren` per round
- Champion card: scale + glow pulse loop + confetti

## Responsive

Mobile-first. Navbar → hamburger drawer. All grids collapse to 1 col. Charts use `ResponsiveContainer`; wide tables get horizontal scroll. Tap targets ≥ 44px.

## Technical notes

- **Routing**: TanStack Router file-based (this template's stack). Same URLs as spec. `<Link to="/predict">` etc.
- **Tailwind v4**: design tokens declared in `src/styles.css` via `@theme inline` mapping to CSS vars; no `tailwind.config.js`.
- **Fonts**: imported via `<link>` in `__root.tsx` head + registered as Tailwind theme font families (`font-display`, `font-body`, `font-mono`).
- **Dependencies to add**: `framer-motion`, `recharts`, `lucide-react` (already likely present), `canvas-confetti` (champion celebration).
- **Charts**: Recharts with custom dark theme + neon gradients via `<defs><linearGradient>`.
- **Particle bg**: lightweight CSS keyframe blobs + SVG grid overlay (no heavy canvas lib needed; keeps SSR safe).
- **No backend / no auth / no DB** — pure frontend with mock data, as specified.

## Quality checklist (verified before done)

- Every page populated with mock data — no empty states
- All charts render on load
- Hover states on every interactive element
- Consistent neon glow shadows + glass styling
- No layout shift; responsive at 375 / 768 / 1280+
- Per-route SEO metadata
