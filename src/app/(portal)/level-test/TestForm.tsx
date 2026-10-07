"use client";
import { useActionState, useEffect, useRef, useState } from "react";
import { createAssessmentAudioPlayer } from "@/lib/assessment-audio";
import { submitPlacement } from "./actions";
import { useLanguage } from "@/context/LanguageContext";
type Question = { id: string; prompt: string; options: readonly string[]; audio?: string };
type FormState = { error?: string; success?: string };
export default function TestForm({ questions, submit = submitPlacement, resultPath = "/level-test", languageCode = "en", voiceLanguage = "en-GB" }: { questions: Question[]; submit?: (state: FormState, form: FormData) => Promise<FormState>; resultPath?: string; languageCode?: string; voiceLanguage?: string }) {
  const { language } = useLanguage();
  const sk = language === "sk";
  const errorRef = useRef<HTMLParagraphElement>(null);
  const [audioError, setAudioError] = useState("");
  const [played, setPlayed] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const player = useRef<ReturnType<typeof createAssessmentAudioPlayer> | null>(null);
  useEffect(() => () => { player.current?.stop(); }, []);
  function listen(q: Question) {
    if (!("speechSynthesis" in window) || !q.audio) { setAudioError(sk ? "Prehliadač nepodporuje prehrávanie. Použite iný prehliadač alebo kontaktujte Mundus." : "Your browser does not support audio playback. Use another browser or contact Mundus."); return; }
    setAudioError("");
    player.current ??= createAssessmentAudioPlayer(window.speechSynthesis);
    player.current.play(q.audio, voiceLanguage,
      () => setPlayed(ids => ids.includes(q.id) ? ids : [...ids,q.id]),
      () => setAudioError(sk ? "Zvuk sa nepodarilo prehrať. Skúste znova alebo kontaktujte Mundus." : "Audio could not be played. Try again or contact Mundus."));
  }
  const audioQuestions = questions.filter(q => q.audio);
  const listeningComplete = audioQuestions.every(q => played.includes(q.id));
  async function save(previous: FormState, form: FormData): Promise<FormState> {
    try {
      const result = await submit(previous, form);
      if (result.success) player.current?.stop();
      return result;
    } catch {
      return { error: sk ? "Výsledok sa nepodarilo uložiť. Vaše odpovede zostali vybrané. Skontrolujte pripojenie a skúste znova." : "The result could not be saved. Your answers remain selected. Check your connection and try again." };
    }
  }
  const [state, action, pending] = useActionState(save, {});
  useEffect(() => { if (state.error) errorRef.current?.focus(); }, [state.error]);
  if (state.success) return <div role="status" className="rounded-2xl bg-indigo-50 p-6 leading-relaxed text-[#2F3AA2]"><p>{state.success}</p><a href={resultPath} className="mt-4 inline-block font-semibold underline">{sk ? "Zobraziť uložené výsledky" : "View saved results"}</a></div>;
  return <form action={action} className="space-y-5" aria-busy={pending}><input type="hidden" name="ui_language" value={language}/><input type="hidden" name="assessment_language" value={languageCode} />
    {questions.map((q,index) => <fieldset key={q.id} disabled={pending} className="rounded-2xl border border-gray-200 bg-white p-5"><legend lang={languageCode} className="px-2 font-semibold">{index+1}. {q.prompt}</legend>{q.audio && <button type="button" aria-label={`${sk ? "Prehrať zvuk k otázke" : "Play audio for question"} ${index+1}`} onClick={() => listen(q)} className="mb-4 rounded-xl bg-indigo-50 px-4 py-3 font-semibold text-[#2F3AA2]">{played.includes(q.id) ? (sk ? "Prehrať znova" : "Play again") : (sk ? "Prehrať nahrávku" : "Play audio")}</button>}<div className="grid gap-3">{q.options.map((option,value) => <label key={value} lang={languageCode} className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-100 p-3 hover:bg-indigo-50"><input required type="radio" name={q.id} value={value} checked={answers[q.id] === String(value)} onChange={() => setAnswers(current => ({ ...current, [q.id]: String(value) }))} className="accent-[#2F3AA2]" />{option}</label>)}</div></fieldset>)}
    {audioError && <p role="alert" className="text-red-700">{audioError}</p>}
    {!listeningComplete && <p className="text-sm text-gray-600">{sk ? `Pred vyhodnotením si vypočujte všetky zvukové ukážky až do konca (\${audioQuestions.length}).` : `Before submitting, listen to all audio samples until the end (\${audioQuestions.length}).`}</p>}
    {state.error && <p ref={errorRef} tabIndex={-1} role="alert" className="text-red-700">{state.error}</p>}
    <button disabled={pending || !listeningComplete} className="rounded-xl bg-[#2F3AA2] px-6 py-4 font-semibold text-white disabled:opacity-50">{pending ? (sk ? "Ukladám výsledok…" : "Saving result…") : (sk ? "Vyhodnotiť a uložiť" : "Evaluate and save")}</button>
  </form>;
}
