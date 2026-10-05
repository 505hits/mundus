"use client";
import { useActionState } from "react";
import Link from "next/link";
import { signUpStudent } from "./actions";

const input = "mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2F3AA2]";
export default function SignupForm({ next }: { next: string | null }) {
  const [state, action, pending] = useActionState(signUpStudent, {});
  return <>
    {state.success ? <p role="status" aria-live="polite" className="rounded-xl bg-green-50 p-4 text-sm leading-6">{state.success}</p> :
      <form action={action} className="space-y-4">
        {next && <input type="hidden" name="next" value={next} />}
        <label className="block text-sm">Celé meno a priezvisko<input className={input} name="name" autoComplete="name" minLength={2} maxLength={100} required /></label>
        <label className="block text-sm">E-mailová adresa<input className={input} name="email" type="email" autoComplete="email" maxLength={254} required /></label>
        <label className="block text-sm">Heslo<input className={input} name="password" type="password" autoComplete="new-password" minLength={10} maxLength={128} required /><span className="mt-1 block text-xs text-gray-500">Aspoň 10 znakov.</span></label>
        <label className="block text-sm">Zopakujte heslo<input className={input} name="confirmPassword" type="password" autoComplete="new-password" minLength={10} maxLength={128} required /></label>
        {state.error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{state.error}</p>}
        <button disabled={pending} className="w-full rounded-xl bg-[#2F3AA2] p-3.5 font-semibold text-white disabled:opacity-50">{pending ? "Vytváram účet…" : "Vytvoriť študentský účet"}</button>
      </form>}
    <p className="mt-5 rounded-xl bg-[#f0f2ff] p-3 text-sm font-medium text-[#2F3AA2]">Prvý balíček −10 % iba raz na osobu. Overujeme celé meno a e-mail.</p>
    <p className="mt-5 text-center text-sm text-gray-600">Už máte účet? <Link className="font-semibold text-[#2F3AA2] underline" href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"}>Prihlásiť sa</Link></p>
    <p className="mt-5 text-center text-xs leading-5 text-gray-500">Ste lektor? Účet si vytvoríte cez pozvánku od Mundus Languages.</p>
  </>;
}
