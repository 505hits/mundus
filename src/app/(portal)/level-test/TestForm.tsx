"use client";
import { useActionState, useEffect, useState } from "react";
import { submitPlacement } from "./actions";
type Question = { id: string; prompt: string; options: readonly string[]; audio?: string };
export default function TestForm({ questions }: { questions: Question[] }) {
  const [audioError, setAudioError] = useState("");
  const [played, setPlayed] = useState<string[]>([]);
  useEffect(() => () => { if ("speechSynthesis" in window) window.speechSynthesis.cancel(); }, []);
  function listen(q: Question) {
    if (!("speechSynthesis" in window) || !q.audio) { setAudioError("Prehliadač nepodporuje prehrávanie. Použite iný prehliadač alebo kontaktujte Mundus."); return; }
    setAudioError("");
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(q.audio);
    utterance.lang = "en-GB";
    const voice = window.speechSynthesis.getVoices().find(v => v.lang === "en-GB") ?? window.speechSynthesis.getVoices().find(v => v.lang.startsWith("en"));
    if (voice) utterance.voice = voice;
    utterance.rate = 0.9;
    utterance.onend = () => setPlayed(ids => ids.includes(q.id) ? ids : [...ids,q.id]);
    utterance.onerror = event => { if (event.error !== "interrupted" && event.error !== "canceled") setAudioError("Zvuk sa nepodarilo prehrať. Skúste znova alebo kontaktujte Mundus."); };
    window.speechSynthesis.speak(utterance);
  }
  const listeningComplete = questions.filter(q => q.audio).every(q => played.includes(q.id));
  const [state, action, pending] = useActionState(submitPlacement, {});
  if (state.success) return <div role="status" className="rounded-2xl bg-indigo-50 p-6 leading-relaxed text-[#2F3AA2]"><p>{state.success}</p><a href="/level-test" className="mt-4 inline-block font-semibold underline">Zobraziť uložené výsledky</a></div>;
  return <form action={action} className="space-y-5" aria-busy={pending}>
    {questions.map((q,index) => <fieldset key={q.id} disabled={pending} className="rounded-2xl border border-gray-200 bg-white p-5"><legend className="px-2 font-semibold">{index+1}. {q.prompt}</legend>{q.audio && <button type="button" onClick={() => listen(q)} className="mb-4 rounded-xl bg-indigo-50 px-4 py-3 font-semibold text-[#2F3AA2]">{played.includes(q.id) ? "Prehrať znova" : "Prehrať nahrávku"}</button>}<div className="grid gap-3">{q.options.map((option,value) => <label key={value} className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-100 p-3 hover:bg-indigo-50"><input required type="radio" name={q.id} value={value} className="accent-[#2F3AA2]" />{option}</label>)}</div></fieldset>)}
    {audioError && <p role="alert" className="text-red-700">{audioError}</p>}
    {!listeningComplete && <p className="text-sm text-gray-600">Pred vyhodnotením si vypočujte všetkých šesť zvukových ukážok až do konca.</p>}
    {state.error && <p role="alert" className="text-red-700">{state.error}</p>}
    <button disabled={pending || !listeningComplete} className="rounded-xl bg-[#2F3AA2] px-6 py-4 font-semibold text-white disabled:opacity-50">{pending ? "Ukladám výsledok…" : "Vyhodnotiť a uložiť"}</button>
  </form>;
}
