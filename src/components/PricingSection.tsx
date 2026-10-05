"use client";

import { motion } from "framer-motion";
import PurchasePackages from "@/components/PurchasePackages";
import { useLanguage } from "@/context/LanguageContext";

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function PricingSection({ paymentsAvailable = false, signupAvailable = false }: { paymentsAvailable?: boolean; signupAvailable?: boolean }) {
    const { t } = useLanguage();

    return (
        <section id="pricing" className="section bg-white py-24 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -right-64 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -left-64 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl" />
            </div>

            <div className="container relative z-10">
                {/* Header */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeInUp}
                    className="section-header text-center mb-16"
                >
                    <span className="section-label inline-block px-4 py-1.5 rounded-full bg-[#EEF2FF] text-[#2F3AA2] font-semibold text-sm mb-4">
                        {t.pricing.label}
                    </span>
                    <h2 className="section-title text-4xl md:text-5xl font-bold mb-6">
                        {t.pricing.titleStart} <span className="accent-word relative inline-block text-[#2F3AA2]">
                            {t.pricing.titleEnd}
                            <svg className="absolute w-full h-3 bottom-0 left-0 text-indigo-200 -z-10 opacity-40" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                            </svg>
                        </span>
                    </h2>
                    <p className="section-subtitle text-lg text-gray-600 max-w-2xl mx-auto">
                        {t.pricing.subtitle}
                    </p>
                </motion.div>

                <PurchasePackages paymentsAvailable={paymentsAvailable} signupAvailable={signupAvailable} />

            </div>
        </section>
    );
}
