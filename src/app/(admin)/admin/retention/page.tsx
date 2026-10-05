import Link from "next/link";
import { AlertTriangle, CalendarX2, PackageOpen, UserRoundX } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {currentLanguage} from "@/lib/i18n";

function labelDays(days:number|null,sk:boolean){
  if(days===null) return sk?"Bez dokončenej hodiny":"No completed lesson";
  if(days===0) return sk?"Dnes":"Today";
  return sk?`${days} dní`:`${days} days`;
}

export default async function RetentionPage(){
  const language=await currentLanguage(); const sk=language==="sk";
  await requireRole("admin");
  const db=await createSupabaseServerClient();
  const now=new Date();

  const [
    {data:students,error:studentsError},
    {data:packages,error:packagesError},
    {data:lessons,error:lessonsError},
  ]=await Promise.all([
    db.from("profiles").select("id,full_name,email,status").eq("role","student").eq("status","active").order("full_name"),
    db.from("lesson_packages").select("student_id,remaining_lessons,status,purchased_at").in("status",["active","completed"]),
    db.from("lessons").select("student_id,scheduled_at,status").order("scheduled_at",{ascending:false}),
  ]);

  if(studentsError||packagesError||lessonsError) throw new Error("Retention data is unavailable");

  const rows=(students??[]).map(student=>{
    const studentPackages=(packages??[]).filter(p=>p.student_id===student.id&&p.status==="active");
    const remaining=studentPackages.reduce((sum,p)=>sum+(p.remaining_lessons??0),0);
    const studentLessons=(lessons??[]).filter(l=>l.student_id===student.id);
    const completed=studentLessons.find(l=>l.status==="completed");
    const upcoming=studentLessons.some(l=>["scheduled","rescheduled"].includes(l.status)&&new Date(l.scheduled_at).getTime()>=now.getTime());
    const daysInactive=completed?Math.floor((now.getTime()-new Date(completed.scheduled_at).getTime())/86400000):null;
    const riskPoints=(remaining<=2?2:0)+(!upcoming?2:0)+(daysInactive!==null&&daysInactive>=30?3:daysInactive!==null&&daysInactive>=14?1:0)+(completed?0:2);
    const risk=riskPoints>=5?"high":riskPoints>=2?"medium":"low";
    return {student,remaining,upcoming,daysInactive,risk,riskPoints};
  }).sort((a,b)=>b.riskPoints-a.riskPoints||a.remaining-b.remaining);

  const high=rows.filter(r=>r.risk==="high").length;
  const lowCredits=rows.filter(r=>r.remaining<=2).length;
  const noUpcoming=rows.filter(r=>!r.upcoming).length;
  const inactive30=rows.filter(r=>r.daysInactive!==null&&r.daysInactive>=30).length;

  return <main className="min-h-screen bg-transparent text-[#0a0a0f]">
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
      <section><p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">{sk?"Retencia":"Retention"}</p><h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{sk?"Študenti, ktorí potrebujú pozornosť":"Students who need attention"}</h1><p className="mt-2 text-gray-500">{sk?"Kombinácia zostávajúcich hodín, ďalšej rezervácie a poslednej dokončenej hodiny.":"Based on remaining lessons, next booking and the last completed lesson."}</p></section>
      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {value:high,label:sk?"Vysoké riziko":"High risk",Icon:AlertTriangle},
          {value:lowCredits,label:sk?"0–2 hodiny":"0–2 lessons",Icon:PackageOpen},
          {value:noUpcoming,label:sk?"Bez ďalšej hodiny":"No next lesson",Icon:CalendarX2},
          {value:inactive30,label:sk?"30+ dní neaktívni":"Inactive 30+ days",Icon:UserRoundX},
        ].map(({value,label,Icon})=><div key={label} className="rounded-3xl border border-[#E5E7F0] bg-white p-5 shadow-sm"><Icon size={20} className="text-[#2F3AA2]"/><p className="mt-4 text-3xl font-semibold">{value}</p><p className="mt-1 text-sm text-gray-500">{label}</p></div>)}
      </section>
      <section className="mt-8 overflow-hidden rounded-3xl border border-[#E5E7F0] bg-white shadow-sm">
        <div className="divide-y divide-gray-100">
          {rows.map(row=><div key={row.student.id} className="grid gap-4 px-5 py-5 lg:grid-cols-[1.5fr_0.6fr_0.8fr_0.9fr_0.8fr] lg:items-center lg:px-6">
            <div><p className="font-semibold">{row.student.full_name?.trim()||row.student.email||(sk?"Študent":"Student")}</p><p className="mt-1 text-sm text-gray-400">{row.student.email}</p></div>
            <div><p className="text-xs text-gray-400">{sk?"Zostáva":"Remaining"}</p><p className="mt-1 font-semibold">{row.remaining}</p></div>
            <div><p className="text-xs text-gray-400">{sk?"Ďalšia hodina":"Next lesson"}</p><p className="mt-1 text-sm">{row.upcoming?(sk?"Naplánovaná":"Scheduled"):(sk?"Nenaplánovaná":"Not scheduled")}</p></div>
            <div><p className="text-xs text-gray-400">{sk?"Od poslednej hodiny":"Since last lesson"}</p><p className="mt-1 text-sm">{labelDays(row.daysInactive,sk)}</p></div>
            <div><span className={`rounded-full px-3 py-1 text-xs font-semibold ${row.risk==="high"?"bg-red-50 text-red-700":row.risk==="medium"?"bg-amber-50 text-amber-800":"bg-emerald-50 text-emerald-700"}`}>{row.risk==="high"?(sk?"Kontaktovať":"Contact"):row.risk==="medium"?(sk?"Sledovať":"Monitor"):(sk?"V poriadku":"Okay")}</span></div>
          </div>)}
        </div>
      </section>
      <div className="mt-5"><Link href="/admin/students" className="text-sm font-semibold text-[#2F3AA2] underline">{sk?"Otvoriť zoznam študentov":"Open student list"}</Link></div>
    </div>
  </main>;
}
