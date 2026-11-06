import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { currentLanguage, localeFor } from "@/lib/i18n";

type EmployeeRow={student_id:string;full_name:string|null;email:string|null;language:string|null;total_purchased:number;remaining_lessons:number;completed_lessons:number;next_lesson_at:string|null;last_lesson_at:string|null};

export default async function CompanyEmployeesPage(){
 const language=await currentLanguage(); const sk=language==="sk";
 await requireRole("company"); const supabase=await createSupabaseServerClient();
 const {data,error}=await supabase.rpc("company_employee_overview"); const rows=(data??[]) as EmployeeRow[];
 const fmt=(v:string|null)=>v?new Intl.DateTimeFormat(localeFor(language),{dateStyle:"medium",timeZone:"Europe/Bratislava"}).format(new Date(v)):"—";
 return <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10"><p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">{sk?"Firemný portál":"Company portal"}</p><h1 className="mt-2 text-3xl font-semibold">{sk?"Zamestnanci":"Employees"}</h1><p className="mt-2 text-gray-600">{sk?"Základný prehľad využívania firemnej jazykovej výučby.":"A limited overview of company language-training usage."}</p>
 {error?<p role="alert" className="mt-6 text-red-700">{sk?"Údaje sa nepodarilo načítať.":"Data could not be loaded."}</p>:!rows.length?<p className="mt-6 rounded-2xl bg-white p-5 text-gray-500">{sk?"Zatiaľ nemáte priradených zamestnancov.":"You do not have any assigned employees yet."}</p>:
 <div className="mt-6 overflow-x-auto rounded-3xl border border-black/5 bg-white shadow-sm"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-[#F6F7FB] text-gray-500"><tr><th className="px-5 py-4">{sk?"Zamestnanec":"Employee"}</th><th className="px-5 py-4">{sk?"Jazyk":"Language"}</th><th className="px-5 py-4">{sk?"Dokončené":"Completed"}</th><th className="px-5 py-4">{sk?"Zostáva":"Remaining"}</th><th className="px-5 py-4">{sk?"Ďalšia hodina":"Next lesson"}</th><th className="px-5 py-4">{sk?"Posledná hodina":"Last lesson"}</th></tr></thead><tbody>{rows.map(r=><tr key={r.student_id} className="border-t border-gray-100"><td className="px-5 py-4"><p className="font-semibold">{r.full_name||r.email}</p><p className="text-xs text-gray-400">{r.email}</p></td><td className="px-5 py-4">{r.language||"—"}</td><td className="px-5 py-4">{r.completed_lessons}</td><td className="px-5 py-4">{r.remaining_lessons}</td><td className="px-5 py-4">{fmt(r.next_lesson_at)}</td><td className="px-5 py-4">{fmt(r.last_lesson_at)}</td></tr>)}</tbody></table></div>}</main>;
}
