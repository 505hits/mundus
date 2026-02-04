"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function BookingSection() {
    return (
        <section id="booking" className="section gradient-bottom">
            <div className="container">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={stagger}
                    className="booking-cta"
                >
                    <motion.span
                        variants={fadeInUp}
                        className="inline-block px-5 py-2 bg-[#BFFF00] text-[#181818] rounded-full text-sm font-medium mb-6"
                    >
                        Get started today
                    </motion.span>

                    <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-semibold mb-4">
                        Ready to start learning?
                    </motion.h2>

                    <motion.p variants={fadeInUp} className="text-lg max-w-lg mx-auto mb-8">
                        Book a complimentary 30-minute session with one of our expert tutors
                        and experience the Mundus difference.
                    </motion.p>

                    <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-4">
                        <motion.a
                            href="#"
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="btn btn-primary"
                        >
                            Start free trial
                            <ArrowRight size={18} />
                        </motion.a>
                        <a href="/contact" className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
                            Contact us
                        </a>
                    </motion.div>

                    <motion.p variants={fadeInUp} className="text-sm mt-8 opacity-60">
                        No credit card required • Cancel anytime
                    </motion.p>
                </motion.div>
            </div>
        </section>
    );
}
