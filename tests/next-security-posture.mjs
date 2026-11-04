import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const lock = JSON.parse(readFileSync(new URL("../package-lock.json", import.meta.url), "utf8"));
const sharpVersion = lock.packages?.["node_modules/sharp"]?.version || "";
const sharpParts = sharpVersion.split(".").map(Number);
const sharpSafe = sharpParts.length === 3 && (
  sharpParts[0] > 0 ||
  sharpParts[1] > 35 ||
  (sharpParts[1] === 35 && sharpParts[2] >= 5)
);
assert.equal(sharpSafe, true, `sharp must remain >= 0.35.5; found ${sharpVersion || "missing"}`);

const srcRoot = new URL("../src/", import.meta.url).pathname;
const files = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory()) walk(path);
    else if (/\.(ts|tsx|js|jsx)$/.test(name)) files.push(path);
  }
}
walk(srcRoot);

for (const path of files) {
  const source = readFileSync(path, "utf8");
  assert.equal(source.includes("next/og"), false, `${path} uses next/og; re-review current Next.js security advisories before enabling it`);
  assert.equal(source.includes("ImageResponse"), false, `${path} uses ImageResponse; re-review current Next.js security advisories before enabling it`);
  assert.equal(/["']use cache["']/.test(source), false, `${path} uses use cache; re-review current Next.js cache advisories before enabling it`);
  assert.equal(/runtime\s*=\s*["']edge["']/.test(source), false, `${path} opts into Edge runtime; re-review current Next.js cookie advisories before enabling it`);
}

console.log(`PASS: Next.js security posture keeps sharp ${sharpVersion} and avoids currently sensitive feature paths`);
