"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Languages, GraduationCap } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { PublicTeacher } from "@/lib/public-teachers";

type TeacherCard={id:string;name:string;languages:string[];headline:string;headlineSk?:string;bio?:string;bioSk?:string;photoUrl:string|null};
const introduced: TeacherCard[]=[
  {id:"nesrine",name:"Dr. Nesrine Ben Sadok",languages:["English"],headline:"University English teacher",headlineSk:"Univerzitná lektorka angličtiny",bio:"Introduced on Mundus Instagram.",bioSk:"Predstavená na Mundus Instagrame.",photoUrl:"/images/mundus/teacher-nesrine.webp"},
  {id:"veronika",name:"Veronika",languages:["English"],headline:"English teacher",headlineSk:"Lektorka angličtiny",bio:"Introduced on Mundus Instagram.",bioSk:"Predstavená na Mundus Instagrame.",photoUrl:"/images/mundus/teacher-veronika.webp"},
];
export default function TeacherProfiles({approved=[],compact=false}:{approved?:PublicTeacher[];compact?:boolean}){
 const {language}=useLanguage();const sk=language==="sk";
 const teacherCards:TeacherCard[]=[...introduced,...approved.filter(t=>t.name && !introduced.some(a=>a.name.toLowerCase()===t.name.toLowerCase())).map(t=>({...t,photoUrl:t.photoUrl}))];
 const visible=compact?teacherCards.slice(0,2):teacherCards;
 return <section id="teachers" className={compact?"bg-white px-4 py-12 sm:px-6 sm:py-20":"bg-white px-4 py-12 sm:px-6 sm:py-16"}>
  <div className="mx-auto max-w-6xl">
   <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div className="max-w-2xl">
      <p className="text-xs font-bold uppercase tracking-[.17em] text-[#3645AC]">{sk?"Spoznajte náš tím":"Meet the team"}</p>
      <h2 className="mt-2 text-[clamp(1.8rem,5vw,3rem)] font-semibold leading-tight tracking-[-.04em] text-[#171A2B]">{sk?"Tváre, za ktorými je skutočný prístup.":"Real teachers. Real connections."}</h2>
      <p className="mt-3 text-sm leading-6 text-[#667086] sm:text-base">{sk?"Predstavujeme lektorov z našich zverejnených profilov. Ďalšie schválené profily dopĺňame priebežne.":"Meet teachers from our published introductions. Additional approved profiles appear here as they become available."}</p>
    </div>
    {compact&&<Link href={`/${language}/teachers`} className="inline-flex min-h-11 shrink-0 items-center gap-2 font-semibold text-[#2F3AA2]">{sk?"Všetci zverejnení lektori":"All published teachers"}<ArrowRight size={17}/></Link>}
   </div>
   <div className={compact?"mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2":"mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3"}>
    {visible.map(teacher=><article key={teacher.id} className="group flex min-w-0 overflow-hidden rounded-[1.35rem] border border-[#E2E6F2] bg-[#F8F9FD] shadow-[0_12px_28px_rgba(20,27,70,.05)] transition hover:shadow-lg">
      <div className="relative h-[180px] w-[42%] shrink-0 bg-[#DDE3F5] sm:h-[250px] sm:w-[44%]">
        {teacher.photoUrl?<Image src={teacher.photoUrl} alt={teacher.name} fill sizes="(max-width:640px) 40vw,220px" className="object-cover object-center" unoptimized={teacher.photoUrl.startsWith("http")}/>:
        <div className="flex h-full items-center justify-center text-5xl font-semibold text-[#5361B6]">{teacher.name.charAt(0)}</div>}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center p-3.5 sm:p-5">
       <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#E9EDFF] text-[#3846A2]"><GraduationCap size={18}/></div>
       <h3 className="text-lg font-semibold leading-tight tracking-tight text-[#171A2B] sm:text-xl">{teacher.name}</h3>
       <p className="mt-1 text-xs font-semibold text-[#4957A4] sm:text-sm">{sk?(teacher.headlineSk||teacher.headline):teacher.headline}</p>
       <div className="mt-3 flex flex-wrap gap-1">{teacher.languages.map(lang=><span key={lang} className="inline-flex items-center gap-1 rounded-full border border-[#DCE2F3] bg-white px-2 py-1 text-[11px] font-medium text-[#4B5680]"><Languages size={11}/>{lang==="English"&&sk?"Angličtina":lang}</span>)}</div>
      </div>
    </article>)}
   </div>
   {!compact&&<div className="mt-7 flex flex-col gap-3 rounded-[1.35rem] bg-[#E9EBFC] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"><p className="max-w-xl text-sm leading-6 text-[#495473]">{sk?"Lektora vám odporučíme podľa jazyka, cieľa a dostupnosti. Zoznam zverejnených profilov nemusí obsahovať všetkých dostupných lektorov.":"We match teachers to your language, goals and schedule. The published roster may not include every available teacher."}</p><Link href={`/${language}/pricing`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#303DA3] px-4 py-2.5 text-sm font-semibold text-white">{sk?"Vybrať si balíček":"Choose a package"}<ArrowRight size={16}/></Link></div>}
  </div>
 </section>;
}
