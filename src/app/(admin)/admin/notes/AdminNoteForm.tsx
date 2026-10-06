"use client";
import {useActionState} from "react";
import {addAdminNote,type AdminNoteState} from "./actions";
import {useLanguage} from "@/context/LanguageContext";
export default function AdminNoteForm({profiles}:{profiles:Array<{id:string;full_name:string|null;email:string|null;role:string|null}>}){
 const {language}=useLanguage(); const sk=language==="sk";
 const initialState:AdminNoteState={};
 const [state,action,pending]=useActionState(addAdminNote,initialState);
 return <form action={action} className="mt-6 rounded-3xl border border-black/5 bg-white p-5 shadow-sm sm:p-6"><input type="hidden" name="ui_language" value={language}/>
  <div className="grid gap-4 md:grid-cols-[1fr_2fr_auto] md:items-end">
   <label className="block"><span className="text-sm font-medium">{sk?"Študent alebo lektor":"Student or teacher"}</span><select name="subject_id" required className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-3 text-sm"><option value="">{sk?"Vyberte účet":"Choose account"}</option>{profiles.map(p=><option key={p.id} value={p.id}>{p.full_name?.trim()||p.email||(sk?"Účet":"Account")} · {p.role==="teacher"?(sk?"lektor":"teacher"):(sk?"študent":"student")}</option>)}</select></label>
   <label className="block"><span className="text-sm font-medium">{sk?"Súkromná poznámka":"Private note"}</span><textarea name="note" maxLength={3000} required rows={3} placeholder={sk?"Preferuje rána, potrebuje slovenské vysvetlenie, platobná výnimka...":"Prefers mornings, needs Slovak explanations, payment exception..."} className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-3 text-sm"/></label>
   <button disabled={pending} className="rounded-xl bg-[#2F3AA2] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{pending?(sk?"Ukladám...":"Saving..."):(sk?"Pridať":"Add")}</button>
  </div>
  {state.error&&<p className="mt-3 text-sm text-red-700">{state.error}</p>}{state.success&&<p className="mt-3 text-sm text-emerald-700">{state.success}</p>}
 </form>;
}
