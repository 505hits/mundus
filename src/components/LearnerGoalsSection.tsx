"use client";

import Link from "next/link";
import { BriefcaseBusiness, GraduationCap, MessageCircleMore, Plane, Sparkles, Sprout } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const options = [
  { icon: Sprout, sk: "Začínam úplne od nuly", en: "I'm starting from zero", detailSk: "Chcem jasný plán, základy a postup bez stresu.", detailEn: "I want a clear plan, strong foundations and a stress-free start.", href: "/languages?goal=beginner" },
  { icon: MessageCircleMore, sk: "Rozumiem, ale neviem sa rozrozprávať", en: "I understand, but I struggle to speak", detailSk: "Potrebujem viac konverzácie, istoty a spontánneho hovorenia.", detailEn: "I need more conversation, confidence and spontaneous speaking.", href: "/languages?goal=speaking" },
  { icon: Plane, sk: "Potrebujem jazyk na cestovanie", en: "I need the language for travel", detailSk: "Chcem zvládnuť reálne situácie na letisku, v hoteli či reštaurácii.", detailEn: "I want to handle real situations at airports, hotels and restaurants.", href: "/languages?goal=travel" },
  { icon: BriefcaseBusiness, sk: "Potrebujem jazyk do práce", en: "I need the language for work", detailSk: "Meetingy, e-maily, prezentácie a slovná zásoba podľa mojej práce.", detailEn: "Meetings, emails, presentations and vocabulary tailored to my work.", href: "/languages?goal=work" },
  { icon: GraduationCap, sk: "Chcem sa posunúť na vyššiu úroveň", en: "I want to reach the next level", detailSk: "Chcem systematicky zlepšiť gramatiku, slovnú zásobu aj plynulosť.", detailEn: "I want to improve grammar, vocabulary and fluency systematically.", href: "/languages?goal=level-up" },
  { icon: Sparkles, sk: "Neviem presne, čo potrebujem", en: "I'm not sure what I need yet", detailSk: "Pomôžeme vám vybrať jazyk, formát aj tempo podľa vášho cieľa.", detailEn: "We'll help you choose the right language, format and pace for your goal.", href: "/contact" },
];

export default function LearnerGoalsSection() {
  const { language } = useLanguage();
  const sk = language === "sk";
  const prefix = `/${language}`;

  return (
    <section className="bg-white py-24">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">
            {sk ? "Začnite podľa seba" : "Start with your goal"}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {sk ? "Čo vás vystihuje najviac?" : "Which one sounds most like you?"}
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            {sk
              ? "Nemusíte poznať svoju úroveň. Vyberte si cieľ a Mundus vám pomôže nájsť najjednoduchšiu cestu, ako začať."
              : "You don't need to know your exact level. Choose your goal and Mundus will help you find the simplest way to start."}
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {options.map(({ icon: Icon, sk: titleSk, en: titleEn, detailSk, detailEn, href }) => (
            <Link
              key={titleEn}
              href={href.startsWith("/") && href !== "/contact" ? `${prefix}${href}` : href === "/contact" ? `${prefix}/contact` : href}
              className="group rounded-3xl border border-[#E5E7F0] bg-[#FAFAF9] p-6 transition hover:-translate-y-1 hover:border-[#C7CDF6] hover:bg-white hover:shadow-[0_18px_42px_rgba(47,58,162,.08)]"
            >
              <div className="inline-flex rounded-2xl bg-[#EEF2FF] p-3 text-[#2F3AA2] transition group-hover:scale-105">
                <Icon size={22} />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-[#171A2B]">{sk ? titleSk : titleEn}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{sk ? detailSk : detailEn}</p>
              <span className="mt-5 inline-flex text-sm font-semibold text-[#2F3AA2]">
                {sk ? "Nájsť vhodnú možnosť →" : "Find the right option →"}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
