"use client";
import { useActionState } from "react";
import { acceptCompanyInvitation } from "./actions";
import { useLanguage } from "@/context/LanguageContext";
const input="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2F3AA2]";
export default function CompanySetPasswordForm(){
 const {language}=useLanguage(); const sk=language==="sk";
 const [state,action,pending]=useActionState(acceptCompanyInvitation,{});
 return <form action={action} className="space-y-4"><input type="hidden" name="ui_language" value={language}/><label className="block text-sm">{sk?"Nové heslo":"New password"}<input name="password" type="password" minLength={10} maxLength={128} required autoComplete="new-password" className={input}/></label><label className="block text-sm">{sk?"Zopakujte heslo":"Repeat password"}<input name="confirmPassword" type="password" minLength={10} maxLength={128} required autoComplete="new-password" className={input}/></label>{state.error&&<p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{state.error}</p>}<button disabled={pending} className="w-full rounded-xl bg-[#2F3AA2] p-3.5 font-semibold text-white disabled:opacity-50">{pending?(sk?"Aktivujem…":"Activating…"):(sk?"Aktivovať firemný účet":"Activate company account")}</button></form>;
}
