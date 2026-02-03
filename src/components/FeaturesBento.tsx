"use client";

import { motion } from "framer-motion";
import { Users, Brain, Globe, Zap, MessageCircle, Award } from "lucide-react";

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const cardReveal = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.5, ease: "easeOut" as const }
    },
};

const features = [
    {
        icon: Users,
        title: "Interakcia s rodeným hovorcom",
        description: "Žiadne ďalšie aplikácie alebo platformy — hovorte so skutočnými učiteľmi priamo v Mundus.",
        color: "from-lime-400 to-lime-600",
        shadow: "shadow-lime-200",
    },
    {
        icon: Brain,
        title: "Smart sledovanie pokroku",
        description: "Sledujte svoju cestu učením a prispôsobte lekcie svojmu tempu.",
        color: "from-lime-400 to-lime-600",
        shadow: "shadow-lime-200",
    },
    {
        icon: Globe,
        title: "Dostupnosť 24/7",
        description: "Nájdite tútorov vo všetkých časových pásmach, pripravených keď ste vy.",
        color: "from-lime-400 to-lime-600",
        shadow: "shadow-lime-200",
    },
    {
        icon: Zap,
        title: "Okamžité priradenie",
        description: "Získajte perfektného tútora za pár sekúnd na základe vašich cieľov.",
        color: "from-lime-400 to-lime-600",
        shadow: "shadow-lime-200",
    },
    {
        icon: MessageCircle,
        title: "Skutočné konverzácie",
        description: "Precvičujte autentické dialógy, nie napísané scenáre.",
        color: "from-lime-400 to-lime-600",
        shadow: "shadow-lime-200",
    },
    {
        icon: Award,
        title: "Certifikovaný pokrok",
        description: "Získajte personalizovaný certifikát po dokončení kurzu.",
        color: "from-lime-400 to-lime-600",
        shadow: "shadow-lime-200",
    },
];

import { useLanguage } from "@/context/LanguageContext";

export default function FeaturesBento() {
    const { t } = useLanguage();
    return (
        <section id="features" className="section py-24 bg-gray-50/50">
            <div className="container relative z-10">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={stagger}
                    className="section-header text-center mb-16"
                >
                    <motion.span variants={fadeInUp} className="section-label inline-block px-4 py-1.5 rounded-full bg-lime-100 text-lime-700 font-semibold text-sm mb-4">
                        {t.features.label}
                    </motion.span>
                    <motion.h2 variants={fadeInUp} className="section-title text-4xl md:text-5xl font-bold mb-6">
                        {t.features.titleStart} <span className="accent-word text-lime-600">{t.features.titleEnd}</span>
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="section-subtitle text-lg text-gray-600 max-w-2xl mx-auto">
                        {t.features.subtitle}
                    </motion.p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={stagger}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(180px,auto)]"
                >
                    {t.features.items.map((feature, index) => {
                        // We map the static icons to the translated items based on index
                        const FeatureIcon = features[index].icon;

                        return (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                whileHover={{ y: -5, transition: { duration: 0.3 } }}
                                className={`group relative p-8 rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-lime-200/50 transition-all duration-300 overflow-hidden flex flex-col justify-between ${index === 0 || index === 3 ? "md:col-span-1" : ""
                                    }`}
                            >
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-[#BFFF00] opacity-[0.1] rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500`} />

                                <div className={`w-14 h-14 rounded-2xl bg-[#BFFF00] flex items-center justify-center text-black mb-6 shadow-lg shadow-lime-200/50 group-hover:scale-110 transition-transform duration-300`}>
                                    <FeatureIcon size={28} />
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                                    <p className="text-gray-500 leading-relaxed text-[15px]">{feature.description}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
