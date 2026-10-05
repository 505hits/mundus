"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    setError("");
    setSent(false);
    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (resetError) {
        setError("E-mail na obnovu hesla sa nepodarilo odoslať. Skúste to prosím znova.");
        return;
      }
      setSent(true);
    } catch {
      setError("Obnova hesla je momentálne nedostupná. Skúste to prosím znova.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAFAF9] px-6 py-12 text-[#2F3AA2]">
      <div className="w-full max-w-md rounded-3xl border border-black/5 bg-white p-7 shadow-sm sm:p-9">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">
          Mundus portál
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Obnova hesla
        </h1>

        <p className="mt-3 leading-7 text-gray-500">
          Zadajte e-mail, ktorý používate na prihlásenie. Pošleme vám odkaz na nastavenie nového hesla.
        </p>

        {sent ? (
          <div role="status" aria-live="polite" className="mt-7 rounded-2xl bg-[#eef3ef] p-5">
            <p className="font-semibold">Skontrolujte si e-mail</p>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Ak je tento e-mail priradený k účtu Mundus, dostanete odkaz na obnovu hesla.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-7">
            <label className="block text-sm font-medium text-gray-700">
              E-mailová adresa
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
                placeholder="meno@email.com"
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 outline-none focus:border-[#2F3AA2]"
              />
            </label>

            {error && (
              <p role="alert" className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-5 w-full rounded-2xl bg-[#2F3AA2] px-5 py-3.5 font-semibold text-white disabled:opacity-60"
            >
              {loading ? "Odosielam..." : "Poslať odkaz na obnovu"}
            </button>
          </form>
        )}

        <Link
          href="/login"
          className="mt-6 inline-flex text-sm font-medium text-[#2F3AA2] hover:underline"
        >
          ← Späť na prihlásenie
        </Link>
      </div>
    </main>
  );
}
