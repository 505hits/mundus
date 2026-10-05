"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { preparePasswordRecovery } from "@/lib/password-recovery";
import { validPassword } from "@/lib/account-policy";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [ready, setReady] = useState(false);
  const [linkError, setLinkError] = useState("");
  const preparation = useRef<Promise<void> | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!preparation.current) {
      preparation.current = (async () => {
        try {
          const supabase = createSupabaseBrowserClient();
          await preparePasswordRecovery(supabase.auth, new URL(window.location.href));
        } finally {
          // Remove one-time codes and tokens even when the link is invalid.
          window.history.replaceState(null, "", "/reset-password");
        }
      })();
    }
    void preparation.current.then(() => {
      if (!cancelled) setReady(true);
    }).catch(() => {
      if (!cancelled) setLinkError("Odkaz nie je platný alebo vypršal. Požiadajte o nový odkaz na obnovu hesla.");
    });
    return () => { cancelled = true; };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading || !ready) return;

    setError("");
    setSaved(false);

    if (!validPassword(password)) {
      setError("Nové heslo musí mať 10 až 128 znakov.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Heslá sa nezhodujú.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError("Heslo sa nepodarilo zmeniť. Otvorte odkaz z e-mailu znova alebo požiadajte o nový.");
        return;
      }
      setSaved(true);
    } catch {
      setError("Heslo sa nepodarilo uložiť. Skúste to prosím znova.");
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
          Nastaviť nové heslo
        </h1>

        {linkError ? (
          <div className="mt-7"><p role="alert" className="text-sm text-red-700">{linkError}</p><Link href="/forgot-password" className="mt-4 inline-block font-semibold underline">Poslať nový odkaz</Link></div>
        ) : !ready ? (
          <p role="status" className="mt-7 text-sm text-gray-500">Overujem odkaz…</p>
        ) : saved ? (
          <>
            <div role="status" aria-live="polite" className="mt-7 rounded-2xl bg-[#eef3ef] p-5">
              <p className="font-semibold">Heslo bolo zmenené</p>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Teraz sa môžete prihlásiť pomocou nového hesla.
              </p>
            </div>

            <Link
              href="/login"
              className="mt-6 inline-flex w-full justify-center rounded-2xl bg-[#2F3AA2] px-5 py-3.5 font-semibold text-white"
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
                minLength={10}
                maxLength={128}
                autoComplete="new-password"
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 outline-none focus:border-[#2F3AA2]"
              />
            </label>

            <label className="block text-sm font-medium text-gray-700">
              Zopakujte nové heslo
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                minLength={10}
                maxLength={128}
                autoComplete="new-password"
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 outline-none focus:border-[#2F3AA2]"
              />
            </label>

            {error && (
              <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#2F3AA2] px-5 py-3.5 font-semibold text-white disabled:opacity-60"
            >
              {loading ? "Ukladám..." : "Uložiť nové heslo"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
