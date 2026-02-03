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

const footerLinks = {
    Languages: ["Angličtina", "Španielčina", "Taliančina", "Portugalčina"],
    Company: ["O nás", "Kariéra", "Blog", "Tlač"],
    Support: ["Centrum pomoci", "Kontakt", "FAQ", "Komunita"],
    Legal: ["Súkromie", "Podmienky", "Cookies", "Licencie"],
};

export default function Footer() {
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
                            Osvojte si najkrajšie jazyky sveta s rodenými hovorcami.
                            Pohlcujúce, personalizované a efektívne.
                        </p>
                    </motion.div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <motion.div key={category} variants={fadeInUp}>
                            <div className="footer-title">{category === "Languages" ? "Jazyky" : category === "Company" ? "Spoločnosť" : category === "Support" ? "Podpora" : "Právne"}</div>
                            <ul className="footer-links">
                                {links.map((link) => (
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
                    <span>© 2024 Mundus. Všetky práva vyhradené.</span>
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
