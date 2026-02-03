"use client";

import { motion } from "framer-motion";

import { useLanguage } from "@/context/LanguageContext";

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function HowItWorks() {
    const { t } = useLanguage();
    return (
        <section id="how-it-works" className="section">
            <div className="container">
                {/* Header */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={stagger}
                    className="section-header"
                >
                    <motion.span variants={fadeInUp} className="section-label inline-block px-4 py-1.5 rounded-full bg-lime-100 text-lime-700 font-semibold text-sm mb-4">
                        {t.howItWorks.label}
                    </motion.span>
                    <motion.h2 variants={fadeInUp} className="section-title">
                        {t.howItWorks.titleStart} <span className="accent-word text-lime-600">{t.howItWorks.titleEnd}</span>
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="section-subtitle">
                        {t.howItWorks.subtitle}
                    </motion.p>
                </motion.div>

                {/* Steps Grid */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={stagger}
                    className="steps-grid"
                >
                    {t.howItWorks.steps.map((step, index) => (
                        <motion.div
                            key={index}
                            variants={fadeInUp}
                            whileHover={{ y: -4 }}
                            className="step-card"
                        >
                            <motion.div
                                className="step-number bg-lime-400 text-lime-900"
                                whileHover={{ scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                                {step.number}
                            </motion.div>
                            <h3 className="step-title">{step.title}</h3>
                            <p className="step-desc">{step.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
