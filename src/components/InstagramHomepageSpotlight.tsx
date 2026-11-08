"use client";

import Link from "next/link";
import { ArrowRight, ExternalLink, GraduationCap, HeartHandshake, Instagram } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const featured = [
  { id: "DfPIUSjjVZf", labelSk: "Spoznajte lektorov", labelEn: "Meet our teachers", detailSk: "Skutočné predstavenia tímu", detailEn: "Real introductions from our team", color: "bg-[#E8E5FC]" },
  { id: "DWQ3XM8DQ9W", labelSk: "Život v Mundus", labelEn: "Life at Mundus", detailSk: "Nahliadnite do našej komunity", detailEn: "Explore our community", color: "bg-[#F4E7DA]" },
  { id: "DYUFE0ijV_3", labelSk: "Skúsenosti študentov", labelEn: "Student experiences", detailSk: "Príspevky z nášho Instagramu", detailEn: "Shared on our Instagram", color: "bg-[#E0F0E9]" },
];

export default function InstagramHomepageSpotlight() {
  const { language } = useLanguage();
  const sk = language === "sk";
  return (
    <section id="teachers" className="bg-white px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl"><span id="instagram-community" className="block scroll-mt-24" aria-hidden="true" /><span id="testimonials" className="block scroll-mt-24" aria-hidden="true" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[#4652B6]">{sk ? "Skutoční ľudia. Skutočné hodiny." : "Real people. Real lessons."}</p>
            <h2 className="mt-3 text-[clamp(1.85rem,6.2vw,3.1rem)] font-semibold leading-tight tracking-[-.04em] text-[#171A2B]">{sk ? "Za každou hodinou je človek." : "There's a person behind every lesson."}</h2>
            <p className="mt-3 text-base leading-7 text-[#62697C]">{sk ? "Spoznajte náš tím, komunitu a skúsenosti študentov cez skutočné príspevky Mundus." : "Get to know our teachers, community and student experiences through genuine Mundus posts."}</p>
          </div>
          <Link href={`/${language}/teachers`} className="inline-flex min-h-12 shrink-0 items-center gap-2 self-start rounded-xl bg-[#2F3AA2] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#252E82]">
            {sk ? "Spoznať lektorov" : "Meet the teachers"} <ArrowRight size={17}/>
          </Link>
        </div>
        <div className="mt-7 grid gap-3 sm:grid-cols-3 sm:gap-4">
          {featured.map(({id,labelSk,labelEn,detailSk,detailEn,color},i)=>(
            <a key={id} href={`https://www.instagram.com/p/${id}/`} target="_blank" rel="noopener noreferrer"
              className={`group relative flex min-h-[176px] flex-col justify-between overflow-hidden rounded-[1.5rem] p-5 transition hover:-translate-y-1 hover:shadow-xl sm:min-h-[222px] sm:p-6 ${color}`}>
              <div className="flex items-center justify-between text-[#30396E]">
                {i===0?<GraduationCap size={24}/>:i===1?<Instagram size={24}/>:<HeartHandshake size={24}/>}
                <ExternalLink size={17} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"/>
              </div>
              <div>
                <p className="text-xl font-semibold tracking-tight text-[#202544] sm:text-2xl">{sk?labelSk:labelEn}</p>
                <p className="mt-2 text-sm text-[#515873]">{sk?detailSk:detailEn}</p>
              </div>
            </a>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm">
          <span className="text-[#687086]">{sk ? "Príspevky sa otvoria na Instagrame. Žiadne sledovacie embedy na úvodnej stránke." : "Posts open on Instagram. No tracking embeds on the homepage."}</span>
          <Link href={`/${language}/community`} className="inline-flex min-h-11 items-center gap-2 font-semibold text-[#2F3AA2] hover:underline">{sk ? "Pozrieť celú galériu" : "Explore the full gallery"} <ArrowRight size={16}/></Link>
        </div>
      </div>
    </section>
  );
}
