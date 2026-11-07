"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CalendarClock, CheckCircle2, FileText, LayoutDashboard, ShieldCheck, WalletCards, UsersRound } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const fadeInUp={hidden:{opacity:0,y:22},visible:{opacity:1,y:0}};

export default function Hero(){
 const {language}=useLanguage();const sk=language==="sk";
 return <section className="relative overflow-hidden bg-[#171A2B] pb-12 pt-24 sm:pb-16 sm:pt-32 lg:pb-24 lg:pt-40">
  <div className="pointer-events-none absolute inset-0">
    <div className="absolute left-[48%] top-[-34%] h-[860px] w-[860px] -translate-x-1/2 rounded-full bg-[#4652C2]/35 blur-[145px]"/>
    <div className="absolute right-[-12%] top-[18%] h-[480px] w-[480px] rounded-full bg-[#7382FF]/18 blur-[110px]"/>
    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#171A2B] to-transparent"/>
  </div>

  <div className="container relative z-10 grid gap-7 sm:gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
   <motion.div initial="hidden" animate="visible" transition={{staggerChildren:.1}}>
    <motion.span variants={fadeInUp} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-sm font-semibold text-white backdrop-blur">
      <ShieldCheck size={16} className="text-[#C7D2FE]"/>{sk?"Individuálne online hodiny · 13+ jazykov":"Private online lessons · 13+ languages"}
    </motion.span>
    <motion.h1 variants={fadeInUp} className="mt-5 max-w-3xl text-[clamp(2.25rem,10.2vw,5.1rem)] font-semibold leading-[1.04] sm:mt-7 sm:leading-[0.98] tracking-[-0.045em] !text-white">
      {sk?"Konečne sa rozrozprávajte.":"Finally start speaking."} <span className="bg-gradient-to-r from-[#C7D2FE] to-white bg-clip-text text-transparent">{sk?"Po svojom, vo svojom čase.":"Your way, on your schedule."}</span>
    </motion.h1>
    <motion.p variants={fadeInUp} className="mt-4 max-w-xl text-[15px] leading-[1.65] sm:mt-6 sm:text-lg sm:leading-7 text-[#D8DBE8] sm:text-lg">
      {sk
        ?"Vyberte si jazyk, dĺžku hodiny a balíček. Lektora prispôsobíme vašim cieľom a časovým možnostiam."
        :"Choose your language, lesson length and package. We match your teacher to your goals and availability."}
    </motion.p>

    <motion.div variants={fadeInUp} className="mt-6 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:gap-3">
      <Link href={`/${language}/languages`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#5361D4] px-5 py-3 sm:min-h-14 sm:rounded-2xl sm:px-6 sm:py-4 font-semibold text-white shadow-[0_16px_42px_rgba(70,82,194,.35)] transition hover:-translate-y-0.5 hover:bg-[#6572DF]">
        {sk?"Vybrať jazyk":"Choose a language"}<ArrowRight size={18}/>
      </Link>
      <Link href={`/${language}/pricing`} className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 bg-white/[0.06] px-5 py-3 sm:min-h-14 sm:rounded-2xl sm:px-6 sm:py-4 font-semibold text-white backdrop-blur transition hover:bg-white/[0.1]">
        {sk?"Pozrieť ceny":"See pricing"}
      </Link>
    </motion.div>

    <motion.div variants={fadeInUp} className="mt-4 flex flex-wrap items-center gap-2 text-[13px] sm:mt-5 sm:text-sm text-[#D8DBE8]">
      <UsersRound size={17} className="text-[#C7D2FE]"/>
      <span>{sk ? "Chcete najprv spoznať lektorov?" : "Want to meet the teachers first?"}</span>
      <Link href={`/${language}/teachers`} className="font-semibold text-white underline decoration-[#9DA8FF] underline-offset-4 transition hover:text-[#C7D2FE]">{sk ? "Pozrite si reálne predstavenia" : "See real teacher introductions"} <ArrowRight size={14} className="inline"/></Link>
    </motion.div>

    <motion.div variants={fadeInUp} className="mt-4 flex flex-wrap gap-2 text-xs sm:mt-7 sm:gap-2.5 sm:text-sm text-[#E8EAF5]">
      <span className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-2 sm:px-4 sm:py-3"><CalendarClock size={16} className="text-[#C7D2FE]"/>{sk?"45 alebo 60 min":"45 or 60 min"}</span>
      <span className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-2 sm:px-4 sm:py-3"><LayoutDashboard size={16} className="text-[#C7D2FE]"/>{sk?"Flexibilné termíny + portál":"Flexible scheduling + portal"}</span>
    </motion.div>
   </motion.div>

   <motion.div initial={{opacity:0,y:28,scale:.985}} animate={{opacity:1,y:0,scale:1}} transition={{duration:.62,delay:.18}} className="relative">
    <div className="absolute -inset-3 rounded-[2.25rem] bg-gradient-to-br from-[#7382FF]/25 via-transparent to-white/10 blur-xl"/>
    <div className="relative rounded-[1.5rem] border border-white/10 bg-[#F8F8FF] p-3 sm:rounded-[2rem] sm:p-6 text-[#171A2B] shadow-2xl shadow-black/30 sm:p-6">
      <div className="flex items-center justify-between gap-3 border-b border-[#E5E7F0] pb-3 sm:pb-4">
        <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#2F3AA2]">Mundus</p><p className="mt-1 text-lg font-semibold">{sk?"Vaše učenie na jednom mieste":"Your learning in one place"}</p></div>
        <span className="rounded-full bg-[#E9ECFF] px-3 py-1 text-xs font-semibold text-[#2F3AA2]">{sk?"Ukážka":"Preview"}</span>
      </div>

      <div className="mt-3 rounded-2xl bg-[#171A2B] p-4 text-white sm:mt-5 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div><p className="text-xs font-semibold uppercase tracking-[.14em] text-[#C7D2FE]">{sk?"Najbližšia hodina":"Next lesson"}</p><p className="mt-2 text-2xl font-semibold">English · 60 min</p><p className="mt-1 text-sm text-[#D8DBE8]">{sk?"Utorok · 18:00 · online":"Tuesday · 18:00 · online"}</p></div>
          <span className="rounded-xl bg-white/10 p-2"><CalendarClock size={20}/></span>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2 sm:mt-3 sm:gap-3">
       <div className="min-w-0 rounded-2xl border border-[#E5E7F0] bg-white p-3 sm:p-4"><div className="flex items-center gap-2 text-[#2F3AA2]"><WalletCards size={17}/><span className="text-xs font-semibold">{sk?"Balíček":"Package"}</span></div><p className="mt-3 text-3xl font-semibold">8</p><p className="text-xs text-gray-500">{sk?"hodín zostáva":"lessons remaining"}</p></div>
       <div className="rounded-2xl border border-[#E5E7F0] bg-white p-4"><div className="flex items-center gap-2 text-[#2F3AA2]"><FileText size={17}/><span className="text-xs font-semibold">{sk?"Materiály":"Materials"}</span></div><p className="mt-3 text-sm font-semibold">{sk?"Pripravené na hodinu":"Ready for class"}</p><p className="mt-1 text-xs text-gray-500">{sk?"Úlohy, poznámky, súbory":"Homework, notes, files"}</p></div>
      </div>

      <div className="mt-2 flex items-start gap-2 rounded-2xl border border-[#DDE2FB] bg-[#EEF2FF] p-3 sm:mt-3 sm:items-center sm:gap-3 sm:p-4">
        <CheckCircle2 size={20} className="shrink-0 text-[#2F3AA2]"/><p className="text-sm leading-6 text-[#343A6B]">{sk?"Vyberiete balíček, zaplatíte a potom doplníte ciele a dostupnosť.":"Choose a package, pay, then add your goals and availability."}</p>
      </div>
    </div>
   </motion.div>
  </div>
 </section>;
}
