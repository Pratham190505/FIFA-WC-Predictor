import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "../components/pages/HomePage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FootyVerse" },
      { name: "description", content: "FootyVerse football intelligence dashboard." },
      { property: "og:title", content: "FootyVerse" },
      { property: "og:description", content: "FootyVerse football intelligence dashboard." },
    ],
  }),
  component: Index,
});

function Index() {
  return <HomePage />;
}
