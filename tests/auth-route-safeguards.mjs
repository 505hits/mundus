import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");

const callback = read("src/app/auth/callback/route.ts");
assert.ok(callback.includes("exchangeCodeForSession(code)"));
assert.ok(callback.includes('purchaseReturnPath(request.nextUrl.searchParams.get("next"))'));
assert.ok(callback.includes('"/auth/error"'));
assert.equal(callback.includes('NextResponse.redirect(request.nextUrl.searchParams.get("next")'), false);

const confirm = read("src/app/auth/confirm/route.ts");
assert.ok(confirm.includes('type === "signup" || type === "invite" || type === "recovery"'));
assert.ok(confirm.includes("verifyOtp({ token_hash, type })"));
assert.ok(confirm.includes('type === "recovery" ? "/reset-password"'));
assert.ok(confirm.includes('type === "invite" ? "/set-password"'));
assert.ok(confirm.includes('purchaseReturnPath(request.nextUrl.searchParams.get("next"))'));

const signup = read("src/app/signup/actions.ts");
assert.ok(signup.includes('MUNDUS_SELF_SIGNUP_ENABLED !== "true"'));
assert.ok(signup.includes("emailRedirectTo:"));
assert.ok(signup.includes("accountOrigin()"));
assert.ok(signup.includes("if (data.session) await supabase.auth.signOut()"));
assert.ok(signup.includes("validPassword(password)"));

const recoveryPage = read("src/app/reset-password/page.tsx");
assert.ok(recoveryPage.includes("preparePasswordRecovery"));
assert.ok(recoveryPage.includes('window.history.replaceState(null, "", "/reset-password")'));
assert.ok(recoveryPage.includes('autoComplete="new-password"'));

const forgot = read("src/app/forgot-password/page.tsx");
assert.ok(forgot.includes('redirectTo: `${window.location.origin}/reset-password`'));
assert.ok(forgot.includes("If this email belongs to a Mundus account"));

const invite = read("src/app/set-password/actions.ts");
assert.ok(invite.includes('MUNDUS_INVITATIONS_ENABLED !== "true"'));
assert.ok(invite.includes("canAcceptTeacherInvitation(user.app_metadata)"));
assert.ok(invite.includes('profile?.role !== "teacher" || profile.status !== "pending"'));
assert.ok(invite.includes("mundus_accept_teacher_invitation"));

console.log("PASS: auth callback, recovery and teacher invitation route safeguards");
