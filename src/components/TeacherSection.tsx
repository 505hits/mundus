"use client";
import { useLanguage } from "@/context/LanguageContext";
import { MUNDUS_LANGUAGE_OPTIONS } from "@/lib/language-offer";
type PublicTeacher={id:string;name:string;headline:string;bio:string;languages:string[];photoUrl:string|null};

export default function TeacherSection({teachers}:{teachers:PublicTeacher[]}) {
  const { language } = useLanguage();
  const sk = language === "sk";
  const displayLanguage=(value:string)=>sk ? MUNDUS_LANGUAGE_OPTIONS.find(item=>item.value===value)?.label ?? value : value;
  return <section id="teachers" className="section bg-white py-24"><div className="container">
    <div className="mx-auto max-w-3xl text-center">
      <p className="section-label text-[#2F3AA2]">{sk ? "Naši lektori" : "Our teachers"}</p>
      <h2 className="mt-4 text-3xl font-bold sm:text-4xl">{sk ? "Lektor podľa vašich potrieb" : "A teacher for your goals"}</h2>
      <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">{sk ? "Pri výbere berieme do úvahy jazyk, úroveň, cieľ aj dostupné termíny. Po zakúpení balíčka vám odporučíme najvhodnejších lektorov." : "We match teachers based on language, level, goals and availability. After purchasing a package, we recommend the best-fit teachers."}</p>
    </div>
    {teachers.length>0?<div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{teachers.map(teacher=><article key={teacher.id} className="overflow-hidden rounded-3xl border border-black/5 bg-[#FAFAF9] shadow-sm">
      {teacher.photoUrl?<img src={teacher.photoUrl} alt={teacher.name} className="aspect-square w-full object-cover"/>:<div className="flex aspect-square items-center justify-center bg-[#EEF2FF] text-5xl font-semibold text-[#2F3AA2]">{teacher.name.slice(0,1).toUpperCase()}</div>}
      <div className="p-5"><h3 className="text-lg font-semibold">{teacher.name}</h3>{teacher.headline&&<p className="mt-1 text-sm font-medium text-[#2F3AA2]">{teacher.headline}</p>}<p className="mt-3 text-sm leading-6 text-gray-600">{teacher.bio}</p><div className="mt-4 flex flex-wrap gap-2">{teacher.languages.map(item=><span key={item} className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-gray-600">{displayLanguage(item)}</span>)}</div></div>
    </article>)}</div>:<div className="mx-auto mt-10 max-w-2xl rounded-3xl bg-[#EEF2FF] p-6 text-center text-gray-700">{sk?"Lektora vyberáme individuálne podľa vašich potrieb a dostupnosti.":"We select your teacher individually based on your needs and availability."}</div>}
    <div className="mt-10 text-center"><a href="/#buy-packages" className="inline-flex rounded-xl bg-[#2F3AA2] px-6 py-3 font-semibold text-white">{sk ? "Vybrať balíček" : "Choose a package"}</a></div>
  </div></section>;
}
