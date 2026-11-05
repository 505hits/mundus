"use client";

import { Quote } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { PUBLIC_TESTIMONIALS } from "@/data/public-testimonials";

export default function TestimonialsSection() {
  const { language } = useLanguage();
  const sk = language === "sk";
  if (!PUBLIC_TESTIMONIALS.length) return null;

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
