import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
const script = fileURLToPath(new URL("../scripts/check-portal-build-config.mjs", import.meta.url));
function run(url, key) {
  return spawnSync(process.execPath, [script], { encoding: "utf8", env: {
    ...process.env, NEXT_PUBLIC_SUPABASE_URL: url, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: key,
  } });
}
for (const [url, key] of [["", ""], ["https://example.supabase.co", ""], ["invalid", "private-test-value"], ["http://example.com", "private-test-value"]]) {
  const result = run(url, key);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Mundus portal build blocked/);
  assert.ok(!result.stderr.includes("private-test-value"), "Configuration values must not be printed");
}
assert.equal(run("https://example.supabase.co", "test-build-key").status, 0);
console.log("PASS: builds fail on missing/invalid public Supabase configuration without printing keys");
