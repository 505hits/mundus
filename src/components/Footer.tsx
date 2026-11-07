"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import NewsletterSignup from "@/components/NewsletterSignup";

export default function Footer() {
  const { language } = useLanguage();
  const sk = language === "sk";
  const prefix = `/${language}`;

  const groups = [
    {
      title: sk ? "Mundus" : "Mundus",
      links: [
        { href: `${prefix}/#learning-formats`, label: sk ? "Ako to funguje" : "How it works" },
        { href: `${prefix}/teachers`, label: sk ? "Lektori" : "Teachers" },
        { href: `${prefix}/pricing`, label: sk ? "Cenník a platba" : "Pricing & payment" },
        { href: `${prefix}/group-lessons`, label: sk ? "Skupinové hodiny" : "Group lessons" },
        { href: `${prefix}/companies`, label: sk ? "Pre firmy" : "For companies" },
        { href: `${prefix}/#faq`, label: "FAQ" },
      ],
    },
    {
      title: sk ? "Študenti" : "Students",
      links: [
        { href: "/login", label: sk ? "Prihlásenie" : "Sign in" },
        { href: "/dashboard", label: sk ? "Študentský portál" : "Student portal" },
        { href: "/forgot-password", label: sk ? "Obnova hesla" : "Reset password" },
        { href: `${prefix}/contact`, label: sk ? "Kontakt a pomoc" : "Contact & help" },
        { href: "https://www.instagram.com/mundus.languages/", label: "Instagram", external: true },
      ],
    },
    {
      title: sk ? "Jazyky" : "Languages",
      links: [
        { href: `${prefix}/languages`, label: sk ? "Všetky jazyky" : "All languages" },
        { href: `${prefix}/languages/english`, label: sk ? "Angličtina online" : "English online" },
        { href: `${prefix}/languages/german`, label: sk ? "Nemčina online" : "German online" },
        { href: `${prefix}/languages/slovak-for-foreigners`, label: sk ? "Slovenčina pre cudzincov" : "Slovak for foreigners" },
      ],
    },
    {
      title: sk ? "Právne" : "Legal",
      links: [
        { href: `${prefix}/privacy`, label: sk ? "Ochrana súkromia" : "Privacy" },
        { href: `${prefix}/terms`, label: sk ? "Podmienky" : "Terms" },
        { href: `${prefix}/cookies`, label: "Cookies" },
      ],
    },
  ];

  return <footer className="footer bg-white">
    <div className="container">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <Link href={prefix} className="footer-brand">Mundus Languages</Link>
          <p className="footer-desc max-w-sm">
            {sk ? "Online jazyková výučba 1:1, súkromné skupiny a firemné vzdelávanie s flexibilnými termínmi a modernými portálmi." : "Online 1:1 language lessons, private groups and company training with flexible scheduling and modern portals."}
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map(group => <nav key={group.title} aria-label={group.title}>
            <p className="footer-title">{group.title}</p>
            <ul className="footer-links">
              {group.links.map(link => <li key={link.label}>
                {"external" in link && link.external
                  ? <a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>
                  : <Link href={link.href}>{link.label}</Link>}
              </li>)}
            </ul>
          </nav>)}
        </div>
      </div>
      <div className="mt-10 rounded-3xl border border-[#E5E7F0] bg-[#FAFAF9] p-5 sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-lg font-semibold">{sk ? "Novinky a sezónne ponuky" : "Updates & seasonal offers"}</p>
            <p className="mt-1 text-sm leading-6 text-gray-500">{sk ? "Občas vám pošleme nové termíny, jazykové novinky a špeciálne ponuky Mundus." : "Occasional updates about new openings, language news and special Mundus offers."}</p>
          </div>
          <NewsletterSignup source="footer" compact />
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Mundus Languages. {sk ? "Všetky práva vyhradené." : "All rights reserved."}</span>
        <span>{sk ? "Online výučba · Slovensko / EÚ" : "Online lessons · Slovakia / EU"}</span>
      </div>
    </div>
  </footer>;
}
