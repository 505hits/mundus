import assert from "node:assert/strict";
import { formatLanguage } from "../src/lib/portalLabels.ts";

assert.equal(formatLanguage("english"), "Angličtina");
assert.equal(formatLanguage("hungarian"), "Maďarčina");
assert.equal(formatLanguage("polish"), "Poľština");
assert.equal(formatLanguage("hebrew"), "Moderná hebrejčina");
assert.equal(formatLanguage("modern_hebrew"), "Moderná hebrejčina");
assert.equal(formatLanguage("Maďarčina"), "Maďarčina");
assert.equal(formatLanguage(null), "Jazyk");
assert.equal(formatLanguage("turkish"), "turkish");
console.log("PASS: portal language labels match the current Mundus offer");
