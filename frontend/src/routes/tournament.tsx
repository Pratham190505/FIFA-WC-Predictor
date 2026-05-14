import { createFileRoute } from "@tanstack/react-router";
import { TournamentPage } from "../components/pages/TournamentPage";

export const Route = createFileRoute("/tournament")({
  head: () => ({
    meta: [
      { title: "Tournament Simulator - FootyVerse" },
      { name: "description", content: "Simulate the entire World Cup bracket from R16 to the final with Monte Carlo AI." },
      { property: "og:title", content: "Tournament Simulator - FootyVerse" },
      { property: "og:description", content: "Run thousands of bracket simulations in seconds." },
    ],
  }),
  component: TournamentPage,
});
