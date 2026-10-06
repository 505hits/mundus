"use client";
import { useActionState } from "react";
import { STUDENT_LANGUAGES, STUDENT_LEVELS } from "@/lib/account-policy";
import { saveOnboarding } from "./actions";
import { useLanguage } from "@/context/LanguageContext";

export default function OnboardingForm({ next }: { next: string | null }) {
  const { language } = useLanguage();
  const sk = language === "sk";
  const [state, action, pending] = useActionState(saveOnboarding, {});
  const dayLabels = sk ? [["1","Po"],["2","Ut"],["3","St"],["4","Št"],["5","Pi"],["6","So"],["7","Ne"]] : [["1","Mon"],["2","Tue"],["3","Wed"],["4","Thu"],["5","Fri"],["6","Sat"],["7","Sun"]];
  const languageLabels: Record<string,string> = {
    "Angličtina":"English","Nemčina":"German","Španielčina":"Spanish","Taliančina":"Italian","Francúzština":"French",
    "Portugalčina":"Portuguese","Maďarčina":"Hungarian","Poľština":"Polish","Ruština":"Russian","Čínština":"Chinese",
    "Slovenčina":"Slovak","Ukrajinčina":"Ukrainian","Moderná hebrejčina":"Modern Hebrew",
  };
  const levelLabels: Record<string,string> = {
    "Neviem posúdiť":"Not sure","Úplný začiatočník":"Complete beginner",
  };
  const input = "mt-2 w-full rounded-xl border border-gray-200 bg-white p-3";
  return <form action={action} className="space-y-5"><input type="hidden" name="ui_language" value={language}/>
    {next && <input type="hidden" name="next" value={next} />}
    <label className="block text-sm">{sk ? "Aký jazyk sa chcete učiť?" : "Which language do you want to learn?"}<select name="language" defaultValue="" required className={input}><option value="" disabled>{sk ? "Vyberte jazyk" : "Choose a language"}</option>{STUDENT_LANGUAGES.map(value => <option key={value} value={value}>{sk ? value : (languageLabels[value] ?? value)}</option>)}</select></label>
    <label className="block text-sm">{sk ? "Aká je vaša približná úroveň?" : "What is your approximate level?"}<select name="level" defaultValue="Neviem posúdiť" required className={input}>{STUDENT_LEVELS.map(level => <option key={level} value={level}>{sk ? level : (levelLabels[level] ?? level)}</option>)}</select></label>
    <fieldset><legend className="mb-2 text-sm">{sk ? "Ktoré dni vám najviac vyhovujú? " : "Which days suit you best? "}<span className="text-gray-400">{sk ? "(voliteľné)" : "(optional)"}</span></legend><div className="flex flex-wrap gap-2">{dayLabels.map(([value,label])=><label key={value} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"><input type="checkbox" name="preferred_days" value={value} className="mr-2 accent-[#2F3AA2]"/>{label}</label>)}</div></fieldset>
    <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm">{sk ? "Preferovaný čas od " : "Preferred time from "}<span className="text-gray-400">{sk ? "(voliteľné)" : "(optional)"}</span><input name="preferred_time_from" type="time" className={input}/></label><label className="block text-sm">{sk ? "Preferovaný čas do " : "Preferred time to "}<span className="text-gray-400">{sk ? "(voliteľné)" : "(optional)"}</span><input name="preferred_time_to" type="time" className={input}/></label></div>
    <label className="block text-sm">{sk ? "Čo by ste chceli zlepšiť?" : "What would you like to improve?"}<textarea name="goal" required minLength={3} maxLength={1000} rows={3} placeholder={sk ? "Napríklad: chcem sa istejšie dohovoriť na dovolenke." : "For example: I want to speak more confidently while travelling."} className={input} /></label>
    {state.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
    <button disabled={pending} className="w-full rounded-xl bg-[#2F3AA2] p-3.5 font-semibold text-white disabled:opacity-50">{pending ? (sk ? "Ukladám…" : "Saving…") : (sk ? "Uložiť a pokračovať" : "Save and continue")}</button>
  </form>;
}
