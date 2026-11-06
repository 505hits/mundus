"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, CreditCard, Instagram, ShieldCheck, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { firstPackageAmountCents, PACKAGE_PRICES, type PackageDuration } from "@/lib/package-catalog";

export default function PurchasePackages({ paymentsAvailable, signupAvailable }: { paymentsAvailable: boolean; signupAvailable: boolean }) {
  const { language, t } = useLanguage();
  const sk = language === "sk";
  const [durationMinutes, setDurationMinutes] = useState<PackageDuration>(60);

  const money = (cents: number) => new Intl.NumberFormat(sk ? "sk-SK" : "en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(cents / 100);

  const benefits = sk
    ? ["Individuálne 1:1 hodiny", `${durationMinutes} minút s lektorom`, "Flexibilné termíny", "Pokrok a materiály v portáli"]
    : ["Individual 1:1 lessons", `${durationMinutes} minutes with your teacher`, "Flexible scheduling", "Progress and materials in your portal"];

  const packages = PACKAGE_PRICES.filter(item => item.durationMinutes === durationMinutes);

  return (
    <div id="buy-packages" className="mb-8 scroll-mt-32">
      <div className="mb-8 grid gap-5 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#2F3AA2]">
            {sk ? "Individuálne online hodiny" : "Individual online lessons"}
          </p>
          <h3 className="max-w-2xl text-3xl font-semibold tracking-tight text-[#171A2B] md:text-4xl">
            {sk ? "Vyberte si dĺžku a počet hodín." : "Choose lesson length and package size."}
          </h3>
          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
            {sk
              ? "Vyberte si 45- alebo 60-minútové individuálne hodiny. Termíny si dohodnete podľa vašej dostupnosti a v portáli vidíte rozvrh, materiály aj zostávajúce hodiny."
              : "Choose 45- or 60-minute individual lessons. Arrange times around your availability and use your portal to see your schedule, materials and remaining lessons."}
          </p>

          <div className="mt-5 inline-flex rounded-2xl border border-[#DDE2FB] bg-white p-1">
            {([45,60] as const).map(duration => (
              <button
                key={duration}
                type="button"
                onClick={() => setDurationMinutes(duration)}
                className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${durationMinutes===duration?"bg-[#2F3AA2] text-white":"text-[#2F3AA2] hover:bg-[#F3F5FF]"}`}
              >
                {duration} min
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#DDE2FB] bg-[#F5F6FF] p-5">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 shrink-0 text-[#2F3AA2]" size={20} />
            <div>
              <p className="font-semibold text-[#171A2B]">
                {sk ? "Prvý balíček automaticky −10 %" : "First package automatically −10%"}
              </p>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                {sk
                  ? "Zľava sa vypočíta automaticky a je dostupná iba raz na študenta/osobu. Po prvom zaplatenom zvýhodnenom balíčku sa už ďalšie nákupy účtujú za bežnú cenu."
                  : "The discount is calculated automatically and can be used only once per student/person. After the first paid discounted package, later purchases use the regular price."}
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
        {packages.map(({ lessons, amountCents, durationMinutes }) => {
          const firstPackageCents = firstPackageAmountCents(amountCents);
          const perLesson = amountCents / lessons;
          const isRecommended = lessons === 10;

          return (
            <article
              key={`${durationMinutes}-${lessons}`}
              className={`relative flex min-h-[410px] flex-col rounded-3xl border p-5 transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(47,58,162,0.10)] sm:p-6 ${
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

              <h4 className="text-xl font-semibold text-[#171A2B]">{lessons} × {durationMinutes} min</h4>

              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">
                {sk ? "Bežná cena" : "Regular price"}
              </p>
              <p className="mt-1 text-3xl font-semibold tracking-tight text-[#171A2B]">{money(amountCents)}</p>
              <p className="mt-1 text-sm text-gray-500">
                {money(perLesson)} {sk ? "/ hodina" : "/ lesson"}
              </p>

              <div className="mt-5 rounded-2xl border border-[#DDE2FB] bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#2F3AA2]">
                  {sk ? "Prvý balíček −10 %" : "First package −10%"}
                </p>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-[#2F3AA2]">{money(firstPackageCents)}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {sk ? `Automatická úspora ${money(amountCents-firstPackageCents)}.` : `Automatic saving ${money(amountCents-firstPackageCents)}.`}
                </p>
              </div>

              <div className="my-5 flex items-start gap-2 text-sm leading-6 text-gray-600">
                <ShieldCheck size={17} className="mt-0.5 shrink-0 text-[#2F3AA2]" />
                <span>
                  {sk
                    ? "Zľava iba raz na osobu. Bez predplatného."
                    : "Discount once per person. No subscription."}
                </span>
              </div>

              <div className="mt-auto grid gap-2">
                <Link
                  href={
                    paymentsAvailable
                      ? signupAvailable
                        ? `/signup?next=${encodeURIComponent(`/packages?selected=${lessons}&duration=${durationMinutes}`)}`
                        : `/login?next=${encodeURIComponent(`/packages?selected=${lessons}&duration=${durationMinutes}`)}`
                      : "/contact"
                  }
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#2F3AA2] px-3 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#252E82]"
                >
                  {paymentsAvailable ? (sk ? "Zaplatiť online" : "Pay online") : t.pricing.individual.contactLabel}
                  <ArrowRight size={16} />
                </Link>
                <a href="https://www.instagram.com/mundus.languages/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-xl border border-[#2F3AA2]/20 bg-white px-3 py-3 text-center text-sm font-semibold text-[#2F3AA2] transition hover:bg-indigo-50">
                  <Instagram size={16} />
                  {sk ? "Napísať na Instagram" : "Message on Instagram"}
                </a>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-7 flex flex-col gap-3 rounded-2xl border border-[#E7E9F2] bg-[#FAFAF9] p-5 text-sm leading-6 text-gray-600 md:flex-row md:items-center md:justify-between">
        <p className="max-w-3xl">
          {paymentsAvailable
            ? signupAvailable ? t.pricing.individual.paymentNote : t.pricing.individual.existingAccountNote
            : t.pricing.individual.offlineNote}{" "}
          {sk ? "Balíčky sa automaticky neobnovujú." : "Packages do not renew automatically."}
        </p>
        <div className="flex shrink-0 flex-col gap-2 md:items-end">
          <span className="inline-flex items-center gap-2 font-medium text-[#2F3AA2]"><CreditCard size={17} />{sk ? "Jednorazová platba v EUR" : "One-time payment in EUR"}</span>
          <Link href="/contact" className="text-xs font-medium text-gray-500 underline underline-offset-2 hover:text-[#2F3AA2]">{sk ? "Potrebujete faktúru na firmu? Kontaktujte nás." : "Need a company invoice? Contact us."}</Link>
        </div>
      </div>
    </div>
  );
}
