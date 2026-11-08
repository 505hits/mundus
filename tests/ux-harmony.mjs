import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read=(p)=>readFileSync(new URL("../"+p,import.meta.url),"utf8");

const home=read("src/app/page.tsx");
const nav=read("src/components/Navbar.tsx");
const languages=read("src/components/LanguageSelector.tsx");
const portalNav=read("src/components/PortalNav.tsx");
const dashboard=read("src/app/(portal)/dashboard/page.tsx");
const layout=read("src/app/layout.tsx");
const css=read("src/app/globals.css");

assert.ok(languages.includes("flagcdn.com") && languages.includes("flagForLanguage"),"language section must show the user-requested language flags");
assert.equal(nav.includes("tel:+421904082794"),false,"primary navbar must stay focused on navigation and purchase");
assert.ok(home.indexOf("<PricingSection") < home.indexOf("<InstagramHomepageSpotlight"),"pricing should appear before the curated community gallery");
assert.ok(portalNav.includes('!["/feedback", "/level-test", "/progress-test"].includes(item.href)'),"mobile nav must stay focused on five core destinations");
assert.ok(portalNav.includes("fixed left-0 right-0 top-0"),"mobile portal needs a consistent top bar");
assert.ok(dashboard.includes("Quick navigation"),"dashboard must expose obvious task shortcuts");
assert.ok(layout.includes("45 alebo 60 minút"),"SEO description must reflect both lesson durations");
assert.equal(home.match(/<FloatingCTA/g)?.length ?? 0,0,"floating CTA is global and must not be duplicated on homepage");
assert.ok(css.includes("prefers-reduced-motion: reduce"),"global UI must respect reduced-motion preferences");

console.log("PASS: public site and student dashboard preserve the streamlined Mundus UX");
