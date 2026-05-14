import { createFileRoute } from "@tanstack/react-router";
import { TeamsPage } from "../components/pages/TeamsPage";

export const Route = createFileRoute("/teams")({
  head: () => ({
    meta: [
      { title: "Teams - FootyVerse" },
      { name: "description", content: "Browse all 32 World Cup teams with form, key players and AI sentiment." },
      { property: "og:title", content: "Teams - FootyVerse" },
      { property: "og:description", content: "Detailed analytics on all 32 World Cup squads." },
    ],
  }),
  component: TeamsPage,
});
