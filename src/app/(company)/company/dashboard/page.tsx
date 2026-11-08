import Link from "next/link";
import { Building2, CalendarDays, GraduationCap, Users } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { currentLanguage, localeFor } from "@/lib/i18n";

type EmployeeRow={student_id:string;full_name:string|null;email:string|null;language:string|null;total_purchased:number;remaining_lessons:number;completed_lessons:number;next_lesson_at:string|null;last_lesson_at:string|null};

export default async function CompanyDashboardPage(){
  const language=await currentLanguage(); const sk=language==="sk";
  await requireRole("company");
  const supabase=await createSupabaseServerClient();
  const {data,error}=await supabase.rpc("company_employee_overview");
  const employees=(data??[]) as EmployeeRow[];
  const activeUpcoming=employees.filter(e=>e.next_lesson_at).length;
  const completed=employees.reduce((sum,e)=>sum+Number(e.completed_lessons||0),0);
  const remaining=employees.reduce((sum,e)=>sum+Number(e.remaining_lessons||0),0);
  return <main className="dashboard-page mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
    <section className="dashboard-welcome relative overflow-hidden rounded-[1.6rem] p-6 sm:p-9">
    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#DDE4FF]">{sk?"Firemný portál":"Company portal"}</p>
    <h1 className="mt-2 text-3xl font-semibold">{sk?"Prehľad jazykového vzdelávania":"Language training overview"}</h1>
    <p className="mt-2 text-gray-500">{sk?"Sledujte základný stav výučby zamestnancov priradených k vašej spoločnosti.":"Track the essential learning status of employees assigned to your company."}</p>
    </section>
    {error&&<p role="alert" className="mt-5 rounded-2xl bg-red-50 p-4 text-red-700">{sk?"Prehľad sa nepodarilo načítať.":"The overview could not be loaded."}</p>}
    <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[
        [Users,employees.length,sk?"Zamestnanci":"Employees"],
        [CalendarDays,activeUpcoming,sk?"S naplánovanou hodinou":"With an upcoming lesson"],
        [GraduationCap,completed,sk?"Dokončené hodiny":"Completed lessons"],
        [Building2,remaining,sk?"Zostávajúce hodiny":"Lessons remaining"],
      ].map(([Icon,value,label],i)=>{const C=Icon as typeof Users; return <div key={i} className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm"><C size={20} className="text-[#2F3AA2]"/><p className="mt-4 text-3xl font-semibold">{error ? "—" : String(value)}</p><p className="mt-1 text-sm text-gray-500">{String(label)}</p></div>})}
    </section>
    <section className="mt-8 rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-semibold">{sk?"Zamestnanci":"Employees"}</h2><p className="mt-1 text-sm text-gray-500">{sk?"Zobrazuje sa iba základný stav výučby, nie súkromné poznámky ani výsledky testov.":"Only essential learning status is shown, not private notes or test results."}</p></div><Link href="/company/employees" className="font-semibold text-[#2F3AA2] underline">{sk?"Zobraziť všetkých":"View all"}</Link></div>
      {!employees.length?<p className="mt-5 text-gray-500">{sk?"K vašej spoločnosti zatiaľ nie sú priradení zamestnanci.":"No employees are assigned to your company yet."}</p>:
      <div className="mt-5 divide-y divide-gray-100">{employees.slice(0,5).map(e=><div key={e.student_id} className="grid gap-2 py-4 sm:grid-cols-[1.4fr_1fr_1fr] sm:items-center"><div><p className="font-semibold">{e.full_name||e.email|| (sk?"Zamestnanec":"Employee")}</p><p className="text-sm text-gray-500">{e.language||"—"}</p></div><p className="text-sm">{sk?"Dokončené":"Completed"}: <strong>{e.completed_lessons}</strong> · {sk?"zostáva":"remaining"}: <strong>{e.remaining_lessons}</strong></p><p className="text-sm text-gray-500">{e.next_lesson_at?new Intl.DateTimeFormat(localeFor(language),{dateStyle:"medium",timeStyle:"short",timeZone:"Europe/Bratislava"}).format(new Date(e.next_lesson_at)):(sk?"Bez ďalšieho termínu":"No upcoming lesson")}</p></div>)}</div>}
    </section>
    <p className="mt-6 text-xs leading-5 text-gray-500">{sk?"Firemný portál zámerne nezobrazuje domáce úlohy, hodnotenia, testové odpovede, súkromné poznámky lektora ani interné údaje Mundus.":"The company portal intentionally excludes homework, ratings, test answers, private teacher notes and Mundus internal data."}</p>
  </main>;
}
