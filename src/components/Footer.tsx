"use client";

import { motion } from "framer-motion";

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

import { useLanguage } from "@/context/LanguageContext";

const footerLinks = {
    Languages: "Languages",
    Company: "Company",
    Support: "Support",
    Legal: "Legal",
};

export default function Footer() {
    const { t } = useLanguage();

    // Map the keys to the translated arrays from t.footer.links
    const linksMap = {
        Languages: t.footer.links.Languages,
        Company: t.footer.links.Company,
        Support: t.footer.links.Support,
        Legal: t.footer.links.Legal,
    };

    return (
        <footer className="footer">
            <div className="container">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={stagger}
                    className="footer-grid"
                >
                    {/* Brand */}
                    <motion.div variants={fadeInUp}>
                        <div className="footer-brand">Mundus</div>
                        <p className="footer-desc">
                            {t.footer.brandDesc}
                        </p>
                    </motion.div>

                    {/* Links */}
                    {(Object.keys(linksMap) as Array<keyof typeof linksMap>).map((category) => (
                        <motion.div key={category} variants={fadeInUp}>
                            <div className="footer-title">{t.footer.headings[category]}</div>
                            <ul className="footer-links">
                                {linksMap[category].map((link) => (
                                    <li key={link}>
                                        <a href="#">{link}</a>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="footer-bottom"
                >
                    <span>{t.footer.copyright}</span>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-[#181818] transition-colors">Twitter</a>
                        <a href="#" className="hover:text-[#181818] transition-colors">LinkedIn</a>
                        <a href="#" className="hover:text-[#181818] transition-colors">Instagram</a>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
}
