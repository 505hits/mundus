import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync(new URL("../src/app/(admin)/admin/dashboard/page.tsx", import.meta.url), "utf8");
const code = ts.transpileModule(source, { compilerOptions: {
  module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX,
} }).outputText;
let profileChecks = 0, privilegedClients = 0;
const query = new Proxy({}, { get: (_, key) => key === "then"
  ? Promise.resolve({ data: [], error: null }).then.bind(Promise.resolve({ data: [], error: null }))
  : () => query });
const component = () => null;
const dependencies = {
  "react/jsx-runtime": { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) },
  "@/lib/missing-reports": { missingLessonReports: () => [] },
  "@/lib/followup-queue": { followupQueue: () => [] },
  "./FollowupForm": { default: component }, "next/link": { default: component },
  "@/lib/renewal-attention": { renewalAttention: () => [] },
  "lucide-react": new Proxy({}, { get: () => component }),
  "@/lib/auth": { requireRole: async role => { assert.equal(role, "admin"); profileChecks++; return { profile: { full_name: "Admin" } }; } },
  "@/lib/supabase/server": { createSupabaseServerClient: async () => ({ from: () => query }) },
  "@/lib/supabase/admin": { createSupabaseAdminClient: () => { assert.equal(profileChecks, 1); privilegedClients++; throw Error("Service key missing"); } },
  "@/lib/portalLabels": {}, "@/lib/i18n": { currentLanguage: async () => "en", localeFor: () => "en-GB" },
  "./contact-request-actions": { markContactRequestContacted: component },
};
const exports = {};
new Function("require", "exports", code)(name => {
  assert.ok(name in dependencies, `Unexpected dependency ${name}`);
  return dependencies[name];
}, exports);
const tree = await exports.default();
assert.ok(tree, "Core dashboard must still render without contact request configuration");
assert.equal(privilegedClients, 1);
const rendered = JSON.stringify(tree);
assert.ok(rendered.includes("Some data could not be loaded"));
assert.ok(rendered.includes("Active students"));
console.log("PASS: missing optional service configuration preserves the authenticated admin dashboard");
