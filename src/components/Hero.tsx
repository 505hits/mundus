"use client";

import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import Image from "next/image";

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
};

const stagger = {
    visible: { transition: { staggerChildren: 0.15 } },
};

const imageReveal = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.7, ease: "easeOut" as const }
    },
};

const titleAnimation = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" as const }
    },
};

export default function Hero() {
    return (
        <section className="hero">
            <motion.div
                variants={stagger}
                initial="hidden"
                animate="visible"
                className="container"
            >
                {/* Badge */}
                <motion.div
                    variants={fadeInUp}
                    transition={{ duration: 0.5 }}
                    className="flex justify-center"
                >
                    <span className="hero-badge">
                        <Star size={14} />
                        Thousands of happy learners — and counting
                    </span>
                </motion.div>

                {/* Animated Title */}
                <motion.h1
                    variants={titleAnimation}
                    className="hero-title"
                >
                    Learn languages with{" "}
                    <span className="accent-word">native speakers</span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    variants={fadeInUp}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="hero-subtitle"
                >
                    Experience immersive 1-on-1 sessions with native experts.
                    Fluid, fast, and tailored to your goals.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    variants={fadeInUp}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="hero-cta"
                >
                    <motion.a
                        href="#booking"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="btn btn-primary"
                    >
                        Book my first lesson
                        <ArrowRight size={18} />
                    </motion.a>
                    <a href="#how-it-works" className="btn btn-secondary">
                        See how it works
                    </a>
                </motion.div>

                {/* Image Grid */}
                <motion.div
                    variants={stagger}
                    className="image-grid mt-16"
                >
                    <motion.div
                        variants={imageReveal}
                        className="image-grid-item large"
                    >
                        <Image
                            src="/Gemini_Generated_Image_4omac74omac74oma.png"
                            alt="Mundus learning experience"
                            width={800}
                            height={1000}
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                    <motion.div
                        variants={imageReveal}
                        className="image-grid-item"
                    >
                        <Image
                            src="/Gemini_Generated_Image_841mwh841mwh841m.png"
                            alt="Student learning"
                            width={600}
                            height={400}
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                    <motion.div
                        variants={imageReveal}
                        className="image-grid-item"
                    >
                        <Image
                            src="/Gemini_Generated_Image_r3ay2xr3ay2xr3ay.png"
                            alt="Student studying"
                            width={600}
                            height={400}
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                </motion.div>

                {/* Trust indicators */}
                <motion.div
                    variants={fadeInUp}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="flex flex-wrap items-center justify-center gap-8 mt-12 text-sm text-[#525252]"
                >
                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                            {[
                                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
                                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
                                "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
                                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
                            ].map((src, i) => (
                                <Image
                                    key={i}
                                    src={src}
                                    alt="Student"
                                    width={32}
                                    height={32}
                                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                                />
                            ))}
                        </div>
                        <span>10,000+ students</span>
                    </div>
                    <div className="h-4 w-px bg-[#E5E5E5] hidden sm:block" />
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="ml-1">4.9/5 rating</span>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}
