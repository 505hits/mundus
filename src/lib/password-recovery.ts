import type { SupabaseClient } from "@supabase/supabase-js";

type RecoveryAuth = Pick<SupabaseClient["auth"], "exchangeCodeForSession" | "setSession" | "getUser">;

// Explicitly failed links must never fall back to an unrelated existing session.
export async function preparePasswordRecovery(auth: RecoveryAuth, url: URL) {
  const hash = new URLSearchParams(url.hash.slice(1));
  if (url.searchParams.has("error") || hash.has("error")) throw new Error("Invalid recovery link");
  const code = url.searchParams.get("code");
  const access_token = hash.get("access_token");
  const refresh_token = hash.get("refresh_token");
  if (code) {
    const { error } = await auth.exchangeCodeForSession(code);
    if (error) throw error;
  } else if (access_token || refresh_token) {
    if (!access_token || !refresh_token || hash.get("type") !== "recovery") throw new Error("Invalid recovery link");
    const { error } = await auth.setSession({ access_token, refresh_token });
    if (error) throw error;
  }
  const { data: { user }, error } = await auth.getUser();
  if (error || !user) throw new Error("Missing recovery session");
}
