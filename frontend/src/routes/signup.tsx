import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "../components/pages/AuthPage";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Register - FootyVerse" },
      { name: "description", content: "Create your FootyVerse account." },
    ],
  }),
  component: Signup,
});

function Signup() {
  return <AuthPage mode="signup" />;
}
