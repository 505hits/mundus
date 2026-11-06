"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Languages, Sparkles } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { trackEvent } from "@/components/AnalyticsManager";

const fadeInUp={hidden:{opacity:0,y:18},visible:{opacity:1,y:0,transition:{duration:.45}}};
const stagger={hidden:{opacity:0},visible:{opacity:1,transition:{staggerChildren:.06}}};

export default function LanguageSelector(){
 const {t,language}=useLanguage();const sk=language==="sk";
 const primary=[
  {value:"English",label:sk?"Angličtina":"English",detail:"/languages/english"},
  {value:"German",label:sk?"Nemčina":"German",detail:"/languages/german"},
  {value:"Spanish",label:sk?"Španielčina":"Spanish",detail:"/languages/spanish"},
  {value:"Italian",label:sk?"Taliančina":"Italian",detail:"/languages/italian"},
  {value:"French",label:sk?"Francúzština":"French",detail:"/languages/french"},
  {value:"Portuguese",label:sk?"Portugalčina":"Portuguese",detail:null},
 ];
 const additional=[
  {value:"Hungarian",label:sk?"Maďarčina":"Hungarian",detail:null},
  {value:"Polish",label:sk?"Poľština":"Polish",detail:null},
  {value:"Russian",label:sk?"Ruština":"Russian",detail:null},
  {value:"Chinese",label:sk?"Čínština":"Chinese",detail:null},
  {value:"Slovak",label:sk?"Slovenčina pre cudzincov":"Slovak for foreigners",detail:"/languages/slovak-for-foreigners"},
  {value:"Ukrainian",label:sk?"Ukrajinčina":"Ukrainian",detail:null},
  {value:"Modern Hebrew",label:sk?"Moderná hebrejčina":"Modern Hebrew",detail:null},
 ];

 return <section id="languages" className="bg-gradient-to-b from-[#F6F7FB] to-white py-20 md:py-28">
  <div className="container"><motion.div initial="hidden" whileInView="visible" viewport={{once:true,margin:"-80px"}} variants={stagger} className="mx-auto max-w-5xl">
   <motion.div variants={fadeInUp} className="text-center">
    <span className="inline-flex items-center gap-2 rounded-full border border-[#DDE2F4] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[.14em] text-[#2F3AA2] shadow-sm"><Languages size={15}/>{t.languageSelector.badge}</span>
    <h2 className="mt-5 text-4xl font-semibold tracking-[-.035em] text-[#171A2B] md:text-5xl">{sk?"1. Vyberte jazyk":"1. Choose your language"}</h2>
    <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-gray-600 md:text-lg">{sk?"Po výbere jazyka pokračujete priamo k balíčkom a online platbe. Detailnú úroveň a termíny zadáte až po zaplatení.":"After choosing a language, continue directly to packages and online payment. You’ll add your level and availability only after payment."}</p>
   </motion.div>

   <motion.div variants={stagger} className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {primary.map(item=><motion.article key={item.value} variants={fadeInUp} className="group relative flex min-h-[190px] flex-col overflow-hidden rounded-3xl border border-[#E5E7F0] bg-white p-5 shadow-[0_10px_28px_rgba(23,26,43,.04)] transition hover:-translate-y-1 hover:border-[#C7CDF6] hover:shadow-[0_18px_40px_rgba(47,58,162,.10)]">
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#EEF2FF] transition duration-500 group-hover:scale-125"/>
      <div className="relative flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[.12em] text-[#2F3AA2]">1:1 online</p><h3 className="mt-2 text-xl font-semibold text-[#171A2B]">{item.label}</h3></div><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#2F3AA2]"><Languages size={17}/></span></div>
      <div className="relative mt-auto pt-6">
       <Link href={`/pricing?language=${encodeURIComponent(item.value)}`} onClick={()=>trackEvent("select_language",{language:item.value,placement:"primary_language_card"})} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2F3AA2] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#252E82]">{sk?"Vybrať tento jazyk":"Choose this language"}<ArrowRight size={16}/></Link>
       {item.detail&&<Link href={item.detail} className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 underline underline-offset-3 hover:text-[#2F3AA2]">{sk?"Viac o výučbe":"Learn more"}<ArrowUpRight size={13}/></Link>}
      </div>
    </motion.article>)}
   </motion.div>

   <motion.div variants={fadeInUp} className="mt-7 rounded-3xl border border-[#E5E7F0] bg-white/80 p-5 backdrop-blur">
    <div className="flex items-center gap-2"><Sparkles size={17} className="text-[#2F3AA2]"/><p className="text-sm font-semibold text-[#171A2B]">{sk?"Ďalšie dostupné jazyky":"More available languages"}</p></div>
    <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{additional.map(item=><div key={item.value} className="rounded-2xl border border-[#E1E5F0] bg-[#FAFAF9] p-3.5"><div className="flex items-center justify-between gap-2"><span className="text-sm font-semibold text-gray-700">{item.label}</span>{item.detail&&<Link href={item.detail} className="text-[#2F3AA2]" aria-label={sk?`Viac o ${item.label}`:`Learn more about ${item.label}`}><ArrowUpRight size={15}/></Link>}</div><Link href={`/pricing?language=${encodeURIComponent(item.value)}`} onClick={()=>trackEvent("select_language",{language:item.value,placement:"additional_language_card"})} className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#2F3AA2]">{sk?"Vybrať a pokračovať":"Choose & continue"}<ArrowRight size={13}/></Link></div>)}</div>
   </motion.div>
  </motion.div></div>
 </section>;
}
