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
const dashboardSetup=read("src/app/(portal)/dashboard/setup/page.tsx");
const legacyOnboarding=read("src/app/onboarding/page.tsx");
const login=read("src/app/login/page.tsx");
const contact=read("src/app/contact/page.tsx");
const notificationWorker=read("src/app/api/notifications/process/route.ts");

for(const component of ["PortalPreviewSection","TrustSection","FAQSection"]) {
  assert.ok(home.includes(component), `homepage must include ${component}`);
}
assert.ok(onboarding.includes('name="lessons_per_week"'));
assert.ok(onboardingAction.includes("lessons_per_week: lessonsPerWeek"));
assert.ok(onboardingAction.includes("lessonsPerWeek < 1 || lessonsPerWeek > 5"));
assert.ok(onboardingAction.includes("Onboarding is available only after a package payment is confirmed."));
assert.ok(dashboardSetup.includes("Payment confirmed"));
assert.ok(dashboardSetup.includes('OnboardingForm next="/dashboard?payment=success"'));
assert.ok(legacyOnboarding.includes('redirect("/packages")'));
assert.ok(legacyOnboarding.includes('redirect("/dashboard/setup")'));
assert.ok(paymentReturn.includes("dashboard/setup?payment=success"),"paid students must continue to setup, optionally with preserved language context");
assert.ok(paymentReturn.includes('redirect("/dashboard?payment=success")'));
assert.ok(login.includes('profile.role === "student" && desired'), "login must preserve an explicit package/payment destination before onboarding");
assert.match(login, /router\.replace\([\s\S]*profile\.role === "student" && desired[\s\S]*\? desired[\s\S]*: needsOnboarding/, "payment intent must take precedence over onboarding in the final redirect");
assert.ok(matching.includes("lessons_per_week"));
assert.ok(matching.includes("Approve this match"));
assert.ok(matching.includes("Schváliť túto zhodu"));
assert.ok(lessonForm.includes("initialStudentId"));
assert.ok(lessonForm.includes("initialTeacherId"));

assert.ok(translations.includes('number: "05"'), "How It Works must show five real customer steps");
assert.ok(translations.includes("Create your account & pay securely"));
assert.ok(translations.includes("Complete your learning preferences"));
assert.ok(translations.includes("Doplňte svoje preferencie"));
assert.ok(faq.includes("Čo sa stane po nákupe?"));
assert.ok(faq.includes("Až potom doplníte jazyk"));
assert.ok(faq.includes("Only then do you enter language"));
assert.ok(preview.includes("Preview based on the real dashboard"));
assert.ok(preview.includes("same structure and information types as the student dashboard"));
assert.ok(footer.includes('${prefix}/#faq'));
assert.ok(footer.includes('${prefix}/privacy'));
assert.ok(footer.includes('${prefix}/terms'));
assert.ok(footer.includes('${prefix}/cookies'));
assert.ok(footer.includes('href: "/dashboard"'));

assert.equal(hero.includes("images.unsplash.com/photo-1507003211169"), false, "hero must not use stock faces as student proof");
assert.equal(hero.includes("Gemini_Generated_Image"), false, "hero must not use generated learner imagery");
assert.ok(hero.includes("Payment comes first") || hero.includes("Najprv platba"));
assert.equal(translations.includes("200+ students"), false);
assert.equal(translations.includes("200+ študentov"), false);
assert.equal(translations.includes("4.9/5"), false);
assert.equal(layout.toLowerCase().includes("turečtina"), false);
assert.equal(translations.includes("SKUPINOVÉ KURZY"), false, "new strategy must not restore old group-course pricing");
assert.equal(home.includes("CalendlyWidget"), false, "homepage must stay focused on direct purchase instead of consultation booking");
assert.equal(contact.includes("× 60 min</option>"), false, "contact form must not imply every enquiry is for 60-minute lessons");
assert.equal(notificationWorker.includes('requestRow.package_lessons+" × 60 min"'), false, "contact notification must not invent a 60-minute duration");

console.log("PASS: public site, paid onboarding, dashboard and teacher matching follow the Mundus strategy");
