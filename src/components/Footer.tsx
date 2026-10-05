"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
    const { t, language } = useLanguage();
    const sk = language === "sk";
    const links = [
        { href: "/#languages", label: sk ? "Jazyky" : "Languages" },
        { href: "/#teachers", label: sk ? "Naši lektori" : "Our teachers" },
        { href: "/prices", label: sk ? "Balíčky a ceny" : "Packages and prices" },
        { href: "/contact", label: sk ? "Kontakt a pomoc" : "Contact and support" },
        { href: "/login", label: sk ? "Prihlásenie" : "Sign in" },
    ];
    return (
        <footer className="footer">
            <div className="container">
                <div className="grid gap-8 sm:grid-cols-2">
                    <div>
                        <Link href="/" className="footer-brand">Mundus Languages</Link>
                        <p className="footer-desc">{t.footer.brandDesc}</p>
                    </div>
                    <nav aria-label={sk ? "Navigácia v päte" : "Footer navigation"}>
                        <ul className="footer-links grid gap-3 sm:grid-cols-2">
                            {links.map(link => <li key={link.href}><Link href={link.href}>{link.label}</Link></li>)}
                        </ul>
                    </nav>
                </div>
                <div className="footer-bottom">
                    <span>© {new Date().getFullYear()} Mundus Languages. {sk ? "Všetky práva vyhradené." : "All rights reserved."}</span>
                    <a href="https://www.instagram.com/mundus.languages/" target="_blank" rel="noopener noreferrer" className="hover:text-[#181818] transition-colors">Instagram @mundus.languages</a>
                </div>
            </div>
        </footer>
    );
}
