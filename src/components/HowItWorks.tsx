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
        title: "Take a quick test",
        description: "Find your level in just 2 minutes — no pressure, just a starting point.",
    },
    {
        number: "02",
        title: "Choose your course",
        description: "Pick the plan that fits your goals: beginner, conversation, business, or exam prep.",
    },
    {
        number: "03",
        title: "Start learning online",
        description: "Access lessons anytime and join live video calls with native-speaking tutors.",
    },
    {
        number: "04",
        title: "Improve every day",
        description: "Track your progress, unlock new topics, and stay consistent with smart reminders.",
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
                        Simple process
                    </motion.span>
                    <motion.h2 variants={fadeInUp} className="section-title">
                        How it <span className="accent-word">works</span>
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="section-subtitle">
                        Get started in minutes — choose your path, learn at your pace, and see real progress.
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
