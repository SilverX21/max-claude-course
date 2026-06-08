"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function AuthenticatePage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await authClient.signIn.email({ email, password });
        if (error) {
          setError(error.message ?? "Login failed");
          return;
        }
      } else {
        const { error } = await authClient.signUp.email({ email, password, name });
        if (error) {
          setError(error.message ?? "Registration failed");
          return;
        }
      }
      window.location.href = "/dashboard";
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-56px)] items-center justify-center px-4">
      <div className="w-full max-w-sm animate-scale-in">
        {/* Card */}
        <div className="bg-surface border border-border rounded-2xl p-8 shadow-sm">
          <div className="mb-6">
            <div className="w-8 h-0.5 bg-accent rounded-full mb-4" />
            <h1 className="font-serif text-2xl font-semibold text-fg">
              {mode === "login" ? "Welcome back" : "Create account"}
            </h1>
            <p className="text-sm text-muted mt-1">
              {mode === "login" ? "Sign in to your notes" : "Start writing in seconds"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "register" && (
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-md border border-border bg-bg text-fg placeholder:text-muted text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-md border border-border bg-bg text-fg placeholder:text-muted text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-md border border-border bg-bg text-fg placeholder:text-muted text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
            />

            {error ? (
              <p
                role="alert"
                className="text-sm text-danger py-2 px-3 rounded-md bg-danger-surface"
              >
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer w-full py-2.5 mt-1 rounded-md bg-accent text-accent-fg text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-50"
            >
              {loading ? "…" : mode === "login" ? "Log in" : "Sign up"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted mt-4">
          {mode === "login" ? "No account?" : "Have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setError("");
              setMode(mode === "login" ? "register" : "login");
            }}
            className="cursor-pointer text-accent hover:text-accent-hover font-medium transition-colors"
          >
            {mode === "login" ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
}
