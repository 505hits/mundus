"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};


const floatingFlags = [
    { code: "gb", x: "5%", y: "15%", delay: 0, size: 50 },
    { code: "es", x: "90%", y: "20%", delay: 1, size: 60 },
    { code: "ru", x: "10%", y: "70%", delay: 2, size: 45 },
    { code: "it", x: "85%", y: "80%", delay: 0.5, size: 55 },
    { code: "cn", x: "60%", y: "10%", delay: 1.5, size: 40 }, // Moved higher
    { code: "fr", x: "25%", y: "15%", delay: 2.5, size: 35 },
    { code: "de", x: "75%", y: "30%", delay: 1.2, size: 40 },
];

import { useLanguage } from "@/context/LanguageContext";

export default function LanguageSelector() {
    const { t, language } = useLanguage();
    const offeredLanguages = language === "sk"
        ? ["Angličtina", "Nemčina", "Španielčina", "Taliančina", "Francúzština", "Portugalčina", "Maďarčina", "Poľština", "Ruština", "Čínština", "Slovenčina", "Ukrajinčina", "Moderná hebrejčina"]
        : ["English", "German", "Spanish", "Italian", "French", "Portuguese", "Hungarian", "Polish", "Russian", "Chinese", "Slovak", "Ukrainian", "Modern Hebrew"];
    return (
        <section id="languages" className="section relative overflow-hidden bg-gradient-to-b from-[#F3F5FB] to-white py-12 md:py-24">
            {/* Background Floating Flags - Adjusted positions to avoid center text */}
            <div className="pointer-events-none absolute inset-0 select-none overflow-hidden opacity-55">
                {floatingFlags.map((flag, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full shadow-sm overflow-hidden border border-white/40"
                        style={{
                            left: flag.x,
                            top: flag.y,
                            width: flag.size,
                            height: flag.size,
                        }}
                        animate={{
                            y: [0, -8, 0],
                            x: [0, 4, 0],
                        }}
                        transition={{
                            duration: 10 + i,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: flag.delay,
                        }}
                    >
                        <Image
                            src={`https://flagcdn.com/w160/${flag.code}.png`}
                            alt="flag"
                            fill
                            className="object-cover shadow-sm"
                        />
                    </motion.div>
                ))}
            </div>

            <div className="container relative z-10">
                {/* Header */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={stagger}
                    className="section-header text-center mb-0 relative z-10"
                >
                    <motion.div variants={fadeInUp} className="inline-block mb-6">
                        <span className="rounded-full border border-[#DDE2F4] bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#2F3AA2]">
                            {t.languageSelector.badge}
                        </span>
                    </motion.div>
                    <motion.h2 variants={fadeInUp} className="section-title mb-6 text-4xl font-semibold tracking-tight text-[#171A2B] md:text-5xl">
                        {t.languageSelector.title} <br className="hidden md:block" />
                        {t.languageSelector.titleBreak} <span className="relative inline-block text-[#2F3AA2]">
                            {t.languageSelector.goals}
                            
                        </span>
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="section-subtitle mx-auto max-w-3xl text-base text-gray-600 md:text-lg">
                        {t.languageSelector.subtitle}
                    </motion.p>
                    <motion.ul variants={fadeInUp} aria-label={language === "sk" ? "Ponúkané jazyky" : "Languages offered"} className="mx-auto mt-8 flex max-w-5xl flex-wrap justify-center gap-2">
                        {offeredLanguages.map((item) => <li key={item} className="rounded-full border border-[#E1E5F0] bg-white/90 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm">{item}</li>)}
                    </motion.ul>
                </motion.div>

            </div>
        </section>
    );
}
