"use client";

import { Quote } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { PUBLIC_TESTIMONIALS } from "@/data/public-testimonials";

export default function TestimonialsSection() {
  const { language } = useLanguage();
  const sk = language === "sk";
  if (!PUBLIC_TESTIMONIALS.length) {
    const goals = sk
      ? [
          ["Chcem sa konečne rozrozprávať", "Praktická konverzácia, menej strachu z chýb a viac reálneho hovorenia."],
          ["Potrebujem jazyk do práce", "Meetingy, e-maily, prezentácie a slovná zásoba podľa pracovných situácií."],
          ["Chcem sa dohovoriť na cestách", "Letisko, hotel, reštaurácia, doprava a bežné situácie bez zbytočnej teórie."],
        ]
      : [
          ["I want to finally start speaking", "Practical conversation, less fear of mistakes and more real speaking."],
          ["I need the language for work", "Meetings, emails, presentations and vocabulary built around workplace situations."],
          ["I want to communicate while travelling", "Airports, hotels, restaurants, transport and everyday situations without unnecessary theory."],
        ];
    return <section className="bg-white py-24">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">{sk ? "Najčastejšie ciele študentov" : "Common learner goals"}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{sk ? "Výučba sa prispôsobí tomu, čo chcete reálne dosiahnuť" : "Lessons adapt to what you actually want to achieve"}</h2>
          <p className="mt-3 text-sm leading-6 text-gray-500">{sk ? "Toto nie sú recenzie ani vymyslené citácie — sú to typické ciele, s ktorými študenti prichádzajú." : "These are not reviews or fabricated quotes — they are typical learning goals students come with."}</p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">{goals.map(([title,text],index)=><article key={title} className="group relative overflow-hidden rounded-3xl border border-[#E5E7F0] bg-[#FAFAF9] p-6 transition hover:-translate-y-1 hover:border-[#C7CDF6] hover:shadow-[0_18px_40px_rgba(47,58,162,.08)]"><div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#EEF2FF] transition duration-500 group-hover:scale-125"/><Quote size={22} className="relative text-[#2F3AA2]"/><p className="relative mt-4 text-lg font-semibold text-[#171A2B]">{title}</p><p className="relative mt-3 leading-7 text-gray-600">{text}</p><span className="relative mt-5 inline-block text-xs font-semibold uppercase tracking-[.12em] text-gray-400">{sk ? `Typický cieľ 0${index+1}` : `Typical goal 0${index+1}`}</span></article>)}</div>
      </div>
    </section>;
  }

  return <section className="bg-white py-24">
    <div className="container">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">{sk ? "Skúsenosti študentov" : "Student experiences"}</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{sk ? "Čo hovoria študenti Mundus" : "What Mundus students say"}</h2>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {PUBLIC_TESTIMONIALS.map((item,index)=><article key={item.name+"-"+index} className="rounded-3xl border border-[#E5E7F0] bg-[#FAFAF9] p-6">
          <Quote size={22} className="text-[#2F3AA2]" />
          <p className="mt-4 leading-7 text-gray-700">“{item.quote}”</p>
          <p className="mt-5 font-semibold">{item.name}</p>
          {(item.language||item.detail)&&<p className="mt-1 text-sm text-gray-500">{[item.language,item.detail].filter(Boolean).join(" · ")}</p>}
        </article>)}
      </div>
    </div>
  </section>;
}
