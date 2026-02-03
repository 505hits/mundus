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

const imageReveal = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.6, ease: "easeOut" as const }
    },
};

const teachers = [
    {
        name: "Emma Collins",
        flag: "🇬🇧",
        specialty: "IELTS preparation expert",
        description: "Helping you speak clearly and boost your exam scores.",
        image: "/Gemini_Generated_Image_18c8g018c8g018c8.png",
    },
    {
        name: "James Turner",
        flag: "🇺🇸",
        specialty: "Business English coach",
        description: "Teaching real communication skills for work and interviews.",
        image: "/Gemini_Generated_Image_chlddschlddschld.png",
    },
    {
        name: "Giulia Romano",
        flag: "🇮🇹",
        specialty: "Italian culture & grammar",
        description: "Helping you sound natural and confident in Italian.",
        image: "/Gemini_Generated_Image_mg96o0mg96o0mg96.png",
    },
    {
        name: "Rafael Santos",
        flag: "🇧🇷",
        specialty: "Brazilian Portuguese",
        description: "Building speaking skills through guided conversation.",
        image: "/Gemini_Generated_Image_va7nhvva7nhvva7n.png",
    },
];

export default function TeacherSection() {
    return (
        <section id="teachers" className="section gradient-section">
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
                        Our teachers
                    </motion.span>
                    <motion.h2 variants={fadeInUp} className="section-title">
                        Meet your <span className="accent-word">teachers</span>
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="section-subtitle">
                        Join live sessions with native teachers — included in the Pro plan, twice a week.
                    </motion.p>
                </motion.div>

                {/* Teachers Grid */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={stagger}
                    className="teacher-grid"
                >
                    {teachers.map((teacher, index) => (
                        <motion.div
                            key={teacher.name}
                            variants={imageReveal}
                            className="teacher-card"
                        >
                            <motion.div
                                className="teacher-image"
                                whileHover={{ scale: 1.03 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Image
                                    src={teacher.image}
                                    alt={teacher.name}
                                    width={400}
                                    height={500}
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                            <div className="teacher-specialty">{teacher.specialty}</div>
                            <div className="teacher-name">
                                {teacher.name} {teacher.flag}
                            </div>
                            <p className="teacher-desc">{teacher.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
