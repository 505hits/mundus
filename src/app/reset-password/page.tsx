"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    setError("");
    setSaved(false);

    if (password.length < 8) {
      setError("Nové heslo musí mať aspoň 8 znakov.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Heslá sa nezhodujú.");
      return;
    }

    setLoading(true);

    const supabase = createSupabaseBrowserClient();
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError("Heslo sa nepodarilo zmeniť. Otvorte odkaz z e-mailu znova alebo požiadajte o nový.");
      setLoading(false);
      return;
    }

    setSaved(true);
    setLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f8f5] px-6 py-12 text-[#163f3a]">
      <div className="w-full max-w-md rounded-3xl border border-black/5 bg-white p-7 shadow-sm sm:p-9">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#8a7445]">
          Mundus portál
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Nastaviť nové heslo
        </h1>

        {saved ? (
          <>
            <div className="mt-7 rounded-2xl bg-[#eef3ef] p-5">
              <p className="font-semibold">Heslo bolo zmenené</p>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Teraz sa môžete prihlásiť pomocou nového hesla.
              </p>
            </div>

            <Link
              href="/login"
              className="mt-6 inline-flex w-full justify-center rounded-2xl bg-[#163f3a] px-5 py-3.5 font-semibold text-white"
            >
              Prejsť na prihlásenie
            </Link>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <label className="block text-sm font-medium text-gray-700">
              Nové heslo
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 outline-none focus:border-[#163f3a]"
              />
            </label>

            <label className="block text-sm font-medium text-gray-700">
              Zopakujte nové heslo
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 outline-none focus:border-[#163f3a]"
              />
            </label>

            {error && (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#163f3a] px-5 py-3.5 font-semibold text-white disabled:opacity-60"
            >
              {loading ? "Ukladám..." : "Uložiť nové heslo"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
