import { assessmentStorageReady } from "@/lib/assessment-storage";
import AssessmentUnavailable from "@/components/AssessmentUnavailable";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { assessmentBank } from "@/lib/assessment-catalog";
import AssessmentLanguagePicker from "@/components/AssessmentLanguagePicker";
import PlacementResults from "@/components/PlacementResults";
import TestForm from "../level-test/TestForm";
import { submitProgress } from "./actions";
export default async function ProgressTestPage({searchParams}:{searchParams:Promise<{language?:string}>}) {
  const { user } = await requireRole("student");
  const code=(await searchParams).language === "de" ? "de" : "en";
  const bank=assessmentBank(code,"progress");
  const storageReady = await assessmentStorageReady(user.id,code);
  const supabase = await createSupabaseServerClient();
  const query = () => supabase.from("placement_results").select("id,score,created_at,skill_scores").eq("student_id",user.id).eq("assessment_kind","progress").eq("language",bank.language).eq("test_version",bank.version);
  const [first,last] = await Promise.all([query().order("created_at",{ascending:true}).limit(1).maybeSingle(),query().order("created_at",{ascending:false}).limit(1).maybeSingle()]);
  const delta = first.data && last.data ? last.data.score - first.data.score : null;
  return <main className="mx-auto max-w-3xl px-5 py-10"><h1 className="text-3xl font-semibold">Kontrolný test: {bank.language}</h1><AssessmentLanguagePicker route="/progress-test" code={code} /><p className="my-5 leading-relaxed text-gray-600">Samostatný test s inými otázkami než vstupný test: 24 otázok A1–C2, gramatika, čítanie a počúvanie. Zopakujte ho po niekoľkých mesiacoch alebo po dokončení balíčka. Každý výsledok sa uloží osobitne a vstupný výsledok zostane zachovaný. Nepoužívajte prekladač ani pomoc.</p>
    <div className="mb-6 rounded-2xl bg-indigo-50 p-5 text-[#2F3AA2]">{first.error || last.error ? "Porovnanie sa teraz nepodarilo načítať." : delta === null ? "Prvý kontrolný test vytvorí základ pre porovnanie ďalších kontrolných testov." : first.data?.id === last.data?.id ? "Máte prvý kontrolný výsledok. Po ďalšom teste tu uvidíte zmenu skóre." : <>Zmena oproti prvému kontrolnému testu rovnakej verzie: <strong>{delta > 0 ? "+" : ""}{delta} bodov z 24</strong>. Prvý výsledok {first.data?.score}/24, posledný {last.data?.score}/24.</>}<p className="mt-3 text-sm">Skóre je orientačné. Opakovanie rovnakých otázok môže ovplyvniť výsledok; zmenu úrovne a rozprávanie overí lektor. Skóre rozdielnych testov neporovnávame ako presné meranie.</p></div>
    <PlacementResults studentId={user.id} kind="progress" />
    {storageReady ? <TestForm questions={bank.questions.map(q => ({id:q.id,prompt:q.prompt,options:q.options,audio:q.audio}))} submit={submitProgress} languageCode={code} voiceLanguage={bank.voice} resultPath={`/progress-test?language=${code}`} /> : <AssessmentUnavailable />}
  </main>;
}
