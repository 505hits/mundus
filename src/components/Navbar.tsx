"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

export default function Navbar() {
  const { t, language } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const prefix = `/${language}`;

  const navLinks = [
    { name: t.nav.courses, href: `${prefix}/#languages` },
    { name: language === "sk" ? "Skupinové hodiny" : "Group lessons", href: `${prefix}/group-lessons` },
    { name: t.nav.teachers, href: `${prefix}/#teachers` },
    { name: t.nav.prices, href: `${prefix}/#pricing` },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`navbar border-b border-black/5 bg-white/90 backdrop-blur-xl ${isScrolled ? "shadow-sm" : ""}`}
      >
        <div className="navbar-inner flex w-full items-center justify-between px-5 sm:px-6">
          <Link href={prefix} className="nav-logo relative h-12 w-36 shrink-0 sm:w-40" aria-label="Mundus Languages">
            <Image src="/logo-removebg-preview.png" alt="Mundus Languages" fill className="object-contain object-left" priority />
          </Link>

          <div className="hidden items-center gap-7 xl:flex">
            <nav className="flex items-center gap-7" aria-label={language === "sk" ? "Hlavná navigácia" : "Main navigation"}>
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} className="nav-link whitespace-nowrap text-sm font-medium transition-colors hover:text-[#2F3AA2]">
                  {link.name}
                </Link>
              ))}
            </nav>

            <Link href={`${prefix}/companies`} className="inline-flex items-center gap-1.5 rounded-full border border-[#DDE2FB] bg-[#F5F6FF] px-4 py-2 text-sm font-semibold text-[#2F3AA2] transition hover:border-[#2F3AA2]/40 hover:bg-[#EEF2FF]">
              {language === "sk" ? "Pre firmy" : "For companies"}
              <ArrowRight size={15} />
            </Link>

            <LanguageToggle compact />

            <Link href="/login" className="whitespace-nowrap text-sm font-semibold text-[#171A2B] transition hover:text-[#2F3AA2]">
              {language === "sk" ? "Prihlásenie" : "Sign in"}
            </Link>

            <Link href={`${prefix}/#pricing`} className="btn btn-primary !px-5 !py-2.5 !text-sm whitespace-nowrap">
              {t.nav.book}
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="relative z-50 ml-auto rounded-xl p-2 text-[#171A2B] xl:hidden"
            aria-label={isMobileMenuOpen ? (language === "sk" ? "Zavrieť menu" : "Close menu") : (language === "sk" ? "Otvoriť menu" : "Open menu")}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={27} /> : <Menu size={27} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-8%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-8%" }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-40 flex flex-col bg-white px-6 pb-8 pt-24 xl:hidden"
          >
            <div className="flex flex-col">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between border-b border-gray-100 py-4 text-xl font-semibold text-[#171A2B]"
              >
                {language === "sk" ? "Prihlásenie" : "Sign in"}
                <ArrowRight size={19} className="text-gray-400" />
              </Link>

              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between border-b border-gray-100 py-4 text-xl font-medium text-[#171A2B]"
                >
                  {link.name}
                  <ArrowRight size={19} className="text-gray-400" />
                </Link>
              ))}

              <Link href={`${prefix}/companies`} onClick={() => setIsMobileMenuOpen(false)} className="mt-5 flex items-center justify-between rounded-2xl border border-[#DDE2FB] bg-[#F5F6FF] p-4 text-lg font-semibold text-[#2F3AA2]">
                {language === "sk" ? "Pre firmy" : "For companies"}
                <ArrowRight size={19} />
              </Link>

              <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#F6F7FB] p-3">
                <span className="text-sm font-medium text-gray-500">{language === "sk" ? "Jazyk stránky" : "Site language"}</span>
                <LanguageToggle />
              </div>
            </div>

            <div className="mt-auto">
              <Link
                href={`${prefix}/#pricing`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn btn-primary w-full justify-center py-3.5 text-base"
              >
                {t.nav.book}
              </Link>
              <p className="mt-5 text-center text-sm text-gray-500">
                {t.nav.needHelp}{" "}
                <Link href={`${prefix}/contact`} onClick={() => setIsMobileMenuOpen(false)} className="font-medium text-[#2F3AA2] underline underline-offset-4">
                  {t.nav.contactUs}
                </Link>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
