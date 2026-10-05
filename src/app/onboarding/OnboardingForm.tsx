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
    <fieldset><legend className="mb-2 text-sm">Ktoré dni vám najviac vyhovujú? <span className="text-gray-400">(voliteľné)</span></legend><div className="flex flex-wrap gap-2">{[["1","Po"],["2","Ut"],["3","St"],["4","Št"],["5","Pi"],["6","So"],["7","Ne"]].map(([value,label])=><label key={value} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"><input type="checkbox" name="preferred_days" value={value} className="mr-2 accent-[#2F3AA2]"/>{label}</label>)}</div></fieldset>
    <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm">Preferovaný čas od <span className="text-gray-400">(voliteľné)</span><input name="preferred_time_from" type="time" className={input}/></label><label className="block text-sm">Preferovaný čas do <span className="text-gray-400">(voliteľné)</span><input name="preferred_time_to" type="time" className={input}/></label></div>
    <label className="block text-sm">Čo by ste chceli zlepšiť?<textarea name="goal" required minLength={3} maxLength={1000} rows={3} placeholder="Napríklad: chcem sa istejšie dohovoriť na dovolenke." className={input} /></label>
    {state.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
    <button disabled={pending} className="w-full rounded-xl bg-[#2F3AA2] p-3.5 font-semibold text-white disabled:opacity-50">{pending ? "Ukladám…" : "Uložiť a pokračovať"}</button>
  </form>;
}
