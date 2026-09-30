import assert from "node:assert/strict";
import { purchaseReturnPath } from "../src/lib/purchase-intent.ts";

for (const count of [1, 5, 10, 20, 30]) {
  assert.equal(purchaseReturnPath(`/packages?selected=${count}`), `/packages?selected=${count}`);
}
for (const value of ["//evil.test", "https://evil.test", "/admin/payments", "/packages?selected=999", "/packages?selected=5&next=//evil.test", null, 5]) {
  assert.equal(purchaseReturnPath(value), null);
}
console.log("PASS: only a supported internal package choice survives authentication");
