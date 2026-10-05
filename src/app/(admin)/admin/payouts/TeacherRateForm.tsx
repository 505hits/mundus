"use client";
import {useActionState} from "react";
import {saveTeacherRate} from "./actions";
export default function TeacherRateForm({teachers,month}:{teachers:Array<{id:string;full_name:string|null;email:string|null}>,month:string}){
 const [state,action,pending]=useActionState(saveTeacherRate,{});
 return <form action={action} className="mt-6 rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
  <input type="hidden" name="month" value={month}/>
  <div className="grid gap-4 md:grid-cols-[1.5fr_0.8fr_auto] md:items-end">
   <label className="block"><span className="text-sm font-medium">Lektor</span><select name="teacher_id" required className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-3 text-sm"><option value="">Vyberte lektora</option>{teachers.map(t=><option key={t.id} value={t.id}>{t.full_name?.trim()||t.email||"Lektor"}</option>)}</select></label>
   <label className="block"><span className="text-sm font-medium">€ za dokončenú hodinu</span><input name="rate_eur" required type="number" min="0" max="1000" step="0.01" className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-3 text-sm"/></label>
   <button disabled={pending} className="rounded-xl bg-[#2F3AA2] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{pending?"Ukladám...":"Uložiť sadzbu"}</button>
  </div>
  {state.error&&<p className="mt-3 text-sm text-red-700">{state.error}</p>}{state.success&&<p className="mt-3 text-sm text-emerald-700">{state.success}</p>}
 </form>;
}
