"use client";

import Link from "next/link";
import { ArrowRight, HeartHandshake, RefreshCw, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function MatchGuaranteeSection() {
  const { language } = useLanguage();
  const sk = language === "sk";
  const prefix = `/${language}`;

  return (
    <section className="bg-[#171A2B] py-20 text-white">
      <div className="container">
        <div className="grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.05] p-7 shadow-2xl shadow-black/10 backdrop-blur sm:p-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-semibold">
              <ShieldCheck size={17} className="text-[#C7D2FE]" />
              {sk ? "Mundus Match Guarantee" : "Mundus Match Guarantee"}
            </div>
            <h2 className="mt-5 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              {sk ? "Lektor vám nesadol? Nájdeme lepší match." : "Teacher not the right fit? We'll find a better match."}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[#D8DBE8] sm:text-lg">
              {sk
                ? "Pri individuálnej výučbe rozhoduje aj chémia medzi študentom a lektorom. Ak prvý match nie je správny, Mundus vám pomôže s novým priradením bez ďalšieho poplatku za samotné priradenie."
                : "A good student-teacher fit matters. If the first match isn't right, Mundus will help you switch to a better-fit teacher without an extra matching fee."}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href={`${prefix}/pricing`} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#5361D4] px-6 py-3.5 font-semibold text-white transition hover:bg-[#6572DF]">
                {sk ? "Vybrať jazyk a balíček" : "Choose language & package"} <ArrowRight size={17} />
              </Link>
              <Link href={`${prefix}/contact`} className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/[0.05] px-6 py-3.5 font-semibold transition hover:bg-white/[0.1]">
                {sk ? "Najprv sa opýtať" : "Ask us first"}
              </Link>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
              <HeartHandshake className="text-[#C7D2FE]" size={23} />
              <p className="mt-3 font-semibold">{sk ? "Osobný match" : "Personal matching"}</p>
              <p className="mt-2 text-sm leading-6 text-[#D8DBE8]">{sk ? "Jazyk, cieľ, úroveň, dostupnosť aj štýl výučby." : "Language, goals, level, availability and teaching style."}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
              <RefreshCw className="text-[#C7D2FE]" size={23} />
              <p className="mt-3 font-semibold">{sk ? "Možnosť zmeny" : "Switch when needed"}</p>
              <p className="mt-2 text-sm leading-6 text-[#D8DBE8]">{sk ? "Ak to nefunguje, pomôžeme nájsť vhodnejšieho lektora." : "If the fit isn't right, we'll help find a better teacher."}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
