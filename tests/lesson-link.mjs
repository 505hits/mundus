import assert from "node:assert/strict";
import { safeLessonLink } from "../src/lib/lesson-link.ts";
for (const value of [null, undefined, "", "https://", "https:///", "http://meet.google.com/abc", "javascript:alert(1)", "//example.com", "https://user:password@example.com/room", "https://example.com/room name", "https://example.com/\nroom", "https://example.com\\room"]) {
  assert.equal(safeLessonLink(value), null, String(value));
}
for (const value of ["https://meet.google.com/abc-defg-hij", "https://zoom.us/j/123?pwd=token", "https://teams.microsoft.com/l/meetup-join/a%20b", "https://example.com/room#join"]) {
  assert.equal(safeLessonLink(value), value);
}
assert.equal(safeLessonLink("  HTTPS://EXAMPLE.COM/room  "), "https://example.com/room");
console.log("PASS: meeting URLs, malformed links, unsafe schemes, credentials and control characters");
