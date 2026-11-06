"use client";
import { useActionState, useEffect } from "react";
import { subscribeNewsletter } from "@/app/newsletter/actions";
import { useLanguage } from "@/context/LanguageContext";

export default function NewsletterSignup({source,onSubscribed,compact=false}:{source:"popup"|"footer";onSubscribed?:()=>void;compact?:boolean}){
  const {language}=useLanguage();const sk=language==="sk";
  const [state,action,pending]=useActionState(subscribeNewsletter,{});
  useEffect(()=>{if(state.subscribed) onSubscribed?.()},[state.subscribed,onSubscribed]);
  return <form action={action} className={compact?"space-y-3":"space-y-4"}>
    <input type="hidden" name="ui_language" value={language}/>
    <input type="hidden" name="source" value={source}/>
    <div className={compact?"flex flex-col gap-2 sm:flex-row":"grid gap-3 sm:grid-cols-[1fr_auto]"}>
      <label className="sr-only" htmlFor={`newsletter-email-${source}`}>E-mail</label>
      <input id={`newsletter-email-${source}`} name="email" type="email" autoComplete="email" required maxLength={254} placeholder={sk?"Váš e-mail":"Your email"} className="min-w-0 rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#2F3AA2] focus:ring-4 focus:ring-[#2F3AA2]/10"/>
      <button disabled={pending} className="rounded-xl bg-[#2F3AA2] px-5 py-3 font-semibold text-white disabled:opacity-50">{pending?(sk?"Odosielam…":"Sending…"):(sk?"Chcem novinky":"Join the list")}</button>
    </div>
    <label className="flex items-start gap-2 text-xs leading-5 text-gray-500">
      <input name="marketing_consent" type="checkbox" required className="mt-1"/>
      <span>{sk?"Súhlasím so zasielaním občasných noviniek, sezónnych ponúk a informácií od Mundus Languages. Súhlas môžem kedykoľvek odvolať cez odkaz v e-maile.":"I agree to receive occasional Mundus Languages updates, seasonal offers and news. I can withdraw consent at any time using the unsubscribe link in an email."}</span>
    </label>
    {state.error&&<p role="alert" className="text-sm text-red-700">{state.error}</p>}
    {state.success&&<p role="status" className="text-sm font-medium text-green-800">{state.success}</p>}
  </form>;
}
