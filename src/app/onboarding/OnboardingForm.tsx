"use client";
import { useActionState } from "react";
import { STUDENT_LANGUAGES, STUDENT_LEVELS } from "@/lib/account-policy";
import { saveOnboarding } from "./actions";

export default function OnboardingForm({ next }: { next: string | null }) {
  const [state, action, pending] = useActionState(saveOnboarding, {});
  const input = "mt-2 w-full rounded-xl border border-gray-200 bg-white p-3";
  return <form action={action} className="space-y-5">
    {next && <input type="hidden" name="next" value={next} />}
    <label className="block text-sm">Aký jazyk sa chcete učiť?<select name="language" defaultValue="" required className={input}><option value="" disabled>Vyberte jazyk</option>{STUDENT_LANGUAGES.map(language => <option key={language}>{language}</option>)}</select></label>
    <label className="block text-sm">Aká je vaša približná úroveň?<select name="level" defaultValue="Neviem posúdiť" required className={input}>{STUDENT_LEVELS.map(level => <option key={level}>{level}</option>)}</select></label>
    <label className="block text-sm">Čo by ste chceli zlepšiť?<textarea name="goal" required minLength={3} maxLength={1000} rows={3} placeholder="Napríklad: chcem sa istejšie dohovoriť na dovolenke." className={input} /></label>
    {state.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
    <button disabled={pending} className="w-full rounded-xl bg-[#163f3a] p-3.5 font-semibold text-white disabled:opacity-50">{pending ? "Ukladám…" : "Uložiť a pokračovať"}</button>
  </form>;
}
