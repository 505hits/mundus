"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const cardReveal = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring" as const, stiffness: 100, damping: 15 }
    },
};

const teachers = [
    {
        name: "Lenka",
        flag: "🇬🇧🇸🇰",
        specialty: "English & Slovak",
        description: "Engaging English and Slovak lessons for all levels.",
        image: "/Lenka.jpeg",
    },
    {
        name: "Jakub",
        flag: "🇪🇸",
        specialty: "Kouč španielskej gramatiky",
        description: "Zvládnite komplexnú gramatiku jednoduchými vysvetleniami.",
        image: "/Jakub.jpeg",
    },
    {
        name: "Alisa",
        flag: "🇷🇺",
        specialty: "Rodená hovorkyňa ruštiny",
        description: "Pohlcujúce lekcie ruského jazyka a kultúry.",
        image: "/alisa.JPG",
    },
    {
        name: "Roland",
        flag: "🇮🇹",
        specialty: "Expert na taliančinu",
        description: "Naučte sa hovoriť taliansky s vášňou a sebavedomím.",
        image: "/roland.jpeg",
    },
    {
        name: "Bella",
        flag: "🇬🇧",
        specialty: "Angličtina",
        description: "Zábavné lekcie pre každého, od začiatočníkov po pokročilých.",
        image: "/Bella English side.png",
    },
    {
        name: "Anar",
        flag: "🇨🇳",
        specialty: "Mandarínska čínština",
        description: "Naučte sa efektívne najrozšírenejší jazyk sveta.",
        image: "/Anar Chinese chill.png",
    },
    {
        name: "Tamara",
        flag: "🇺🇦🇸🇰🇬🇧",
        specialty: "Ukrainian, Slovak & English",
        description: "Learn Ukrainian, Slovak or English with a passionate native teacher.",
        image: "/Tamara.jpeg",
    },
];


export default function TeacherSection() {
    const { t } = useLanguage();
    return (
        <section id="teachers" className="section bg-white py-24">
            <div className="container">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={stagger}
                    className="section-header text-center mb-16"
                >
                    <motion.span variants={fadeInUp} className="section-label inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 font-semibold text-sm mb-4">
                        {t.teachers.label}
                    </motion.span>
                    <motion.h2 variants={fadeInUp} className="section-title text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                        {t.teachers.titleStart} <span className="accent-word relative inline-block text-blue-600">
                            {t.teachers.titleEnd}
                            <svg className="absolute w-full h-3 bottom-0 left-0 text-yellow-300 -z-10 opacity-40" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                            </svg>
                        </span>
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="section-subtitle text-lg text-gray-600 max-w-2xl mx-auto">
                        {t.teachers.subtitle}
                    </motion.p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {t.teachers.list.map((teacher, index) => {
                        // Map static images to translated teachers
                        const teacherImage = teachers[index].image;

                        return (
                            <motion.div
                                key={index}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-50px" }}
                                variants={cardReveal}
                                className="group relative cursor-pointer"
                            >
                                <div className="relative overflow-hidden rounded-2xl aspect-[3/4] mb-4 shadow-lg shadow-gray-200">
                                    <Image
                                        src={teacherImage}
                                        alt={teacher.name}
                                        fill
                                        className="object-cover transition-transform duration-700 scale-105 group-hover:scale-115"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-300" />

                                    <div className="absolute bottom-0 left-0 w-full p-6 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        <h3 className="text-xl font-bold mb-1 !text-white">{teacher.name}</h3>
                                        <p className="text-sm font-medium text-blue-200 mb-2">{teacher.specialty}</p>
                                        <p className="text-xs text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">
                                            {teacher.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
