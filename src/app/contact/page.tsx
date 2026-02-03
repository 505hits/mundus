"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
    visible: { transition: { staggerChildren: 0.1 } },
};

export default function ContactPage() {
    return (
        <main className="min-h-screen flex flex-col font-sans">
            <Navbar />

            {/* Background with Blue Gradient */}
            <section className="flex-grow pt-32 pb-20 bg-gradient-to-br from-blue-50 via-white to-blue-50/30 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-20 left-0 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-100/20 rounded-full blur-3xl -z-10" />

                <div className="container px-6 mx-auto relative z-10">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={stagger}
                        className="max-w-6xl mx-auto"
                    >
                        {/* Header Section */}
                        <motion.div variants={fadeInUp} className="text-center mb-16">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm tracking-wide uppercase mb-4 shadow-sm border border-blue-200/50">
                                Get in touch
                            </span>
                            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
                                Let's Start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Conversation</span>
                            </h1>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                                Whether you're ready to start learning or just have a few questions, we're here to help you every step of the way.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                            {/* Contact Info Card */}
                            <motion.div variants={fadeInUp} className="lg:col-span-5 space-y-8">
                                <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl border border-white/50 relative overflow-hidden group hover:shadow-blue-100/50 transition-all duration-500">
                                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                                        <Send size={120} className="transform rotate-12" />
                                    </div>

                                    <h3 className="text-3xl font-bold mb-8 text-gray-900">Contact Info</h3>
                                    <div className="space-y-8 relative z-10">
                                        <a href="mailto:hello@mundus.com" className="flex items-center gap-6 group/item p-4 rounded-2xl hover:bg-blue-50/50 transition-colors">
                                            <div className="bg-gradient-to-br from-blue-500 to-indigo-400 p-4 rounded-2xl text-white shadow-lg shadow-blue-200 group-hover/item:scale-110 transition-transform duration-300">
                                                <Mail size={24} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Email Us</p>
                                                <span className="text-lg font-bold text-gray-900 group-hover/item:text-blue-600 transition-colors">
                                                    hello@mundus.com
                                                </span>
                                            </div>
                                        </a>

                                        <a href="tel:+421904082794" className="flex items-center gap-6 group/item p-4 rounded-2xl hover:bg-blue-50/50 transition-colors">
                                            <div className="bg-gradient-to-br from-indigo-500 to-violet-400 p-4 rounded-2xl text-white shadow-lg shadow-indigo-200 group-hover/item:scale-110 transition-transform duration-300">
                                                <Phone size={24} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Call Us</p>
                                                <span className="text-lg font-bold text-gray-900 group-hover/item:text-blue-600 transition-colors">
                                                    +421 904 082 794
                                                </span>
                                            </div>
                                        </a>

                                        <div className="flex items-center gap-6 group/item p-4 rounded-2xl hover:bg-blue-50/50 transition-colors">
                                            <div className="bg-gradient-to-br from-orange-400 to-red-400 p-4 rounded-2xl text-white shadow-lg shadow-orange-200 group-hover/item:scale-110 transition-transform duration-300">
                                                <MapPin size={24} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Visit Us</p>
                                                <span className="text-lg font-bold text-gray-900">
                                                    123 Language Street<br />
                                                    Paris, France 75001
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Contact Form */}
                            <motion.div variants={fadeInUp} className="lg:col-span-7">
                                <form className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 space-y-8 relative z-10">
                                    {/* Form Header */}
                                    <div className="mb-8">
                                        <h3 className="text-2xl font-bold text-gray-900">Send us a message</h3>
                                        <p className="text-gray-500 mt-2">Fill out the form below and we'll get back to you within 24 hours.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2 group">
                                            <label htmlFor="firstName" className="text-sm font-bold text-gray-700 ml-1 group-focus-within:text-blue-600 transition-colors">First Name</label>
                                            <input
                                                type="text"
                                                id="firstName"
                                                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-200 text-gray-900 font-medium focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300 placeholder:text-gray-400"
                                                placeholder="John"
                                            />
                                        </div>
                                        <div className="space-y-2 group">
                                            <label htmlFor="lastName" className="text-sm font-bold text-gray-700 ml-1 group-focus-within:text-blue-600 transition-colors">Last Name</label>
                                            <input
                                                type="text"
                                                id="lastName"
                                                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-200 text-gray-900 font-medium focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300 placeholder:text-gray-400"
                                                placeholder="Doe"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 group">
                                        <label htmlFor="email" className="text-sm font-bold text-gray-700 ml-1 group-focus-within:text-blue-600 transition-colors">Email Address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-200 text-gray-900 font-medium focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300 placeholder:text-gray-400"
                                            placeholder="john@example.com"
                                        />
                                    </div>

                                    <div className="space-y-2 group">
                                        <label htmlFor="message" className="text-sm font-bold text-gray-700 ml-1 group-focus-within:text-blue-600 transition-colors">Your Message</label>
                                        <textarea
                                            id="message"
                                            rows={5}
                                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-200 text-gray-900 font-medium focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300 resize-none placeholder:text-gray-400"
                                            placeholder="Tell us how we can help..."
                                        />
                                    </div>

                                    <motion.button
                                        type="submit"
                                        whileHover={{ scale: 1.01, boxShadow: "0 20px 25px -5px rgba(37, 99, 235, 0.15), 0 8px 10px -6px rgba(37, 99, 235, 0.1)" }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-bold text-lg py-5 rounded-2xl shadow-lg shadow-blue-200 transition-all duration-300 flex items-center justify-center gap-3 group"
                                    >
                                        Send Message
                                        <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                                    </motion.button>
                                </form>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
