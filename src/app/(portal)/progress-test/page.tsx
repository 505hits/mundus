import { assessmentStorageReady } from "@/lib/assessment-storage";
import AssessmentUnavailable from "@/components/AssessmentUnavailable";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { assessmentBank } from "@/lib/assessment-catalog";
import AssessmentLanguagePicker from "@/components/AssessmentLanguagePicker";
import PlacementResults from "@/components/PlacementResults";
import TestForm from "../level-test/TestForm";
import { submitProgress } from "./actions";
import { currentLanguage } from "@/lib/i18n";
export default async function ProgressTestPage({searchParams}:{searchParams:Promise<{language?:string}>}) {
  const uiLanguage = await currentLanguage();
  const sk = uiLanguage === "sk";
  const { user } = await requireRole("student");
  const language=(await searchParams).language;
  const code=language === "de" || language === "es" || language === "it" || language === "fr" || language === "pt" ? language : "en";
  const bank=assessmentBank(code,"progress");
  const storageReady = await assessmentStorageReady(user.id,code);
  const supabase = await createSupabaseServerClient();
  const query = () => supabase.from("placement_results").select("id,score,created_at,skill_scores").eq("student_id",user.id).eq("assessment_kind","progress").eq("language",bank.language).eq("test_version",bank.version);
  const [first,last] = await Promise.all([query().order("created_at",{ascending:true}).limit(1).maybeSingle(),query().order("created_at",{ascending:false}).limit(1).maybeSingle()]);
  const delta = first.data && last.data ? last.data.score - first.data.score : null;
  return <main className="mx-auto max-w-3xl px-5 py-10"><h1 className="text-3xl font-semibold">{sk ? "Kontrolný test" : "Progress test"}: {bank.language}</h1><AssessmentLanguagePicker route="/progress-test" code={code} /><p className="my-5 leading-relaxed text-gray-600">{sk ? "Samostatný test s inými otázkami než vstupný test: 24 otázok A1–C2, gramatika, čítanie a počúvanie. Zopakujte ho po niekoľkých mesiacoch alebo po dokončení balíčka. Každý výsledok sa uloží osobitne a vstupný výsledok zostane zachovaný. Nepoužívajte prekladač ani pomoc." : "A separate test with different questions from the placement test: 24 A1–C2 questions covering grammar, reading and listening. Repeat it after a few months or after completing a package. Each result is saved separately and your placement result remains preserved. Do not use a translator or outside help."}</p>
    <div className="mb-6 rounded-2xl bg-indigo-50 p-5 text-[#2F3AA2]">{first.error || last.error ? (sk ? "Porovnanie sa teraz nepodarilo načítať." : "Comparison could not be loaded right now.") : delta === null ? (sk ? "Prvý kontrolný test vytvorí základ pre porovnanie ďalších kontrolných testov." : "Your first progress test creates a baseline for future comparisons.") : first.data?.id === last.data?.id ? (sk ? "Máte prvý kontrolný výsledok. Po ďalšom teste tu uvidíte zmenu skóre." : "You have your first progress-test result. After another test, you will see the score change here.") : <>{sk ? "Zmena oproti prvému kontrolnému testu rovnakej verzie:" : "Change compared with the first progress test of the same version:"} <strong>{delta > 0 ? "+" : ""}{delta} {sk ? "bodov z 24" : "points out of 24"}</strong>. {sk ? "Prvý výsledok" : "First result"} {first.data?.score}/24, {sk ? "posledný" : "latest"} {last.data?.score}/24.</>}<p className="mt-3 text-sm">{sk ? "Skóre je orientačné. Opakovanie rovnakých otázok môže ovplyvniť výsledok; zmenu úrovne a rozprávanie overí lektor. Skóre rozdielnych testov neporovnávame ako presné meranie." : "Scores are indicative. Repeating the same questions can affect the result; level changes and speaking are confirmed by your teacher. Scores from different tests are not treated as an exact measurement."}</p></div>
    <PlacementResults language={bank.language} studentId={user.id} kind="progress" />
    {storageReady ? <TestForm key={`${code}:${bank.version}`} questions={bank.questions.map(q => ({id:q.id,prompt:q.prompt,options:q.options,audio:q.audio}))} submit={submitProgress} languageCode={code} voiceLanguage={bank.voice} resultPath={`/progress-test?language=${code}`} /> : <AssessmentUnavailable />}
  </main>;
}
