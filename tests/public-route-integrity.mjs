import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read=(p)=>readFileSync(new URL("../"+p,import.meta.url),"utf8");

const nav=read("src/components/Navbar.tsx");
const hero=read("src/components/Hero.tsx");
const formats=read("src/components/LearningFormatsSection.tsx");
const selector=read("src/components/LanguageSelector.tsx");
const purchase=read("src/components/PurchasePackages.tsx");
const footer=read("src/components/Footer.tsx");
const proxy=read("proxy.ts");
const nextConfig=read("next.config.ts");
const companies=read("src/app/companies/page.tsx");
const companyActions=read("src/app/companies/actions.ts");
const groups=read("src/app/group-lessons/page.tsx");
const languages=read("src/app/languages/page.tsx");
const languageDetail=read("src/app/languages/[slug]/page.tsx");
const contact=read("src/app/contact/page.tsx");
const contactActions=read("src/app/contact/actions.ts");

assert.ok(nav.includes("${prefix}/#languages"),"primary purchase CTA must begin with language selection");
assert.ok(hero.includes('href="#languages"'));
assert.ok(hero.includes('href="#pricing"'));
assert.ok(formats.includes("${prefix}/#languages"),"individual format CTA must start with language selection");
assert.ok(formats.includes("${prefix}/group-lessons"));
assert.ok(formats.includes("${prefix}/companies"));
assert.ok(selector.includes("/?language=") && selector.includes("#pricing"));
assert.ok(purchase.includes("focusLanguageSelect"),"package CTA without language must guide user to selector");
assert.ok(purchase.includes("Continue to payment") && purchase.includes("Pokračovať k platbe"));
assert.ok(footer.includes("${prefix}/#learning-formats"));
assert.ok(footer.includes("${prefix}/#teachers"));
assert.ok(footer.includes("${prefix}/#pricing"));
assert.ok(proxy.includes('"prices"'),"localized legacy prices route must rewrite normally");
assert.ok(nextConfig.includes('"group-lessons"') && nextConfig.includes('"companies"') && nextConfig.includes('"languages"'),"localized public routes must have config-level fallback rewrites");
assert.ok(nextConfig.includes('source: "/sk"') && nextConfig.includes('source: "/en"'),"localized homepage routes must have config-level fallbacks");
assert.ok(companies.includes('href="#quote"'));
assert.ok(companies.includes('name="ui_language" value={language}'));
assert.ok(companyActions.includes('const base=`/${uiLanguage}/companies`'));
assert.ok(groups.includes("/contact?type=group"));
assert.ok(languages.includes("<LanguageSelector/>"));
assert.ok(languageDetail.includes("/?language=${encodeURIComponent(config.value)}#pricing"));
assert.ok(contact.includes('name="ui_language" value={language}'));
assert.ok(contactActions.includes('const base = `/${uiLanguage}/contact`'));

console.log("PASS: public CTA destinations, localized pages and form redirects are consistent");