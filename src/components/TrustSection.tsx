"use client";

import { CalendarClock, ShieldCheck, UserRoundCheck, WalletCards } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function TrustSection() {
  const { language } = useLanguage();
  const sk = language === "sk";
  const items = sk ? [
    ["1:1 výučba", "Každý balíček je určený na individuálne 60-minútové online hodiny."],
    ["Flexibilné termíny", "Preferované dni a časy zadáte po platbe a konkrétne hodiny sa dohodnú podľa dostupnosti."],
    ["Schválené priradenie", "Systém odporučí vhodných lektorov, ale finálne priradenie schvaľuje Mundus."],
    ["Bez automatického predplatného", "Ďalší balíček si kúpite len vtedy, keď chcete pokračovať."],
  ] : [
    ["1:1 teaching", "Every package is for individual 60-minute online lessons."],
    ["Flexible scheduling", "Enter preferred days and times after payment; specific lessons are arranged around availability."],
    ["Approved matching", "The system recommends suitable teachers, but Mundus approves the final match."],
    ["No automatic subscription", "Buy another package only when you want to continue."],
  ];
  const icons=[UserRoundCheck,CalendarClock,ShieldCheck,WalletCards];

  return <section className="bg-[#FAFAF9] py-16">
    <div className="container">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(([title,desc],i) => {
          const Icon=icons[i];
          return <div key={title} className="rounded-2xl border border-[#E5E7F0] bg-white p-5 shadow-sm">
            <Icon size={22} className="text-[#2F3AA2]" />
            <p className="mt-4 font-semibold">{title}</p>
            <p className="mt-2 text-sm leading-6 text-gray-600">{desc}</p>
          </div>;
        })}
      </div>
    </div>
  </section>;
}
