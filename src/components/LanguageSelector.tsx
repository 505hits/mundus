"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Languages, Sparkles } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const fadeInUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

export default function LanguageSelector() {
  const { t, language } = useLanguage();
  const sk = language === "sk";

  const primary = [
    { label: sk ? "Angličtina" : "English", href: "/languages/english" },
    { label: sk ? "Nemčina" : "German", href: "/languages/german" },
    { label: sk ? "Španielčina" : "Spanish", href: "/languages/spanish" },
    { label: sk ? "Taliančina" : "Italian", href: "/languages/italian" },
    { label: sk ? "Francúzština" : "French", href: "/languages/french" },
    { label: sk ? "Portugalčina" : "Portuguese", href: null },
  ];

  const additional = [
    { label: sk ? "Maďarčina" : "Hungarian", href: null },
    { label: sk ? "Poľština" : "Polish", href: null },
    { label: sk ? "Ruština" : "Russian", href: null },
    { label: sk ? "Čínština" : "Chinese", href: null },
    { label: sk ? "Slovenčina" : "Slovak", href: "/languages/slovak-for-foreigners" },
    { label: sk ? "Ukrajinčina" : "Ukrainian", href: null },
    { label: sk ? "Moderná hebrejčina" : "Modern Hebrew", href: null },
  ];

  return (
    <section id="languages" className="bg-gradient-to-b from-[#F6F7FB] to-white py-20 md:py-28">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="mx-auto max-w-5xl"
        >
          <motion.div variants={fadeInUp} className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#DDE2F4] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#2F3AA2] shadow-sm">
              <Languages size={15} />
              {t.languageSelector.badge}
            </span>

            <h2 className="mt-5 text-4xl font-semibold tracking-tight text-[#171A2B] md:text-5xl">
              {t.languageSelector.title}{" "}
              <span className="text-[#2F3AA2]">{t.languageSelector.goals}</span>
            </h2>

            <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-gray-600 md:text-lg">
              {t.languageSelector.subtitle}
            </p>
          </motion.div>

          <motion.div variants={stagger} className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {primary.map((item) => (
              <motion.div key={item.label} variants={fadeInUp}>
                {item.href ? (
                  <Link href={item.href} className="group flex items-center justify-between rounded-2xl border border-[#E5E7F0] bg-white p-5 shadow-[0_10px_28px_rgba(23,26,43,0.04)] transition hover:-translate-y-0.5 hover:border-[#C7CDF6] hover:shadow-[0_16px_34px_rgba(47,58,162,0.08)]">
                    <span className="font-semibold text-[#171A2B]">{item.label}</span>
                    <span className="flex items-center gap-2"><span className="rounded-full bg-[#EEF2FF] px-2.5 py-1 text-xs font-semibold text-[#2F3AA2]">1:1</span><ArrowUpRight size={16} className="text-[#2F3AA2] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"/></span>
                  </Link>
                ) : (
                  <div className="flex items-center justify-between rounded-2xl border border-[#E5E7F0] bg-white p-5 shadow-[0_10px_28px_rgba(23,26,43,0.04)]">
                    <span className="font-semibold text-[#171A2B]">{item.label}</span>
                    <span className="rounded-full bg-[#EEF2FF] px-2.5 py-1 text-xs font-semibold text-[#2F3AA2]">1:1</span>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeInUp} className="mt-7 rounded-3xl border border-[#E5E7F0] bg-white/80 p-5 backdrop-blur">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={17} className="text-[#2F3AA2]" />
                <p className="text-sm font-semibold text-[#171A2B]">{sk ? "Ďalšie dostupné jazyky" : "More available languages"}</p>
              </div>
              <a href="/contact" className="text-sm font-semibold text-[#2F3AA2] underline underline-offset-4">
                {sk ? "Opýtať sa na dostupnosť" : "Ask about availability"}
              </a>
            </div>

            <ul aria-label={sk ? "Ďalšie ponúkané jazyky" : "More languages offered"} className="mt-4 flex flex-wrap gap-2">
              {additional.map((item) => (
                <li key={item.label}>
                  {item.href ? <Link href={item.href} className="inline-flex items-center gap-1.5 rounded-full border border-[#C7CDF6] bg-[#EEF2FF] px-3.5 py-2 text-sm font-semibold text-[#2F3AA2] hover:border-[#2F3AA2]">{item.label}<ArrowUpRight size={14}/></Link> : <span className="inline-block rounded-full border border-[#E1E5F0] bg-[#FAFAF9] px-3.5 py-2 text-sm font-medium text-gray-700">{item.label}</span>}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
