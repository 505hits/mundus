"use client";
import {useActionState} from "react";
import {saveTeacherProfile,type TeacherProfileState} from "./actions";
import {MUNDUS_LANGUAGE_OPTIONS} from "@/lib/language-offer";
import {useLanguage} from "@/context/LanguageContext";
import {formatLanguage} from "@/lib/portalLabels";

type Record={headline:string;bio:string;languages:string[];photoUrl:string|null;website_visible:boolean};
export default function TeacherProfileForm({record}:{record:Record}){
 const {language}=useLanguage();
 const sk=language==="sk";
 const [state,action,pending]=useActionState<TeacherProfileState,FormData>(saveTeacherProfile,{});
 return <form action={action} className="mt-6 space-y-6 rounded-3xl border border-black/5 bg-white p-6 shadow-sm" aria-busy={pending}><input type="hidden" name="ui_language" value={language}/>
  {record.photoUrl&&<>
    {/* Profile photos come from the teacher-public Supabase bucket. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={record.photoUrl} alt={sk?"Aktuálna profilová fotka":"Current profile photo"} className="h-28 w-28 rounded-3xl object-cover"/>
  </>}
  <label className="block text-sm font-medium">{sk?"Profilová fotka":"Profile photo"}<input name="photo" type="file" accept="image/jpeg,image/png,image/webp" className="mt-2 block w-full rounded-xl border border-black/10 p-3 text-sm"/></label>
  <label className="block text-sm font-medium">{sk?"Krátky titulok":"Short headline"}<input name="headline" maxLength={120} defaultValue={record.headline} placeholder={sk?"Napr. Angličtina a nemčina · konverzácia a pracovný jazyk":"e.g. English and German · conversation and business language"} className="mt-2 w-full rounded-xl border border-black/10 p-3"/></label>
  <label className="block text-sm font-medium">{sk?"O vás":"About you"}<textarea name="bio" maxLength={1000} rows={5} defaultValue={record.bio} placeholder={sk?"Krátko sa predstavte budúcim študentom.":"Briefly introduce yourself to future students."} className="mt-2 w-full rounded-xl border border-black/10 p-3"/></label>
  <fieldset><legend className="mb-3 text-sm font-semibold">{sk?"Jazyky, ktoré učíte":"Languages you teach"}</legend><div className="flex flex-wrap gap-2">{MUNDUS_LANGUAGE_OPTIONS.map(({value})=><label key={value} className="rounded-xl border border-black/10 px-3 py-2 text-sm"><input type="checkbox" name="languages" value={value} defaultChecked={record.languages.includes(value)} className="mr-2 accent-[#2F3AA2]"/>{formatLanguage(value,language)}</label>)}</div></fieldset>
  <label className="flex items-start gap-3 rounded-2xl bg-[#EEF2FF] p-4 text-sm"><input type="checkbox" name="website_visible" value="true" defaultChecked={record.website_visible} className="mt-1 accent-[#2F3AA2]"/><span><strong>{sk?"Zobraziť ma na hlavnom webe":"Show me on the main website"}</strong><br/>{sk?"Profil sa zobrazí v sekcii lektorov po uložení.":"Your profile will appear in the teachers section after saving."}</span></label>
  {state.error&&<p role="alert" className="text-sm text-red-700">{state.error}</p>}
  {state.success&&<p role="status" className="text-sm font-medium text-[#2F3AA2]">{state.success}</p>}
  <button disabled={pending} className="rounded-xl bg-[#2F3AA2] px-5 py-3 font-semibold text-white disabled:opacity-50">{pending?(sk?"Ukladám…":"Saving…"):(sk?"Uložiť profil":"Save profile")}</button>
 </form>;
}
