import assert from "node:assert/strict";
import { bratislavaLocalToUtc } from "../src/lib/lesson-time.ts";

for (const [input, expected] of [
  ["2026-01-15T12:00", "2026-01-15T11:00:00.000Z"],
  ["2026-07-15T12:00", "2026-07-15T10:00:00.000Z"],
  ["2026-03-29T01:30", "2026-03-29T00:30:00.000Z"],
  ["2026-03-29T03:30", "2026-03-29T01:30:00.000Z"],
  ["2026-10-25T01:30", "2026-10-24T23:30:00.000Z"],
  ["2026-10-25T03:30", "2026-10-25T02:30:00.000Z"],
  ["2028-02-29T00:00", "2028-02-28T23:00:00.000Z"],
]) assert.equal(bratislavaLocalToUtc(input).toISOString(), expected, input);
for (const input of ["", "wrong", "2026-02-29T12:00", "2026-04-31T12:00", "2026-13-01T12:00", "2026-01-01T24:00", "2026-01-01T12:60", "2026-03-29T02:30", "2026-10-25T02:30"]) {
  assert.ok(Number.isNaN(bratislavaLocalToUtc(input).getTime()), input);
}
console.log("PASS: Bratislava winter/summer conversion, clock-change gaps and ambiguity, invalid dates and leap years");
