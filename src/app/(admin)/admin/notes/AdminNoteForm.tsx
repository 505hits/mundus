"use client";
import {useActionState} from "react";
import {addAdminNote,type AdminNoteState} from "./actions";
export default function AdminNoteForm({profiles}:{profiles:Array<{id:string;full_name:string|null;email:string|null;role:string|null}>}){
 const initialState:AdminNoteState={};
 const [state,action,pending]=useActionState(addAdminNote,initialState);
 return <form action={action} className="mt-6 rounded-3xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
  <div className="grid gap-4 md:grid-cols-[1fr_2fr_auto] md:items-end">
   <label className="block"><span className="text-sm font-medium">Študent alebo lektor</span><select name="subject_id" required className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-3 text-sm"><option value="">Vyberte účet</option>{profiles.map(p=><option key={p.id} value={p.id}>{p.full_name?.trim()||p.email||"Účet"} · {p.role==="teacher"?"lektor":"študent"}</option>)}</select></label>
   <label className="block"><span className="text-sm font-medium">Súkromná poznámka</span><textarea name="note" maxLength={3000} required rows={3} placeholder="Preferuje rána, potrebuje slovenské vysvetlenie, platobná výnimka..." className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-3 text-sm"/></label>
   <button disabled={pending} className="rounded-xl bg-[#2F3AA2] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{pending?"Ukladám...":"Pridať"}</button>
  </div>
  {state.error&&<p className="mt-3 text-sm text-red-700">{state.error}</p>}{state.success&&<p className="mt-3 text-sm text-emerald-700">{state.success}</p>}
 </form>;
}
