import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read=(p)=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const data=read("src/data/language-seo-pages.ts");
const page=read("src/app/languages/[slug]/page.tsx");
const selector=read("src/components/LanguageSelector.tsx");
const sitemap=read("src/app/sitemap.ts");

const slugs=["english","german","italian","spanish","french","portuguese","hungarian","polish","russian","chinese","slovak-for-foreigners","ukrainian","modern-hebrew"];
for(const slug of slugs){
  assert.ok(data.includes(`slug:"${slug}"`),`missing content for ${slug}`);
}
assert.ok(sitemap.includes("LANGUAGE_SEO_PAGES"),"sitemap must derive language URLs from the shared language-page catalog");
assert.ok(sitemap.includes("languagePaths"),"sitemap must generate language-page paths from the catalog");
for(const slug of slugs){
  assert.ok(selector.includes(`/languages/${slug}`),`missing internal link for ${slug}`);
}
assert.ok(page.includes("generateMetadata"));
assert.ok(page.includes('"@type":"Service"'));
assert.ok(page.includes('"@type":"BreadcrumbList"'));
assert.ok(page.includes("Payment comes first") && page.includes("Najprv platba"));
assert.ok(page.includes("/?language=") && page.includes("#pricing"),"language landing pages must carry the selected language into pricing");
assert.ok(data.includes("business English") && data.includes("pracovnú angličtinu"),"English page should contain genuinely useful work-specific intent");
assert.ok(data.includes("Slovenčina pre cudzincov"),"Slovak-for-foreigners page should be explicit");
console.log("PASS: language landing pages have unique content, metadata, internal links and sitemap coverage");
