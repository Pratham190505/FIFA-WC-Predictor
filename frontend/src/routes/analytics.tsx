import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsPage } from "../components/pages/AnalyticsPage";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — MatchMind AI" },
      { name: "description", content: "Deep statistical comparison, regional dominance and model accuracy charts." },
      { property: "og:title", content: "Analytics — MatchMind AI" },
      { property: "og:description", content: "Advanced World Cup analytics dashboard." },
    ],
  }),
  component: AnalyticsPage,
});
