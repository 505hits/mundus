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
    hidden: { opacity: 0, scale: 0.9, filter: "blur(10px)" },
    visible: {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        transition: { duration: 0.8, ease: "easeOut" as const }
    },
};

const teachers = [
    {
        name: "Aniko",
        flag: "🇬🇧",
        specialty: "British English Specialist",
        description: "Master the British accent and cultural nuances.",
        image: "/Aniko.png",
    },
    {
        name: "Dani",
        flag: "🇪🇸",
        specialty: "Conversational Spanish",
        description: "Fluid conversation practice for all levels.",
        image: "/Dani.png",
    },
    {
        name: "Jakub",
        flag: "🇪🇸",
        specialty: "Spanish Grammar Coach",
        description: "Master complex grammar with simple explanations.",
        image: "/Jakub.jpeg",
    },
    {
        name: "Alisa",
        flag: "🇷🇺",
        specialty: "Russian Native",
        description: "Immersive lessons in Russian language and culture.",
        image: "/alisa.JPG",
    },
    {
        name: "Roland",
        flag: "🇮🇹",
        specialty: "Italian Expert",
        description: "Learn to speak Italian with passion and confidence.",
        image: "/roland.jpeg",
    },
    {
        name: "Bella",
        flag: "🇬🇧",
        specialty: "English",
        description: "Engaging lessons for everyone, from beginners to advanced.",
        image: "/Bella English side.png",
    },
    {
        name: "Simona",
        flag: "🇬🇧",
        specialty: "Business English",
        description: "Professional communication skills for your career.",
        image: "/simona.jpg",
    },
    {
        name: "Anar",
        flag: "🇨🇳",
        specialty: "Mandarin Chinese",
        description: "Learn the world's most spoken language effectively.",
        image: "/Anar Chinese chill.png",
    },
];


export default function TeacherSection() {
    return (
        <section id="teachers" className="section relative overflow-hidden bg-white py-24">
            <div className="container relative z-10">
                {/* Header */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={stagger}
                    className="section-header text-center mb-16"
                >
                    <motion.span variants={fadeInUp} className="section-label inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold mb-4">
                        Our teachers
                    </motion.span>
                    <motion.h2 variants={fadeInUp} className="section-title text-4xl md:text-5xl font-bold mb-6">
                        Meet your <span className="text-primary">experts</span>
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="section-subtitle text-lg text-gray-600 max-w-2xl mx-auto">
                        Join live sessions with native teachers — carefully selected for their expertise and passion.
                    </motion.p>
                </motion.div>

                {/* Teachers Grid */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={stagger}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {teachers.map((teacher) => (
                        <motion.div
                            key={teacher.name}
                            variants={imageReveal}
                            className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100"
                        >
                            <motion.div
                                className="relative aspect-[3/4] overflow-hidden"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.4 }}
                            >
                                <Image
                                    src={teacher.image}
                                    alt={teacher.name}
                                    fill
                                    className="object-cover transition-transform duration-500"
                                />
                                {/* Enhanced Gradient Overlay for Readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90" />

                                <div className="absolute bottom-0 left-0 p-6 w-full translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-xl font-bold !text-white drop-shadow-md">{teacher.name}</h3>
                                        <span className="text-2xl text-white">{teacher.flag}</span>
                                    </div>
                                    <p className="!text-white text-sm font-medium mb-2 opacity-95 drop-shadow-md">{teacher.specialty}</p>
                                    <p className="!text-white text-sm line-clamp-2 leading-relaxed drop-shadow-md">{teacher.description}</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
