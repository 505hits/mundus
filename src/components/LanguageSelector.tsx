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
    { name: "Portuguese", native: "Português", code: "br", delay: 0.6 },
];

export default function LanguageSelector() {
    return (
        <section id="languages" className="section gradient-green">
            <div className="container">
                {/* Header */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={stagger}
                    className="section-header"
                >
                    <motion.span variants={fadeInUp} className="section-label">
                        Choose your language
                    </motion.span>
                    <motion.h2 variants={fadeInUp} className="section-title">
                        Choose the right course for your goals
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="section-subtitle">
                        Select your desired language and connect with native-speaking tutors
                        from around the world.
                    </motion.p>
                </motion.div>

                {/* Language Grid */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={stagger}
                    className="language-grid"
                >
                    {languages.map((lang) => (
                        <motion.div
                            key={lang.name}
                            variants={fadeInUp}
                            whileHover={{ scale: 1.02, y: -4 }}
                            className="language-card"
                        >
                            {/* Floating Flag Circle */}
                            <motion.div
                                className="flag-circle overflow-hidden relative"
                                animate={{
                                    y: [0, -8, 0],
                                    transition: {
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: lang.delay
                                    }
                                }}
                            >
                                <Image
                                    src={`https://flagcdn.com/w160/${lang.code}.png`}
                                    alt={`${lang.name} flag`}
                                    width={80}
                                    height={80}
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                            <div className="language-name">{lang.name}</div>
                            <div className="language-native">{lang.native}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
