import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = new URL("../src/", import.meta.url);
const rootPath = fileURLToPath(root);
const files = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory()) walk(path);
    else if (/\.(ts|tsx|js|jsx)$/.test(name)) files.push(path);
  }
}
walk(rootPath);

const forbiddenClientTokens = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "STRIPE_RESTRICTED_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "MUNDUS_SMTP_PASSWORD",
  "MUNDUS_NOTIFICATION_SECRET",
  "CRON_SECRET",
];

for (const path of files) {
  const source = readFileSync(path, "utf8");
  const firstMeaningful = source.split(/\r?\n/).find(line => line.trim() && !line.trim().startsWith("//"))?.trim();
  const isClient = firstMeaningful === '"use client";' || firstMeaningful === "'use client';";
  if (!isClient) continue;
  for (const token of forbiddenClientTokens) {
    assert.equal(
      source.includes(token),
      false,
      `${relative(rootPath, path)} must not reference server-only secret ${token}`,
    );
  }
  assert.equal(
    source.includes("@/lib/supabase/admin"),
    false,
    `${relative(rootPath, path)} must not import the privileged Supabase admin client`,
  );
}

const admin = readFileSync(new URL("../src/lib/supabase/admin.ts", import.meta.url), "utf8");
assert.ok(admin.includes('import "server-only"'), "admin Supabase client must remain server-only");
assert.ok(admin.includes("SUPABASE_SERVICE_ROLE_KEY"), "admin client must use the server service-role variable");
assert.equal(admin.includes("NEXT_PUBLIC_SUPABASE_SERVICE"), false, "service-role key must never be public");

const browser = readFileSync(new URL("../src/lib/supabase.ts", import.meta.url), "utf8");
assert.ok(browser.includes("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"));
assert.equal(browser.includes("SUPABASE_SERVICE_ROLE_KEY"), false);

const example = readFileSync(new URL("../.env.local.example", import.meta.url), "utf8");
for (const token of ["SERVICE_ROLE", "STRIPE_WEBHOOK_SECRET", "STRIPE_RESTRICTED_KEY", "SMTP_PASSWORD", "NOTIFICATION_SECRET"]) {
  assert.equal(
    new RegExp(`NEXT_PUBLIC_[^\\n]*${token}`, "i").test(example),
    false,
    `.env.local.example must not expose ${token} through NEXT_PUBLIC_ variables`,
  );
}

console.log("PASS: client bundles cannot reference Mundus server secrets or the admin Supabase client");
