"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { preparePasswordRecovery } from "@/lib/password-recovery";
import { validPassword } from "@/lib/account-policy";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { useLanguage } from "@/context/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

export default function ResetPasswordPage() {
  const { language } = useLanguage();
  const sk = language === "sk";
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
      if (!cancelled) setLinkError(sk ? "Odkaz nie je platný alebo vypršal. Požiadajte o nový odkaz na obnovu hesla." : "This link is invalid or expired. Request a new password reset link.");
    });
    return () => { cancelled = true; };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading || !ready) return;

    setError("");
    setSaved(false);

    if (!validPassword(password)) {
      setError(sk ? "Nové heslo musí mať 10 až 128 znakov." : "Your new password must be 10 to 128 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError(sk ? "Heslá sa nezhodujú." : "Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError(sk ? "Heslo sa nepodarilo zmeniť. Otvorte odkaz z e-mailu znova alebo požiadajte o nový." : "We could not change the password. Reopen the email link or request a new one.");
        return;
      }
      setSaved(true);
    } catch {
      setError(sk ? "Heslo sa nepodarilo uložiť. Skúste to prosím znova." : "We could not save the password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#FAFAF9] px-6 py-12 text-[#2F3AA2]">
      <div className="absolute right-5 top-5"><LanguageToggle /></div>
      <div className="w-full max-w-md rounded-3xl border border-black/5 bg-white p-7 shadow-sm sm:p-9">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">
          {sk ? "Mundus portál" : "Mundus portal"}
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          {sk ? "Nastaviť nové heslo" : "Set a new password"}
        </h1>

        {linkError ? (
          <div className="mt-7"><p role="alert" className="text-sm text-red-700">{linkError}</p><Link href="/forgot-password" className="mt-4 inline-block font-semibold underline">{sk ? "Poslať nový odkaz" : "Send a new link"}</Link></div>
        ) : !ready ? (
          <p role="status" className="mt-7 text-sm text-gray-500">{sk ? "Overujem odkaz…" : "Verifying link…"}</p>
        ) : saved ? (
          <>
            <div role="status" aria-live="polite" className="mt-7 rounded-2xl bg-[#eef3ef] p-5">
              <p className="font-semibold">{sk ? "Heslo bolo zmenené" : "Password changed"}</p>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                {sk ? "Teraz sa môžete prihlásiť pomocou nového hesla." : "You can now sign in with your new password."}
              </p>
            </div>

            <Link
              href="/login"
              className="mt-6 inline-flex w-full justify-center rounded-2xl bg-[#2F3AA2] px-5 py-3.5 font-semibold text-white"
            >
              {sk ? "Prejsť na prihlásenie" : "Go to sign in"}
            </Link>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <label className="block text-sm font-medium text-gray-700">
              {sk ? "Nové heslo" : "New password"}
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
              {sk ? "Zopakujte nové heslo" : "Repeat new password"}
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
              {loading ? (sk ? "Ukladám..." : "Saving...") : (sk ? "Uložiť nové heslo" : "Save new password")}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
