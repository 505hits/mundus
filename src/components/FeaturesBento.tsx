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
        color: "from-blue-500 to-indigo-600",
        shadow: "shadow-blue-200",
    },
    {
        icon: Brain,
        title: "Smart sledovanie pokroku",
        description: "Sledujte svoju cestu učením a prispôsobte lekcie svojmu tempu.",
        color: "from-purple-500 to-pink-500",
        shadow: "shadow-purple-200",
    },
    {
        icon: Globe,
        title: "Dostupnosť 24/7",
        description: "Nájdite tútorov vo všetkých časových pásmach, pripravených keď ste vy.",
        color: "from-teal-400 to-emerald-500",
        shadow: "shadow-teal-200",
    },
    {
        icon: Zap,
        title: "Okamžité priradenie",
        description: "Získajte perfektného tútora za pár sekúnd na základe vašich cieľov.",
        color: "from-amber-400 to-orange-500",
        shadow: "shadow-amber-200",
    },
    {
        icon: MessageCircle,
        title: "Skutočné konverzácie",
        description: "Precvičujte autentické dialógy, nie napísané scenáre.",
        color: "from-rose-400 to-red-500",
        shadow: "shadow-rose-200",
    },
    {
        icon: Award,
        title: "Certifikovaný pokrok",
        description: "Získajte personalizovaný certifikát po dokončení kurzu.",
        color: "from-cyan-400 to-blue-500",
        shadow: "shadow-cyan-200",
    },
];

export default function FeaturesBento() {
    return (
        <section id="features" className="section py-24 bg-gray-50/50">
            <div className="container">
                {/* Header */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={stagger}
                    className="section-header text-center mb-16"
                >
                    <motion.span variants={fadeInUp} className="section-label inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm mb-4">
                        Prečo Mundus
                    </motion.span>
                    <motion.h2 variants={fadeInUp} className="section-title text-4xl md:text-5xl font-bold mb-6">
                        Všetko čo potrebujete na <span className="accent-word text-blue-600">úspech</span>
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="section-subtitle text-lg text-gray-600 max-w-2xl mx-auto">
                        Nie len ďalší kurz — Mundus spája smart nástroje so skutočnou konverzáciou.
                    </motion.p>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={stagger}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {features.map((feature) => (
                        <motion.div
                            key={feature.title}
                            variants={cardReveal}
                            whileHover={{ y: -8, transition: { duration: 0.2 } }}
                            className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all"
                        >
                            <motion.div
                                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} text-white flex items-center justify-center mb-6 shadow-lg ${feature.shadow}`}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                                <feature.icon size={30} strokeWidth={1.5} />
                            </motion.div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
