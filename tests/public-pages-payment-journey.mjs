import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read=(p)=>readFileSync(new URL("../"+p,import.meta.url),"utf8");

const nav=read("src/components/Navbar.tsx");
const hero=read("src/components/Hero.tsx");
const selector=read("src/components/LanguageSelector.tsx");
const formats=read("src/components/LearningFormatsSection.tsx");
const pricing=read("src/components/PurchasePackages.tsx");
const payment=read("src/app/payment/page.tsx");
const languagePage=read("src/app/languages/[slug]/page.tsx");
const intentPage=read("src/app/learn/[slug]/page.tsx");
const groupPage=read("src/app/group-lessons/page.tsx");
const companiesPage=read("src/app/companies/page.tsx");
const footer=read("src/components/Footer.tsx");
const proxy=read("proxy.ts");
const nextConfig=read("next.config.ts");
const checkout=read("src/app/(portal)/packages/actions.ts");

assert.ok(nav.includes("${prefix}/languages"),"main languages nav must use a real page");
assert.ok(nav.includes("${prefix}/pricing"),"main pricing nav and mobile CTA must use a real page");
assert.ok(nav.includes("${prefix}/group-lessons"),"group lessons must use a real page");
assert.ok(nav.includes("${prefix}/companies"),"companies must use a real page");
assert.ok(nav.includes("${prefix}/teachers"),"teachers must use a real page");
assert.ok(hero.includes("`/${language}/languages`"),"hero language CTA must use the languages page");
assert.ok(hero.includes("`/${language}/pricing`"),"hero pricing CTA must use the pricing page");
assert.ok(selector.includes("${prefix}/pricing?language="),"language cards must open pricing with selected language");
assert.ok(formats.includes("${prefix}/pricing"),"individual lesson format must open pricing");
assert.ok(pricing.includes("packageGridRef"),"pricing language selection must visibly advance to package cards");
assert.ok(pricing.includes("${prefix}/payment?selected="),"package cards must open the dedicated payment page");
assert.ok(payment.includes("Create account & continue") && payment.includes("Vytvoriť účet a pokračovať"));
assert.ok(payment.includes("/signup?next=") && payment.includes("/login?next="),"payment page must preserve checkout intent through auth");
assert.ok(payment.includes("Secure Stripe payment") && payment.includes("Bezpečná platba cez Stripe"));
assert.ok(languagePage.includes("${prefix}/pricing?language="),"language SEO pages must use standalone pricing");
assert.ok(intentPage.includes("${prefix}/pricing?language="),"intent SEO pages must use standalone pricing");
assert.ok(groupPage.includes("${language}/contact?type=group"),"group page must lead to localized quote flow");
assert.ok(companiesPage.includes("submitCompanyQuote"),"companies page must keep working quote form");
assert.ok(footer.includes("${prefix}/pricing") && footer.includes("${prefix}/languages"),"footer must use standalone public pages");
assert.ok(proxy.includes('"payment"'),"payment page must be localized through proxy");
assert.ok(nextConfig.includes('"payment"') && nextConfig.includes('"teachers"'),"payment and teachers pages must have localized fallback rewrites");
assert.ok(checkout.includes("stripe.checkout.sessions.create"),"existing Stripe Checkout flow must remain connected");
assert.ok(checkout.includes("success_url") && checkout.includes("cancel_url"),"Stripe checkout must retain return URLs");

console.log("PASS: standalone SK/EN public pages and Stripe purchase journey are connected");