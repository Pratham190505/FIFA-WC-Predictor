import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsPage } from "../components/pages/AnalyticsPage";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics - FootyVerse" },
      { name: "description", content: "Deep statistical comparison, regional dominance and model accuracy charts." },
      { property: "og:title", content: "Analytics - FootyVerse" },
      { property: "og:description", content: "Advanced World Cup analytics dashboard." },
    ],
  }),
  component: AnalyticsPage,
});
