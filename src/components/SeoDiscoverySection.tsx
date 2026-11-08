"use client";

import Link from "next/link";
import { ArrowUpRight, BookOpenText } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const choices=[
 {slug:"anglictina-pre-zaciatocnikov",sk:"Angličtina pre začiatočníkov",en:"English for beginners"},
 {slug:"konverzacna-anglictina",sk:"Konverzačná angličtina",en:"Conversational English"},
 {slug:"business-english",sk:"Business English do práce",en:"Business English for work"},
 {slug:"anglictina-na-cestovanie",sk:"Angličtina na cestovanie",en:"English for travel"},
 {slug:"slovencina-pre-cudzincov-a1",sk:"Slovenčina pre cudzincov A1",en:"Slovak for foreigners A1"},
];
const popular=[
 {slug:"spanish",sk:"Španielčina online",en:"Spanish lessons online"},
 {slug:"italian",sk:"Taliančina online",en:"Italian lessons online"},
 {slug:"french",sk:"Francúzština online",en:"French lessons online"},
 {slug:"german",sk:"Nemčina online",en:"German lessons online"},
];
export default function SeoDiscoverySection(){
 const {language}=useLanguage();const sk=language==="sk";const base=`/${language}`;
 return <section aria-labelledby="course-ideas-heading" className="border-t border-[#E5E9F4] bg-[#F8F9FD] px-4 py-10 sm:px-6 sm:py-14">
  <div className="mx-auto max-w-6xl">
   <div className="max-w-3xl">
    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-[#3948A9]"><BookOpenText size={17}/>{sk?"Podľa vášho cieľa":"Find the right focus"}</p>
    <h2 id="course-ideas-heading" className="mt-3 text-[clamp(1.65rem,4vw,2.5rem)] font-semibold tracking-tight text-[#171A2B]">{sk?"Jazykové kurzy, ktoré sa prispôsobia vám":"Online language lessons for your goals"}</h2>
    <p className="mt-3 text-sm leading-6 text-[#616A80] sm:text-base">{sk?"Potrebujete sa rozrozprávať po anglicky, pripraviť sa na prácu alebo začať nový jazyk? Vyberte si konkrétny cieľ. Lekcie sú online a individuálne, s flexibilnými termínmi a možnosťou 45 alebo 60 minút.":"Want to improve your English conversation, speak more confidently at work, or start another language? Explore lessons by goal. Classes are online and individual, with flexible 45- or 60-minute options."}</p>
   </div>
   <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
    {choices.map(x=><Link key={x.slug} href={`${base}/learn/${x.slug}`} className="group flex min-h-12 items-center justify-between gap-3 rounded-xl border border-[#E1E6F3] bg-white px-4 py-3 text-sm font-semibold text-[#2A356F] transition hover:border-[#A1ADE1] hover:shadow-sm">{sk?x.sk:x.en}<ArrowUpRight size={17} className="shrink-0 text-[#4253B4]"/></Link>)}
    <Link href={`${base}/languages`} className="group flex min-h-12 items-center justify-between gap-3 rounded-xl border border-[#C4CEF1] bg-[#EDEFFF] px-4 py-3 text-sm font-semibold text-[#28358C]">{sk?"Všetkých 13 jazykov":"Explore all 13 languages"}<ArrowUpRight size={17}/></Link>
   </div>
   <p className="mt-5 text-xs font-medium text-[#697389]">{sk?"Obľúbené jazyky:":"Popular courses:"}{" "}
   {popular.map((x,i)=><span key={x.slug}>{i>0?" · ":""}<Link href={`${base}/languages/${x.slug}`} className="underline decoration-[#B0B8DF] underline-offset-4 hover:text-[#3846AB]">{sk?x.sk:x.en}</Link></span>)}</p>
  </div>
 </section>;
}
