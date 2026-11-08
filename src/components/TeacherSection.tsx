"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Instagram, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { MUNDUS_LANGUAGE_OPTIONS } from "@/lib/language-offer";

type PublicTeacher={id:string;name:string;headline:string;bio:string;languages:string[];photoUrl:string|null};
const fade={hidden:{opacity:0,y:20},visible:{opacity:1,y:0,transition:{duration:0.4}}};

export default function TeacherSection({teachers}:{teachers:PublicTeacher[]}) {
  const { language } = useLanguage();
  const sk=language==="sk";
  const prefix=`/${language}`;
  const displayLanguage=(value:string)=>sk ? MUNDUS_LANGUAGE_OPTIONS.find(item=>item.value===value)?.label ?? value : value;
  const visible=teachers.slice(0,6);

  return <section id="teachers" className="bg-white px-6 py-20 sm:py-24">
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">{sk?"Naši lektori":"Our teachers"}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-.035em] sm:text-5xl">{sk?"Vyberáme lektora podľa vás.":"We match the teacher to you."}</h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-gray-600">{sk?"Na webe zobrazujeme iba aktuálne schválené profily. Ďalšie predstavenia lektorov nájdete na Instagrame.":"We show only currently approved teacher profiles here. See more teacher introductions on Instagram."}</p>
        </div>
        <a href="https://www.instagram.com/mundus.languages/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 self-start rounded-2xl border border-[#DDE2FB] bg-[#F5F6FF] px-5 py-3 font-semibold text-[#2F3AA2] transition hover:bg-[#EEF2FF]">
          <Instagram size={18}/>@mundus.languages
        </a>
      </div>

      {visible.length>0 ? <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map(teacher=><motion.article key={teacher.id} initial="hidden" whileInView="visible" viewport={{once:true,margin:"-40px"}} variants={fade} className="overflow-hidden rounded-3xl border border-[#E5E7F0] bg-white shadow-[0_10px_30px_rgba(23,26,43,.045)]">
          <div className="aspect-[4/3] overflow-hidden bg-[#EEF2FF]">
            {teacher.photoUrl
              ? <div className="relative h-full w-full"><Image unoptimized src={teacher.photoUrl} alt={teacher.name} fill sizes="(max-width:640px) 100vw,33vw" className="object-cover"/></div>
              : <div className="flex h-full items-center justify-center text-6xl font-semibold text-[#2F3AA2]">{teacher.name.slice(0,1).toUpperCase()}</div>}
          </div>
          <div className="p-5">
            <h3 className="text-xl font-semibold text-[#171A2B]">{teacher.name}</h3>
            {teacher.headline&&<p className="mt-1 text-sm font-semibold text-[#2F3AA2]">{teacher.headline}</p>}
            {teacher.bio&&<p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">{teacher.bio}</p>}
            {teacher.languages.length>0&&<div className="mt-4 flex flex-wrap gap-1.5">{teacher.languages.map(item=><span key={item} className="rounded-full bg-[#EEF2FF] px-2.5 py-1 text-xs font-medium text-[#2F3AA2]">{displayLanguage(item)}</span>)}</div>}
          </div>
        </motion.article>)}
      </div> : <div className="mt-9 rounded-[1.75rem] border border-[#DDE2FB] bg-[#F7F8FF] p-6 sm:flex sm:items-center sm:justify-between sm:gap-8">
        <div>
          <p className="font-semibold text-[#171A2B]">{sk?"Aktuálne profily práve obnovujeme.":"We are refreshing the current teacher profiles."}</p>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">{sk?"Nechceme zobrazovať starý zoznam. Najnovšie predstavenia lektorov sú zatiaľ na našom Instagrame.":"We do not want to show an outdated roster. The latest teacher introductions are available on our Instagram for now."}</p>
        </div>
        <a href="https://www.instagram.com/mundus.languages/" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#2F3AA2] px-5 py-3 font-semibold text-white sm:mt-0"><Instagram size={17}/>{sk?"Pozrieť lektorov":"See teachers"}</a>
      </div>}

      <div className="mt-8">
        <Link href={`${prefix}/#pricing`} className="inline-flex items-center gap-2 font-semibold text-[#2F3AA2]">{sk?"Vybrať balíček":"Choose a package"}<ArrowRight size={17}/></Link>
      </div>
    </div>
  </section>;
}
