import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read=(p)=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const sitemap=read("src/app/sitemap.ts");
const robots=read("src/app/robots.ts");
const layout=read("src/app/layout.tsx");
const structured=read("src/components/MundusStructuredData.tsx");
const home=read("src/app/page.tsx");
const hero=read("src/components/Hero.tsx");
const formats=read("src/components/LearningFormatsSection.tsx");

for(const route of ["/group-lessons","/companies","/contact"]) assert.ok(sitemap.includes(route));
assert.ok(robots.includes("/admin/") && robots.includes("/teacher/") && robots.includes("/company/"));
assert.ok(robots.includes("sitemap.xml"));
assert.ok(layout.includes("summary_large_image") && layout.includes("/logo-removebg-preview.png"));
assert.ok(structured.includes('"@type":"WebSite"') && structured.includes('"@type":"Service"'));
assert.ok(structured.includes("#group-lessons") && structured.includes("#company-training"));
assert.equal(home.includes("FeaturesBento"),false,"redundant feature block should stay off the homepage");
assert.ok(home.indexOf("<LearningFormatsSection") < home.indexOf("<LanguageSelector"),"lesson formats should be front-loaded for scanning");
assert.ok(hero.includes("tracking-[-0.045em]") && hero.includes("Everything for your lessons in one place"));
assert.ok(formats.includes("Three formats. One simple experience."));
for(const p of ["src/app/(portal)/layout.tsx","src/app/(teacher)/layout.tsx","src/app/(admin)/layout.tsx","src/app/(company)/layout.tsx"]){
 const content=read(p);assert.ok(content.includes("index: false")&&content.includes("follow: false"),p+" must stay noindex");
}
console.log("PASS: design hierarchy and technical SEO safeguards");
