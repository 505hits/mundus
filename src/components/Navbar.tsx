"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
    { name: "Kurzy", href: "/#languages" },
    { name: "Ako to funguje", href: "/#how-it-works" },
    { name: "Lektori", href: "/#teachers" },
    { name: "Výhody", href: "/#features" },
    { name: "Kontakt", href: "/contact" },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Prevent scrolling when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isMobileMenuOpen]);

    return (
        <>
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`navbar ${isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"}`}
            >
                <div className="navbar-inner flex items-center justify-between px-6 py-4 w-full">
                    {/* Logo */}
                    <Link href="/" className="nav-logo relative h-10 w-32 md:h-14 md:w-40 shrink-0">
                        <Image
                            src="/Gemini_Generated_Image_ytz5tytz5tytz5ty-removebg-preview.png"
                            alt="Mundus"
                            fill
                            className="object-contain object-left"
                            priority
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="nav-links hidden xl:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link key={link.name} href={link.href} className="nav-link text-sm font-medium hover:text-primary transition-colors">
                                {link.name}
                            </Link>
                        ))}
                        <a href="tel:+421904082794" className="nav-link text-sm font-semibold text-gray-900 hover:text-primary transition-colors flex items-center gap-1">
                            +421 904 082 794
                        </a>
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden xl:flex items-center">
                        <motion.a
                            href="/#booking"
                            className="btn btn-primary"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Rezervovať prvú lekciu
                        </motion.a>
                    </div>

                    {/* Mobile Menu Button - Visible ONLY on small screens */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="xl:hidden p-2 z-50 relative ml-auto"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <X size={28} className="text-gray-900" />
                        ) : (
                            <Menu size={28} className="text-gray-900" />
                        )}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: "-100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "-100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-40 bg-white xl:hidden flex flex-col pt-24 px-6 pb-8"
                    >
                        <div className="flex flex-col gap-6">
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 + i * 0.05 }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center justify-between text-2xl font-medium text-gray-900 py-3 border-b border-gray-100"
                                    >
                                        {link.name}
                                        <ArrowRight size={20} className="text-gray-400" />
                                    </Link>
                                </motion.div>
                            ))}
                            {/* Mobile Phone Number */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.35 }}
                            >
                                <a
                                    href="tel:+421904082794"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center justify-between text-2xl font-bold text-gray-900 py-3 border-b border-gray-100"
                                >
                                    +421 904 082 794
                                    <ArrowRight size={20} className="text-gray-400" />
                                </a>
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="mt-auto"
                        >
                            <a
                                href="/#booking"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="btn btn-primary w-full justify-center text-lg py-4"
                            >
                                Rezervovať prvú lekciu
                            </a>
                            <p className="mt-6 text-center text-gray-500 text-sm">
                                Potrebujete pomoc? <a href="mailto:support@mundus.com" className="text-primary underline">Kontaktujte nás</a>
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
