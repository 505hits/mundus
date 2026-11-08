"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import PurchasePackages from "@/components/PurchasePackages";
import { useLanguage } from "@/context/LanguageContext";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function PricingSection({ paymentsAvailable = false }: { paymentsAvailable?: boolean }) {
  const { t, language } = useLanguage();
  const sk = language === "sk";

  return (
    <section id="pricing" className="relative overflow-hidden bg-[#FAFAF9] py-24">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-52 top-16 h-96 w-96 rounded-full bg-[#DDE2FB]/60 blur-3xl" />
        <div className="absolute -left-52 bottom-10 h-80 w-80 rounded-full bg-[#E8EAF8]/70 blur-3xl" />
      </div>

      <div className="container relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <span className="inline-block rounded-full border border-[#DDE2FB] bg-white px-4 py-1.5 text-sm font-semibold text-[#2F3AA2] shadow-sm">
            {t.pricing.label}
          </span>

          <h2 className="mt-5 text-4xl font-semibold tracking-tight text-[#171A2B] md:text-5xl">
            {t.pricing.titleStart}{" "}
            <span className="text-[#2F3AA2]">{t.pricing.titleEnd}</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-600">
            {t.pricing.subtitle}
          </p>

          <p className="mt-4 text-sm font-medium text-[#2F3AA2]">
            {sk
              ? "Bez automatického predplatného — vyberiete si len počet hodín, ktorý vám vyhovuje."
              : "No automatic renewal or recurring subscription — simply choose the number of lessons that suits you."}
          </p>
        </motion.div>

        <div className="relative mb-7 h-44 overflow-hidden rounded-[1.65rem] bg-[#DDE2FB] sm:mb-9 sm:h-56">
          <Image unoptimized src="/images/mundus/DeRGioptTPN.webp" alt={sk ? "Fotografia Mundus" : "Mundus photo"} fill sizes="(max-width: 900px) 95vw, 1100px" className="object-cover object-center"/>
          <div className="absolute inset-0 bg-gradient-to-r from-[#171A2B]/90 via-[#171A2B]/50 to-transparent"/>
          <div className="absolute inset-y-0 left-0 flex max-w-lg flex-col justify-center p-5 text-white sm:p-9">
            <p className="text-xs font-bold uppercase tracking-[.15em] text-[#C7D2FE]">{sk ? "Výučba podľa vás" : "Learning your way"}</p>
            <p className="mt-2 text-xl font-semibold leading-tight sm:text-3xl">{sk ? "Vyberte si balíček. Ostatné doladíme spolu." : "Pick your package. We'll tailor the rest."}</p>
            
          </div>
        </div>
        <PurchasePackages paymentsAvailable={paymentsAvailable} />
      </div>
    </section>
  );
}
