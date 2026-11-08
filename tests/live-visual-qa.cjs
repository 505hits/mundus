/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Run with Node after installing Playwright Chromium:
 *   BASE_URL=https://mundus-mundus1.vercel.app node tests/live-visual-qa.cjs
 * Checks public SK/EN routes on phone, tablet and desktop.
 * Does not log in, modify records, or simulate payments.
 */
const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");
const root = (process.env.BASE_URL || "https://mundus-mundus1.vercel.app").replace(/\/$/, "");
const routes = ["/sk","/en","/sk/pricing","/en/pricing","/sk/languages","/en/languages","/sk/group-lessons","/en/group-lessons","/sk/companies","/en/companies","/sk/teachers","/en/teachers","/sk/community","/en/community","/sk/contact","/en/contact"];
const widths = [320,390,768,1440];
const shots = path.resolve("qa-screenshots");
fs.mkdirSync(shots, { recursive: true });
(async()=>{
 const browser=await chromium.launch({headless:true});
 const failures=[];
 try {
  for(const width of widths){
   const page=await browser.newPage({viewport:{width,height:820},deviceScaleFactor:1});
   for(const route of routes){
    const errors=[];
    page.on("pageerror",onError);
    function onError(e){ errors.push(e.message); }
    try {
     const response=await page.goto(root+route,{waitUntil:"domcontentloaded",timeout:30000});
     await page.waitForTimeout(220);
     const info=await page.evaluate(()=>{
       const visibleImages=[...document.images].filter(i=>i.getBoundingClientRect().top < window.innerHeight+150 && i.getBoundingClientRect().bottom >-100);
       return {scroll:document.documentElement.scrollWidth,lang:document.documentElement.lang,
         broken:visibleImages.filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.getAttribute("src")).slice(0,4),
         h1:document.querySelector("h1")?.textContent?.trim().slice(0,90) || ""};
     });
     const state={viewport:width,route,status:response?.status(),...info,pageErrors:errors.slice(0,2)};
     console.log(JSON.stringify(state));
     if(response?.status()!==200)failures.push(`${width} ${route}: HTTP ${response?.status()}`);
     if(info.scroll>width+8)failures.push(`${width} ${route}: document overflow ${info.scroll-width}px`);
     if(info.lang!==route.split("/")[1])failures.push(`${width} ${route}: unexpected lang ${info.lang}`);
     if(info.broken.length)failures.push(`${width} ${route}: missing image(s) ${info.broken.join(",")}`);
     if(errors.length)failures.push(`${width} ${route}: script error ${errors[0]}`);
     if((width===390||width===1440)&&["/sk","/sk/group-lessons","/sk/companies","/sk/pricing","/sk/teachers"].includes(route)){
       await page.screenshot({path:path.join(shots,`${route.replaceAll("/","_")}-${width}.png`),fullPage:true});
     }
    }catch(e){failures.push(`${width} ${route}: ${e.message}`);}
    page.off("pageerror",onError);
   }
   await page.close();
  }
 }finally{await browser.close();}
 console.log("VISUAL_QA_FAILURES",failures.length);
 failures.forEach(f=>console.error("FAIL",f));
 assert.equal(failures.length,0,"Public site browser checks must pass");
})().catch(e=>{console.error(e);process.exit(1)});
