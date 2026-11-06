"use client";
import { useActionState } from "react";
import { unsubscribeNewsletter } from "./actions";
import { useLanguage } from "@/context/LanguageContext";

export default function UnsubscribeForm({token}:{token:string}){
 const {language}=useLanguage();const sk=language==="sk";const [state,action,pending]=useActionState(unsubscribeNewsletter,{});
 return <form action={action} className="space-y-4"><input type="hidden" name="token" value={token}/><input type="hidden" name="ui_language" value={language}/><p className="text-sm leading-6 text-gray-600">{sk?"Po zrušení vám už nebudeme posielať marketingové novinky ani sezónne ponuky.":"After unsubscribing, we will no longer send marketing updates or seasonal offers."}</p><button disabled={pending||Boolean(state.success)} className="w-full rounded-xl border border-red-200 bg-red-50 px-5 py-3 font-semibold text-red-700 disabled:opacity-50">{pending?(sk?"Ruším…":"Unsubscribing…"):(sk?"Zrušiť odber":"Unsubscribe")}</button>{state.error&&<p role="alert" className="text-sm text-red-700">{state.error}</p>}{state.success&&<p role="status" className="text-sm font-medium text-green-800">{state.success}</p>}</form>;
}
