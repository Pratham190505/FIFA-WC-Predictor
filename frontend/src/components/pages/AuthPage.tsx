import { FormEvent, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, LockKeyhole, LogIn, UserPlus } from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { authAPI } from "../../lib/api";
import { useAuth } from "../../store/appContext";

type AuthMode = "login" | "signup";

const specialCharacters = "!@#$%^&*()-_=+[]{}|;:,.<>?/";
const isValidPassword = (value: string) =>
  value.length >= 8 && [...value].some((char) => specialCharacters.includes(char));

function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error && "response" in error) {
    const response = (error as { response?: { data?: { detail?: unknown } } }).response;
    const detail = response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg;
  }
  return "Something went wrong. Please try again.";
}

export function AuthPage({ mode }: { mode: AuthMode }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const isSignup = mode === "signup";
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

  const passwordIsValid = useMemo(() => isValidPassword(password), [password]);
  const canSubmit = email.trim() && passwordIsValid && (!isSignup || username.trim().length >= 3);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!passwordIsValid) {
      setError("Password must be at least 8 characters and include one special character.");
      return;
    }

    setSubmitting(true);
    try {
      if (isSignup) {
        await authAPI.register({
          username: username.trim(),
          email: email.trim(),
          password,
        });
        setMessage("Account created. Please log in to continue.");
        setPassword("");
        await navigate({ to: "/login" });
      } else {
        await login(email.trim(), password);
        await navigate({ to: "/" });
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050810] px-4 py-8 text-text-primary">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center">
        <section className="grid w-full overflow-hidden rounded-lg border border-white/10 bg-[#07111e]/95 shadow-2xl shadow-black/40 md:grid-cols-[1fr_0.92fr]">
          <div className="flex min-h-130 items-center justify-center bg-[#e8e5da] p-8 sm:p-10">
            <img
              src="/footyverse-logo.png"
              alt="FootyVerse"
              className="h-auto w-full max-w-90"
            />
          </div>

          <div className="flex items-center p-6 sm:p-10">
            <form onSubmit={handleSubmit} className="w-full space-y-5">
              <div>
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/10 bg-white/5 text-neon-cyan">
                  {isSignup ? <UserPlus size={20} /> : <LogIn size={20} />}
                </div>
                <h1 className="font-display text-4xl tracking-normal text-white">
                  {isSignup ? "Create account" : "Welcome back"}
                </h1>
                <p className="mt-2 text-sm text-text-muted">
                  {isSignup
                    ? "Register first, then log in to enter FootyVerse."
                    : "Log in with the account you registered."}
                </p>
              </div>

              {message && <p className="rounded-md border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">{message}</p>}
              {error && <p className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>}

              {isSignup && (
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="footyfan" minLength={3} required />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="At least 8 characters and one special character"
                    className="px-9"
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-white/10 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className={password && !passwordIsValid ? "text-xs text-danger" : "text-xs text-text-muted"}>
                  Must be at least 8 characters and include one special character.
                </p>
              </div>

              <Button type="submit" disabled={!canSubmit || isSubmitting} className="h-11 w-full bg-[#f7a70c] font-semibold text-[#04121a] hover:bg-[#ffb321]">
                {isSubmitting ? "Please wait..." : isSignup ? "Register" : "Log in"}
              </Button>

              <p className="text-center text-sm text-text-muted">
                {isSignup ? "Already registered?" : "Need an account?"}{" "}
                <Link to={isSignup ? "/login" : "/signup"} className="font-semibold text-neon-cyan hover:text-white">
                  {isSignup ? "Log in" : "Register"}
                </Link>
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
