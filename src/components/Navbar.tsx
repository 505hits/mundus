"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
    { name: "Courses", href: "#languages" },
    { name: "How it works", href: "#how-it-works" },
    { name: "Teachers", href: "#teachers" },
    { name: "Features", href: "#features" },
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

    return (
        <>
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="navbar"
            >
                <div className="navbar-inner">
                    {/* Logo */}
                    <a href="#" className="nav-logo">
                        Mundus
                    </a>

                    {/* Desktop Navigation */}
                    <div className="nav-links hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <a key={link.name} href={link.href} className="nav-link">
                                {link.name}
                            </a>
                        ))}
                        <a href="tel:+1234567890" className="nav-link font-medium text-[#181818]">
                            📞 +1 (555) 000-0000
                        </a>
                    </div>

                    {/* CTA Button */}
                    <div className="hidden md:flex items-center">
                        <motion.a
                            href="/prices"
                            className="btn btn-primary"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Book my first lesson
                        </motion.a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="fixed inset-x-0 top-[72px] z-50 md:hidden bg-white border-b border-[#E5E5E5] p-6"
                    >
                        <div className="flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-lg text-[#525252] hover:text-[#181818] py-2"
                                >
                                    {link.name}
                                </a>
                            ))}
                            <hr className="border-[#E5E5E5]" />
                            <a
                                href="#booking"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="btn btn-primary w-full text-center"
                            >
                                Book my first lesson
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
