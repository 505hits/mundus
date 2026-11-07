"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function FloatingCTA() {
    const { t, language } = useLanguage();
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(false);

    const isPortalRoute =
        pathname === "/login" ||
        pathname === "/signup" ||
        pathname === "/onboarding" ||
        pathname === "/set-password" ||
        pathname.startsWith("/auth/") ||
        pathname === "/forgot-password" ||
        pathname === "/reset-password" ||
        pathname === "/pending-approval" ||
        pathname === "/dashboard" ||
        pathname.startsWith("/lessons") ||
        pathname.startsWith("/learning") ||
        pathname.startsWith("/progress") ||
        pathname.startsWith("/packages") ||
        pathname.startsWith("/teacher") ||
        pathname.startsWith("/admin");

    useEffect(() => {
        const handleScroll = () => {
            // Show button after scrolling down 600px (past hero)
            setIsVisible(window.scrollY > 600);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (isPortalRoute) {
        return null;
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="fixed bottom-4 left-4 right-4 z-40 sm:bottom-8 sm:left-auto sm:right-8"
                >
                    <Link
                        href={`/${language}/#languages`}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2F3AA2] px-6 py-4 font-semibold text-white shadow-lg shadow-blue-900/20 transition-all hover:bg-[#252E82] hover:shadow-xl sm:w-auto sm:rounded-full sm:hover:scale-105"
                    >
                        <span>{t.nav.book}</span>
                        <ArrowRight size={20} />
                    </Link>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
