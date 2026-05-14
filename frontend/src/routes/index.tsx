import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "../components/pages/HomePage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MatchMind AI — World Cup Predictions" },
      { name: "description", content: "Premium AI-driven World Cup match prediction and tournament simulation platform." },
      { property: "og:title", content: "MatchMind AI — World Cup Predictions" },
      { property: "og:description", content: "AI-driven match predictions, bracket simulation and team analytics." },
    ],
  }),
  component: Index,
});

function Index() {
  return <HomePage />;
}
