import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { firstPackageAmountCents, PACKAGE_PRICES } from "../src/lib/package-catalog.ts";

const purchase = readFileSync(new URL("../src/components/PurchasePackages.tsx", import.meta.url), "utf8");
const pricingSection = readFileSync(new URL("../src/components/PricingSection.tsx", import.meta.url), "utf8");
const nav = readFileSync(new URL("../src/components/Navbar.tsx", import.meta.url), "utf8");
const translations = readFileSync(new URL("../src/data/translations.ts", import.meta.url), "utf8");

assert.deepEqual(
  PACKAGE_PRICES.map(item => [item.durationMinutes, item.lessons, item.amountCents]),
  [
    [45,1,2400],[45,5,11500],[45,10,22000],[45,20,41500],[45,30,59500],
    [60,1,2800],[60,5,13500],[60,10,26000],[60,20,49000],[60,30,70500],
  ],
  "public package catalog must contain approved 45- and 60-minute prices",
);

assert.ok(purchase.includes("PACKAGE_PRICES.filter"), "public pricing cards must render from the shared package catalog filtered by duration");
assert.ok(purchase.includes("firstPackageAmountCents(amountCents)"), "first-package display must derive the 10% discount from the shared catalog");
assert.deepEqual(PACKAGE_PRICES.filter(x=>x.durationMinutes===45).map(x=>firstPackageAmountCents(x.amountCents)),[2160,10350,19800,37350,53550],"45-minute first-package prices must be calculated automatically and rounded to cents");
assert.deepEqual(PACKAGE_PRICES.filter(x=>x.durationMinutes===60).map(x=>firstPackageAmountCents(x.amountCents)),[2520,12150,23400,44100,63450],"60-minute first-package prices must be calculated automatically");
assert.equal(purchase.includes("line-through"), false, "regular package prices must not be presented as obsolete crossed-out prices");
assert.ok(purchase.includes("packages do not renew automatically") || purchase.includes("Packages do not renew automatically"));
assert.ok(purchase.includes("Bez predplatného"), "Slovak pricing must explain there is no subscription");
assert.ok(purchase.includes("No subscription"), "English pricing must explain there is no subscription");
assert.ok(purchase.includes('href="/companies"'), "business buyers must be routed to the dedicated company offer");
assert.ok(purchase.includes("lessons === 10"), "10-lesson package remains the neutral recommended package");
assert.ok(purchase.includes("45 min") || purchase.includes("[45,60]"), "public pricing must expose 45-minute lessons");
assert.ok(purchase.includes("60 min") || purchase.includes("[45,60]"), "public pricing must expose 60-minute lessons");
assert.ok(pricingSection.includes('bg-[#FAFAF9]'), "public pricing should use the same warm portal background");
assert.ok(nav.includes("${prefix}/#pricing"), "navigation should have one clear localized pricing destination");
assert.ok(nav.includes("${prefix}/companies"),"companies must have a distinct localized top-level navigation treatment");
assert.equal(nav.includes("Kúpiť hodiny"), false, "navigation must not duplicate pricing with a second buy-lessons item");
assert.ok(translations.includes("10% off"), "English copy must clearly explain the first-package discount");
assert.ok(translations.includes("zľavu 10 %"), "Slovak copy must clearly explain the first-package discount");
assert.ok(translations.includes("one simple portal"), "English homepage must position the portal as part of the service");
assert.ok(translations.includes("jednom jednoduchom portáli"), "Slovak homepage must position the portal as part of the service");

console.log("PASS: public pricing and homepage positioning match the Mundus portal strategy");
