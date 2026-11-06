"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { bratislavaLocalToUtc, INVALID_LESSON_TIME } from "@/lib/lesson-time";
import { safeLessonLink } from "@/lib/lesson-link";
import { MUNDUS_LANGUAGE_OPTIONS } from "@/lib/language-offer";
import { formatLanguage } from "@/lib/portalLabels";
import { useLanguage } from "@/context/LanguageContext";

type Person={id:string;full_name:string|null;email:string|null};
export default function AdminCreateGroupLessonForm({students,teachers}:{students:Person[];teachers:Person[]}){
 const router=useRouter();const {language:uiLanguage}=useLanguage();const sk=uiLanguage==="sk";
 const [teacherId,setTeacherId]=useState(teachers[0]?.id??"");const [studentIds,setStudentIds]=useState<string[]>([]);
 const [dateTime,setDateTime]=useState("");const [duration,setDuration]=useState<45|60>(60);const [language,setLanguage]=useState("English");const [meetLink,setMeetLink]=useState("");
 const [saving,setSaving]=useState(false);const [error,setError]=useState("");const [saved,setSaved]=useState(false);
 const toggle=(id:string)=>setStudentIds(current=>current.includes(id)?current.filter(x=>x!==id):current.length<5?[...current,id]:current);
 async function create(){
  setError("");setSaved(false);
  if(studentIds.length<2||studentIds.length>5){setError(sk?"Vyberte 2 až 5 študentov.":"Choose 2 to 5 students.");return}
  if(!teacherId||!dateTime){setError(sk?"Vyberte lektora, dátum a čas.":"Choose a teacher, date and time.");return}
  const scheduled=bratislavaLocalToUtc(dateTime);if(Number.isNaN(scheduled.getTime())){setError(sk?INVALID_LESSON_TIME:"The selected lesson time is invalid.");return}
  if(scheduled.getTime()<=Date.now()){setError(sk?"Termín musí byť v budúcnosti.":"The lesson must be in the future.");return}
  const link=meetLink.trim();if(link&&!safeLessonLink(link)){setError(sk?"Zadajte platný https:// odkaz na hodinu.":"Enter a valid https:// lesson link.");return}
  setSaving(true);
  try{
   const supabase=createSupabaseBrowserClient();
   const {data,error}=await supabase.rpc("mundus_create_group_session",{target_teacher_id:teacherId,target_student_ids:studentIds,target_scheduled_at:scheduled.toISOString(),target_duration_minutes:duration,target_language:language,target_meet_link:link||null});
   if(error||!data){setError(sk?"Skupinu sa nepodarilo vytvoriť. Každý študent musí mať aktívny balíček rovnakej dĺžky.":"The group could not be created. Every student needs an active package with the same duration.");return}
   setSaved(true);setStudentIds([]);setDateTime("");setMeetLink("");router.refresh();
  }catch{setError(sk?"Skupinovú hodinu sa nepodarilo uložiť.":"The group lesson could not be saved.")}finally{setSaving(false)}
 }
 const name=(p:Person)=>p.full_name?.trim()||p.email||"—";
 return <details className="mt-4 rounded-3xl border border-[#DDE2FB] bg-[#F7F7FF] p-5 shadow-sm sm:p-6"><summary className="flex cursor-pointer list-none items-center gap-2 font-semibold"><Users size={19}/>{sk?"Naplánovať skupinovú hodinu":"Schedule a group lesson"}</summary><p className="mt-3 text-sm text-gray-600">{sk?"Vyberte 2–5 študentov. Systém automaticky použije aktívny balíček rovnakej dĺžky každého študenta; kredit sa odpočíta každému zvlášť až po dokončení hodiny.":"Choose 2–5 students. The system automatically uses each student’s active package with the same duration; each credit is deducted separately only after completion."}</p>
 <div className="mt-5 grid gap-4 md:grid-cols-2">
  <label className="text-sm font-medium">{sk?"Lektor":"Teacher"}<select value={teacherId} onChange={e=>setTeacherId(e.target.value)} className="mt-2 w-full rounded-xl border bg-white p-3">{teachers.map(t=><option key={t.id} value={t.id}>{name(t)}</option>)}</select></label>
  <label className="text-sm font-medium">{sk?"Jazyk":"Language"}<select value={language} onChange={e=>setLanguage(e.target.value)} className="mt-2 w-full rounded-xl border bg-white p-3">{MUNDUS_LANGUAGE_OPTIONS.map(({value})=><option key={value} value={value}>{formatLanguage(value,uiLanguage)}</option>)}</select></label>
  <label className="text-sm font-medium">{sk?"Dátum a čas":"Date and time"}<input type="datetime-local" value={dateTime} onChange={e=>setDateTime(e.target.value)} className="mt-2 w-full rounded-xl border p-3"/></label>
  <label className="text-sm font-medium">{sk?"Dĺžka":"Duration"}<select value={duration} onChange={e=>setDuration(Number(e.target.value) as 45|60)} className="mt-2 w-full rounded-xl border bg-white p-3"><option value={45}>45 min</option><option value={60}>60 min</option></select></label>
  <label className="text-sm font-medium md:col-span-2">{sk?"Odkaz na online hodinu":"Online lesson link"}<input type="url" value={meetLink} onChange={e=>setMeetLink(e.target.value)} placeholder="https://meet.google.com/..." className="mt-2 w-full rounded-xl border p-3"/></label>
 </div>
 <fieldset className="mt-5"><legend className="text-sm font-semibold">{sk?"Členovia skupiny":"Group members"} <span className="font-normal text-gray-400">({studentIds.length}/5)</span></legend><div className="mt-3 grid max-h-64 gap-2 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3">{students.map(s=><label key={s.id} className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm ${studentIds.includes(s.id)?"border-[#2F3AA2] bg-white":"border-gray-200 bg-white/60"}`}><input type="checkbox" checked={studentIds.includes(s.id)} onChange={()=>toggle(s.id)} disabled={!studentIds.includes(s.id)&&studentIds.length>=5}/><span className="truncate">{name(s)}</span></label>)}</div></fieldset>
 <button type="button" onClick={create} disabled={saving||students.length<2||teachers.length===0} className="mt-5 rounded-xl bg-[#2F3AA2] px-5 py-3 font-semibold text-white disabled:opacity-50">{saving?(sk?"Vytváram…":"Creating…"):(sk?"Vytvoriť skupinovú hodinu":"Create group lesson")}</button>
 {saved&&<p role="status" className="mt-3 text-sm font-medium text-green-800">{sk?"Skupinová hodina bola vytvorená pre všetkých členov.":"The group lesson was created for all members."}</p>}{error&&<p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}</details>;
}
