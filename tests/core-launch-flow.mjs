import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
import { PGlite } from "@electric-sql/pglite";
import { createLessonOnce } from "../src/lib/lesson-creation.ts";
import { canAcceptTeacherInvitation } from "../src/lib/account-policy.ts";
import { purchaseReturnPath } from "../src/lib/purchase-intent.ts";

function load(file, dependencies) {
  const source = readFileSync(new URL(file, import.meta.url), "utf8");
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const exports = {};
  new Function("require", "exports", code)(name => {
    if (!(name in dependencies)) throw Error(`Unexpected import ${name}`);
    return dependencies[name];
  }, exports);
  return exports;
}
const redirect = path => { throw Object.assign(new Error("redirect"), { path }); };
let profileResult;
let currentUser = { id: "student", email_confirmed_at: "2026-10-01", app_metadata: {} };
const dbMock = {
  auth: { getUser: async () => ({ data: { user: currentUser }, error: null }) },
  from: () => ({ select: () => ({ eq: () => ({ single: async () => profileResult }) }) }),
};
const { requireRole } = load("../src/lib/auth.ts", {
  "next/navigation": { redirect },
  "@/lib/supabase/server": { createSupabaseServerClient: async () => dbMock },
  "@/lib/account-policy": { canAcceptTeacherInvitation },
  "@/lib/purchase-intent": { purchaseReturnPath },
});
profileResult = { data: null, error: Error("database unavailable") };
await assert.rejects(requireRole("student"), error => !error.path && /profile is unavailable/.test(error.message));
profileResult = { data: null, error: null };
await assert.rejects(requireRole("student"), error => !error.path && /profile is unavailable/.test(error.message));
profileResult = { data: { role: "student", status: "active", full_name: "Student" }, error: null };
assert.equal((await requireRole("student")).user.id, "student");
await assert.rejects(requireRole("admin"), error => error.path === "/dashboard");
currentUser = null;
await assert.rejects(requireRole("student", "/packages?selected=10"), error => error.path === "/login?next=%2Fpackages%3Fselected%3D10");

let capturedReturn;
const { startPackageCheckout } = load("../src/app/(portal)/packages/actions.ts", {
  "next/navigation": { redirect },
  "@/lib/auth": { requireRole: async (_role, next) => { capturedReturn = next; redirect("/login"); } },
  "@/lib/supabase/admin": {}, "@/lib/account-config": {},
  "@/lib/i18n": { formUiLanguage: form => form.get("ui_language") === "en" ? "en" : "sk" },
  "@/lib/payments": { PACKAGE_PRICES: [1,5,10,20,30].map(lessons => ({ lessons })) },
});
for (const count of [1,5,10,20,30]) {
  const form = new FormData(); form.set("lessons", String(count));
  await assert.rejects(startPackageCheckout(form), error => error.path === "/login");
  assert.equal(capturedReturn, `/packages?selected=${count}`);
}
const bad = new FormData(); bad.set("lessons", "999");
await assert.rejects(startPackageCheckout(bad), error => error.path === "/login");
assert.equal(capturedReturn, undefined);

const db = new PGlite();
await db.exec(`create table lessons(id text primary key, student_id text,teacher_id text,package_id text,scheduled_at timestamptz,duration_minutes integer,language text,lesson_type text,meet_link text)`);
const expected = { id: "attempt-1", student_id: "s", teacher_id: "t", package_id: "p", scheduled_at: "2026-10-05T10:00:00.000Z", duration_minutes: 60, language: "English", lesson_type: "regular", meet_link: null };
let writes = 0;
const read = async () => {
  const row = (await db.query("select * from lessons where id=$1", [expected.id])).rows[0];
  return row ? { ...row, scheduled_at: new Date(row.scheduled_at).toISOString() } : null;
};
const insert = async () => {
  writes++;
  await db.query("insert into lessons values ($1,$2,$3,$4,$5,$6,$7,$8,$9)", Object.values(expected));
};
// The database committed; the network response was lost.
await createLessonOnce(expected, read, async () => { await insert(); throw Error("Lost response"); });
assert.equal(writes, 1);
await createLessonOnce(expected, read, insert);
assert.equal(writes, 1, "retry must not insert or revalidate an already saved lesson");
assert.equal((await db.query("select count(*)::int n from lessons")).rows[0].n, 1);
await assert.rejects(createLessonOnce({ ...expected, teacher_id: "other" }, read, insert), /conflict/);
assert.equal(writes, 1, "existing rows must never be overwritten");
const unavailable = Error("Read unavailable");
await assert.rejects(createLessonOnce(expected, async () => { throw unavailable; }, insert), error => error === unavailable);
assert.equal(writes, 1, "failed precheck must not insert");
const failure = Error("Save unavailable");
await assert.rejects(createLessonOnce(expected, async () => null, async () => { throw failure; }), error => error === failure);
await db.close();
console.log("PASS: retryable account lookup, role isolation, checkout selection after session expiry and one lesson after lost-response retry");
