"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function FloatingCTA() {
    const { t } = useLanguage();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show button after scrolling down 600px (past hero)
            setIsVisible(window.scrollY > 600);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="fixed bottom-8 right-8 z-40"
                >
                    <a
                        href="/#booking"
                        className="flex items-center gap-2 bg-[#2F3AA2] text-white px-6 py-4 rounded-full font-semibold shadow-lg shadow-blue-900/20 hover:shadow-xl hover:bg-[#252E82] hover:scale-105 transition-all transform"
                    >
                        <span>{t.nav.book}</span>
                        <ArrowRight size={20} />
                    </a>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
