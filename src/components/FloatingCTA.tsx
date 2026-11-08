"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useAnalyticsConsent } from "@/components/AnalyticsManager";

export default function FloatingCTA() {
    const { t, language } = useLanguage();
    const pathname = usePathname();
    const cookieChoice = useAnalyticsConsent();
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
        pathname.startsWith("/admin") ||
        /^\/(sk|en)\/(pricing|payment)(\/|$)/.test(pathname) ||
        pathname === "/pricing" || pathname === "/payment";

    useEffect(() => {
        const handleScroll = () => {
            // Show purchase CTA after the hero; never compete with cookie consent.
            setIsVisible(window.scrollY > 450);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const onCompanies = /^\/(sk|en)\/companies(\/|$)/.test(pathname) || pathname === "/companies";

    if (isPortalRoute || cookieChoice === null) {
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
                    className="fixed bottom-[max(.75rem,env(safe-area-inset-bottom))] left-4 right-4 z-30 sm:bottom-8 sm:left-auto sm:right-8"
                >
                    <Link
                        href={onCompanies ? `/${language}/companies#quote` : `/${language}/pricing`}
                        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#2F3AA2] px-5 py-3 font-semibold text-white shadow-lg shadow-blue-900/20 transition-all hover:bg-[#252E82] hover:shadow-xl sm:w-auto sm:rounded-full sm:hover:scale-105"
                    >
                        <span>{onCompanies ? (language === "sk" ? "Získať ponuku" : "Get a quote") : t.nav.book}</span>
                        <ArrowRight size={20} />
                    </Link>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
