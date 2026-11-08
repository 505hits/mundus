"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { ArrowRight, Check, CheckCircle2, CreditCard, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { firstPackageAmountCents, PACKAGE_PRICES, type PackageDuration } from "@/lib/package-catalog";
import { MUNDUS_LANGUAGE_OPTIONS, MUNDUS_LANGUAGE_VALUES } from "@/lib/language-offer";
import { trackEvent } from "@/components/AnalyticsManager";

export default function PurchasePackages({ paymentsAvailable }: { paymentsAvailable: boolean }) {
  const { language } = useLanguage();
  const sk = language === "sk";
  const prefix = `/${language}`;
  const pathname = usePathname();
  const standalonePricing = pathname === "/pricing" || /^\/(sk|en)\/pricing\/?$/.test(pathname);
  const queryLanguage = useSearchParams().get("language") ?? "";
  const validQueryLanguage = MUNDUS_LANGUAGE_VALUES.includes(queryLanguage as (typeof MUNDUS_LANGUAGE_VALUES)[number]) ? queryLanguage : "";
  const [languageOverride, setLanguageOverride] = useState<string | null>(null);
  const selectedLanguage = languageOverride ?? validQueryLanguage;
  const [duration, setDuration] = useState<PackageDuration>(60);
  const [lessons, setLessons] = useState(10);
  const languageRef = useRef<HTMLSelectElement>(null);
  const packagesRef = useRef<HTMLDivElement>(null);
  const [prompt, setPrompt] = useState(false);
  const money = (cents: number) => new Intl.NumberFormat(sk ? "sk-SK" : "en-IE", { style: "currency", currency: "EUR" }).format(cents / 100);
  const packages = useMemo(() => PACKAGE_PRICES.filter(item => item.durationMinutes === duration), [duration]);
  const selected = packages.find(item => item.lessons === lessons) ?? packages[2];
  const firstPrice = firstPackageAmountCents(selected.amountCents);
  const checkout = `${prefix}/payment?selected=${lessons}&duration=${duration}&language=${encodeURIComponent(selectedLanguage)}`;
  const languageName = (sk ? MUNDUS_LANGUAGE_OPTIONS.find(item => item.value === selectedLanguage)?.label : selectedLanguage) || selectedLanguage;

  function focusLanguage() {
    setPrompt(true);
    languageRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    languageRef.current?.focus({ preventScroll: true });
  }

  return <div id="buy-packages" className={`mx-auto max-w-6xl scroll-mt-24 sm:scroll-mt-32 ${standalonePricing ? "pb-24 sm:pb-7" : "pb-7"}`}>
    <div className="relative overflow-hidden rounded-[1.6rem] border border-[#DCE0F3] bg-white p-4 shadow-[0_24px_70px_rgba(23,26,43,.08)] sm:rounded-[2rem] sm:p-7 lg:p-9">
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[#DDE2FF]/70 blur-[70px]" />
      <div className="relative mb-7 flex flex-col gap-3 border-b border-[#E7E8F0] pb-6 sm:mb-9 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.17em] text-[#4652B6]">{sk ? "Jednoduchý výber" : "Made simple"}</p>
          <h3 className="mt-2 max-w-2xl text-[clamp(1.7rem,5vw,2.65rem)] font-semibold leading-[1.12] tracking-[-.045em] text-[#171A2B]">{sk ? "Váš jazykový kurz. Vaše tempo." : "Your language. Your pace."}</h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#565F93]">
          <ShieldCheck size={18}/>{sk ? "Bez predplatného · Platba v EUR" : "No subscription · Pay in EUR"}
        </div>
      </div>

      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(260px,.67fr)] lg:gap-10">
        <div className="min-w-0 space-y-8">
          <section aria-labelledby="language-step">
            <div className="mb-3 flex items-center gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#2F3AA2] text-sm font-bold text-white">01</span><h4 id="language-step" className="text-lg font-semibold">{sk ? "Ktorý jazyk sa chcete učiť?" : "Which language would you like to learn?"}</h4></div>
            <select ref={languageRef} value={selectedLanguage} onChange={e => { setLanguageOverride(e.target.value); setPrompt(false); if(e.target.value) trackEvent("select_language", { language: e.target.value, placement: "guided_pricing" }); }} aria-invalid={prompt && !selectedLanguage} className="min-h-14 w-full rounded-2xl border border-[#D1D7EC] bg-[#F8F9FF] px-4 text-base font-semibold text-[#171A2B] outline-none transition focus:border-[#4652B6] focus:ring-4 focus:ring-[#4652B6]/10">
              <option value="">{sk ? "Vyberte jazyk" : "Select a language"}</option>
              {MUNDUS_LANGUAGE_OPTIONS.map(item => <option value={item.value} key={item.value}>{sk ? item.label : item.value}</option>)}
            </select>
            {prompt && !selectedLanguage && <p role="alert" className="mt-2 text-sm font-semibold text-[#2F3AA2]">{sk ? "Najprv vyberte jazyk a potom pokračujte." : "Choose a language before continuing."}</p>}
          </section>

          <section aria-labelledby="duration-step">
            <div className="mb-3 flex items-center gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#2F3AA2] text-sm font-bold text-white">02</span><h4 id="duration-step" className="text-lg font-semibold">{sk ? "Ako dlho má trvať hodina?" : "How long should each lesson be?"}</h4></div>
            <div role="group" aria-label={sk ? "Dĺžka hodiny" : "Lesson duration"} className="grid grid-cols-2 gap-3">
              {([45,60] as const).map(option => <button type="button" key={option} aria-pressed={duration===option} onClick={() => {setDuration(option);trackEvent("select_lesson_duration",{duration_minutes:option});}} className={`flex min-h-16 items-center justify-between rounded-2xl border px-4 text-left transition sm:px-5 ${duration===option ? "border-[#2F3AA2] bg-[#EEF0FF] text-[#263399] ring-2 ring-[#2F3AA2]/10" : "border-[#DDE1EF] bg-white text-[#171A2B] hover:border-[#A5AEE5]"}`}><span className="text-xl font-bold">{option} <small className="text-sm font-medium">min</small></span>{duration===option && <CheckCircle2 size={20}/>}</button>)}
            </div>
          </section>

          <section aria-labelledby="package-step">
            <div className="mb-3 flex items-center gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#2F3AA2] text-sm font-bold text-white">03</span><h4 id="package-step" className="text-lg font-semibold">{sk ? "Vyberte balíček" : "Pick your package"}</h4></div>
            <div ref={packagesRef} role="group" aria-label={sk ? "Počet lekcií" : "Number of lessons"} className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {packages.map(item => {
                const active = lessons === item.lessons;
                const recommended = item.lessons === 10;
                return <button key={item.lessons} type="button" aria-pressed={active} onClick={() => { setLessons(item.lessons); trackEvent("select_package",{language:selectedLanguage||"not_selected",duration_minutes:duration,lessons:item.lessons,amount_eur:item.amountCents/100}); }} className={`relative flex min-h-[116px] flex-col justify-between rounded-2xl border p-3.5 text-left transition sm:p-4 ${active ? "border-[#2F3AA2] bg-[#F1F2FF] ring-2 ring-[#2F3AA2]/15" : "border-[#DFE2EF] bg-white hover:border-[#A5AEE5]"}`}>
                  {recommended && <span className="absolute -top-2 right-2 rounded-full bg-[#2F3AA2] px-2 py-1 text-[10px] font-bold text-white">{sk ? "Top výber" : "Top pick"}</span>}
                  <span className="flex items-start justify-between gap-1 text-lg font-bold text-[#171A2B]">{item.lessons} <span className="text-xs font-semibold">{sk ? (item.lessons===1?"hodina":"hodín") : (item.lessons===1?"lesson":"lessons")}</span>{active && <CheckCircle2 size={17} className="shrink-0 text-[#2F3AA2]"/>}</span>
                  <span className="text-xs text-gray-500">{money(Math.round(item.amountCents/item.lessons))} / {sk ? "hod." : "lesson"}</span>
                  <span className="text-base font-bold text-[#2F3AA2]">{money(firstPackageAmountCents(item.amountCents))}</span>
                </button>;
              })}
            </div>
            <p className="mt-3 text-xs leading-5 text-gray-500">{sk ? "Zobrazené ceny zahŕňajú 10 % zľavu na prvý oprávnený balíček. Po overení účtu sa uplatní iba raz na osobu." : "Displayed prices include the 10% first-package discount, subject to account eligibility. It can only be used once per person."}</p>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-[1.55rem] bg-[#171A2B] p-5 text-white shadow-[0_24px_60px_rgba(23,26,43,.18)] sm:p-7">
            <div className="flex items-center justify-between gap-2"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#BDC7FF]">{sk ? "Váš balíček" : "Your package"}</p><Sparkles size={19} className="text-[#C7D2FE]"/></div>
            <h4 className="mt-4 text-2xl font-semibold !text-white">{selectedLanguage ? languageName : (sk ? "Vyberte jazyk" : "Choose a language")}</h4>
            <p className="mt-1 text-sm text-[#CDD2EA]">{lessons} × {duration} min · {sk ? "Individuálne 1:1" : "Private 1:1"}</p>
            <div className="my-6 border-t border-white/15" />
            <div className="flex items-end justify-between gap-3"><div><p className="text-xs text-[#B8BEDC]">{sk ? "Prvý oprávnený balíček" : "Eligible first package"}</p><p className="mt-1 text-[clamp(2rem,6vw,3.25rem)] font-semibold tracking-tight !text-white">{money(firstPrice)}</p></div><span className="rounded-full bg-[#BCEBD4] px-3 py-1 text-xs font-bold text-[#164B39]">−10 %</span></div>
            <p className="mt-1 text-sm text-[#BEC4DB]"><span className="line-through">{money(selected.amountCents)}</span><span className="ml-2">{sk ? "úspora" : "save"} {money(selected.amountCents-firstPrice)}</span></p>
            <div className="mt-6 space-y-2 text-sm text-[#E3E7F7]">
              <p className="flex items-center gap-2"><Check size={17} className="text-[#A4E9D0]"/>{sk ? "Flexibilné termíny" : "Flexible scheduling"}</p>
              <p className="flex items-center gap-2"><Check size={17} className="text-[#A4E9D0]"/>{sk ? "Materiály a študentský portál" : "Materials and student portal"}</p>
              <p className="flex items-center gap-2"><Check size={17} className="text-[#A4E9D0]"/>{sk ? "Jednorazová platba" : "One-time payment"}</p>
            </div>
            {selectedLanguage ? <Link href={checkout} onClick={() => trackEvent("start_checkout",{language:selectedLanguage,duration_minutes:duration,lessons})} className="mt-7 flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[#DDE2FF] px-4 text-center font-bold text-[#202C82] transition hover:bg-white"><LockKeyhole size={18}/>{sk ? "Pokračovať k platbe" : "Continue to payment"}<ArrowRight size={17}/></Link> : <button type="button" onClick={focusLanguage} className="mt-7 flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#DDE2FF] px-4 text-center font-bold text-[#202C82]">{sk ? "Vybrať jazyk" : "Select your language"}<ArrowRight size={17}/></button>}
            <p className="mt-3 text-center text-xs leading-5 text-[#BCC2D8]">{paymentsAvailable ? (sk ? "Bezpečná platba cez Stripe po prihlásení." : "Secure Stripe checkout after sign-in.") : (sk ? "Online platba sa pripravuje. Výber zostane zachovaný." : "Online payment is being prepared. Your selection is preserved.")}</p>
          </div>
          <p className="mt-4 flex items-start gap-2 px-2 text-xs leading-5 text-[#60667B]"><CreditCard size={17} className="shrink-0 text-[#2F3AA2]"/>{sk ? "Platba pred onboardingom. Po nákupe vyplníte svoje ciele a dostupnosť." : "Payment comes before onboarding. After purchase, add your goals and availability."}</p>
        </aside>
      </div>
    </div>

    {standalonePricing && <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#DCE0F3] bg-white/95 px-4 py-2.5 shadow-[0_-8px_32px_rgba(23,26,43,.1)] backdrop-blur-xl lg:hidden" style={{paddingBottom:"max(.625rem, env(safe-area-inset-bottom))"}}>
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
        <div className="min-w-0"><p className="truncate text-xs font-semibold text-[#626A80]">{lessons} × {duration} min</p><p className="text-lg font-bold text-[#263399]">{money(firstPrice)}</p></div>
        {selectedLanguage ? <Link href={checkout} className="flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#2F3AA2] px-4 text-sm font-semibold text-white">{sk ? "Pokračovať" : "Continue"}<ArrowRight size={17}/></Link> : <button type="button" onClick={focusLanguage} className="flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#2F3AA2] px-4 text-sm font-semibold text-white">{sk ? "Vybrať jazyk" : "Select language"}<ArrowRight size={17}/></button>}
      </div>
    </div>}
    <div className="mt-5 grid gap-3 md:grid-cols-2">
      <Link href={`${prefix}/group-lessons`} className="group rounded-[1.5rem] border border-[#DDE1EF] bg-white p-5 transition hover:border-[#9BA6E7]">
        <p className="text-xs font-bold uppercase tracking-wider text-[#2F3AA2]">{sk ? "S priateľmi" : "With friends"}</p><h4 className="mt-2 text-xl font-semibold">{sk ? "Súkromné skupiny 2–5" : "Private groups of 2–5"}</h4><p className="mt-2 text-sm text-gray-600">{sk ? "Výučba a cena pre vašu skupinu." : "Learning and pricing for your group."}</p><span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#2F3AA2]">{sk ? "Zistiť viac" : "Learn more"}<ArrowRight size={16}/></span>
      </Link>
      <Link href={`${prefix}/companies`} className="group rounded-[1.5rem] border border-[#DDE1EF] bg-[#F3F4FF] p-5 transition hover:border-[#9BA6E7]">
        <p className="text-xs font-bold uppercase tracking-wider text-[#2F3AA2]">{sk ? "Pre tímy" : "For teams"}</p><h4 className="mt-2 text-xl font-semibold">{sk ? "Firemné jazykové kurzy" : "Corporate language training"}</h4><p className="mt-2 text-sm text-gray-600">{sk ? "Individuálna ponuka podľa potrieb firmy." : "A custom plan for your organization."}</p><span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#2F3AA2]">{sk ? "Požiadať o ponuku" : "Request a quote"}<ArrowRight size={16}/></span>
      </Link>
    </div>
  </div>;
}
