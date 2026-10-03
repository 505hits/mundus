import { assessmentStorageReady } from "@/lib/assessment-storage";
import AssessmentUnavailable from "@/components/AssessmentUnavailable";
import { requireRole } from "@/lib/auth";
import { PLACEMENT_QUESTIONS } from "@/lib/placement";
import PlacementResults from "@/components/PlacementResults";
import TestForm from "./TestForm";
export default async function PlacementPage() {
  const { user } = await requireRole("student");
  const storageReady = await assessmentStorageReady(user.id);
  return <main className="mx-auto max-w-3xl px-5 py-10"><h1 className="text-3xl font-semibold">Vstupný test: angličtina</h1><p className="my-5 leading-relaxed text-gray-600">24 otázok, približne 15–20 minút. Odpovedajte bez prekladača alebo pomoci. Ide o orientačný test gramatiky, čítania a počúvania od A1 po C2, nie certifikát. Rozprávanie a konečnú úroveň preverí lektor. Pri počúvaní použite slúchadlá; zvuk prehráva anglický hlas vášho prehliadača. Testy ostatných jazykov pripravujeme; dovtedy vám úroveň pomôže určiť lektor.</p><PlacementResults studentId={user.id} />{storageReady ? <TestForm questions={PLACEMENT_QUESTIONS.map(q => ({id:q.id,prompt:q.prompt,options:q.options, audio: "audio" in q ? q.audio : undefined}))} /> : <AssessmentUnavailable />}</main>;
}
