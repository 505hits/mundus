import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatLanguage, formatLessonStatus } from "@/lib/portalLabels";
import { CalendarDays, Clock3 } from "lucide-react";

function name(profile:{full_name?:string|null;email?:string|null}|null|undefined){
  return profile?.full_name?.trim()||profile?.email||"Neznáme";
}
function dateKey(value:string){
  return new Intl.DateTimeFormat("en-CA",{timeZone:"Europe/Bratislava",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date(value));
}
function dateLabel(value:string){
  return new Intl.DateTimeFormat("sk-SK",{timeZone:"Europe/Bratislava",weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(new Date(value));
}
function timeLabel(value:string){
  return new Intl.DateTimeFormat("sk-SK",{timeZone:"Europe/Bratislava",hour:"2-digit",minute:"2-digit",hour12:false}).format(new Date(value));
}

export default async function AdminCalendarPage(){
  await requireRole("admin");
  const db=await createSupabaseServerClient();
  const {data,error}=await db.from("lessons").select(`
    id,scheduled_at,duration_minutes,status,language,
    student:profiles!lessons_student_id_fkey(full_name,email),
    teacher:profiles!lessons_teacher_id_fkey(full_name,email)
  `).order("scheduled_at",{ascending:true});

  const groups=new Map<string,typeof data>();
  for(const lesson of data??[]){
    const key=dateKey(lesson.scheduled_at);
    const row=groups.get(key)??[];
    row?.push(lesson);
    groups.set(key,row);
  }

  return <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">Centrálny kalendár</p>
    <h1 className="mt-2 text-3xl font-semibold">Všetky hodiny Mundus</h1>
    <p className="mt-3 max-w-3xl text-gray-600">Spoločný admin prehľad všetkých evidovaných hodín — minulých aj naplánovaných — naprieč všetkými lektormi a študentmi.</p>

    {error?<p role="alert" className="mt-6 rounded-2xl bg-red-50 p-4 text-red-700">Kalendár sa nepodarilo načítať.</p>:
      groups.size===0?<div className="mt-8 rounded-3xl border border-black/5 bg-white p-8 text-gray-500 shadow-sm">Zatiaľ nie sú evidované žiadne hodiny.</div>:
      <div className="mt-8 space-y-6">{Array.from(groups.entries()).map(([key,lessons])=><section key={key} className="rounded-3xl border border-black/5 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-black/5 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3"><CalendarDays size={19} className="text-[#2F3AA2]"/><h2 className="font-semibold capitalize">{dateLabel(lessons?.[0]?.scheduled_at||key)}</h2></div>
          <span className="rounded-full bg-[#EEF2FF] px-3 py-1 text-xs font-semibold text-[#2F3AA2]">{lessons?.length??0} hod.</span>
        </div>
        <div className="divide-y divide-gray-100">{lessons?.map(lesson=>{
          const student=Array.isArray(lesson.student)?lesson.student[0]:lesson.student;
          const teacher=Array.isArray(lesson.teacher)?lesson.teacher[0]:lesson.teacher;
          return <div key={lesson.id} className="grid gap-3 px-5 py-4 sm:grid-cols-[0.7fr_1.2fr_1.2fr_1fr_0.9fr] sm:items-center sm:px-6">
            <div className="flex items-center gap-2 font-semibold"><Clock3 size={15} className="text-gray-400"/>{timeLabel(lesson.scheduled_at)}</div>
            <div><p className="text-xs text-gray-400">Študent</p><p className="font-medium">{name(student)}</p></div>
            <div><p className="text-xs text-gray-400">Lektor</p><p className="font-medium">{name(teacher)}</p></div>
            <div><p className="text-xs text-gray-400">Hodina</p><p className="text-sm">{formatLanguage(lesson.language)} · {lesson.duration_minutes||60} min</p></div>
            <div><span className="rounded-full bg-[#EEF2FF] px-3 py-1 text-xs font-semibold text-[#3730A3]">{formatLessonStatus(lesson.status)}</span></div>
          </div>;
        })}</div>
      </section>)}</div>
    }
  </main>;
}
