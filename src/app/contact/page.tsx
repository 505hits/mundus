"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
    return (
        <main className="min-h-screen">
            <Navbar />

            <div className="pt-32 pb-20 container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <span className="section-label">Contact us</span>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 mt-6">Get in touch</h1>
                    <p className="section-subtitle">
                        Have questions? We're here to help you start your language journey.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="space-y-8"
                    >
                        <div className="card">
                            <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-[#FAFAF9] rounded-xl text-[#BFFF00] bg-black">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <p className="font-medium">Email</p>
                                        <a href="mailto:hello@mundus.com" className="text-[#525252] hover:text-[#BFFF00] transition-colors">
                                            hello@mundus.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-[#FAFAF9] rounded-xl text-[#BFFF00] bg-black">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <p className="font-medium">Phone</p>
                                        <a href="tel:+15550000000" className="text-[#525252] hover:text-[#BFFF00] transition-colors">
                                            +1 (555) 000-0000
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-[#FAFAF9] rounded-xl text-[#BFFF00] bg-black">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <p className="font-medium">Office</p>
                                        <p className="text-[#525252]">
                                            123 Language Street<br />
                                            New York, NY 10001<br />
                                            United States
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="card"
                    >
                        <form className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium mb-2">Name</label>
                                <input
                                    type="text"
                                    className="w-full p-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#BFFF00] transition-colors"
                                    placeholder="Your name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    className="w-full p-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#BFFF00] transition-colors"
                                    placeholder="your@email.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Message</label>
                                <textarea
                                    rows={4}
                                    className="w-full p-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#BFFF00] transition-colors resize-none"
                                    placeholder="How can we help you?"
                                ></textarea>
                            </div>
                            <button type="button" className="btn btn-primary w-full justify-center">
                                Send Message
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
