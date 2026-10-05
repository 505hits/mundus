import {AlertTriangle,BarChart3,CalendarDays,Star,Users} from "lucide-react";
import {requireRole} from "@/lib/auth";
import {createSupabaseServerClient} from "@/lib/supabase/server";
import {BRATISLAVA_TIME_ZONE,bratislavaMonth,currentBratislavaMonth,parseBratislavaMonth} from "@/lib/month";
import {currentLanguage,localeFor} from "@/lib/i18n";

const categoryLabels=(sk:boolean):Record<string,string>=>({preparation:sk?"Príprava":"Preparation",explanation:sk?"Vysvetľovanie":"Explanation",conversation:sk?"Konverzácia":"Conversation",friendly:sk?"Prístup":"Friendly approach",punctuality:sk?"Dochvíľnosť":"Punctuality"});

export default async function TeacherPerformancePage({searchParams}:{searchParams?:Promise<{month?:string|string[]}>}){
 const language=await currentLanguage(); const sk=language==="sk";
 await requireRole("admin"); const db=await createSupabaseServerClient();
 const params=await searchParams; const requested=Array.isArray(params?.month)?params?.month[0]:params?.month;
 const current=currentBratislavaMonth(); const selected=parseBratislavaMonth(requested)||current;
 const history=Array.from({length:6},(_,i)=>{let y=selected.year,m=selected.month-i;while(m<=0){m+=12;y--;}return bratislavaMonth(y,m);}).reverse();
 const historyStart=history[0].start;
 const [{data:teachers,error:teachersError},{data:lessons,error:lessonsError},{data:feedback,error:feedbackError}]=await Promise.all([
  db.from("profiles").select("id,full_name,email,status").eq("role","teacher"),
  db.from("lessons").select("teacher_id,student_id,scheduled_at,status").eq("status","completed").gte("scheduled_at",historyStart).lt("scheduled_at",selected.end),
  db.from("teacher_monthly_feedback").select("teacher_id,student_id,feedback_month,rating,feedback,categories,updated_at").gte("feedback_month",history[0].key).lte("feedback_month",selected.key)
 ]);
 if(teachersError||lessonsError||feedbackError) throw new Error("Teacher performance is unavailable");

 const rows=(teachers??[]).map(t=>{
  const tf=(feedback??[]).filter(f=>f.teacher_id===t.id);
  const tl=(lessons??[]).filter(l=>l.teacher_id===t.id);
  const trend=history.map(m=>{
   const ratings=tf.filter(f=>f.feedback_month===m.key);
   const count=tl.filter(l=>new Date(l.scheduled_at)>=new Date(m.start)&&new Date(l.scheduled_at)<new Date(m.end)).length;
   return {key:m.key.slice(0,7),avg:ratings.length?ratings.reduce((s,r)=>s+Number(r.rating),0)/ratings.length:null,responses:ratings.length,lessons:count};
  });
  const selectedRatings=tf.filter(f=>f.feedback_month===selected.key);
  const selectedLessons=tl.filter(l=>new Date(l.scheduled_at)>=new Date(selected.start)&&new Date(l.scheduled_at)<new Date(selected.end));
  const avg=selectedRatings.length?selectedRatings.reduce((s,r)=>s+Number(r.rating),0)/selectedRatings.length:null;
  const negative=tf.filter(f=>Number(f.rating)<=3&&history.slice(-2).some(m=>m.key===f.feedback_month)).length;
  const alert=(selectedRatings.length>=3&&avg!==null&&avg<4)||negative>=2;
  const categories=new Map<string,number>();
  for(const f of selectedRatings) for(const cat of f.categories??[]) categories.set(cat,(categories.get(cat)??0)+1);
  return {...t,avg,responses:selectedRatings.length,lessons:selectedLessons.length,students:new Set(selectedLessons.map(l=>l.student_id)).size,alert,negative,trend,categories:[...categories.entries()].sort((a,b)=>b[1]-a[1])};
 }).sort((a,b)=>Number(b.alert)-Number(a.alert)||(b.avg??-1)-(a.avg??-1)||b.responses-a.responses);

 const monthLabel=new Intl.DateTimeFormat(localeFor(language),{month:"long",year:"numeric",timeZone:BRATISLAVA_TIME_ZONE}).format(new Date(selected.start));
 return <main className="min-h-screen bg-[#FAFAF9]"><div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">{sk?"Kvalita výučby":"Teaching quality"}</p><h1 className="mt-2 text-3xl font-semibold">Teacher Performance</h1><p className="mt-2 text-gray-500">{sk?"Interný prehľad kvality, objemu a trendu. Upozornenie nikdy automaticky nemení status lektora.":"Internal overview of quality, volume and trends. Alerts never automatically change a teacher’s status."}</p>
  <form method="get" className="mt-4 flex items-end gap-2"><label><span className="block text-xs text-gray-500">{sk?"Mesiac":"Month"}</span><input type="month" name="month" defaultValue={selected.key.slice(0,7)} max={current.key.slice(0,7)} className="mt-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"/></label><button className="rounded-xl bg-[#2F3AA2] px-4 py-2 text-sm font-semibold text-white">{sk?"Zobraziť":"Show"}</button></form>
  <div className="mt-8 space-y-5">{rows.map(t=><article key={t.id} className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
   <div className="flex flex-wrap items-start justify-between gap-4"><div><div className="flex flex-wrap items-center gap-2"><h2 className="text-xl font-semibold">{t.full_name?.trim()||t.email||(sk?"Lektor":"Teacher")}</h2>{t.alert&&<span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700"><AlertTriangle size={13}/>{sk?"Skontrolovať kvalitu":"Review quality"}</span>}</div><p className="mt-1 text-sm text-gray-400">{monthLabel}</p></div><div className="grid grid-cols-3 gap-3 text-center"><div><p className="flex items-center justify-center gap-1 font-semibold"><Star size={15}/>{t.avg===null?"—":t.avg.toFixed(2)}</p><p className="text-xs text-gray-400">{t.responses} {sk?"hodnotení":"ratings"}</p></div><div><p className="flex items-center justify-center gap-1 font-semibold"><CalendarDays size={15}/>{t.lessons}</p><p className="text-xs text-gray-400">{sk?"hodín":"lessons"}</p></div><div><p className="flex items-center justify-center gap-1 font-semibold"><Users size={15}/>{t.students}</p><p className="text-xs text-gray-400">{sk?"študentov":"students"}</p></div></div></div>
   {t.alert&&<div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-800">{sk?"Systém našiel opakovaný slabší signál: ":"The system found a repeated weaker signal: "}{t.avg!==null&&t.responses>=3&&t.avg<4?`priemer ${t.avg.toFixed(2)} z ${t.responses} hodnotení`:`${t.negative} hodnotenia ≤3 za posledné 2 mesiace`}. {sk?"Odporúčanie: prečítať spätnú väzbu a riešiť individuálne, nie automaticky sankcionovať.":"Recommendation: review the feedback and handle it individually rather than applying an automatic penalty."}</div>}
   <div className="mt-5"><p className="flex items-center gap-2 text-sm font-semibold"><BarChart3 size={16}/>{sk?"6-mesačný trend":"6-month trend"}</p><div className="mt-3 grid gap-2 sm:grid-cols-3 xl:grid-cols-6">{t.trend.map(point=><div key={point.key} className="rounded-2xl bg-[#FAFAF9] p-3"><p className="text-xs text-gray-400">{point.key}</p><p className="mt-1 font-semibold">{point.avg===null?"—":point.avg.toFixed(2)} ★</p><p className="text-xs text-gray-400">{point.lessons} {sk?"hodín":"lessons"} · {point.responses} {sk?"hodnotení":"ratings"}</p></div>)}</div></div>
   <div className="mt-5 flex flex-wrap gap-2">{t.categories.length?t.categories.map(([cat,count])=><span key={cat} className="rounded-full bg-[#EEF2FF] px-3 py-1 text-xs font-medium text-[#2F3AA2]">{categoryLabels(sk)[cat]??cat} · {count}</span>):<span className="text-sm text-gray-400">{sk?"Bez kategorizovanej spätnej väzby.":"No categorized feedback."}</span>}</div>
  </article>)}</div>
 </div></main>;
}
