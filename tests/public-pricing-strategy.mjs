import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PACKAGE_PRICES } from "../src/lib/package-catalog.ts";

const purchase = readFileSync(new URL("../src/components/PurchasePackages.tsx", import.meta.url), "utf8");
const pricingSection = readFileSync(new URL("../src/components/PricingSection.tsx", import.meta.url), "utf8");
const nav = readFileSync(new URL("../src/components/Navbar.tsx", import.meta.url), "utf8");
const translations = readFileSync(new URL("../src/data/translations.ts", import.meta.url), "utf8");

assert.deepEqual(
  PACKAGE_PRICES.map(item => [item.lessons, item.amountCents]),
  [[1,2800],[5,13500],[10,26000],[20,49000],[30,70500]],
  "public package catalog must match the approved Mundus prices",
);

assert.ok(purchase.includes("PACKAGE_PRICES.map"), "public pricing cards must render from the shared package catalog");
assert.ok(purchase.includes("amountCents * 0.9"), "first-package display must derive the 10% discount from the shared catalog");
assert.equal(purchase.includes("line-through"), false, "regular package prices must not be presented as obsolete crossed-out prices");
assert.ok(purchase.includes("packages do not renew automatically") || purchase.includes("Packages do not renew automatically"));
assert.ok(purchase.includes("Bez predplatného"), "Slovak pricing must explain there is no subscription");
assert.ok(purchase.includes("No subscription"), "English pricing must explain there is no subscription");
assert.ok(purchase.includes("company invoice"), "public pricing must offer a company-invoice contact path");
assert.ok(purchase.includes("faktúru na firmu"), "Slovak pricing must offer a company-invoice contact path");
assert.ok(purchase.includes("lessons === 10"), "10-lesson package remains the neutral recommended package");
assert.ok(pricingSection.includes('bg-[#FAFAF9]'), "public pricing should use the same warm portal background");
assert.ok(nav.includes('href: "/#pricing"'), "navigation should have one clear pricing destination");
assert.equal(nav.includes("Kúpiť hodiny"), false, "navigation must not duplicate pricing with a second buy-lessons item");
assert.ok(translations.includes("10% off"), "English copy must clearly explain the first-package discount");
assert.ok(translations.includes("zľavu 10 %"), "Slovak copy must clearly explain the first-package discount");
assert.ok(translations.includes("one simple portal"), "English homepage must position the portal as part of the service");
assert.ok(translations.includes("jednom jednoduchom portáli"), "Slovak homepage must position the portal as part of the service");

console.log("PASS: public pricing and homepage positioning match the Mundus portal strategy");
