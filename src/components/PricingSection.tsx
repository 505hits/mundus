"use client";

import { motion } from "framer-motion";
import PurchasePackages from "@/components/PurchasePackages";
import { useLanguage } from "@/context/LanguageContext";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function PricingSection({
  paymentsAvailable = false,
  signupAvailable = false,
}: {
  paymentsAvailable?: boolean;
  signupAvailable?: boolean;
}) {
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

        <PurchasePackages paymentsAvailable={paymentsAvailable} signupAvailable={signupAvailable} />
      </div>
    </section>
  );
}
