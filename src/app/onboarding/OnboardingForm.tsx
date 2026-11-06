"use client";

import { useActionState, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { STUDENT_LANGUAGES, STUDENT_LEVELS } from "@/lib/account-policy";
import { saveOnboarding } from "./actions";
import { useLanguage } from "@/context/LanguageContext";

export default function OnboardingForm({ next }: { next: string | null }) {
  const { language } = useLanguage();
  const sk = language === "sk";
  const [state, action, pending] = useActionState(saveOnboarding, {});
  const [step, setStep] = useState(1);
  const formRef = useRef<HTMLFormElement>(null);

  const goNext = () => {
    const currentSection = formRef.current?.querySelector<HTMLElement>(`[data-step="${step}"]`);
    const requiredFields = currentSection?.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("[required]");
    for (const field of requiredFields ?? []) {
      if (!field.checkValidity()) {
        field.reportValidity();
        return;
      }
    }
    setStep(current => Math.min(4, current + 1));
  };

  const dayLabels = sk
    ? [["1","Po"],["2","Ut"],["3","St"],["4","Št"],["5","Pi"],["6","So"],["7","Ne"]]
    : [["1","Mon"],["2","Tue"],["3","Wed"],["4","Thu"],["5","Fri"],["6","Sat"],["7","Sun"]];

  const languageLabels: Record<string,string> = {
    "Angličtina":"English","Nemčina":"German","Španielčina":"Spanish","Taliančina":"Italian","Francúzština":"French",
    "Portugalčina":"Portuguese","Maďarčina":"Hungarian","Poľština":"Polish","Ruština":"Russian","Čínština":"Chinese",
    "Slovenčina":"Slovak","Ukrajinčina":"Ukrainian","Moderná hebrejčina":"Modern Hebrew",
  };

  const levelLabels: Record<string,string> = {
    "Neviem posúdiť":"Not sure",
    "Úplný začiatočník":"Complete beginner",
  };

  const steps = sk
    ? ["Jazyk a úroveň", "Frekvencia", "Dni a čas", "Váš cieľ"]
    : ["Language & level", "Frequency", "Days & time", "Your goal"];

  const input = "mt-2 w-full rounded-xl border border-gray-200 bg-white p-3 outline-none transition focus:border-[#2F3AA2] focus:ring-2 focus:ring-[#EEF2FF]";

  return (
    <form ref={formRef} action={action} className="space-y-6">
      <input type="hidden" name="ui_language" value={language}/>
      {next && <input type="hidden" name="next" value={next} />}

      <div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-[#2F3AA2]">{sk ? `Krok ${step} zo 4` : `Step ${step} of 4`}</p>
          <p className="text-xs text-gray-400">{steps[step - 1]}</p>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2" aria-hidden="true">
          {[1,2,3,4].map(item => (
            <span key={item} className={`h-1.5 rounded-full transition ${item <= step ? "bg-[#2F3AA2]" : "bg-[#E5E7F0]"}`} />
          ))}
        </div>
      </div>

      <section data-step="1" className={step === 1 ? "space-y-5" : "hidden"} aria-hidden={step !== 1}>
        <div>
          <h2 className="text-xl font-semibold">{sk ? "Čo sa chcete učiť?" : "What would you like to learn?"}</h2>
          <p className="mt-1 text-sm text-gray-500">{sk ? "Stačí približná úroveň. Lektor ju môže neskôr upresniť." : "An approximate level is enough. Your teacher can refine it later."}</p>
        </div>
        <label className="block text-sm">
          {sk ? "Jazyk" : "Language"}
          <select name="language" defaultValue="" required className={input}>
            <option value="" disabled>{sk ? "Vyberte jazyk" : "Choose a language"}</option>
            {STUDENT_LANGUAGES.map(value => <option key={value} value={value}>{sk ? value : (languageLabels[value] ?? value)}</option>)}
          </select>
        </label>
        <label className="block text-sm">
          {sk ? "Približná úroveň" : "Approximate level"}
          <select name="level" defaultValue="Neviem posúdiť" required className={input}>
            {STUDENT_LEVELS.map(level => <option key={level} value={level}>{sk ? level : (levelLabels[level] ?? level)}</option>)}
          </select>
        </label>
      </section>

      <section data-step="2" className={step === 2 ? "space-y-5" : "hidden"} aria-hidden={step !== 2}>
        <div>
          <h2 className="text-xl font-semibold">{sk ? "Ako často chcete hodiny?" : "How often would you like lessons?"}</h2>
          <p className="mt-1 text-sm text-gray-500">{sk ? "Frekvenciu môžete neskôr prispôsobiť podľa svojho rozvrhu." : "You can adjust the frequency later around your schedule."}</p>
        </div>
        <label className="block text-sm">
          {sk ? "Počet hodín za týždeň" : "Lessons per week"}
          <select name="lessons_per_week" defaultValue="1" required className={input}>
            {[1,2,3,4,5].map(value => <option key={value} value={value}>{value}× {sk ? "týždenne" : "per week"}</option>)}
          </select>
        </label>
      </section>

      <section data-step="3" className={step === 3 ? "space-y-5" : "hidden"} aria-hidden={step !== 3}>
        <div>
          <h2 className="text-xl font-semibold">{sk ? "Kedy vám hodiny najviac vyhovujú?" : "When do lessons suit you best?"}</h2>
          <p className="mt-1 text-sm text-gray-500">{sk ? "Vyberte viac možností, aby sme ľahšie našli vhodného lektora." : "Choose several options to help us find a suitable teacher."}</p>
        </div>
        <fieldset>
          <legend className="mb-2 text-sm">{sk ? "Preferované dni " : "Preferred days "}<span className="text-gray-400">{sk ? "(voliteľné)" : "(optional)"}</span></legend>
          <div className="flex flex-wrap gap-2">
            {dayLabels.map(([value,label]) => (
              <label key={value} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm">
                <input type="checkbox" name="preferred_days" value={value} className="mr-2 accent-[#2F3AA2]"/>
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            {sk ? "Čas od " : "Time from "}<span className="text-gray-400">{sk ? "(voliteľné)" : "(optional)"}</span>
            <input name="preferred_time_from" type="time" className={input}/>
          </label>
          <label className="block text-sm">
            {sk ? "Čas do " : "Time to "}<span className="text-gray-400">{sk ? "(voliteľné)" : "(optional)"}</span>
            <input name="preferred_time_to" type="time" className={input}/>
          </label>
        </div>
      </section>

      <section data-step="4" className={step === 4 ? "space-y-5" : "hidden"} aria-hidden={step !== 4}>
        <div>
          <h2 className="text-xl font-semibold">{sk ? "Čo chcete dosiahnuť?" : "What would you like to achieve?"}</h2>
          <p className="mt-1 text-sm text-gray-500">{sk ? "Napíšte hlavný cieľ, aby sme podľa neho nastavili výučbu." : "Tell us your main goal so we can shape the lessons around it."}</p>
        </div>
        <label className="block text-sm">
          {sk ? "Váš hlavný cieľ" : "Your main goal"}
          <textarea
            name="goal"
            required
            minLength={3}
            maxLength={1000}
            rows={4}
            placeholder={sk ? "Napríklad: chcem sa istejšie dohovoriť na dovolenke." : "For example: I want to speak more confidently while travelling."}
            className={input}
          />
        </label>

        <div className="rounded-2xl bg-[#F5F6FF] p-4 text-sm text-gray-600">
          <p className="flex items-start gap-2">
            <Check size={17} className="mt-0.5 shrink-0 text-[#2F3AA2]" />
            {sk ? "Tieto preferencie nemenia cenu ani váš zaplatený balíček." : "These preferences do not change your price or paid package."}
          </p>
        </div>
      </section>

      {state.error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{state.error}</p>}

      <div className="flex gap-3">
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep(current => Math.max(1, current - 1))}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white p-3.5 font-semibold text-[#171A2B]"
          >
            <ArrowLeft size={17} />
            {sk ? "Späť" : "Back"}
          </button>
        )}

        {step < 4 ? (
          <button
            type="button"
            onClick={goNext}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#2F3AA2] p-3.5 font-semibold text-white"
          >
            {sk ? "Pokračovať" : "Continue"}
            <ArrowRight size={17} />
          </button>
        ) : (
          <button disabled={pending} className="flex-1 rounded-xl bg-[#2F3AA2] p-3.5 font-semibold text-white disabled:opacity-50">
            {pending ? (sk ? "Ukladám…" : "Saving…") : (sk ? "Dokončiť nastavenie" : "Finish setup")}
          </button>
        )}
      </div>
    </form>
  );
}
