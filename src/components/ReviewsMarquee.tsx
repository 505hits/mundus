"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
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

const ReviewCard = ({ review }: { review: typeof reviews[0] }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 w-[300px] flex-shrink-0 mx-4">
        <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    size={16}
                    className={`${i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
                        }`}
                />
            ))}
        </div>
        <p className="text-gray-700 text-sm mb-4 line-clamp-3">"{review.text}"</p>
        <div>
            <p className="font-semibold text-gray-900 text-sm">{review.name}</p>
            <p className="text-xs text-gray-500">{review.role}</p>
        </div>
    </div>
);

export default function ReviewsMarquee() {
    return (
        <section className="py-20 overflow-hidden bg-gray-50">
            <div className="container mx-auto px-6 mb-12 text-center">
                <h2 className="text-3xl font-bold mb-4">Trusted by Language Lovers</h2>
                <p className="text-gray-600">Join thousands of students and teachers worldwide.</p>
            </div>

            <div className="relative">
                {/* Gradient Masks */}
                <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-gray-50 to-transparent z-10" />
                <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-gray-50 to-transparent z-10" />

                {/* First Line - Left to Right (Actually Right to Left for standard marquee, but let's do Left) */}
                {/* Standard marquee moves content Left. Let's make one move Left and one Right. */}

                {/* Row 1: Left */}
                <div className="flex mb-8 overflow-hidden">
                    <motion.div
                        className="flex"
                        animate={{ x: [0, -1000] }} // Adjust value based on content width
                        transition={{
                            repeat: Infinity,
                            ease: "linear",
                            duration: 30, // Adjust speed
                        }}
                    >
                        {[...reviews, ...reviews, ...reviews].map((review, i) => (
                            <ReviewCard key={`r1-${i}`} review={review} />
                        ))}
                    </motion.div>
                </div>

                {/* Row 2: Right */}
                <div className="flex overflow-hidden">
                    <motion.div
                        className="flex"
                        animate={{ x: [-1000, 0] }} // Move right
                        transition={{
                            repeat: Infinity,
                            ease: "linear",
                            duration: 35, // Slightly different speed
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
