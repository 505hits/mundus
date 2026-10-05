import assert from "node:assert/strict";
import {portalEmail} from "../src/lib/portal-email.ts";
assert.match(portalEmail("admin_assignment","Eva","https://example.invalid/admin/matching").text,/čaká na priradenie/);
assert.match(portalEmail("admin_renewal","Eva","https://example.invalid/admin").subject,/posledné hodiny/);
assert.match(portalEmail("student_renewal","Eva","https://example.invalid/packages").text,/posledná hodina/);
console.log("PASS: assignment and renewal notification copy");
