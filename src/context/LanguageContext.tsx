"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { translations } from "@/data/translations";

export type Language = "en" | "sk";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: typeof translations.en;
}

const defaultContext: LanguageContextType = {
    language: "sk",
    setLanguage: () => {},
    t: translations.sk,
};

const LanguageContext = createContext<LanguageContextType>(defaultContext);

export function LanguageProvider({ children, initialLanguage = "sk" }: { children: ReactNode; initialLanguage?: Language }) {
    const router = useRouter();
    const [language, setLanguageState] = useState<Language>(initialLanguage);

    useEffect(() => {
        document.documentElement.lang = language;
        try {
            window.localStorage.setItem("mundus-language", language);
        } catch {}
    }, [language]);

    useEffect(() => {
        try {
            const stored = window.localStorage.getItem("mundus-language");
            if ((stored === "en" || stored === "sk") && stored !== language) {
                document.cookie = `mundus_language=${stored}; Path=/; Max-Age=31536000; SameSite=Lax`;
                setLanguageState(stored);
                router.refresh();
            }
        } catch {}
    // Initial reconciliation only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setLanguage = useCallback((lang: Language) => {
        if (lang === language) return;
        document.cookie = `mundus_language=${lang}; Path=/; Max-Age=31536000; SameSite=Lax`;
        try {
            window.localStorage.setItem("mundus-language", lang);
        } catch {}
        document.documentElement.lang = lang;
        setLanguageState(lang);
        router.refresh();
    }, [language, router]);

    const value = useMemo(() => ({
        language,
        setLanguage,
        t: translations[language],
    }), [language, setLanguage]);

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
    return useContext(LanguageContext);
}
