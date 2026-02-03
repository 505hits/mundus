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

const languages = [
    { name: "English", native: "English", code: "gb", delay: 0 },
    { name: "Spanish", native: "Español", code: "es", delay: 0.2 },
    { name: "Italian", native: "Italiano", code: "it", delay: 0.4 },
    // Portuguese removed as requested
];

const floatingFlags = [
    { code: "gb", x: "5%", y: "15%", delay: 0, size: 50 },
    { code: "es", x: "90%", y: "20%", delay: 1, size: 60 },
    { code: "ru", x: "10%", y: "70%", delay: 2, size: 45 },
    { code: "it", x: "85%", y: "80%", delay: 0.5, size: 55 },
    { code: "cn", x: "60%", y: "10%", delay: 1.5, size: 40 }, // Moved higher
    { code: "fr", x: "25%", y: "15%", delay: 2.5, size: 35 },
    { code: "de", x: "75%", y: "30%", delay: 1.2, size: 40 },
];

export default function LanguageSelector() {
    return (
        <section id="languages" className="section relative overflow-hidden bg-gradient-to-b from-blue-50/20 to-white py-12 md:py-24">
            {/* Background Floating Flags - Adjusted positions to avoid center text */}
            <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
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
                            y: [0, -15, 0],
                            x: [0, 8, 0],
                            rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                            duration: 6 + i,
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
                        <span className="px-5 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-bold border border-blue-100 uppercase tracking-wide">
                            Choose your language
                        </span>
                    </motion.div>
                    <motion.h2 variants={fadeInUp} className="section-title text-5xl md:text-7xl font-bold mb-8 text-gray-900 tracking-tight leading-none">
                        Choose the right course <br className="hidden md:block" />
                        for your <span className="text-primary relative inline-block">
                            goals
                            <svg className="absolute w-full h-3 bottom-0 left-0 text-yellow-300 -z-10 opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                            </svg>
                        </span>
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="section-subtitle text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-medium">
                        Select your desired language and connect with native-speaking tutors
                        from around the world.
                    </motion.p>
                </motion.div>

            </div>
        </section>
    );
}
