"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Check, CreditCard, ShieldCheck, Sparkles, LockKeyhole } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { firstPackageAmountCents, PACKAGE_PRICES, type PackageDuration } from "@/lib/package-catalog";
import { MUNDUS_LANGUAGE_OPTIONS, MUNDUS_LANGUAGE_VALUES } from "@/lib/language-offer";
import { trackEvent } from "@/components/AnalyticsManager";

export default function PurchasePackages({ paymentsAvailable }: { paymentsAvailable: boolean }) {
  const { language, t } = useLanguage();
  const sk = language === "sk";
  const prefix = `/${language}`;
  const searchParams = useSearchParams();
  const queryLanguage = searchParams.get("language");
  const validQueryLanguage = queryLanguage && MUNDUS_LANGUAGE_VALUES.includes(queryLanguage as (typeof MUNDUS_LANGUAGE_VALUES)[number]) ? queryLanguage : "";
  const [selectedLanguageOverride, setSelectedLanguageOverride] = useState<string | null>(null);
  const selectedLanguage = selectedLanguageOverride ?? validQueryLanguage;
  const [durationMinutes, setDurationMinutes] = useState<PackageDuration>(60);
  const languageSelectRef = useRef<HTMLSelectElement>(null);
  const packageGridRef = useRef<HTMLDivElement>(null);
  const [showLanguagePrompt, setShowLanguagePrompt] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(10);

  const focusLanguageSelect = () => {
    setShowLanguagePrompt(true);
    languageSelectRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => languageSelectRef.current?.focus(), 350);
  };

  const money = (cents: number) => new Intl.NumberFormat(sk ? "sk-SK" : "en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(cents / 100);

  const benefits = sk
    ? ["Individuálne 1:1 hodiny", `${durationMinutes} minút s lektorom`, "Flexibilné termíny", "Pokrok a materiály v portáli"]
    : ["Individual 1:1 lessons", `${durationMinutes} minutes with your teacher`, "Flexible scheduling", "Progress and materials in your portal"];

  const packages = PACKAGE_PRICES.filter(item => item.durationMinutes === durationMinutes);
  const activePackage = packages.find(item => item.lessons === selectedPackage) ?? packages[0];
  const activeHref = activePackage && selectedLanguage ? `${prefix}/payment?selected=${activePackage.lessons}&duration=${durationMinutes}&language=${encodeURIComponent(selectedLanguage)}` : null;

  return (
    <div id="buy-packages" className="mb-8 scroll-mt-32">
      <div className="mb-6 rounded-[1.5rem] border sm:mb-8 sm:rounded-[1.75rem] border-[#C7CDF6] bg-gradient-to-br from-white to-[#F2F4FF] p-5 shadow-[0_18px_44px_rgba(47,58,162,0.08)] sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#2F3AA2]">{sk ? "Krok 1 z 2" : "Step 1 of 2"}</p>
            <h3 className="mt-2 text-2xl font-semibold text-[#171A2B]">{sk ? "Vyberte si jazyk" : "Choose your language"}</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">{sk ? "Jazyk si vyberiete ešte pred balíčkom. Po platbe doplníte úroveň, cieľ a termíny." : "Choose your language before the package. After payment, add your level, goal and availability."}</p>
          </div>
          <label className="block text-sm font-semibold text-[#171A2B]">
            {sk ? "Jazyk výučby" : "Lesson language"}
            <select ref={languageSelectRef} value={selectedLanguage} onChange={event => { const value=event.target.value; setSelectedLanguageOverride(value); setShowLanguagePrompt(false); if(value){ trackEvent("select_language",{language:value,placement:"pricing_selector"}); window.setTimeout(()=>packageGridRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),120); } }} className={`mt-2 w-full rounded-2xl border bg-white px-4 py-3.5 text-base font-medium outline-none transition focus:border-[#2F3AA2] focus:ring-4 focus:ring-[#2F3AA2]/10 ${showLanguagePrompt ? "border-[#2F3AA2] ring-4 ring-[#2F3AA2]/10" : "border-[#DDE2FB]"}`}>
              <option value="">{sk ? "Vyberte jazyk" : "Choose a language"}</option>
              {MUNDUS_LANGUAGE_OPTIONS.map(item => <option key={item.value} value={item.value}>{sk ? item.label : item.value}</option>)}
            </select>
            {showLanguagePrompt && <span className="mt-2 block text-sm font-semibold text-[#2F3AA2]">{sk ? "Najprv si vyberte jazyk a potom môžete pokračovať k platbe." : "Choose a language first, then continue to payment."}</span>}
          </label>
        </div>
      </div>
      <div className="mb-6 grid gap-4 sm:mb-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#2F3AA2]">
            {sk ? "Krok 2 z 2 · Individuálne online hodiny" : "Step 2 of 2 · Individual online lessons"}
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
                onClick={() => { setDurationMinutes(duration); trackEvent("select_lesson_duration",{duration_minutes:duration}); }}
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

      <div className="mb-6 hidden gap-3 sm:grid sm:grid-cols-2 lg:mb-8 lg:grid-cols-4">
        {benefits.map((benefit) => (
          <div key={benefit} className="flex items-center gap-2 rounded-2xl border border-[#E7E9F2] bg-white px-4 py-3 text-sm font-medium text-gray-700">
            <Check size={16} className="shrink-0 text-[#2F3AA2]" />
            {benefit}
          </div>
        ))}
      </div>

      <div ref={packageGridRef} className="scroll-mt-24 grid gap-3 sm:scroll-mt-32 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5">
        {packages.map(({ lessons, amountCents, durationMinutes }) => {
          const firstPackageCents = firstPackageAmountCents(amountCents);
          const perLesson = amountCents / lessons;
          const isRecommended = lessons === 10;
          const isSelected = selectedPackage === lessons;

          return (
            <article
              key={`${durationMinutes}-${lessons}`}
              className={`relative flex min-h-0 flex-col rounded-[1.35rem] border p-4 sm:min-h-[375px] sm:rounded-3xl sm:p-5 transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(47,58,162,0.10)] sm:p-6 ${
                isSelected
                  ? "border-[#2F3AA2] ring-2 ring-[#2F3AA2]/20 bg-[#F7F7FF] shadow-[0_16px_38px_rgba(47,58,162,0.10)]"
                  : "border-[#E5E7F0] bg-white shadow-[0_10px_28px_rgba(23,26,43,0.035)]"
              }`}
            >
              {isRecommended ? (
                <span className="mb-2 self-start rounded-full bg-[#2F3AA2] sm:mb-4 px-3 py-1 text-xs font-semibold text-white">
                  {sk ? "Odporúčame" : "Recommended"}
                </span>
              ) : (
                <div className="mb-1 h-3 sm:mb-4 sm:h-6" aria-hidden="true" />
              )}

              <h4 className="text-xl font-semibold text-[#171A2B]">{lessons} × {durationMinutes} min</h4>

              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-gray-400 sm:mt-5">
                {sk ? "Bežná cena" : "Regular price"}
              </p>
              <p className="mt-1 text-[1.75rem] font-semibold tracking-tight text-[#171A2B] sm:text-3xl">{money(amountCents)}</p>
              <p className="mt-1 text-sm text-gray-500">
                {money(perLesson)} {sk ? "/ hodina" : "/ lesson"}
              </p>

              <div className="mt-3 rounded-xl border border-[#DDE2FB] bg-white/80 p-3 sm:mt-5 sm:rounded-2xl sm:p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#2F3AA2]">
                  {sk ? "Prvý balíček −10 %" : "First package −10%"}
                </p>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-[#2F3AA2]">{money(firstPackageCents)}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {sk ? `Automatická úspora ${money(amountCents-firstPackageCents)}.` : `Automatic saving ${money(amountCents-firstPackageCents)}.`}
                </p>
              </div>

              <div className="my-3 flex items-start gap-2 text-xs leading-5 text-gray-600 sm:my-5 sm:text-sm sm:leading-6">
                <ShieldCheck size={17} className="mt-0.5 shrink-0 text-[#2F3AA2]" />
                <span>
                  {sk
                    ? "Zľava iba raz na osobu. Bez predplatného."
                    : "Discount once per person. No subscription."}
                </span>
              </div>

              <button type="button" aria-pressed={isSelected} onClick={() => {setSelectedPackage(lessons);trackEvent("select_package",{language:selectedLanguage || "not_selected",duration_minutes:durationMinutes,lessons,amount_eur:amountCents/100});}} className={`mt-auto flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F3AA2] ${isSelected ? "bg-[#2F3AA2] text-white" : "border border-[#C7CDF6] bg-white text-[#2F3AA2] hover:bg-[#EEF2FF]"}`}>
                {isSelected ? <Check size={17}/> : <ArrowRight size={16}/>}
                {isSelected ? (sk ? "Vybraný balíček" : "Selected package") : (sk ? "Vybrať balíček" : "Select package")}
              </button>
            </article>
          );
        })}
      </div>

      <div className="sticky bottom-[max(.5rem,env(safe-area-inset-bottom))] z-30 mt-5 rounded-2xl border border-[#C7CDF6] bg-white/95 p-3 sm:bottom-3 sm:mt-7 sm:rounded-3xl sm:p-4 shadow-[0_15px_45px_rgba(23,26,43,.15)] backdrop-blur-xl sm:p-5 lg:bottom-5">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#2F3AA2]">{sk ? "Váš výber" : "Your selection"}</p>
            <p className="mt-1 text-sm font-semibold sm:text-base">{selectedLanguage || (sk ? "Vyberte jazyk" : "Choose a language")} · {activePackage.lessons} × {durationMinutes} min</p>
            <p className="mt-1 text-xs text-gray-600 sm:text-sm"><strong className="text-[#2F3AA2]">{money(firstPackageAmountCents(activePackage.amountCents))}</strong> <span className="line-through">{money(activePackage.amountCents)}</span> · {sk ? "prvý oprávnený balíček" : "eligible first package"}</p>
          </div>
          {activeHref ? <Link href={activeHref} className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#2F3AA2] px-6 py-3 font-semibold text-white hover:bg-[#252E82]"><LockKeyhole size={17}/>{sk ? "Pokračovať k platbe" : "Continue to payment"}<ArrowRight size={17}/></Link>
            : <button type="button" onClick={focusLanguageSelect} className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#2F3AA2] px-6 py-3 font-semibold text-white">{sk ? "Vybrať jazyk" : "Choose language"}<ArrowRight size={17}/></button>}
        </div>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-[#DDE2FB] bg-white p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#2F3AA2]">{sk ? "Súkromná skupina" : "Private group"}</p>
          <h4 className="mt-2 text-2xl font-semibold">{sk ? "2–5 osôb" : "2–5 people"}</h4>
          <p className="mt-3 text-sm leading-6 text-gray-600">{sk ? "Chcete sa učiť s priateľmi alebo kolegami? Cena závisí od veľkosti skupiny, dĺžky hodiny, frekvencie a počtu lekcií." : "Want to learn with friends or colleagues? Pricing depends on group size, lesson length, frequency and number of lessons."}</p>
          <Link href={`${prefix}/group-lessons`} className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[#2F3AA2]/20 px-4 py-3 text-sm font-semibold text-[#2F3AA2]">{sk ? "Požiadať o cenu" : "Request group pricing"}<ArrowRight size={16}/></Link>
        </div>
        <div className="rounded-3xl border border-[#DDE2FB] bg-[#F5F6FF] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#2F3AA2]">{sk ? "Pre firmy" : "For companies"}</p>
          <h4 className="mt-2 text-2xl font-semibold">{sk ? "Cena na mieru" : "Custom quote"}</h4>
          <p className="mt-3 text-sm leading-6 text-gray-600">{sk ? "Individuálna aj skupinová výučba pre zamestnancov a firemný portál so základným prehľadom využívania hodín." : "Individual and group employee training plus a company portal with a limited overview of lesson usage."}</p>
          <Link href={`${prefix}/companies`} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#2F3AA2] px-4 py-3 text-sm font-semibold text-white">{sk ? "Požiadať o firemnú ponuku" : "Request company quote"}<ArrowRight size={16}/></Link>
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-3 rounded-2xl border border-[#E7E9F2] bg-[#FAFAF9] p-5 text-sm leading-6 text-gray-600 md:flex-row md:items-center md:justify-between">
        <p className="max-w-3xl">
          {paymentsAvailable
            ? t.pricing.individual.paymentNote
            : t.pricing.individual.offlineNote}{" "}
          {sk ? "Balíčky sa automaticky neobnovujú." : "Packages do not renew automatically."}
        </p>
        <div className="flex shrink-0 flex-col gap-2 md:items-end">
          <span className="inline-flex items-center gap-2 font-medium text-[#2F3AA2]"><CreditCard size={17} />{sk ? "Jednorazová platba v EUR" : "One-time payment in EUR"}</span>
          <Link href={`${prefix}/companies`} className="text-xs font-medium text-gray-500 underline underline-offset-2 hover:text-[#2F3AA2]">{sk ? "Kupujete výučbu pre firmu? Pozrite si firemnú ponuku." : "Buying training for a company? See company options."}</Link>
        </div>
      </div>
    </div>
  );
}
