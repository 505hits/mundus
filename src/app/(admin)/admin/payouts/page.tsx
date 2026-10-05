import TeacherRateForm from "./TeacherRateForm";
import {requireRole} from "@/lib/auth";
import {createSupabaseServerClient} from "@/lib/supabase/server";
import {BRATISLAVA_TIME_ZONE,currentBratislavaMonth,parseBratislavaMonth} from "@/lib/month";
import {currentLanguage,localeFor} from "@/lib/i18n";

export default async function PayoutsPage({searchParams}:{searchParams?:Promise<{month?:string|string[]}>}){
 const language=await currentLanguage(); const sk=language==="sk";
 await requireRole("admin"); const db=await createSupabaseServerClient();
 const params=await searchParams; const requested=Array.isArray(params?.month)?params?.month[0]:params?.month;
 const current=currentBratislavaMonth(); const selected=parseBratislavaMonth(requested)||current;
 const [{data:teachers,error:teachersError},{data:lessons,error:lessonsError},{data:rates,error:ratesError}]=await Promise.all([
  db.from("profiles").select("id,full_name,email,status").eq("role","teacher").order("full_name"),
  db.from("lessons").select("teacher_id,scheduled_at,status,duration_minutes").eq("status","completed").gte("scheduled_at",selected.start).lt("scheduled_at",selected.end),
  db.from("teacher_pay_rates").select("teacher_id,effective_month,rate_cents_per_lesson").lte("effective_month",selected.key).order("effective_month",{ascending:false})
 ]);
 if(teachersError||lessonsError||ratesError) throw new Error("Payout data is unavailable");
 const rows=(teachers??[]).map(t=>{
  const teacherLessons=(lessons??[]).filter(l=>l.teacher_id===t.id);
  const latestRate=(rates??[]).find(r=>r.teacher_id===t.id);
  const rate=latestRate?.rate_cents_per_lesson??0;
  const total=teacherLessons.length*rate;
  return {...t,lessons:teacherLessons.length,rate,total};
 }).filter(r=>r.lessons>0||r.rate>0).sort((a,b)=>b.total-a.total);
 const grand=rows.reduce((s,r)=>s+r.total,0);
 const monthLabel=new Intl.DateTimeFormat(localeFor(language),{month:"long",year:"numeric",timeZone:BRATISLAVA_TIME_ZONE}).format(new Date(selected.start));
 return <main className="min-h-screen bg-transparent"><div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">{sk?"Výplaty lektorov":"Teacher payouts"}</p><h1 className="mt-2 text-3xl font-semibold">{sk?"Mesačný payout report":"Monthly payout report"}</h1><p className="mt-2 text-gray-500">{sk?"Dokončené hodiny × uložená mesačná sadzba. Zmena novej sadzby neprepíše staršie mesiace.":"Completed lessons × saved monthly rate. Changing a new rate does not rewrite earlier months."}</p>
  <div className="mt-4 flex flex-wrap items-end gap-3"><form method="get" className="flex items-end gap-2"><label><span className="block text-xs text-gray-500">{sk?"Mesiac":"Month"}</span><input type="month" name="month" defaultValue={selected.key.slice(0,7)} max={current.key.slice(0,7)} className="mt-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"/></label><button className="rounded-xl bg-[#2F3AA2] px-4 py-2 text-sm font-semibold text-white">{sk?"Zobraziť":"Show"}</button></form><a href={`/admin/payouts/export?month=${selected.key.slice(0,7)}`} className="rounded-xl border border-[#2F3AA2]/20 bg-white px-4 py-2 text-sm font-semibold text-[#2F3AA2]">{sk?"Stiahnuť CSV":"Download CSV"}</a></div>
  <TeacherRateForm teachers={(teachers??[]).filter(t=>t.status==="active")} month={selected.key.slice(0,7)}/>
  <section className="mt-8 overflow-hidden rounded-3xl border border-[#E5E7F0] bg-white shadow-sm"><div className="divide-y divide-gray-100">{rows.map(r=><div key={r.id} className="grid gap-4 px-5 py-5 lg:grid-cols-[1.5fr_0.7fr_0.8fr_0.9fr] lg:items-center lg:px-6"><div><p className="font-semibold">{r.full_name?.trim()||r.email||(sk?"Lektor":"Teacher")}</p><p className="text-xs text-gray-400">{monthLabel}</p></div><div><p className="text-xs text-gray-400">{sk?"Hodiny":"Lessons"}</p><p className="font-semibold">{r.lessons}</p></div><div><p className="text-xs text-gray-400">{sk?"Sadzba":"Rate"}</p><p className="font-semibold">{(r.rate/100).toFixed(2)} €</p></div><div><p className="text-xs text-gray-400">{sk?"Na vyplatenie":"Payout"}</p><p className="text-lg font-semibold text-[#2F3AA2]">{(r.total/100).toFixed(2)} €</p></div></div>)}</div><div className="border-t border-gray-100 px-6 py-5 text-right"><span className="text-sm text-gray-500">{sk?"Spolu: ":"Total: "}</span><span className="text-xl font-semibold">{(grand/100).toFixed(2)} €</span></div></section>
 </div></main>;
}
