"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { translations } from "@/data/translations";

type Language = "en" | "sk";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: typeof translations.en;
}

const defaultContext: LanguageContextType = {
    language: "sk",
    setLanguage: () => { },
    t: translations.sk,
};

const LanguageContext = createContext<LanguageContextType>(defaultContext);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>("sk"); // Default to Slovak

    const value = {
        language,
        setLanguage,
        t: translations[language],
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    // Context will fall back to defaultContext if provider is missing
    return context;
}
