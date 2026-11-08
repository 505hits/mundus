"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CalendarClock, LayoutDashboard, ShieldCheck, UsersRound } from "lucide-react";
import HeroTeacherPanel from "@/components/HeroTeacherPanel";
import { useLanguage } from "@/context/LanguageContext";

const fadeInUp={hidden:{opacity:0,y:22},visible:{opacity:1,y:0}};

export default function Hero({paymentsAvailable=false}:{paymentsAvailable?:boolean}){
 const {language}=useLanguage();const sk=language==="sk";
 return <section className="relative overflow-hidden bg-[#171A2B] pb-8 pt-20 sm:pb-16 sm:pt-32 lg:pb-24 lg:pt-40">
  <div className="pointer-events-none absolute inset-0">
    <div className="absolute left-[48%] top-[-34%] h-[860px] w-[860px] -translate-x-1/2 rounded-full bg-[#4652C2]/35 blur-[145px]"/>
    <div className="absolute right-[-12%] top-[18%] h-[480px] w-[480px] rounded-full bg-[#7382FF]/18 blur-[110px]"/>
    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#171A2B] to-transparent"/>
  </div>

  <div className="container relative z-10 grid gap-7 sm:gap-12 lg:grid-cols-[.98fr_1.02fr] lg:items-center">
   <motion.div initial="hidden" animate="visible" transition={{staggerChildren:.1}}>
    <motion.span variants={fadeInUp} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-sm font-semibold text-white backdrop-blur">
      <ShieldCheck size={16} className="text-[#C7D2FE]"/>{sk?"Individuálne online hodiny · 13+ jazykov":"Private online lessons · 13+ languages"}
    </motion.span>
    <motion.h1 variants={fadeInUp} className="mt-5 max-w-3xl text-[clamp(2.25rem,10.2vw,5.1rem)] font-semibold leading-[1.04] sm:mt-7 sm:leading-[0.98] tracking-[-0.045em] !text-white">
      {sk?"Online jazykové kurzy":"Online language courses"} <span className="bg-gradient-to-r from-[#C7D2FE] to-white bg-clip-text text-transparent">{sk?"vo vašom tempe.":"at your pace."}</span>
    </motion.h1>
    <motion.p variants={fadeInUp} className="mt-4 max-w-xl text-[15px] leading-[1.65] sm:mt-6 sm:text-lg sm:leading-7 text-[#D8DBE8] sm:text-lg">
      {sk
        ?(paymentsAvailable?"Vyberiete balíček, zaplatíte bezpečne online a potom nám poviete svoje ciele. Lektora prispôsobíme vašim časovým možnostiam.":"Vyberte si jazyk a balíček. Pomôžeme vám s ďalším postupom a nájdeme lektora podľa vašich cieľov.")
         : (paymentsAvailable?"Choose a package, pay securely online, then tell us your goals. We match a teacher to your availability.":"Choose your language and package. We will help you with the next steps and match a teacher to your goals.")}
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

   <motion.div initial={{opacity:0,y:22}} animate={{opacity:1,y:0}} transition={{duration:.6,delay:.18}} className="min-w-0"><HeroTeacherPanel /></motion.div>
  </div>
 </section>;
}
