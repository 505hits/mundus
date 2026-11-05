"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { accountOrigin } from "@/lib/account-config";
import { validEmail } from "@/lib/account-policy";

export type RecoveryState = { success?: string; error?: string };

export async function requestPasswordRecovery(_previous: RecoveryState, form: FormData): Promise<RecoveryState> {
  const language = String(form.get("ui_language") ?? "sk") === "en" ? "en" : "sk";
  const sk = language === "sk";
  const email = String(form.get("email") ?? "").trim().toLowerCase();

  if (!validEmail(email)) {
    return { error: sk ? "Zadajte platnú e-mailovú adresu." : "Enter a valid email address." };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${accountOrigin()}/reset-password`,
    });
    if (error) {
      return {
        error: sk
          ? "E-mail na obnovu hesla sa nepodarilo odoslať. Skúste to prosím znova."
          : "We could not send the password reset email. Please try again.",
      };
    }
    return {
      success: sk
        ? "Ak je tento e-mail priradený k účtu Mundus, dostanete odkaz na obnovu hesla. Skontrolujte aj spam."
        : "If this email belongs to a Mundus account, you’ll receive a password reset link. Also check your spam folder.",
    };
  } catch {
    return {
      error: sk
        ? "Obnova hesla je momentálne nedostupná. Skúste to prosím znova."
        : "Password recovery is currently unavailable. Please try again.",
    };
  }
}

export type ConfirmationState = { success?: string; error?: string };

export async function resendSignupConfirmation(_previous: ConfirmationState, form: FormData): Promise<ConfirmationState> {
  const language = String(form.get("ui_language") ?? "sk") === "en" ? "en" : "sk";
  const sk = language === "sk";
  const email = String(form.get("email") ?? "").trim().toLowerCase();

  if (!validEmail(email)) {
    return { error: sk ? "Zadajte platnú e-mailovú adresu." : "Enter a valid email address." };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${accountOrigin()}/auth/callback` },
    });
    if (error) {
      return {
        error: sk
          ? "Nový potvrdzovací e-mail sa nepodarilo odoslať. Ak už je účet potvrdený, skúste sa prihlásiť."
          : "We could not send a new confirmation email. If the account is already confirmed, try signing in.",
      };
    }
    return {
      success: sk
        ? "Poslali sme nový potvrdzovací odkaz. Použite najnovší e-mail a staršie odkazy ignorujte."
        : "We sent a new confirmation link. Use the newest email and ignore older links.",
    };
  } catch {
    return {
      error: sk
        ? "Potvrdenie účtu je momentálne nedostupné. Skúste to prosím znova."
        : "Account confirmation is currently unavailable. Please try again.",
    };
  }
}
