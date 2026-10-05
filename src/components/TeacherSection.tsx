"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { MUNDUS_LANGUAGE_OPTIONS } from "@/lib/language-offer";

type PublicTeacher={id:string;name:string;headline:string;bio:string;languages:string[];photoUrl:string|null};

const existingTeacherImages=[
  "/Lenka.jpeg",
  "/Jakub.jpeg",
  "/alisa.JPG",
  "/roland.jpeg",
  "/Bella English side.png",
  "/Anar Chinese chill.png",
  "/Tamara.jpeg",
];

const fade={hidden:{opacity:0,y:24},visible:{opacity:1,y:0,transition:{duration:0.45}}};

export default function TeacherSection({teachers}:{teachers:PublicTeacher[]}) {
  const { t, language } = useLanguage();
  const sk=language==="sk";
  const displayLanguage=(value:string)=>sk ? MUNDUS_LANGUAGE_OPTIONS.find(item=>item.value===value)?.label ?? value : value;
  const normalizeName=(value:string)=>value.trim().replace(/\s+/g," ").toLocaleLowerCase("sk");
  const existingNames=new Set(t.teachers.list.map(item=>normalizeName(item.name)));
  const newTeachers=teachers.filter(teacher=>!existingNames.has(normalizeName(teacher.name)));

  return <section id="teachers" className="section bg-white py-24">
    <div className="container">
      <div className="mx-auto max-w-3xl text-center">
        <p className="section-label text-[#2F3AA2]">{sk?"Naši lektori":"Our teachers"}</p>
        <h2 className="mt-4 text-3xl font-bold sm:text-4xl">{sk?"Spoznajte lektorov Mundus":"Meet the Mundus teachers"}</h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
          {sk
            ?"Pri priradení zohľadňujeme jazyk, úroveň, vaše ciele aj časové možnosti. Konkrétnu dostupnosť vhodného lektora vždy overíme."
            :"We match teachers based on language, level, goals and availability, and confirm the right teacher before lessons begin."}
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
        {t.teachers.list.map((teacher,index)=>
          <motion.article key={teacher.name} initial="hidden" whileInView="visible" viewport={{once:true,margin:"-40px"}} variants={fade} className="group overflow-hidden rounded-3xl border border-[#E5E7F0] bg-white shadow-[0_10px_30px_rgba(23,26,43,0.045)] transition hover:-translate-y-1 hover:border-[#C7D2FE] hover:shadow-[0_18px_42px_rgba(47,58,162,0.09)]">
            <div className="relative aspect-[4/3] overflow-hidden bg-[#F3F5FB]">
              <Image src={existingTeacherImages[index]} alt={teacher.name} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"/>
            </div>
            <div className="p-5">
              <h3 className="text-xl font-semibold text-[#171A2B]">{teacher.name}</h3>
              <p className="mt-1 text-sm font-semibold text-[#2F3AA2]">{teacher.specialty}</p>
              <p className="mt-3 text-sm leading-6 text-gray-600">{teacher.description}</p>
            </div>
          </motion.article>
        )}

        {newTeachers.map(teacher=>
          <motion.article key={teacher.id} initial="hidden" whileInView="visible" viewport={{once:true,margin:"-40px"}} variants={fade} className="group overflow-hidden rounded-3xl border border-[#E5E7F0] bg-white shadow-[0_10px_30px_rgba(23,26,43,0.045)] transition hover:-translate-y-1 hover:border-[#C7D2FE] hover:shadow-[0_18px_42px_rgba(47,58,162,0.09)]">
            <div className="relative aspect-[4/3] overflow-hidden bg-[#EEF2FF]">
              {teacher.photoUrl
                ? <>
                    {/* Dynamic Supabase-hosted teacher photos intentionally use the public object URL directly. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={teacher.photoUrl} alt={teacher.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"/>
                  </>
                : <div className="flex h-full items-center justify-center text-6xl font-semibold text-[#2F3AA2]">{teacher.name.slice(0,1).toUpperCase()}</div>}
            </div>
            <div className="p-5">
              <h3 className="text-xl font-semibold text-[#171A2B]">{teacher.name}</h3>
              {teacher.headline&&<p className="mt-1 text-sm font-semibold text-[#2F3AA2]">{teacher.headline}</p>}
              <p className="mt-3 text-sm leading-6 text-gray-600">{teacher.bio}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {teacher.languages.map(item=><span key={item} className="rounded-full bg-[#EEF2FF] px-2.5 py-1 text-xs font-medium text-[#2F3AA2]">{displayLanguage(item)}</span>)}
              </div>
            </div>
          </motion.article>
        )}
      </div>

      <div className="mt-10 text-center">
        <Link href="/#buy-packages" className="inline-flex rounded-xl bg-[#2F3AA2] px-6 py-3 font-semibold text-white">{sk?"Vybrať balíček":"Choose a package"}</Link>
      </div>
    </div>
  </section>;
}
