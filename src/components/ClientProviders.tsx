"use client";

import { LanguageProvider, type Language } from "@/context/LanguageContext";

export default function ClientProviders({ children, initialLanguage }: { children: React.ReactNode; initialLanguage: Language }) {
    return <LanguageProvider initialLanguage={initialLanguage}>{children}</LanguageProvider>;
}
