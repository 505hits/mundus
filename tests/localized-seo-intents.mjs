import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const proxy=read("proxy.ts");
const helper=read("src/lib/seo-locales.ts");
const sitemap=read("src/app/sitemap.ts");
const context=read("src/context/LanguageContext.tsx");
const intents=read("src/data/intent-seo-pages.ts");
const intentPage=read("src/app/learn/[slug]/page.tsx");
const languagePage=read("src/app/languages/[slug]/page.tsx");
const home=read("src/app/page.tsx");

assert.ok(proxy.includes('matcher:["/sk/:path*","/en/:path*"]'));
assert.ok(proxy.includes("mundus_language"));
assert.ok(helper.includes('"sk-SK"') && helper.includes('"en-GB"') && helper.includes('"x-default"'));
assert.ok(context.includes("router.push"));
assert.ok(context.includes("/(sk|en)"));
assert.ok(home.includes('localizedAlternates("/",language)'));
for(const slug of ["anglictina-pre-zaciatocnikov","business-english","konverzacna-anglictina","anglictina-na-cestovanie","slovencina-pre-cudzincov-a1"]){
  assert.ok(intents.includes('slug:"'+slug+'"'),"missing intent page "+slug);
}
assert.ok(intentPage.includes("localizedAlternates(path,language)"));
assert.ok(intentPage.includes("/pricing?language="));
assert.ok(languagePage.includes("related.length>0"));
assert.ok(languagePage.includes("/learn/"));
assert.ok(sitemap.includes('["sk","en"]'));
assert.ok(sitemap.includes("INTENT_SEO_PAGES"));
assert.ok(sitemap.includes("alternates:{languages"));
console.log("PASS: localized SK/EN SEO URLs, hreflang and high-intent pages are wired");