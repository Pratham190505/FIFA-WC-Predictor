import { createFileRoute } from "@tanstack/react-router";
import { PredictPage } from "../components/pages/PredictPage";

export const Route = createFileRoute("/predict")({
  head: () => ({
    meta: [
      { title: "Match Predictor — MatchMind AI" },
      { name: "description", content: "Head-to-head AI win probability, sentiment and stats for any World Cup matchup." },
      { property: "og:title", content: "Match Predictor — MatchMind AI" },
      { property: "og:description", content: "Live H2H AI predictions for the World Cup." },
    ],
  }),
  component: PredictPage,
});