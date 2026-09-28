"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setHeslo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
      setError("Prihlásenie je momentálne nedostupné. Prosím, kontaktujte nás.");
      return;
    }

    const supabase = createSupabaseBrowserClient();
    setLoading(true);

const { data, error } = await supabase.auth.signInWithPassword({
  email,
      password,
    });

    if (error) {
      setError("Nesprávny e-mail alebo heslo. Skontrolujte údaje a skúste to znova.");
      setLoading(false);
      return;
    }

const { data: profile, error: profileError } = await supabase
  .from("profiles")
  .select("role, status")
  .eq("id", data.user.id)
  .single();

if (profileError || !profile) {
  setError("Nepodarilo sa načítať váš Mundus profil. Skúste to prosím znova.");
  setLoading(false);
  return;
}

if (profile.role === "admin" && profile.status === "active") {
  window.location.href = "/admin/dashboard";
  return;
}

if (profile.role === "teacher") {
  if (profile.status === "active") {
    window.location.href = "/teacher/dashboard";
  } else {
    window.location.href = "/pending-approval";
  }
  return;
}

window.location.href = "/dashboard";
}
  return (
    <main className="min-h-screen bg-[#f7f8f5] flex">
      <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#163f3a] p-12 flex-col justify-between">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#d7b56d]/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-white/5 blur-3xl" />

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
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-[#d7b56d]">
            Vzdelávací portál Mundus
          </p>

          <h1 className="text-5xl font-semibold leading-tight text-white">
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
        <div className="w-full max-w-md">
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

          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#8a7445]">
            Vzdelávací portál
          </p>

          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-[#163f3a]">
            Vitajte späť
          </h2>

          <p className="mt-3 text-base leading-7 text-gray-500">
            Prihláste sa a majte prehľad o svojich hodinách, materiáloch a pokroku.
          </p>

          <form onSubmit={handleLogin} className="mt-9 space-y-5">
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
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-gray-800 shadow-sm outline-none focus:border-[#163f3a]"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">
                Password
              </span>

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-gray-800 shadow-sm outline-none focus:border-[#163f3a]"
              />
            </label>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#163f3a] px-5 py-4 font-semibold text-white transition hover:bg-[#12342f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Prihlasujem..." : "Prihlásiť sa"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Potrebujete pomoc? Kontaktujte Mundus Languages.
          </p>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm font-medium text-[#163f3a] hover:underline"
            >
              ← Späť na Mundus Languages
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
