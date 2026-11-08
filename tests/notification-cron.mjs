import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const file=JSON.parse(readFileSync(new URL("../vercel.json",import.meta.url),"utf8"));
const worker=readFileSync(new URL("../src/app/api/notifications/process/route.ts",import.meta.url),"utf8");
assert.ok(file.crons?.some(job=>job.path==="/api/notifications/process"&&job.schedule==="0 7 * * *"),"secure daily notification runner must be scheduled");
assert.ok(worker.includes("MUNDUS_NOTIFICATION_SECRET || process.env.CRON_SECRET"),"job must support Vercel-generated Authorization header");
assert.ok(worker.includes("timingSafeEqual")&&worker.includes("Bearer ${secret}"),"job must reject unauthorized callers");
assert.ok(worker.includes('MUNDUS_EMAIL_NOTIFICATIONS_ENABLED!=="true"'),"mail worker must remain disabled without explicit activation");
console.log("PASS: Vercel Cron scheduled, protected, and fail-closed while SMTP is inactive");
