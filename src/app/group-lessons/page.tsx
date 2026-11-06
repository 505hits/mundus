import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Users, CalendarDays, MessageCircle, Sparkles } from "lucide-react";
import { currentLanguage } from "@/lib/i18n";
import { localizedAlternates, localizedPath } from "@/lib/seo-locales";


export async function generateMetadata(): Promise<Metadata> {
 const language=await currentLanguage(); const sk=language==="sk";
 return { title: sk ? "Skupinové jazykové kurzy online | Mundus Languages" : "Private group language lessons online | Mundus Languages", description: sk ? "Súkromné online jazykové hodiny pre 2–5 priateľov alebo kolegov. Flexibilné termíny, spoločný cieľ a cena na mieru." : "Private online language lessons for 2–5 friends or colleagues with flexible scheduling, a shared goal and custom pricing.", alternates:localizedAlternates("/group-lessons",language), openGraph:{title:sk?"Skupinové jazykové kurzy online | Mundus Languages":"Private group language lessons online | Mundus Languages",description:sk?"Súkromné online jazykové hodiny pre 2–5 priateľov alebo kolegov. Flexibilné termíny, spoločný cieľ a cena na mieru.":"Private online language lessons for 2–5 friends or colleagues with flexible scheduling, a shared goal and custom pricing.",url:`https://munduslanguages.com${localizedPath("/group-lessons",language)}`,type:"website",images:[{url:"/logo-removebg-preview.png",width:1200,height:630}]}, twitter:{card:"summary_large_image",title:sk?"Skupinové jazykové kurzy online | Mundus Languages":"Private group language lessons online | Mundus Languages",description:sk?"Súkromné online jazykové hodiny pre 2–5 priateľov alebo kolegov. Flexibilné termíny, spoločný cieľ a cena na mieru.":"Private online language lessons for 2–5 friends or colleagues with flexible scheduling, a shared goal and custom pricing.",images:["/logo-removebg-preview.png"]} };
}
export default async function GroupLessonsPage(){
 const language=await currentLanguage();const sk=language==="sk";
 return <main className="min-h-screen bg-[#FAFAF9]"><Navbar/><section className="px-6 pb-16 pt-32"><div className="mx-auto max-w-6xl"><p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">{sk?"Súkromné skupiny":"Private groups"}</p><h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl">{sk?"Učte sa spolu s priateľmi alebo kolegami":"Learn together with friends or colleagues"}</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600">{sk?"Malé súkromné online skupiny pre ľudí, ktorí sa už poznajú. Ideálne pre 2–5 osôb s podobnou úrovňou a spoločným cieľom.":"Small private online groups for people who already know each other. Ideal for 2–5 people with a similar level and shared goal."}</p><Link href={`/${language}/contact?type=group`} className="mt-8 inline-flex rounded-xl bg-[#2F3AA2] px-6 py-4 font-semibold text-white">{sk?"Požiadať o cenu":"Request group pricing"}</Link></div></section>
 <section className="px-6 py-12"><div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2">{[
  [Users,sk?"2–5 osôb":"2–5 people",sk?"Súkromná skupina, ktorú tvoríte vy – nie náhodní študenti.":"A private group formed by you — not random students."],
  [CalendarDays,sk?"Flexibilný termín":"Flexible schedule",sk?"Termíny nastavíme podľa spoločných časových možností skupiny a lektora.":"We schedule around the shared availability of your group and teacher."],
  [MessageCircle,sk?"Spoločný cieľ":"Shared goal",sk?"Konverzácia, cestovanie, práca alebo všeobecný jazyk podľa toho, čo skupina potrebuje.":"Conversation, travel, work or general language based on what the group needs."],
  [Sparkles,sk?"Cena na mieru":"Custom pricing",sk?"Cena závisí od veľkosti skupiny, dĺžky hodiny, frekvencie a počtu lekcií.":"Pricing depends on group size, lesson length, frequency and number of lessons."]
 ].map(([Icon,title,text])=>{const C=Icon as typeof Users;return <article key={String(title)} className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm"><C size={24} className="text-[#2F3AA2]"/><h2 className="mt-4 text-xl font-semibold">{String(title)}</h2><p className="mt-2 leading-7 text-gray-600">{String(text)}</p></article>})}</div></section><Footer/></main>;
}
