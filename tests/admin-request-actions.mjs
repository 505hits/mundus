import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const code = ts.transpileModule(readFileSync(new URL("../src/app/(admin)/admin/requests/actions.ts", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
let authorized = true, clients = 0, saved = true, invalidations = 0;
const filters = [];
const chain = {
  update: () => chain,
  eq: (key, value) => { filters.push([key, value]); return chain; },
  select: () => chain,
  maybeSingle: async () => ({ data: saved ? { id: "saved" } : null, error: null }),
};
const dependencies = {
  "next/navigation": { redirect: path => { throw Object.assign(Error("redirect"), { path }); } },
  "next/cache": { revalidatePath: () => invalidations++ },
  "@/lib/auth": { requireRole: async role => { assert.equal(role, "admin"); if (!authorized) throw Error("forbidden"); } },
  "@/lib/supabase/admin": { createSupabaseAdminClient: () => { clients++; return { from: table => { assert.equal(table, "contact_requests"); return chain; } }; } },
};
const exports = {};
new Function("require", "exports", code)(name => {
  assert.ok(name in dependencies, `Unexpected dependency ${name}`);
  return dependencies[name];
}, exports);
function form(status = "contacted") {
  const data = new FormData();
  data.set("id", "11111111-1111-4111-8111-111111111111");
  data.set("status", status); data.set("current_status", "new");
  return data;
}
authorized = false;
await assert.rejects(exports.updateContactRequest(form()), /forbidden/);
assert.equal(clients, 0, "A non-admin must never create a privileged client");
authorized = true;
await assert.rejects(exports.updateContactRequest(form("invalid")), error => error.path === "/admin/requests?problem=invalid");
assert.equal(clients, 0, "Malformed input must not access the database");
saved = false;
await assert.rejects(exports.updateContactRequest(form()), error => error.path === "/admin/requests?status=new&problem=save");
assert.equal(invalidations, 0, "A concurrent change must not be reported as saved");
saved = true;
await assert.rejects(exports.updateContactRequest(form()), error => error.path === "/admin/requests?status=new");
assert.equal(invalidations, 1);
assert.ok(filters.some(([key, value]) => key === "status" && value === "new"), "Updates must compare the existing status");
console.log("PASS: admin-only request updates, validation, concurrent-update rejection and successful revalidation");
