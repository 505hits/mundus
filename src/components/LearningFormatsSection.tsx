"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Building2, UserRound, Users, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function LearningFormatsSection() {
 const {language}=useLanguage(), sk=language==="sk", prefix=`/${language}`;
 const cards=[
  {icon:UserRound,number:"01",eyebrow:sk?"Pre vás":"Just for you",title:sk?"Individuálne 1:1":"One-to-one lessons",text:sk?"Sústredíme sa na vaše ciele, tempo aj čas.":"Your goals, your pace, your schedule.",href:`${prefix}/pricing`,cta:sk?"Vybrať balíček":"Find your package",img:"/images/mundus/DWQ3XM8DQ9W.webp",background:"bg-[#E9E8FF]",ink:"text-[#282B71]",details:sk?"45 alebo 60 min · Flexibilne":"45 or 60 min · Flexible"},
  {icon:Users,number:"02",eyebrow:sk?"Učte sa spolu":"Learn together",title:sk?"Súkromné skupiny":"Private groups",text:sk?"Hodiny pre 2–5 priateľov alebo kolegov.":"Lessons for 2–5 friends or colleagues.",href:`${prefix}/group-lessons`,cta:sk?"Skupinové hodiny":"Group lessons",img:"/images/mundus/DYSOVxCoMrJ.webp",background:"bg-[#E2EFE7]",ink:"text-[#1B5A49]",details:sk?"Vlastná skupina · Na mieru":"Your own group · Tailored"},
  {icon:Building2,number:"03",eyebrow:sk?"Pre váš tím":"For your team",title:sk?"Pre firmy":"For companies",text:sk?"Praktická komunikácia, ktorú využijete v práci.":"Practical communication that works at work.",href:`${prefix}/companies`,cta:sk?"Firemná výučba":"Corporate training",img:"/images/mundus/DYSRMMnNZbh.webp",background:"bg-[#F5E7DF]",ink:"text-[#7F453C]",details:sk?"Flexibilne · Pre HR":"Flexible · Built for HR"}
 ];
 return <section id="learning-formats" className="relative overflow-hidden bg-[#F7F8FC] px-4 py-16 sm:px-6 sm:py-24">
  <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[45rem] -translate-x-1/2 rounded-full bg-[#DDE2FB]/55 blur-3xl"/>
  <div className="relative mx-auto max-w-6xl">
   <div className="max-w-3xl">
    <p className="text-xs font-bold uppercase tracking-[.17em] text-[#2F3AA2]">{sk?"Vyberte si svoju cestu":"Find your way"}</p>
    <h2 className="mt-3 text-[clamp(2rem,5.4vw,3.1rem)] font-semibold leading-tight tracking-[-.04em]">{sk?"Jazyky do skutočného života.":"Languages for real life."}</h2>
    <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">{sk?"Sami, s priateľmi alebo cez firmu. Vyberte si formát, ktorý vám sedí.":"On your own, with friends, or through work. Find the format that fits."}</p>
   </div>
   <div className="mt-8 grid gap-4 lg:grid-cols-3">
    {cards.map(card=>{const Icon=card.icon;return <article key={card.href} className={`group relative flex min-h-[355px] flex-col overflow-hidden rounded-[1.8rem] p-5 shadow-[0_12px_35px_rgba(23,26,43,.06)] transition hover:-translate-y-1 hover:shadow-xl sm:min-h-[400px] sm:p-7 ${card.background}`}>
      <div className="relative z-10 flex items-start justify-between gap-3">
       <span className={`inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/75 px-3 py-2 text-xs font-bold ${card.ink}`}><Icon size={16}/>{card.eyebrow}</span>
       <span className={`text-xs font-bold ${card.ink}`}>{card.number}</span>
      </div>
      <div className="absolute right-[-25px] top-[60px] h-[180px] w-[55%] overflow-hidden rounded-[85px] border-[8px] border-white/45 bg-white/30 shadow-xl sm:top-[75px] sm:h-[215px]">
       <Image src={card.img} fill sizes="230px" alt={sk?"Moment z Mundus Instagramu":"Mundus community photo"} className="object-cover object-center transition duration-700 group-hover:scale-110"/>
      </div>
      <div className="relative z-10 mt-auto max-w-[90%]">
       <p className={`mb-2 text-[11px] font-semibold uppercase tracking-wider ${card.ink}`}>{card.details}</p>
       <h3 className="max-w-[260px] text-[clamp(1.5rem,2.6vw,2rem)] font-semibold leading-tight tracking-[-.04em] text-[#171A2B]">{card.title}</h3>
       <p className="mt-2 max-w-[270px] text-sm leading-6 text-[#51596C]">{card.text}</p>
       <Link href={card.href} className={`mt-5 inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-bold shadow-sm transition group-hover:gap-3 ${card.ink}`}>{card.cta}<ArrowUpRight size={18}/></Link>
      </div>
     </article>})}
   </div>
  </div>
 </section>;
}
