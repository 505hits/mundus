"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
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
    const pathname = usePathname();
    const [language, setLanguageState] = useState<Language>(initialLanguage);

    useEffect(() => {
        document.documentElement.lang = language;
        try {
            window.localStorage.setItem("mundus-language", language);
        } catch {}
    }, [language]);

    const setLanguage = useCallback((lang: Language) => {
        if (lang === language) return;
        document.cookie = `mundus_language=${lang}; Path=/; Max-Age=31536000; SameSite=Lax`;
        try { window.localStorage.setItem("mundus-language", lang); } catch {}
        document.documentElement.lang = lang;
        setLanguageState(lang);

        const localized = pathname.match(/^\/(sk|en)(\/.*)?$/);
        if (localized) {
            router.push(`/${lang}${localized[2] ?? ""}`);
            return;
        }
        const publicRoots = ["/","/languages","/pricing","/group-lessons","/companies","/contact","/privacy","/terms","/cookies","/learn"];
        if (publicRoots.some(root => root === "/" ? pathname === "/" : pathname === root || pathname.startsWith(root + "/"))) {
            router.push(`/${lang}${pathname === "/" ? "" : pathname}`);
            return;
        }
        router.refresh();
    }, [language, pathname, router]);

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
