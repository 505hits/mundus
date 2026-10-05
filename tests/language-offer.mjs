import assert from "node:assert/strict";
import { MUNDUS_LANGUAGE_OPTIONS, MUNDUS_LANGUAGE_VALUES, MUNDUS_LANGUAGE_LABELS } from "../src/lib/language-offer.ts";

assert.equal(MUNDUS_LANGUAGE_OPTIONS.length, 13);
assert.equal(new Set(MUNDUS_LANGUAGE_VALUES).size, 13);
assert.equal(new Set(MUNDUS_LANGUAGE_LABELS).size, 13);
assert.ok(MUNDUS_LANGUAGE_VALUES.includes("Hungarian"));
assert.ok(MUNDUS_LANGUAGE_VALUES.includes("Polish"));
assert.ok(MUNDUS_LANGUAGE_VALUES.includes("Modern Hebrew"));
assert.equal(MUNDUS_LANGUAGE_VALUES.includes("Turkish"), false);
console.log("PASS: shared Mundus language offer is current and unique");
