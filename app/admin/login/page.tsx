"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/src/features/admin/admin-auth-context";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, admin, loading } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && admin) {
    router.replace("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f7fb] px-6 py-12">
      <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Admin Login
          </p>
          <h1 className="font-display text-5xl leading-none tracking-[-0.04em] text-slate-900">
            Welcome back
          </h1>
          <p className="text-sm leading-7 text-slate-600">
            Sign in with your Appwrite admin account to manage the storefront content.
          </p>
        </div>

        <form
          className="mt-8 space-y-5"
          onSubmit={async (event) => {
            event.preventDefault();
            setSubmitting(true);
            setError(null);
            try {
              await login(email, password);
              router.replace("/admin");
            } catch {
              setError("Unable to sign in. Check your credentials and Appwrite CORS settings.");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-12 rounded-2xl border border-slate-300 px-4 text-sm"
              required
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-12 rounded-2xl border border-slate-300 px-4 text-sm"
              required
            />
          </label>

          {error ? (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
