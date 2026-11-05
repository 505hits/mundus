import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read=(p)=>readFileSync(new URL("../"+p, import.meta.url),"utf8");

const home=read("src/app/page.tsx");
const onboarding=read("src/app/onboarding/OnboardingForm.tsx");
const onboardingAction=read("src/app/onboarding/actions.ts");
const paymentReturn=read("src/app/(portal)/packages/return/page.tsx");
const matching=read("src/app/(admin)/admin/matching/page.tsx");
const lessonForm=read("src/app/(admin)/admin/lessons/AdminCreateLessonForm.tsx");
const translations=read("src/data/translations.ts");
const hero=read("src/components/Hero.tsx");
const footer=read("src/components/Footer.tsx");
const layout=read("src/app/layout.tsx");
const faq=read("src/components/FAQSection.tsx");
const preview=read("src/components/PortalPreviewSection.tsx");

for(const component of ["PortalPreviewSection","TrustSection","FAQSection"]) {
  assert.ok(home.includes(component), `homepage must include ${component}`);
}
assert.ok(onboarding.includes('name="lessons_per_week"'));
assert.ok(onboardingAction.includes("lessons_per_week: lessonsPerWeek"));
assert.ok(onboardingAction.includes("lessonsPerWeek < 1 || lessonsPerWeek > 5"));
assert.ok(paymentReturn.includes('redirect("/onboarding?next=%2Fdashboard%3Fpayment%3Dsuccess")'));
assert.ok(paymentReturn.includes('redirect("/dashboard?payment=success")'));
assert.ok(matching.includes("lessons_per_week"));
assert.ok(matching.includes("Approve this match"));
assert.ok(matching.includes("Schváliť túto zhodu"));
assert.ok(lessonForm.includes("initialStudentId"));
assert.ok(lessonForm.includes("initialTeacherId"));

assert.ok(translations.includes('number: "05"'), "How It Works must show five real customer steps");
assert.ok(translations.includes("Complete your learning preferences"));
assert.ok(translations.includes("Doplňte svoje preferencie"));
assert.ok(faq.includes("Čo sa stane po platbe?"));
assert.ok(preview.includes("Portal preview"));
assert.ok(footer.includes('href: "/#faq"'));

assert.equal(hero.includes("images.unsplash.com/photo-1507003211169"), false, "hero must not use stock faces as student proof");
assert.equal(translations.includes("200+ students"), false);
assert.equal(translations.includes("200+ študentov"), false);
assert.equal(translations.includes("4.9/5"), false);
assert.equal(layout.toLowerCase().includes("turečtina"), false);
assert.equal(translations.includes("SKUPINOVÉ KURZY"), false, "new strategy must not restore old group-course pricing");

console.log("PASS: public site, paid onboarding, dashboard and teacher matching follow the Mundus strategy");
