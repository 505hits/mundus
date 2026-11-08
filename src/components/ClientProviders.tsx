"use client";

import { usePathname } from "next/navigation";
import { LanguageProvider, type Language } from "@/context/LanguageContext";

export default function ClientProviders({ children, initialLanguage }: { children: React.ReactNode; initialLanguage: Language }) {
    const pathname = usePathname();
    const routeLanguage = pathname.match(/^\/(sk|en)(?:\/|$)/)?.[1] as Language | undefined;
    const language = routeLanguage ?? initialLanguage;
    // Re-key when the URL's locale changes so all navigation, cookie banners,
    // and footers show the locale of the route, not a stale cookie.
    return <LanguageProvider key={language} initialLanguage={language}>{children}</LanguageProvider>;
}
