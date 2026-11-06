"use client";

import { motion } from "framer-motion";
import { ArrowRight, CalendarClock, CheckCircle2, LayoutDashboard, ShieldCheck, UserRound } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function Hero() {
  const { t, language } = useLanguage();
  const sk = language === "sk";

  return (
    <section className="relative overflow-hidden bg-[#171A2B] pb-20 pt-32 lg:pb-28 lg:pt-40">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-35%] h-[900px] w-[900px] -translate-x-1/2 rounded-full bg-[#4652C2]/35 blur-[150px]" />
        <div className="absolute right-[-10%] top-[10%] h-[520px] w-[520px] rounded-full bg-[#7382FF]/20 blur-[120px]" />
      </div>

      <div className="container relative z-10 grid gap-12 lg:grid-cols-[1fr_0.95fr] lg:items-center">
        <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.12 }}>
          <motion.span variants={fadeInUp} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white">
            <ShieldCheck size={16} className="text-[#C7D2FE]" />
            {t.hero.badge}
          </motion.span>

          <motion.h1 variants={fadeInUp} className="mt-7 max-w-3xl text-4xl font-semibold leading-[1.05] !text-white sm:text-5xl lg:text-7xl">
            {t.hero.titleBefore}{" "}
            <span className="text-[#C7D2FE]">{t.hero.nativeSpeakers}</span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="mt-6 max-w-2xl text-base leading-8 text-[#D8DBE8] sm:text-lg">
            {t.hero.subtitle}
          </motion.p>

          <motion.div variants={fadeInUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#buy-packages" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4652C2] px-6 py-4 font-semibold text-white shadow-lg shadow-black/20 transition hover:bg-[#5361D4]">
              {sk ? "Vybrať balíček a zaplatiť online" : "Choose a package & pay online"}
              <ArrowRight size={18} />
            </a>
            <a href="/contact" className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-4 font-semibold text-white transition hover:bg-white/10">
              {sk ? "Najprv sa opýtať" : "Ask us first"}
            </a>
          </motion.div>

          <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap gap-3 text-sm text-[#D8DBE8]">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2"><UserRound size={16} className="text-[#C7D2FE]" />{t.hero.students}</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2"><CalendarClock size={16} className="text-[#C7D2FE]" />{t.hero.rating}</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2"><LayoutDashboard size={16} className="text-[#C7D2FE]" />{t.hero.interactive}</span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.2 }}
          className="rounded-[30px] border border-white/10 bg-[#F8F8FF] p-4 text-[#171A2B] shadow-2xl shadow-black/30 sm:p-6"
        >
          <div className="flex items-center justify-between border-b border-[#E5E7F0] pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#2F3AA2]">Mundus</p>
              <p className="mt-1 font-semibold">{sk ? "Ako začnete" : "How you start"}</p>
            </div>
            <span className="rounded-full bg-[#EEF2FF] px-3 py-1 text-xs font-semibold text-[#2F3AA2]">{sk ? "Jednoduchý proces" : "Simple process"}</span>
          </div>

          <div className="mt-5 space-y-3">
            {[
              [sk ? "1. Vyberiete si balíček" : "1. Choose a package", sk ? "Jasná cena a 45- alebo 60-minútové individuálne hodiny." : "Clear pricing and 45- or 60-minute individual lessons."],
              [sk ? "2. Zaplatíte online" : "2. Pay online", sk ? "Najprv platba. Až potom vypĺňate detailné preferencie." : "Payment comes first. Detailed preferences come afterwards."],
              [sk ? "3. Doplníte preferencie" : "3. Add your preferences", sk ? "Jazyk, úroveň, frekvencia, dni, časy a cieľ." : "Language, level, frequency, days, times and goal."],
              [sk ? "4. Mundus odporučí lektora" : "4. Mundus recommends a teacher", sk ? "Vyhodnotíme vhodné zhody a finálne priradenie schválime." : "We rank suitable matches and approve the final assignment."],
            ].map(([title,desc]) => (
              <div key={title} className="flex gap-3 rounded-2xl bg-white p-4 shadow-sm">
                <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-[#2F3AA2]" />
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="mt-1 text-sm leading-6 text-gray-600">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
