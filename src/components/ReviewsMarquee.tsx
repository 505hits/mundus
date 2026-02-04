"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const reviewsSK = [
    {
        name: "Peter Kováč",
        role: "Mundus Študent • 24 hodín výučby",
        text: "Neuveriteľné, ako rýchlo som sa zbavil strachu rozprávať. Môj lektor Thomas je skvelý, hodiny sú uvoľnené a vždy sa na ne teším. Konečne rozumiem anglickým filmom bez titulkov!",
        rating: 5,
    },
    {
        name: "Elena Mikulová",
        role: "Mundus Študent • 45 hodín výučby",
        text: "Potrebovala som angličtinu kvôli novej práci v IT. Za 3 mesiace som sa posunula z B1 na silnú B2. Oceňujem flexibilitu a to, že môžem mať hodiny aj neskoro večer.",
        rating: 5,
    },
    {
        name: "Michal Varga",
        role: "Mundus Študent • 12 hodín výučby",
        text: "Vyskúšal som Duolingo aj jazykovky, ale až tu som sa naozaj rozrozprával. Konverzácie s rodeným hovorcom z Londýna mi dali presne ten prízvuk, ktorý som chcel.",
        rating: 5,
    },
    {
        name: "Zuzana Horváthová",
        role: "Mundus Študent • 60+ hodín výučby",
        text: "Dcéra (14 rokov) mala problémy v škole, ale teraz patrí k najlepším v triede. Lektorka Sarah je trpezlivá a vie ju motivovať. Sme veľmi spokojní.",
        rating: 5,
    },
    {
        name: "Martin Tóth",
        role: "Mundus Študent • 18 hodín výučby",
        text: "Super platforma pre zaneprázdnených ľudí. Hodinu si booknem na obednú prestávku a nikam nemusím cestovať. Kvalita hovoru aj lektorov je top.",
        rating: 5,
    },
    {
        name: "Katarína Balážová",
        role: "Mundus Študent • 32 hodín výučby",
        text: "Pripravovala som sa tu na IELTS certifikát a podarilo sa mi získať band 7.5! Lektor sa zameral presne na moje slabé stránky v písaní a hovorení. Ďakujem!",
        rating: 5,
    },
    {
        name: "Jozef Novák",
        role: "Mundus Študent • 55 hodín výučby",
        text: "Učím sa španielčinu od nuly a po pol roku sa dohovorím na dovolenke. Je to úžasný pocit. Páči sa mi, že lektori striedajú gramatiku s bežnou konverzáciou.",
        rating: 5,
    },
    {
        name: "Andrea Molnárová",
        role: "Mundus Študent • 28 hodín výučby",
        text: "Najlepšia investícia do seba. Ceny sú férové a výsledky viditeľné. Odporúčam každému, kto sa chce posunúť v jazyku a nemá čas chodiť do jazykovky.",
        rating: 5,
    },
];

const reviewsEN = [
    {
        name: "Peter Kováč",
        role: "Mundus Student • 24 hours learned",
        text: "Unbelievable how quickly I lost my fear of speaking. My tutor Thomas is great, lessons are relaxed and I always look forward to them. I finally understand English movies without subtitles!",
        rating: 5,
    },
    {
        name: "Elena Mikulová",
        role: "Mundus Student • 45 hours learned",
        text: "I needed English for a new job in IT. In 3 months I moved from B1 to strong B2. I appreciate the flexibility and that I can have lessons even late in the evening.",
        rating: 5,
    },
    {
        name: "Michal Varga",
        role: "Mundus Student • 12 hours learned",
        text: "I tried Duolingo and language schools, but only here I really started speaking. Conversations with a native speaker from London gave me exactly the accent I wanted.",
        rating: 5,
    },
    {
        name: "Zuzana Horváthová",
        role: "Mundus Student • 60+ hours learned",
        text: "My daughter (14) had problems at school, but now she is among the best in class. Tutor Sarah is patient and knows how to motivate her. We are very satisfied.",
        rating: 5,
    },
    {
        name: "Martin Tóth",
        role: "Mundus Student • 18 hours learned",
        text: "Super platform for busy people. I book a lesson for my lunch break and don't have to travel anywhere. The quality of calls and tutors is top.",
        rating: 5,
    },
    {
        name: "Katarína Balážová",
        role: "Mundus Student • 32 hours learned",
        text: "I prepared here for the IELTS certificate and managed to get band 7.5! The tutor focused exactly on my weak points in writing and speaking. Thank you!",
        rating: 5,
    },
    {
        name: "Jozef Novák",
        role: "Mundus Student • 55 hours learned",
        text: "I'm learning Spanish from scratch and after half a year I can communicate on vacation. It's an amazing feeling. I like that tutors alternate grammar with common conversation.",
        rating: 5,
    },
    {
        name: "Andrea Molnárová",
        role: "Mundus Student • 28 hours learned",
        text: "Best investment in myself. Prices are fair and results visible. I recommend to everyone who wants to move forward in language and doesn't have time to go to language school.",
        rating: 5,
    },
];

const ReviewCard = ({ review }: { review: typeof reviewsSK[0] }) => (
    <div className="relative bg-white/80 backdrop-blur-md rounded-2xl p-6 w-[320px] flex-shrink-0 mx-4 border border-white/50 shadow-lg hover:shadow-xl transition-all group overflow-hidden">
        {/* Light effect gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-[#2F3AA2]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-[#2F3AA2]/10 rounded-full blur-2xl group-hover:bg-[#2F3AA2]/20 transition-all duration-500" />

        <div className="relative z-10">
            <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        size={16}
                        className={`${i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
                            }`}
                    />
                ))}
            </div>
            <p className="text-gray-700 text-[15px] leading-relaxed mb-6 line-clamp-4 italic">"{review.text}"</p>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2F3AA2] to-[#4a58d6] flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {review.name.charAt(0)}
                </div>
                <div>
                    <p className="font-bold text-gray-900 text-sm">{review.name}</p>
                    <p className="text-xs text-[#2F3AA2] font-medium">{review.role}</p>
                </div>
            </div>
        </div>
    </div>
);

export default function ReviewsMarquee() {
    const { language } = useLanguage();
    const reviews = language === 'sk' ? reviewsSK : reviewsEN;

    return (
        <section className="py-24 overflow-hidden bg-gray-50/50 relative">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-[#2F3AA2]/5 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-blue-100/30 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-6 mb-16 text-center relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                    Trusted by Language Lovers
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Join thousands of students and teachers worldwide who are already achieving their goals.
                </p>
            </div>

            <div className="relative z-10">
                {/* Gradient Masks */}
                <div className="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-gray-50 to-transparent z-20 pointer-events-none" />
                <div className="absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-gray-50 to-transparent z-20 pointer-events-none" />

                {/* Row 1: Left */}
                <div className="flex mb-8">
                    <motion.div
                        className="flex"
                        animate={{ x: [0, -1000] }}
                        transition={{
                            repeat: Infinity,
                            ease: "linear",
                            duration: 40,
                        }}
                    >
                        {[...reviews, ...reviews, ...reviews].map((review, i) => (
                            <ReviewCard key={`r1-${i}`} review={review} />
                        ))}
                    </motion.div>
                </div>

                {/* Row 2: Right */}
                <div className="flex">
                    <motion.div
                        className="flex"
                        animate={{ x: [-1000, 0] }}
                        transition={{
                            repeat: Infinity,
                            ease: "linear",
                            duration: 45,
                        }}
                    >
                        {[...reviews, ...reviews, ...reviews].map((review, i) => (
                            <ReviewCard key={`r2-${i}`} review={review} />
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
