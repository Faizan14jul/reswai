"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm({ ownerEmail }: { ownerEmail: string }) {
  const router = useRouter();
  const [email, setEmail] = useState(ownerEmail);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Login failed.");
      setLoading(false);
      return;
    }

    router.refresh();
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="surface-card w-full max-w-md rounded-[30px] p-6">
      <p className="text-sm uppercase tracking-[0.3em] text-white/45">Owner access</p>
      <h1 className="mt-4 font-[family:var(--font-display)] text-4xl font-semibold text-white">Admin Dashboard</h1>
      <p className="mt-4 text-sm leading-7 text-white/68">
        Sign in with the owner email to view waitlist submissions and traffic overview.
      </p>

      <div className="mt-6 grid gap-4">
        <label className="grid gap-2 text-sm text-white/75">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none transition focus:border-sky-400/60"
          />
        </label>

        <label className="grid gap-2 text-sm text-white/75">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none transition focus:border-sky-400/60"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl bg-gradient-to-r from-violet-500 via-sky-500 to-orange-400 px-5 py-3 text-sm font-semibold text-slate-950 disabled:opacity-70"
        >
          {loading ? "Signing in..." : "Open Admin Panel"}
        </button>
      </div>

      {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
    </form>
  );
}
