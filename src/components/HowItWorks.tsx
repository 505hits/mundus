"use client";

import { motion } from "framer-motion";

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const steps = [
    {
        number: "01",
        title: "Urobte si rýchly test",
        description: "Zistite svoju úroveň za 2 minúty — žiadny stres, len východiskový bod.",
    },
    {
        number: "02",
        title: "Vyberte si kurz",
        description: "Zvoľte plán, ktorý sedí vašim cieľom: začiatočník, konverzácia, biznis alebo príprava na skúšky.",
    },
    {
        number: "03",
        title: "Začnite sa učiť online",
        description: "Prístup k lekciám kedykoľvek a živé videohovory s rodenými lektormi.",
    },
    {
        number: "04",
        title: "Zlepšujte sa každý deň",
        description: "Sledujte svoj pokrok, odomykajte nové témy a buďte konzistentní vďaka smart pripomienkam.",
    },
];

export default function HowItWorks() {
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
                    <motion.span variants={fadeInUp} className="section-label">
                        Jednoduchý proces
                    </motion.span>
                    <motion.h2 variants={fadeInUp} className="section-title">
                        Ako to <span className="accent-word">funguje</span>
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="section-subtitle">
                        Začnite v priebehu pár minút — vyberte si cestu, učte sa vlastným tempom a vidíte skutočný pokrok.
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
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.number}
                            variants={fadeInUp}
                            whileHover={{ y: -4 }}
                            className="step-card"
                        >
                            <motion.div
                                className="step-number"
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
