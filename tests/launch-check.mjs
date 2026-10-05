import assert from 'node:assert/strict';import {spawnSync} from 'node:child_process';
import {PGlite} from '@electric-sql/pglite';import {readFileSync} from 'node:fs';
const check=env=>spawnSync(process.execPath,['scripts/launch-check.mjs'],{env,encoding:'utf8'});
assert.equal(check({}).status,1);
const configured={NEXT_PUBLIC_SUPABASE_URL:'https://database.invalid',NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:'DO_NOT_PRINT_PUBLIC',SUPABASE_SERVICE_ROLE_KEY:'DO_NOT_PRINT_PRIVATE',MUNDUS_SITE_URL:'https://preview.invalid'};
let result=check(configured);assert.match(result.stdout,/INFO Student signup disabled/);assert.match(result.stdout,/INFO Teacher invitations disabled/);assert.equal(result.status,0);assert.ok(!result.stdout.includes('DO_NOT_PRINT'));
result=check({...configured,MUNDUS_PAYMENTS_ENABLED:'true',STRIPE_RESTRICTED_KEY:'rk_live_DO_NOT_PRINT',STRIPE_WEBHOOK_SECRET:'whsec_DO_NOT_PRINT'});assert.equal(result.status,1,'live key cannot pass test mode check');assert.ok(!result.stdout.includes('DO_NOT_PRINT'));
result=check({...configured,MUNDUS_EMAIL_NOTIFICATIONS_ENABLED:'true',MUNDUS_SMTP_HOST:'smtp.invalid',MUNDUS_SMTP_USER:'DO_NOT_PRINT',MUNDUS_SMTP_PASSWORD:'DO_NOT_PRINT',MUNDUS_EMAIL_FROM:'notifications@example.invalid',MUNDUS_NOTIFICATION_SECRET:'x'.repeat(32)});assert.equal(result.status,0);assert.ok(!result.stdout.includes('DO_NOT_PRINT'));
for(const flag of ['MUNDUS_SELF_SIGNUP_ENABLED','MUNDUS_INVITATIONS_ENABLED','MUNDUS_PAYMENTS_ENABLED','MUNDUS_PAYMENTS_LIVE_ENABLED','MUNDUS_EMAIL_NOTIFICATIONS_ENABLED']) {
 const invalid=check({...configured,[flag]:'TRUE'});assert.equal(invalid.status,1);assert.ok(!invalid.stdout.includes('DO_NOT_PRINT'));
}
result=check({...configured,MUNDUS_SELF_SIGNUP_ENABLED:'true',MUNDUS_INVITATIONS_ENABLED:'true'});assert.equal(result.status,0);assert.match(result.stdout,/INFO Student signup enabled/);assert.match(result.stdout,/INFO Teacher invitations enabled/);
const db=new PGlite();await db.exec(`create role anon;create role authenticated;create role service_role;create table lesson_reports(id uuid);create table lesson_packages(total_lessons integer,used_lessons integer,remaining_lessons integer);insert into lesson_packages values(5,2,3);`);
const preflight=readFileSync(new URL('../supabase/launch-preflight.sql',import.meta.url),'utf8');
let audit=await db.exec(preflight);
const reportGrants=results=>results.flatMap(r=>r.rows).find(r=>r.table_name==='lesson_reports' && 'client_insert' in r);
assert.equal(reportGrants(audit).client_select,false);assert.equal(reportGrants(audit).client_insert,false);assert.equal(reportGrants(audit).client_update,false);
await db.exec('grant select,insert,update on lesson_reports to authenticated');
audit=await db.exec(preflight);assert.equal(reportGrants(audit).client_select,true);assert.equal(reportGrants(audit).client_insert,true);assert.equal(reportGrants(audit).client_update,true);
assert.deepEqual((await db.query('select * from lesson_packages')).rows,[{total_lessons:5,used_lessons:2,remaining_lessons:3}]);await db.close();
console.log('PASS: redacted configuration checks, key mode mismatch and read-only preflight with missing schemas');
