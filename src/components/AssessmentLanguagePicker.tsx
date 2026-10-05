"use client";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function AssessmentLanguagePicker({route,code}:{route:string;code:string}) {
 const { language } = useLanguage();
 const sk = language === "sk";
 const languages=[
   {code:"en",sk:"Angličtina",en:"English"},
   {code:"de",sk:"Nemčina",en:"German"},
   {code:"es",sk:"Španielčina",en:"Spanish"},
   {code:"it",sk:"Taliančina",en:"Italian"},
   {code:"fr",sk:"Francúzština",en:"French"},
   {code:"pt",sk:"Portugalčina",en:"Portuguese"},
 ];
 return <nav aria-label={sk ? "Jazyk testu" : "Test language"} className="my-5 flex flex-wrap gap-3">{languages.map(item=><Link key={item.code} href={`${route}?language=${item.code}`} aria-current={code===item.code?"page":undefined} className={`rounded-xl border px-4 py-3 font-semibold ${code===item.code?"bg-[#2F3AA2] text-white":"bg-white text-[#2F3AA2]"}`}>{sk?item.sk:item.en}</Link>)}</nav>;
}
