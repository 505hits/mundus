import assert from "node:assert/strict";
import { purchaseReturnPath } from "../src/lib/purchase-intent.ts";

for (const count of [1, 5, 10, 20, 30]) {
  for (const duration of [45,60]) {
    assert.equal(purchaseReturnPath(`/packages?selected=${count}&duration=${duration}`), `/packages?selected=${count}&duration=${duration}`);
  }
}
for (const value of ["//evil.test", "https://evil.test", "/admin/payments", "/packages?selected=5", "/packages?selected=999&duration=60", "/packages?selected=5&duration=90", "/packages?selected=5&duration=60&next=//evil.test", null, 5]) {
  assert.equal(purchaseReturnPath(value), null);
}
console.log("PASS: only a supported internal package choice survives authentication");
