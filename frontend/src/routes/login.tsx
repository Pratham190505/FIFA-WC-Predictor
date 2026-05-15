import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "../components/pages/AuthPage";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login - FootyVerse" },
      { name: "description", content: "Log in to your FootyVerse account." },
    ],
  }),
  component: Login,
});

function Login() {
  return <AuthPage mode="login" />;
}
