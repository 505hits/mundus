"use client";
import { useLanguage } from "@/context/LanguageContext";

export default function TeacherSection() {
  const { language } = useLanguage();
  const sk = language === "sk";
  return <section id="teachers" className="section bg-white py-24"><div className="container max-w-4xl text-center">
    <p className="section-label text-[#2F3AA2]">{sk ? "Výučba s lektorom" : "Learning with a teacher"}</p>
    <h2 className="mt-4 text-3xl font-bold sm:text-4xl">{sk ? "Lektor podľa vašich potrieb" : "A teacher for your goals"}</h2>
    <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">{sk ? "Pomôžeme vám dohodnúť individuálnu online výučbu podľa jazyka, úrovne, cieľov a dostupných termínov. Hodiny sú zamerané na to, čo potrebujete v praxi." : "We help arrange individual online lessons for your language, level, goals and available times. Lessons focus on the language you need in practice."}</p>
    <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-gray-600">{sk ? "Ak je pre vás dôležitý rodený hovoriaci alebo vysvetľovanie v slovenčine, napíšte nám. Dostupnosť vhodného lektora overíme pred dohodnutím výučby." : "If you need a native speaker or explanations in Slovak, tell us. We will check suitable teacher availability before arranging lessons."}</p>
    <a href="/contact" className="mt-7 inline-flex rounded-xl bg-[#2F3AA2] px-6 py-3 font-semibold text-white">{sk ? "Dohodnúť výučbu" : "Arrange lessons"}</a>
  </div></section>;
}
