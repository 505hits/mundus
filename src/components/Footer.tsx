"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { language } = useLanguage();
  const sk = language === "sk";

  const groups = [
    {
      title: sk ? "Mundus" : "Mundus",
      links: [
        { href: "/#how-it-works", label: sk ? "Ako to funguje" : "How it works" },
        { href: "/#teachers", label: sk ? "Lektori" : "Teachers" },
        { href: "/#pricing", label: sk ? "Cenník" : "Pricing" },
        { href: "/group-lessons", label: sk ? "Skupinové hodiny" : "Group lessons" },
        { href: "/companies", label: sk ? "Pre firmy" : "For companies" },
        { href: "/#faq", label: "FAQ" },
      ],
    },
    {
      title: sk ? "Študenti" : "Students",
      links: [
        { href: "/login", label: sk ? "Prihlásenie" : "Sign in" },
        { href: "/dashboard", label: sk ? "Študentský portál" : "Student portal" },
        { href: "/forgot-password", label: sk ? "Obnova hesla" : "Reset password" },
        { href: "/contact", label: sk ? "Kontakt a pomoc" : "Contact & help" },
        { href: "https://www.instagram.com/mundus.languages/", label: "Instagram", external: true },
      ],
    },
    {
      title: sk ? "Jazyky" : "Languages",
      links: [
        { href: "/#languages", label: sk ? "Angličtina · Nemčina" : "English · German" },
        { href: "/#languages", label: sk ? "Španielčina · Taliančina" : "Spanish · Italian" },
        { href: "/#languages", label: sk ? "Francúzština · Portugalčina" : "French · Portuguese" },
        { href: "/#languages", label: sk ? "A ďalšie jazyky" : "And more languages" },
      ],
    },
    {
      title: sk ? "Právne" : "Legal",
      links: [
        { href: "/privacy", label: sk ? "Ochrana súkromia" : "Privacy" },
        { href: "/terms", label: sk ? "Podmienky" : "Terms" },
        { href: "/cookies", label: "Cookies" },
      ],
    },
  ];

  return <footer className="footer bg-white">
    <div className="container">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <Link href="/" className="footer-brand">Mundus Languages</Link>
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
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Mundus Languages. {sk ? "Všetky práva vyhradené." : "All rights reserved."}</span>
        <span>{sk ? "Online výučba · Slovensko / EÚ" : "Online lessons · Slovakia / EU"}</span>
      </div>
    </div>
  </footer>;
}
