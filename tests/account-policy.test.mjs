import test from "node:test";
import assert from "node:assert/strict";
import { canAcceptTeacherInvitation, portalDestination, validEmail, validPassword } from "../src/lib/account-policy.ts";

test("teacher access requires an unexpired, unconsumed trusted invitation", () => {
  const now = Date.parse("2026-09-29T00:00:00Z");
  const invitation = { mundus_invited_role: "teacher", mundus_invitation_expires_at: "2026-09-30T00:00:00Z" };
  assert.equal(canAcceptTeacherInvitation(invitation, now), true);
  for (const metadata of [{}, { role: "teacher" }, { ...invitation, mundus_invited_role: "admin" }, { ...invitation, mundus_invitation_expires_at: "invalid" }, { ...invitation, mundus_invitation_expires_at: "2026-09-29T00:00:00Z" }, { ...invitation, mundus_invitation_accepted_at: "2026-09-28T00:00:00Z" }]) {
    assert.equal(canAcceptTeacherInvitation(metadata, now), false);
  }
});

test("inactive or unknown roles cannot route into an active portal", () => {
  assert.equal(portalDestination("student", "active"), "/dashboard");
  assert.equal(portalDestination("teacher", "active"), "/teacher/dashboard");
  assert.equal(portalDestination("admin", "active"), "/admin/dashboard");
  assert.equal(portalDestination("teacher", "pending"), "/set-password");
  for (const [role, status] of [["admin", "pending"], ["student", "inactive"], ["teacher", "suspended"], ["owner", "active"], [null, "active"]]) {
    assert.equal(portalDestination(role, status), "/auth/error");
  }
});

test("account inputs reject malformed email and short or oversized passwords", () => {
  assert.equal(validEmail("student@example.com"), true);
  for (const email of ["", "student", "a b@example.com", "a@example", "a".repeat(250) + "@example.com"]) assert.equal(validEmail(email), false);
  assert.equal(validPassword("a".repeat(10)), true);
  assert.equal(validPassword("a".repeat(128)), true);
  assert.equal(validPassword("a".repeat(9)), false);
  assert.equal(validPassword("a".repeat(129)), false);
});
