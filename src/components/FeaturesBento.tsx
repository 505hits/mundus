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
        title: "Native-speaker interaction",
        description: "No extra apps or platforms — talk to real teachers directly inside Mundus.",
    },
    {
        icon: Brain,
        title: "AI-powered progress",
        description: "Smart algorithms track your learning and adapt lessons to your pace.",
    },
    {
        icon: Globe,
        title: "24/7 availability",
        description: "Find tutors across all time zones, ready when you are.",
    },
    {
        icon: Zap,
        title: "Instant matching",
        description: "Get paired with the perfect tutor in seconds based on your goals.",
    },
    {
        icon: MessageCircle,
        title: "Real conversations",
        description: "Practice authentic dialogues, not scripted scenarios.",
    },
    {
        icon: Award,
        title: "Certified progress",
        description: "Receive a personalized certificate when you complete your course.",
    },
];

export default function FeaturesBento() {
    return (
        <section id="features" className="section">
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
                        Why Mundus
                    </motion.span>
                    <motion.h2 variants={fadeInUp} className="section-title">
                        Everything you need to <span className="accent-word">succeed</span>
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="section-subtitle">
                        Not just another course — Mundus blends smart tools with real conversation.
                    </motion.p>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={stagger}
                    className="features-grid"
                >
                    {features.map((feature) => (
                        <motion.div
                            key={feature.title}
                            variants={cardReveal}
                            whileHover={{ y: -8, transition: { duration: 0.2 } }}
                            className="feature-card"
                        >
                            <motion.div
                                className="feature-icon"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                                <feature.icon size={24} />
                            </motion.div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-desc">{feature.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
