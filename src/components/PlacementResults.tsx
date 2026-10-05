import { createSupabaseServerClient } from "@/lib/supabase/server";
import { currentLanguage, localeFor } from "@/lib/i18n";

export default async function PlacementResults({ studentId, kind = "placement", language }: { studentId: string; kind?: "placement" | "progress"; language?: string }) {
  const uiLanguage = await currentLanguage();
  const sk = uiLanguage === "sk";
  const supabase = await createSupabaseServerClient();
  let query = supabase.from("placement_results").select("id,language,score,total_questions,skill_scores,recommendation,created_at").eq("student_id",studentId).eq("assessment_kind",kind).order("created_at",{ascending:false}).limit(5);
  if (language) query = query.eq("language", language);
  const { data, error } = await query;
  return <section className="my-6 rounded-2xl border border-indigo-100 bg-white p-5">
    <h2 className="text-xl font-semibold">{kind === "progress" ? (sk ? "Výsledky kontrolných testov" : "Progress test results") : (sk ? "Výsledky vstupných testov" : "Placement test results")}</h2>
    <p className="mt-2 text-sm text-gray-500">{sk ? "Orientačný výsledok gramatiky, čítania a počúvania. Konečnú úroveň určí lektor." : "An indicative result for grammar, reading and listening. Your teacher confirms the final level."}</p>
    {error ? <p className="mt-3 text-sm text-gray-600">{sk ? "Výsledky sa teraz nepodarilo načítať." : "Results could not be loaded right now."}</p> : !data?.length ? <p className="mt-3 text-sm text-gray-600">{sk ? "Zatiaľ žiadny uložený výsledok" : "No saved result yet"}{language ? ` ${sk ? "pre jazyk" : "for"} ${language}` : ""}.</p> : <ul className="mt-3 space-y-3">{data.map(item => <li key={item.id}>{item.language} · {item.score}/{item.total_questions} · {item.recommendation}<p className="text-sm text-gray-600">{sk ? "Gramatika" : "Grammar"} {item.skill_scores?.grammar ?? "—"}/12 · {sk ? "Čítanie" : "Reading"} {item.skill_scores?.reading ?? "—"}/6 · {sk ? "Počúvanie" : "Listening"} {item.skill_scores?.listening ?? "—"}/6</p><span className="ml-2 text-sm text-gray-500">{new Intl.DateTimeFormat(localeFor(uiLanguage),{dateStyle:"medium",timeZone:"Europe/Bratislava"}).format(new Date(item.created_at))}</span></li>)}</ul>}
  </section>;
}
