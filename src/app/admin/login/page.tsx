"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/app/actions/admin";

export default function AdminLogin() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await signIn(
        fd.get("email") as string,
        fd.get("password") as string,
      );
      if (res?.error) {
        setError(res.error);
      } else {
        router.push("/admin");
        router.refresh();
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="font-bold text-3xl text-white">MG</span>
          <span className="text-slate-500 text-lg ml-1">/ Admin</span>
          <p className="text-slate-400 text-sm mt-2">Sign in to manage your portfolio</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-900 rounded-2xl p-6 flex flex-col gap-4 border border-slate-800">
          {error && (
            <p className="text-red-400 text-sm bg-red-950/50 border border-red-800 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Email</label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="admin@example.com"
              className="bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm outline-none focus:border-indigo-500 placeholder:text-slate-600"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Password</label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm outline-none focus:border-indigo-500 placeholder:text-slate-600"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold rounded-lg py-2.5 text-sm transition-colors mt-1"
          >
            {isPending ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-slate-600 text-xs mt-6">
          Muhamad Galih · MIZARIE Portfolio CMS
        </p>
      </div>
    </div>
  );
}
