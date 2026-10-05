"use client";
import {useActionState,useState} from "react";
import {savePreferences} from "./actions";
import { MUNDUS_LANGUAGE_OPTIONS } from "@/lib/language-offer";
import { useLanguage } from "@/context/LanguageContext";
import { formatLanguage } from "@/lib/portalLabels";

export type Preferences={teacher_id:string;accepting_students:boolean;languages:string[];levels:string[];days:string[];time_from:string|null;time_to:string|null;max_new_students:number;note:string;updated_at:string};

export default function PreferencesForm({record}:{record:Preferences|null}) {
 const {language}=useLanguage();
 const sk=language==="sk";
 const [state,action,pending]=useActionState(async(previous:{error?:string;success?:string},form:FormData)=>{try{return await savePreferences(previous,form);}catch{return {error:sk?"Uloženie zlyhalo. Vaše údaje zostali vyplnené.":"Save failed. Your entered data remains in the form."};}},{});
 const [accepting,setAccepting]=useState(record?.accepting_students||false),[languages,setLanguages]=useState(record?.languages||[]),[levels,setLevels]=useState(record?.levels||[]),[days,setDays]=useState(record?.days||[]),[from,setFrom]=useState(record?.time_from?.slice(0,5)||""),[to,setTo]=useState(record?.time_to?.slice(0,5)||""),[capacity,setCapacity]=useState(String(record?.max_new_students||0)),[note,setNote]=useState(record?.note||"");
 const choices=(name:string,options:string[][],selected:string[],set:(values:string[])=>void)=><div className="flex flex-wrap gap-3">{options.map(([value,label])=><label key={value} className="rounded-xl border p-3 text-sm"><input type="checkbox" name={name} value={value} checked={selected.includes(value)} onChange={e=>set(e.target.checked?[...selected,value]:selected.filter(item=>item!==value))} className="mr-2 accent-[#2F3AA2]"/>{label}</label>)}</div>;
 const weekdays=sk?[["1","Pondelok"],["2","Utorok"],["3","Streda"],["4","Štvrtok"],["5","Piatok"],["6","Sobota"],["7","Nedeľa"]]:[["1","Monday"],["2","Tuesday"],["3","Wednesday"],["4","Thursday"],["5","Friday"],["6","Saturday"],["7","Sunday"]];
 return <form action={action} aria-busy={pending} className="mt-6">
   <input type="hidden" name="version" value={record?.updated_at||""}/>
   <fieldset disabled={pending||!!state.success} className="space-y-5">
     <label className="block font-semibold"><input type="checkbox" name="accepting" value="true" checked={accepting} onChange={e=>setAccepting(e.target.checked)} className="mr-2"/>{sk?"Prijímam nových študentov":"I accept new students"}</label>
     <div><p className="mb-2 font-semibold">{sk?"Jazyky":"Languages"}</p>{choices("languages",MUNDUS_LANGUAGE_OPTIONS.map(({value})=>[value,formatLanguage(value,language)]),languages,setLanguages)}</div>
     <div><p className="mb-2 font-semibold">{sk?"Úrovne":"Levels"}</p>{choices("levels",["A1","A2","B1","B2","C1","C2"].map(value=>[value,value]),levels,setLevels)}</div>
     <div><p className="mb-2 font-semibold">{sk?"Preferované dni (voliteľné)":"Preferred days (optional)"}</p>{choices("days",weekdays,days,setDays)}</div>
     <div className="grid gap-4 sm:grid-cols-3">
       <label>{sk?"Čas od":"Time from"}<input type="time" name="from" value={from} onChange={e=>setFrom(e.target.value)} className="mt-1 block w-full rounded-lg border p-3"/></label>
       <label>{sk?"Čas do":"Time to"}<input type="time" name="to" value={to} onChange={e=>setTo(e.target.value)} className="mt-1 block w-full rounded-lg border p-3"/></label>
       <label>{sk?"Kapacita nových študentov":"New-student capacity"}<input required type="number" min={0} max={20} name="capacity" value={capacity} onChange={e=>setCapacity(e.target.value)} className="mt-1 block w-full rounded-lg border p-3"/></label>
     </div>
     <label className="block">{sk?"Poznámka pre správcu":"Note for administrator"}<textarea name="note" maxLength={1000} value={note} onChange={e=>setNote(e.target.value)} rows={3} className="mt-1 block w-full rounded-lg border p-3"/></label>
     <button className="rounded-xl bg-[#2F3AA2] px-5 py-3 font-semibold text-white">{pending?(sk?"Ukladám…":"Saving…"):(sk?"Uložiť preferencie":"Save preferences")}</button>
   </fieldset>
   {state.error&&<p role="alert" className="mt-4 text-red-700">{state.error}</p>}
   {state.success&&<p role="status" className="mt-4 text-[#2F3AA2]">{state.success} {sk?"Obnovte stránku pred ďalšou úpravou.":"Refresh the page before making another edit."}</p>}
 </form>;
}
