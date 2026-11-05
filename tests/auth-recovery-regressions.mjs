import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");

const support = read("src/app/auth-support-actions.ts");
const forgot = read("src/app/forgot-password/page.tsx");
const resend = read("src/app/resend-confirmation/page.tsx");
const authError = read("src/app/auth/error/page.tsx");
const callback = read("src/app/auth/callback/route.ts");
const confirm = read("src/app/auth/confirm/route.ts");

assert.ok(support.includes("resetPasswordForEmail(email"));
assert.ok(support.includes("accountOrigin()"));
assert.ok(support.includes('redirectTo: `${accountOrigin()}/reset-password`'));
assert.ok(support.includes('auth.resend({'));
assert.ok(support.includes('type: "signup"'));
assert.ok(support.includes('emailRedirectTo: `${accountOrigin()}/auth/callback`'));

assert.equal(forgot.includes("createSupabaseBrowserClient"), false, "password reset request must not depend on browser Supabase configuration");
assert.ok(forgot.includes("requestPasswordRecovery"));
assert.ok(resend.includes("resendSignupConfirmation"));
assert.ok(authError.includes('href="/resend-confirmation"'));
assert.ok(authError.includes('href="/forgot-password"'));

assert.ok(callback.includes("accountOrigin()"));
assert.ok(confirm.includes("accountOrigin()"));
assert.equal(callback.includes("request.url"), false, "auth callback redirects must use the canonical configured origin");
assert.equal(confirm.includes("request.url"), false, "auth confirmation redirects must use the canonical configured origin");

console.log("PASS: canonical password recovery and expired-confirmation recovery safeguards");
