import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
const migration=readFileSync(new URL("../supabase/migrations/202610040005_verified_lesson_completion.sql",import.meta.url),"utf8");
const teacher="11111111-1111-4111-8111-111111111111",student="22222222-2222-4222-8222-222222222222",other="33333333-3333-4333-8333-333333333333",admin="44444444-4444-4444-8444-444444444444";
const packageId="55555555-5555-4555-8555-555555555555",lesson="66666666-6666-4666-8666-666666666666",second="77777777-7777-4777-8777-777777777777";
async function fixture(mode) {
 const db=new PGlite();
 await db.exec(`create role anon; create role authenticated;create schema auth;
 create function auth.uid() returns uuid language sql as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
 create table auth.users(id uuid primary key,email_confirmed_at timestamptz);
 create table profiles(id uuid primary key,role text,status text);
 create table lesson_packages(id uuid primary key,student_id uuid,total_lessons int,used_lessons int,remaining_lessons int,status text);
 create table lessons(id uuid primary key,student_id uuid,teacher_id uuid,package_id uuid,status text,scheduled_at timestamptz,updated_at timestamptz);
 create function public.is_active_admin() returns boolean language sql security definer as $$select exists(select 1 from profiles where id=auth.uid() and role='admin' and status='active')$$;
 grant usage on schema auth to authenticated;grant all on lessons,lesson_packages to authenticated;grant select on profiles to authenticated;
 insert into profiles values ('${teacher}','teacher','active'),('${student}','student','active'),('${other}','teacher','active'),('${admin}','admin','active');
 insert into auth.users select id,now() from profiles;
 insert into lesson_packages values ('${packageId}','${student}',1,0,1,'active');
 insert into lessons values ('${lesson}','${student}','${teacher}','${packageId}','scheduled',now()-interval '1 day',now()),('${second}','${student}','${teacher}','${packageId}','scheduled',now()-interval '1 day',now());
 alter table lessons enable row level security;
 create policy broad_legacy_select on lessons for select to authenticated using(true);
 create policy broad_legacy_update on lessons for update to authenticated using(true) with check(true);`);
 if(mode!=="missing") {
  const amount=mode==="double"?2:1;
  await db.exec(`create function fixture_deduct() returns trigger language plpgsql security definer as $$begin
   if new.status='completed' and old.status is distinct from 'completed' then
    update lesson_packages set used_lessons=used_lessons+${amount},remaining_lessons=remaining_lessons-${amount},status=case when remaining_lessons-${amount}=0 then 'completed' else 'active' end where id=new.package_id;
   end if; return new;end$$;
   create trigger fixture_accounting after update on lessons for each row execute function fixture_deduct();`);
 }
 await db.exec(migration);await db.exec(migration);
 return db;
}
async function actor(db,id) {await db.exec(`reset role;set request.jwt.claim.sub='${id}';set role authenticated;`);}
for(const mode of ["correct","missing","double"]) {
 const db=await fixture(mode);
 await actor(db,student);await assert.rejects(db.query("select mundus_complete_lesson($1)",[lesson]),/teacher or admin required/);
 await actor(db,other);await assert.rejects(db.query("select mundus_complete_lesson($1)",[lesson]),/Assigned lesson/);
 await actor(db,teacher);
 await assert.rejects(db.query("update lessons set status='completed' where id=$1",[lesson]),/row-level security/);
 if(mode!=="correct") {
  await assert.rejects(db.query("select mundus_complete_lesson($1)",[lesson]),/exactly one credit/);
  assert.equal((await db.query("select status from lessons where id=$1",[lesson])).rows[0].status,"scheduled");
  assert.deepEqual((await db.query("select used_lessons,remaining_lessons from lesson_packages")).rows[0],{used_lessons:0,remaining_lessons:1});
 } else {
  await db.exec("reset role;update profiles set status='inactive' where role='teacher';set role authenticated;");
  await assert.rejects(db.query("select mundus_complete_lesson($1)",[lesson]),/teacher or admin required/);
  await db.exec("reset role;update profiles set status='active' where role='teacher';update auth.users set email_confirmed_at=null where id='"+teacher+"';set role authenticated;");
  await assert.rejects(db.query("select mundus_complete_lesson($1)",[lesson]),/teacher or admin required/);
  await db.exec("reset role;update auth.users set email_confirmed_at=now();set role authenticated;");
  await db.exec("reset role;update lessons set scheduled_at=now()+interval '1 day' where id='"+lesson+"';set role authenticated;");
  await assert.rejects(db.query("select mundus_complete_lesson($1)",[lesson]),/elapsed scheduled/);
  await db.exec("reset role;update lessons set scheduled_at=now()-interval '1 day',status='teacher_cancelled' where id='"+lesson+"';set role authenticated;");
  await assert.rejects(db.query("select mundus_complete_lesson($1)",[lesson]),/elapsed scheduled/);
  await db.exec("reset role;update lessons set status='scheduled' where id='"+lesson+"';update lesson_packages set student_id='"+other+"';set role authenticated;");
  await assert.rejects(db.query("select mundus_complete_lesson($1)",[lesson]),/package with credit/);
  await db.exec("reset role;update lesson_packages set student_id='"+student+"';set role authenticated;");
  assert.equal((await db.query("select mundus_complete_lesson($1) id",[lesson])).rows[0].id,lesson);
  await db.query("select mundus_complete_lesson($1)",[lesson]);
  assert.deepEqual((await db.query("select used_lessons,remaining_lessons,status from lesson_packages")).rows[0],{used_lessons:1,remaining_lessons:0,status:"completed"});
  await assert.rejects(db.query("select mundus_complete_lesson($1)",[second]),/package with credit/);
  await actor(db,admin);assert.equal((await db.query("select mundus_complete_lesson($1) id",[lesson])).rows[0].id,lesson);
 }
 await db.exec("reset role;set role anon;");await assert.rejects(db.query("select mundus_complete_lesson($1)",[lesson]),/permission denied/);
 await db.close();
}
console.log("PASS: verified completion wraps existing deductions, rolls back missing/double accounting, protects final credit, repeats safely and denies unauthorized/direct teacher completion");
