"use client";

import { BookOpen, CalendarDays, FileText, GraduationCap } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function PortalPreviewSection() {
  const { language } = useLanguage();
  const sk = language === "sk";

  return <section className="bg-[#171A2B] py-24 text-white">
    <div className="container">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#C7D2FE]">{sk ? "Váš Mundus portál" : "Your Mundus portal"}</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight !text-white">{sk ? "Po zaplatení máte všetko na jednom mieste" : "After payment, everything stays in one place"}</h2>
          <p className="mt-5 max-w-xl leading-8 text-[#D8DBE8]">{sk ? "Táto ukážka používa rovnakú štruktúru a typy údajov ako študentský dashboard: balíček, rozvrh, materiály, domácu úlohu, spätnú väzbu a pokrok." : "This preview uses the same structure and information types as the student dashboard: package balance, schedule, materials, homework, feedback and progress."}</p>
          <a href="#buy-packages" className="mt-7 inline-flex rounded-xl bg-white px-5 py-3 font-semibold text-[#2F3AA2]">{sk ? "Vybrať balíček" : "Choose a package"}</a>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-[#F8F8FF] p-4 text-[#171A2B] shadow-2xl shadow-black/20 sm:p-6">
          <div className="flex items-center justify-between border-b border-[#E5E7F0] pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#2F3AA2]">Mundus</p>
              <p className="mt-1 font-semibold">{sk ? "Prehľad študenta" : "Student overview"}</p>
            </div>
            <span className="rounded-full bg-[#EEF2FF] px-3 py-1 text-xs font-semibold text-[#2F3AA2]">{sk ? "Ukážka podľa reálneho dashboardu" : "Preview based on the real dashboard"}</span>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-[#2F3AA2]"><GraduationCap size={18}/><span className="text-sm font-semibold">{sk ? "Balíček" : "Package"}</span></div>
              <p className="mt-3 text-3xl font-semibold">8</p>
              <p className="text-sm text-gray-500">{sk ? "hodín zostáva" : "lessons remaining"}</p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-[#2F3AA2]"><CalendarDays size={18}/><span className="text-sm font-semibold">{sk ? "Najbližšia hodina" : "Next lesson"}</span></div>
              <p className="mt-3 font-semibold">{sk ? "Utorok · 18:00" : "Tuesday · 18:00"}</p>
              <p className="text-sm text-gray-500">English · 60 min</p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-[#2F3AA2]"><BookOpen size={18}/><span className="text-sm font-semibold">{sk ? "Pokrok" : "Progress"}</span></div>
              <p className="mt-3 text-sm text-gray-600">{sk ? "Ďalšie zameranie: sebavedomejšia konverzácia" : "Next focus: more confident conversation"}</p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-[#2F3AA2]"><FileText size={18}/><span className="text-sm font-semibold">{sk ? "Domáca úloha" : "Homework"}</span></div>
              <p className="mt-3 text-sm text-gray-600">{sk ? "Krátke cvičenie + slovná zásoba z poslednej hodiny" : "Short exercise + vocabulary from your last lesson"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>;
}
