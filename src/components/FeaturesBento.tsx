"use client";

import { motion } from "framer-motion";
import { Users, Brain, CalendarClock, UserRoundCheck, MessageCircle, MessageSquareText } from "lucide-react";

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};


const featureIcons = [
    Users,
    Brain,
    CalendarClock,
    UserRoundCheck,
    MessageCircle,
    MessageSquareText,
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
                    <motion.span variants={fadeInUp} className="section-label inline-block px-4 py-1.5 rounded-full bg-blue-50 text-[#2F3AA2] font-semibold text-sm mb-4">
                        {t.features.label}
                    </motion.span>
                    <motion.h2 variants={fadeInUp} className="section-title text-4xl md:text-5xl font-bold mb-6">
                        {t.features.titleStart} <span className="accent-word text-[#2F3AA2]">{t.features.titleEnd}</span>
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
                        const FeatureIcon = featureIcons[index];

                        return (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                whileHover={{ y: -5, transition: { duration: 0.3 } }}
                                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#E5E7F0] bg-white p-7 shadow-[0_10px_30px_rgba(23,26,43,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#C7D2FE] hover:shadow-[0_18px_42px_rgba(47,58,162,0.09)]"
                            >
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-[#2F3AA2] opacity-[0.1] rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500`} />

                                <div className={`w-14 h-14 rounded-2xl bg-[#2F3AA2] flex items-center justify-center text-white mb-6 shadow-[0_10px_24px_rgba(47,58,162,0.2)] group-hover:scale-110 transition-transform duration-300`}>
                                    <FeatureIcon size={28} />
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#2F3AA2] transition-colors">{feature.title}</h3>
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
