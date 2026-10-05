"use client";
import { useActionState, useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { acceptTeacherInvitation } from "./actions";
import { useLanguage } from "@/context/LanguageContext";

export default function SetPasswordForm() {
  const { language } = useLanguage();
  const sk = language === "sk";
  const [ready, setReady] = useState(false);
  const [linkError, setLinkError] = useState("");
  const [state, action, pending] = useActionState(acceptTeacherInvitation, {});
  useEffect(() => {
    let cancelled = false;
    async function prepare() {
      try {
        const supabase = createSupabaseBrowserClient();
        // Supports default Supabase invitation emails as well as the token-hash SSR template.
        const hash = new URLSearchParams(window.location.hash.slice(1));
        const access_token = hash.get("access_token");
        const refresh_token = hash.get("refresh_token");
        if (hash.has("error")) throw new Error("Invalid link");
        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({ access_token, refresh_token });
          if (error) throw error;
        }
        window.history.replaceState(null, "", "/set-password");
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) throw new Error("Missing session");
        if (!cancelled) setReady(true);
      } catch {
        window.history.replaceState(null, "", "/set-password");
        if (!cancelled) setLinkError(sk ? "Odkaz nie je platný alebo vypršal. Otvorte pozvánku z e-mailu alebo kontaktujte Mundus." : "This link is invalid or expired. Open the invitation from your email or contact Mundus.");
      }
    }
    void prepare();
    return () => { cancelled = true; };
  }, []);
  if (linkError) return <p role="alert" className="text-sm leading-6 text-red-700">{linkError}</p>;
  if (!ready) return <p role="status" className="text-sm text-gray-500">{sk ? "Overujem pozvánku…" : "Verifying invitation…"}</p>;
  return <form action={action} className="space-y-5">
    <label className="block text-sm">{sk ? "Nové heslo" : "New password"}<input name="password" type="password" autoComplete="new-password" minLength={10} maxLength={128} required className="mt-2 w-full rounded-xl border border-gray-200 p-3" /><span className="mt-1 block text-xs text-gray-500">{sk ? "Aspoň 10 znakov." : "At least 10 characters."}</span></label>
    <label className="block text-sm">{sk ? "Zopakujte heslo" : "Repeat password"}<input name="confirmPassword" type="password" autoComplete="new-password" minLength={10} maxLength={128} required className="mt-2 w-full rounded-xl border border-gray-200 p-3" /></label>
    {state.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
    <button disabled={pending} className="w-full rounded-xl bg-[#2F3AA2] p-3.5 font-semibold text-white disabled:opacity-50">{pending ? (sk ? "Aktivujem účet…" : "Activating account…") : (sk ? "Nastaviť heslo a aktivovať účet" : "Set password and activate account")}</button>
  </form>;
}
