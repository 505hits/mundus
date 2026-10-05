"use client";
import { useActionState, useEffect, useRef, useState } from "react";
import { createAssessmentAudioPlayer } from "@/lib/assessment-audio";
import { submitPlacement } from "./actions";
type Question = { id: string; prompt: string; options: readonly string[]; audio?: string };
type FormState = { error?: string; success?: string };
export default function TestForm({ questions, submit = submitPlacement, resultPath = "/level-test", languageCode = "en", voiceLanguage = "en-GB" }: { questions: Question[]; submit?: (state: FormState, form: FormData) => Promise<FormState>; resultPath?: string; languageCode?: string; voiceLanguage?: string }) {
  const errorRef = useRef<HTMLParagraphElement>(null);
  const [audioError, setAudioError] = useState("");
  const [played, setPlayed] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const player = useRef<ReturnType<typeof createAssessmentAudioPlayer> | null>(null);
  useEffect(() => () => { player.current?.stop(); }, []);
  function listen(q: Question) {
    if (!("speechSynthesis" in window) || !q.audio) { setAudioError("Prehliadač nepodporuje prehrávanie. Použite iný prehliadač alebo kontaktujte Mundus."); return; }
    setAudioError("");
    player.current ??= createAssessmentAudioPlayer(window.speechSynthesis);
    player.current.play(q.audio, voiceLanguage,
      () => setPlayed(ids => ids.includes(q.id) ? ids : [...ids,q.id]),
      () => setAudioError("Zvuk sa nepodarilo prehrať. Skúste znova alebo kontaktujte Mundus."));
  }
  const listeningComplete = questions.filter(q => q.audio).every(q => played.includes(q.id));
  async function save(previous: FormState, form: FormData): Promise<FormState> {
    try {
      const result = await submit(previous, form);
      if (result.success) player.current?.stop();
      return result;
    } catch {
      return { error: "Výsledok sa nepodarilo uložiť. Vaše odpovede zostali vybrané. Skontrolujte pripojenie a skúste znova." };
    }
  }
  const [state, action, pending] = useActionState(save, {});
  useEffect(() => { if (state.error) errorRef.current?.focus(); }, [state.error]);
  if (state.success) return <div role="status" className="rounded-2xl bg-indigo-50 p-6 leading-relaxed text-[#2F3AA2]"><p>{state.success}</p><a href={resultPath} className="mt-4 inline-block font-semibold underline">Zobraziť uložené výsledky</a></div>;
  return <form action={action} className="space-y-5" aria-busy={pending}><input type="hidden" name="assessment_language" value={languageCode} />
    {questions.map((q,index) => <fieldset key={q.id} disabled={pending} className="rounded-2xl border border-gray-200 bg-white p-5"><legend lang={languageCode} className="px-2 font-semibold">{index+1}. {q.prompt}</legend>{q.audio && <button type="button" aria-label={`Prehrať zvuk k otázke ${index+1}`} onClick={() => listen(q)} className="mb-4 rounded-xl bg-indigo-50 px-4 py-3 font-semibold text-[#2F3AA2]">{played.includes(q.id) ? "Prehrať znova" : "Prehrať nahrávku"}</button>}<div className="grid gap-3">{q.options.map((option,value) => <label key={value} lang={languageCode} className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-100 p-3 hover:bg-indigo-50"><input required type="radio" name={q.id} value={value} checked={answers[q.id] === String(value)} onChange={() => setAnswers(current => ({ ...current, [q.id]: String(value) }))} className="accent-[#2F3AA2]" />{option}</label>)}</div></fieldset>)}
    {audioError && <p role="alert" className="text-red-700">{audioError}</p>}
    {!listeningComplete && <p className="text-sm text-gray-600">Pred vyhodnotením si vypočujte všetkých šesť zvukových ukážok až do konca.</p>}
    {state.error && <p ref={errorRef} tabIndex={-1} role="alert" className="text-red-700">{state.error}</p>}
    <button disabled={pending || !listeningComplete} className="rounded-xl bg-[#2F3AA2] px-6 py-4 font-semibold text-white disabled:opacity-50">{pending ? "Ukladám výsledok…" : "Vyhodnotiť a uložiť"}</button>
  </form>;
}
