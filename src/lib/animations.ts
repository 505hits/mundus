"use client";

import { Variants } from "framer-motion";

// Staggered fade-in and slide-up animation for sections
export const fadeInUp: Variants = {
    hidden: {
        opacity: 0,
        y: 40,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
};

// Stagger children container
export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1,
        },
    },
};

// Scale on hover for buttons and cards
export const scaleOnHover: Variants = {
    initial: { scale: 1 },
    hover: {
        scale: 1.05,
        transition: { duration: 0.2, ease: "easeOut" }
    },
    tap: { scale: 0.98 },
};

// Card hover effect with slight lift
export const cardHover: Variants = {
    initial: {
        scale: 1,
        y: 0,
    },
    hover: {
        scale: 1.02,
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" }
    },
};

// Glow pulse animation for CTA
export const glowPulse: Variants = {
    initial: {
        boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)",
    },
    animate: {
        boxShadow: [
            "0 0 20px rgba(139, 92, 246, 0.3)",
            "0 0 40px rgba(139, 92, 246, 0.5)",
            "0 0 20px rgba(139, 92, 246, 0.3)",
        ],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
};

// Magnetic pull effect for buttons
export const useMagneticEffect = () => {
    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        const element = e.currentTarget;
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        element.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
        e.currentTarget.style.transform = "translate(0, 0)";
    };

    return { handleMouseMove, handleMouseLeave };
};
