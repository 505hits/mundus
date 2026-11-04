"use client";

import Link from "next/link";
import { ArrowRight, Check, CreditCard, ShieldCheck, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { PACKAGE_PRICES } from "@/lib/package-catalog";

export default function PurchasePackages({ paymentsAvailable, signupAvailable }: { paymentsAvailable: boolean; signupAvailable: boolean }) {
  const { language, t } = useLanguage();
  const sk = language === "sk";
  const money = (cents: number) => new Intl.NumberFormat(sk ? "sk-SK" : "en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: cents % 100 ? 2 : 0,
  }).format(cents / 100);

  const benefits = sk
    ? ["Individuálne 1:1 hodiny", "60 minút s lektorom", "Flexibilné termíny", "Pokrok a materiály v portáli"]
    : ["Individual 1:1 lessons", "60 minutes with your teacher", "Flexible scheduling", "Progress and materials in your portal"];

  return (
    <div id="buy-packages" className="mb-8 scroll-mt-32">
      <div className="mb-8 grid gap-5 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#2F3AA2]">
            {sk ? "Individuálne online hodiny" : "Individual online lessons"}
          </p>
          <h3 className="max-w-2xl text-3xl font-semibold tracking-tight text-[#171A2B] md:text-4xl">
            {sk ? "Vyberte si počet hodín. Všetko ostatné prispôsobíme vám." : "Choose your lesson package. We tailor the rest to you."}
          </h3>
          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
            {sk
              ? "Každý balíček obsahuje 60-minútové individuálne online hodiny. Termíny si dohodnete podľa vašej dostupnosti a v portáli vidíte rozvrh, materiály aj zostávajúce hodiny."
              : "Every package includes 60-minute individual online lessons. Arrange times around your availability and use your portal to see your schedule, materials and remaining lessons."}
          </p>
        </div>

        <div className="rounded-2xl border border-[#DDE2FB] bg-[#F5F6FF] p-5">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 shrink-0 text-[#2F3AA2]" size={20} />
            <div>
              <p className="font-semibold text-[#171A2B]">
                {sk ? "Prvý balíček so zľavou 10 %" : "10% off your first package"}
              </p>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                {sk
                  ? "Zľava platí iba raz na osobu. Konečnú cenu automaticky overíme podľa vášho účtu pred platbou."
                  : "The discount applies once per person. Your account is checked automatically before payment to confirm the final price."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((benefit) => (
          <div key={benefit} className="flex items-center gap-2 rounded-2xl border border-[#E7E9F2] bg-white px-4 py-3 text-sm font-medium text-gray-700">
            <Check size={16} className="shrink-0 text-[#2F3AA2]" />
            {benefit}
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {PACKAGE_PRICES.map(({ lessons, amountCents }) => {
          const firstPackageCents = amountCents * 0.9;
          const perLesson = amountCents / lessons;
          const isRecommended = lessons === 10;

          return (
            <article
              key={lessons}
              className={`relative flex min-h-[390px] flex-col rounded-3xl border p-5 transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(47,58,162,0.10)] sm:p-6 ${
                isRecommended
                  ? "border-[#2F3AA2] bg-[#F7F7FF] shadow-[0_16px_38px_rgba(47,58,162,0.10)]"
                  : "border-[#E5E7F0] bg-white shadow-[0_10px_28px_rgba(23,26,43,0.035)]"
              }`}
            >
              {isRecommended ? (
                <span className="mb-4 self-start rounded-full bg-[#2F3AA2] px-3 py-1 text-xs font-semibold text-white">
                  {sk ? "Odporúčame" : "Recommended"}
                </span>
              ) : (
                <div className="mb-4 h-6" aria-hidden="true" />
              )}

              <h4 className="text-xl font-semibold text-[#171A2B]">{lessons} × 60 min</h4>

              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">
                {sk ? "Cena balíčka" : "Package price"}
              </p>
              <p className="mt-1 text-3xl font-semibold tracking-tight text-[#171A2B]">{money(amountCents)}</p>
              <p className="mt-1 text-sm text-gray-500">
                {money(perLesson)} {sk ? "/ hodina" : "/ lesson"}
              </p>

              <div className="mt-5 rounded-2xl border border-[#DDE2FB] bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#2F3AA2]">
                  {sk ? "Ak je to váš prvý balíček" : "If this is your first package"}
                </p>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-[#2F3AA2]">{money(firstPackageCents)}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {sk ? `Ušetríte ${money(amountCents - firstPackageCents)}.` : `You save ${money(amountCents - firstPackageCents)}.`}
                </p>
              </div>

              <div className="my-5 flex items-start gap-2 text-sm leading-6 text-gray-600">
                <ShieldCheck size={17} className="mt-0.5 shrink-0 text-[#2F3AA2]" />
                <span>
                  {sk
                    ? "Bez predplatného. Ďalší balíček si kúpite iba vtedy, keď chcete pokračovať."
                    : "No subscription. Buy another package only when you want to continue."}
                </span>
              </div>

              <Link
                href={
                  paymentsAvailable
                    ? signupAvailable
                      ? `/signup?next=${encodeURIComponent(`/packages?selected=${lessons}`)}`
                      : `/login?next=${encodeURIComponent(`/packages?selected=${lessons}`)}`
                    : "/contact"
                }
                className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-[#2F3AA2] px-3 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#252E82] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2F3AA2]"
              >
                {paymentsAvailable
                  ? signupAvailable
                    ? sk ? "Vybrať a vytvoriť účet" : "Choose & create account"
                    : sk ? "Vybrať a prihlásiť sa" : "Choose & sign in"
                  : t.pricing.individual.contactLabel}
                <ArrowRight size={16} />
              </Link>
            </article>
          );
        })}
      </div>

      <div className="mt-7 flex flex-col gap-3 rounded-2xl border border-[#E7E9F2] bg-[#FAFAF9] p-5 text-sm leading-6 text-gray-600 md:flex-row md:items-center md:justify-between">
        <p className="max-w-3xl">
          {paymentsAvailable
            ? signupAvailable
              ? t.pricing.individual.paymentNote
              : t.pricing.individual.existingAccountNote
            : t.pricing.individual.offlineNote}{" "}
          {sk
            ? "Balíčky sa automaticky neobnovujú."
            : "Packages do not renew automatically."}
        </p>
        <div className="flex shrink-0 flex-col gap-2 md:items-end">
          <span className="inline-flex items-center gap-2 font-medium text-[#2F3AA2]">
            <CreditCard size={17} />
            {sk ? "Jednorazová platba v EUR" : "One-time payment in EUR"}
          </span>
          <Link href="/contact" className="text-xs font-medium text-gray-500 underline underline-offset-2 hover:text-[#2F3AA2]">
            {sk ? "Potrebujete faktúru na firmu? Kontaktujte nás." : "Need a company invoice? Contact us."}
          </Link>
        </div>
      </div>
    </div>
  );
}
