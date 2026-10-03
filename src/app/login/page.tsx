"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { canAcceptTeacherInvitation, hasCompletedOnboarding, portalDestination } from "@/lib/account-policy";
import { purchaseReturnPath } from "@/lib/purchase-intent";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [nextPath, setNextPath] = useState<string | null>(null);

  useEffect(() => {
    setNextPath(purchaseReturnPath(new URLSearchParams(window.location.search).get("next")));
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;
    setError("");
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
      setError("Prihlásenie je momentálne nedostupné. Prosím, kontaktujte nás.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error || !data.user) {
        setError("Nesprávny e-mail alebo heslo. Skontrolujte údaje a overenie e-mailu.");
        return;
      }
      if (!data.user.email_confirmed_at) {
        setError("Najprv potvrďte svoju e-mailovú adresu cez odkaz v e-maile.");
        return;
      }
      const { data: profile, error: profileError } = await supabase
        .from("profiles").select("role, status").eq("id", data.user.id).single();
      if (profileError || !profile) {
        setError("Nepodarilo sa načítať váš Mundus profil. Skúste to prosím znova.");
        return;
      }
      if (profile.role === "teacher" && profile.status === "pending" && !canAcceptTeacherInvitation(data.user.app_metadata)) {
        window.location.href = "/pending-approval";
        return;
      }
      const destination = portalDestination(profile.role, profile.status);
      if (destination === "/auth/error") {
        setError("Váš účet zatiaľ nie je aktívny. Kontaktujte Mundus Languages.");
        return;
      }
      const desired = purchaseReturnPath(new URLSearchParams(window.location.search).get("next"));
      let needsOnboarding = false;
      if (profile.role === "student" && data.user.user_metadata.signup_source === "self_service") {
        const { data: onboarding, error: onboardingError } = await supabase
          .from("student_onboarding").select("completed_at").eq("student_id", data.user.id).maybeSingle();
        if (onboardingError) {
          setError("Nepodarilo sa overiť nastavenie účtu. Skúste to znova alebo kontaktujte Mundus.");
          return;
        }
        needsOnboarding = !hasCompletedOnboarding(onboarding);
      }
      window.location.href = needsOnboarding
        ? `/onboarding${desired ? `?next=${encodeURIComponent(desired)}` : ""}`
        : profile.role === "student" && desired ? desired : destination;
    } catch {
      setError("Prihlásenie je momentálne nedostupné. Skúste to znova.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="min-h-screen bg-[#FAFAF9] flex">
      <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#0a0a0f] p-12 flex-col justify-between">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#2F3AA2]/50 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#6575ff]/20 blur-3xl" />

        <Link href="/" className="relative z-10">
          <Image
            src="/logo-removebg-preview.png"
            alt="Mundus Languages"
            width={180}
            height={70}
            className="h-auto w-[170px]"
            priority
          />
        </Link>

        <div className="relative z-10 max-w-lg">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-[#b7c0ff]">
            Vzdelávací portál Mundus
          </p>

          <h1 className="text-5xl font-semibold leading-tight text-white" style={{ color: "#ffffff" }}>
            Vaše jazykové napredovanie,
            <br />
            všetko na jednom mieste.
          </h1>

          <p className="mt-6 max-w-md text-lg leading-8 text-white/70">
            Majte prehľad o svojich hodinách, materiáloch a pokroku v Mundus.
          </p>
        </div>

        <p className="relative z-10 text-sm text-white/40">
          © 2026 Mundus Languages
        </p>
      </section>

      <section className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 shadow-xl shadow-indigo-100/30 sm:p-9">
          <div className="mb-10 lg:hidden">
            <Link href="/">
              <Image
                src="/logo-removebg-preview.png"
                alt="Mundus Languages"
                width={160}
                height={60}
                className="h-auto w-[150px]"
                priority
              />
            </Link>
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">
            Vzdelávací portál
          </p>

          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-[#2F3AA2]">
            Vitajte späť
          </h2>

          <p className="mt-3 text-base leading-7 text-gray-500">
            Prihláste sa a majte prehľad o svojich hodinách, materiáloch a pokroku.
          </p>

          <form onSubmit={handleLogin} aria-busy={loading} className="mt-9 space-y-5">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">
                E-mailová adresa
              </span>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="meno@email.com"
                required
                autoComplete="email"
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-gray-800 shadow-sm outline-none focus:border-[#2F3AA2] focus:ring-4 focus:ring-[#2F3AA2]/10"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">
                Heslo
              </span>

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                id="login-password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-gray-800 shadow-sm outline-none focus:border-[#2F3AA2] focus:ring-4 focus:ring-[#2F3AA2]/10"
              />
            </label>

            <div className="-mt-2 flex items-center justify-between gap-4">
              <button type="button" aria-controls="login-password" aria-pressed={showPassword} onClick={() => setShowPassword(value => !value)} className="text-sm font-medium text-[#2F3AA2] hover:underline">{showPassword ? "Skryť heslo" : "Zobraziť heslo"}</button>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-[#2F3AA2] hover:underline"
              >
                Zabudli ste heslo?
              </Link>
            </div>

            {error && (
              <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#2F3AA2] px-5 py-4 font-semibold text-white transition hover:bg-[#252E82] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Prihlasujem..." : "Prihlásiť sa"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Ešte nemáte účet? <Link href={nextPath ? `/signup?next=${encodeURIComponent(nextPath)}` : "/signup"} className="font-semibold text-[#2F3AA2] underline">Vytvoriť študentský účet</Link>
          </p>
          <p className="mt-3 text-center text-xs text-gray-500">Lektorský účet získate cez e-mailovú pozvánku od Mundus.</p>

          <p className="mt-8 text-center text-sm text-gray-400">
            Potrebujete pomoc? <Link href="/contact" className="font-medium text-[#2F3AA2] underline">Kontaktujte Mundus Languages.</Link>
          </p>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm font-medium text-[#2F3AA2] hover:underline"
            >
              ← Späť na Mundus Languages
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
