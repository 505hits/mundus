import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import AdminCreateLessonForm from "../lessons/AdminCreateLessonForm";
import { formatLanguage } from "@/lib/portalLabels";
import { teacherMatchScore } from "@/lib/teacher-matching";
import { currentLanguage } from "@/lib/i18n";

function personName(person:{full_name?:string|null;email?:string|null}) {
  return person.full_name?.trim() || person.email || "Bez mena";
}

export default async function MatchingPage(){
  const language=await currentLanguage();
  const sk=language==="sk";
  const days=sk?["","Po","Ut","St","Št","Pi","So","Ne"]:["","Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  await requireRole("admin");
  const db=await createSupabaseServerClient();
  const now=new Date().toISOString();
  const [people,prefs,packages,onboarding,upcoming]=await Promise.all([
    db.from("profiles").select("id,full_name,email,role").eq("status","active").in("role",["teacher","student"]),
    db.from("teacher_preferences").select("*"),
    db.from("lesson_packages").select("id,student_id,total_lessons,remaining_lessons").eq("status","active").gt("remaining_lessons",0),
    db.from("student_onboarding").select("student_id,language,level,goal,preferred_days,preferred_time_from,preferred_time_to"),
    db.from("lessons").select("student_id,teacher_id,status,scheduled_at").in("status",["scheduled","rescheduled"]).gte("scheduled_at",now),
  ]);

  const unavailable=people.error||prefs.error||packages.error||onboarding.error||upcoming.error;
  const teachers=(people.data??[]).filter(p=>p.role==="teacher");
  const students=(people.data??[]).filter(p=>p.role==="student");
  const packageStudentIds=new Set((packages.data??[]).map(p=>p.student_id));
  const upcomingStudentIds=new Set((upcoming.data??[]).map(l=>l.student_id));
  const onboardingByStudent=new Map((onboarding.data??[]).map(row=>[row.student_id,row]));
  const assignedByTeacher=new Map<string,Set<string>>();

  for(const lesson of upcoming.data??[]) {
    if(!assignedByTeacher.has(lesson.teacher_id)) assignedByTeacher.set(lesson.teacher_id,new Set());
    assignedByTeacher.get(lesson.teacher_id)?.add(lesson.student_id);
  }

  const waiting=students.filter(student=>
    packageStudentIds.has(student.id) &&
    onboardingByStudent.has(student.id) &&
    !upcomingStudentIds.has(student.id)
  );

  const recommendations=waiting.map(student=>{
    const request=onboardingByStudent.get(student.id)!;
    const ranked=teachers.flatMap(teacher=>{
      const pref=prefs.data?.find(row=>row.teacher_id===teacher.id);
      if(!pref) return [];
      const match=teacherMatchScore(request,pref,assignedByTeacher.get(teacher.id)?.size??0);
      return match?[{teacher,pref,...match}]:[];
    }).sort((a,b)=>b.score-a.score).slice(0,3);
    return {student,request,ranked};
  });

  const availableTeachers=teachers.filter(teacher=>
    prefs.data?.some(row=>row.teacher_id===teacher.id&&row.accepting_students)
  );

  return <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">Smart matching</p>
    <h1 className="mt-2 text-3xl font-semibold">{sk?"Priradenie študenta k lektorovi":"Match student with teacher"}</h1>
    <p className="mt-3 max-w-3xl text-gray-600">{sk?"Odporúčania zohľadňujú jazyk, približnú úroveň, preferované dni a čas, kapacitu lektora a to, či prijíma nových študentov. Finálne rozhodnutie zostáva na administrátorovi.":"Recommendations consider language, approximate level, preferred days and time, teacher capacity and whether the teacher accepts new students. The final decision remains with the administrator."}</p>

    {unavailable?<p role="alert" className="mt-6 rounded-2xl bg-red-50 p-4 text-red-700">{sk?"Matching údaje sa nepodarilo načítať. Overte databázové migrácie.":"Matching data could not be loaded. Check the database migrations."}</p>:<>
      <section className="mt-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-gray-400">{sk?"Vyžaduje pozornosť":"Needs attention"}</p>
            <h2 className="mt-1 text-xl font-semibold">{sk?"Študenti bez ďalšej naplánovanej hodiny":"Students without a next scheduled lesson"}</h2>
          </div>
          <span className="rounded-full bg-[#EEF2FF] px-3 py-1.5 text-sm font-semibold text-[#2F3AA2]">{waiting.length}</span>
        </div>

        {!recommendations.length?
          <div className="mt-4 rounded-3xl border border-[#E5E7F0] bg-white p-6 text-gray-600 shadow-sm">{sk?"Momentálne tu nie je nový platený študent pripravený na priradenie.":"There is currently no new paid student ready for matching."}</div>
        :
          <div className="mt-4 space-y-5">{recommendations.map(({student,request,ranked})=>
            <article key={student.id} className="rounded-3xl border border-[#E5E7F0] bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{personName(student)}</h3>
                  <p className="mt-1 text-sm text-gray-500">{request.language} · {request.level}</p>
                  <p className="mt-2 max-w-2xl text-sm text-gray-600">{request.goal}</p>
                  {(request.preferred_days?.length||request.preferred_time_from)&&
                    <p className="mt-2 text-sm text-gray-500">
                      {sk?"Preferencie: ":"Preferences: "}{(request.preferred_days??[]).map((d:string)=>days[Number(d)]).join(", ")||(sk?"ľubovoľný deň":"any day")}
                      {request.preferred_time_from&&request.preferred_time_to?" · "+String(request.preferred_time_from).slice(0,5)+"–"+String(request.preferred_time_to).slice(0,5):""}
                    </p>
                  }
                </div>
                <span className="rounded-full bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">{sk?"Priradiť lektora":"Assign teacher"}</span>
              </div>

              <div className="mt-5 grid gap-3 lg:grid-cols-3">
                {ranked.length?ranked.map(({teacher,pref,score,reasons,freeCapacity},index)=>
                  <div key={teacher.id} className={index===0?"rounded-2xl border border-[#2F3AA2] bg-[#EEF2FF] p-4":"rounded-2xl border border-gray-200 p-4"}>
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold">{personName(teacher)}</p>
                      <span className="text-xs font-bold text-[#2F3AA2]">{score} {sk?"bodov":"points"}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{pref.languages.map((value:string)=>formatLanguage(value,language)).join(", ")} · {pref.levels.join(", ")}</p>
                    <p className="mt-2 text-xs text-gray-500">{sk?"Zhoda":"Match"}: {reasons.join(", ")} · {sk?"voľná kapacita":"free capacity"} {freeCapacity}</p>
                  </div>
                ):<p className="text-sm text-gray-500">{sk?"Momentálne nie je dostupný lektor s povinnou jazykovou zhodou a voľnou kapacitou.":"No teacher currently has the required language match and free capacity."}</p>}
              </div>
            </article>
          )}</div>
        }
      </section>

      <section className="mt-10 rounded-3xl border border-[#2F3AA2]/10 bg-[#F8F8FF] p-6">
        <h2 className="text-xl font-semibold">{sk?"Potvrdiť priradenie vytvorením prvej hodiny":"Confirm matching by creating the first lesson"}</h2>
        <p className="mt-2 text-sm text-gray-600">{sk?"Vyberte študenta a odporúčaného lektora. Prvá hodina vytvorí reálny vzťah v portáli.":"Choose the student and recommended teacher. The first lesson creates the actual relationship in the portal."}</p>
        <AdminCreateLessonForm students={students} teachers={availableTeachers} packages={packages.data??[]}/>
      </section>
    </>}

    <Link href="/admin/dashboard" className="mt-6 inline-block font-semibold text-[#2F3AA2] underline">{sk?"Späť na prehľad":"Back to overview"}</Link>
  </main>;
}
