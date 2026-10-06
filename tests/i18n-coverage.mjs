import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

const context = read("src/context/LanguageContext.tsx");
assert.match(context, /mundus_language=/, "language preference must persist in a cookie");
assert.match(context, /localStorage\.setItem\("mundus-language"/, "language preference should persist locally");
assert.match(context, /router\.refresh\(\)/, "language changes must refresh server-rendered pages");

const root = read("src/app/layout.tsx");
assert.match(root, /currentLanguage\(\)/, "root layout must read the saved language");
assert.match(root, /<html lang=\{language\}>/, "document language must follow the selected language");

for (const path of [
  "src/components/Navbar.tsx",
  "src/components/PortalNav.tsx",
  "src/components/TeacherNav.tsx",
  "src/components/AdminNav.tsx",
  "src/components/AccountShell.tsx",
]) {
  assert.match(read(path), /LanguageToggle/, `${path} must expose the language switch`);
}

for (const path of [
  "src/app/signup/SignupForm.tsx",
  "src/app/onboarding/OnboardingForm.tsx",
  "src/app/set-password/SetPasswordForm.tsx",
  "src/app/(portal)/feedback/TeacherFeedbackForm.tsx",
  "src/components/LearningUploadForm.tsx",
]) {
  assert.match(read(path), /name="ui_language"/, `${path} must send UI language to server actions`);
}

const labels = read("src/lib/portalLabels.ts");
assert.match(labels, /language: Language = "sk"/, "shared portal labels must support both languages");
assert.match(labels, /"Scheduled"/, "English lesson statuses must be present");
assert.match(labels, /"Active"/, "English package statuses must be present");

const packages = read("src/app/(portal)/packages/actions.ts");
assert.match(packages, /locale: uiLanguage/, "Stripe Checkout locale must follow the UI language");
assert.match(packages, /Individual online language lessons/, "Stripe English product description must be present");

console.log("PASS: global bilingual UI persistence and payment locale wiring");
