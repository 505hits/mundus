import Link from "next/link";
export default function AssessmentLanguagePicker({route,code}:{route:string;code:string}) {
 return <nav aria-label="Jazyk testu" className="my-5 flex flex-wrap gap-3">{[{code:"en",name:"Angličtina"},{code:"de",name:"Nemčina"},{code:"es",name:"Španielčina"},{code:"it",name:"Taliančina"},{code:"fr",name:"Francúzština"}].map(language=><Link key={language.code} href={`${route}?language=${language.code}`} aria-current={code===language.code?"page":undefined} className={`rounded-xl border px-4 py-3 font-semibold ${code===language.code?"bg-[#2F3AA2] text-white":"bg-white text-[#2F3AA2]"}`}>{language.name}</Link>)}</nav>;
}
