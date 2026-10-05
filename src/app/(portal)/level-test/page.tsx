import { assessmentStorageReady } from "@/lib/assessment-storage";
import AssessmentUnavailable from "@/components/AssessmentUnavailable";
import { requireRole } from "@/lib/auth";
import { assessmentBank } from "@/lib/assessment-catalog";
import AssessmentLanguagePicker from "@/components/AssessmentLanguagePicker";
import PlacementResults from "@/components/PlacementResults";
import TestForm from "./TestForm";
import { currentLanguage } from "@/lib/i18n";
export default async function PlacementPage({searchParams}:{searchParams:Promise<{language?:string}>}) {
  const uiLanguage = await currentLanguage();
  const sk = uiLanguage === "sk";
  const { user } = await requireRole("student");
  const language=(await searchParams).language;
  const code=language === "de" || language === "es" || language === "it" || language === "fr" || language === "pt" ? language : "en";
  const bank=assessmentBank(code,"placement");
  const storageReady = await assessmentStorageReady(user.id,code);
  return <main className="mx-auto max-w-3xl px-5 py-10"><h1 className="text-3xl font-semibold">{sk ? "Vstupný test" : "Placement test"}: {bank.language}</h1><AssessmentLanguagePicker route="/level-test" code={code} /><p className="my-5 leading-relaxed text-gray-600">{sk ? "24 otázok, približne 15–20 minút. Odpovedajte bez prekladača alebo pomoci. Ide o orientačný test gramatiky, čítania a počúvania od A1 po C2, nie certifikát. Rozprávanie a konečnú úroveň preverí lektor. Pri počúvaní použite slúchadlá; zvuk prehráva hlas zvoleného jazyka vášho prehliadača. Testy ostatných jazykov pripravujeme; dovtedy vám úroveň pomôže určiť lektor." : "24 questions, approximately 15–20 minutes. Answer without a translator or outside help. This is an indicative grammar, reading and listening test from A1 to C2, not a certificate. Speaking and your final level are confirmed by your teacher. Use headphones for listening; audio uses the selected language voice available in your browser. Tests for other languages are being prepared; until then, your teacher can help confirm your level."}</p><PlacementResults language={bank.language} studentId={user.id} />{storageReady ? <TestForm key={`${code}:${bank.version}`} languageCode={code} voiceLanguage={bank.voice} resultPath={`/level-test?language=${code}`} questions={bank.questions.map(q => ({id:q.id,prompt:q.prompt,options:q.options, audio: "audio" in q ? q.audio : undefined}))} /> : <AssessmentUnavailable />}</main>;
}
