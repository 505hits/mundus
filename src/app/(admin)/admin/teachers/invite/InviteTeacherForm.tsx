"use client";
import { useActionState } from "react";
import { inviteTeacher } from "./actions";
import {useLanguage} from "@/context/LanguageContext";

export default function InviteTeacherForm({ enabled }: { enabled: boolean }) {
  const {language}=useLanguage(); const sk=language==="sk";
  const [state, action, pending] = useActionState(inviteTeacher, {});
  return <section className="mt-7 rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
    <h2 className="text-lg font-semibold">{sk?"Pozvať lektora":"Invite teacher"}</h2>
    <p className="mt-2 text-sm leading-6 text-gray-500">{sk?"Pozvánku pošlite až po dohode s lektorom. Nastavením hesla získa prístup k lektorskému portálu. Uvidí iba priradených študentov a hodiny.":"Send an invitation only after agreeing with the teacher. Setting a password gives access to the teacher portal. They will see only assigned students and lessons."}</p>
    {!enabled ? <p className="mt-3 text-sm text-amber-800">{sk?"Odosielanie pozvánok ešte nie je aktivované.":"Teacher invitations are not enabled yet."}</p> : <form action={action} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
      <label className="block flex-1 text-sm">{sk?"Meno a priezvisko":"Full name"}<input required name="name" autoComplete="off" minLength={2} maxLength={100} className="mt-1 w-full rounded-xl border border-gray-200 p-3" /></label>
      <label className="block flex-1 text-sm">{sk?"E-mail lektora":"Teacher email"}<input required name="email" type="email" autoComplete="off" maxLength={254} className="mt-1 w-full rounded-xl border border-gray-200 p-3" /></label>
      <button disabled={pending} className="rounded-xl bg-[#163f3a] px-5 py-3 font-semibold text-white disabled:opacity-50">{pending?(sk?"Odosielam…":"Sending…"):(sk?"Odoslať pozvánku":"Send invitation")}</button>
    </form>}
    {state.error && <p role="alert" className="mt-3 text-sm text-red-700">{state.error}</p>}
    {state.success && <p role="status" className="mt-3 text-sm text-green-800">{state.success}</p>}
  </section>;
}
