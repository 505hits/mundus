import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const db=new PGlite();
const admin='00000000-0000-4000-8000-000000000001',student='00000000-0000-4000-8000-000000000002',teacher='00000000-0000-4000-8000-000000000003';
await db.exec(`create role anon;create role authenticated;create schema auth;create function auth.uid() returns uuid language sql as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;create table profiles(id uuid primary key,role text,status text);create table auth.users(id uuid primary key,email_confirmed_at timestamptz);grant usage on schema auth to authenticated;insert into profiles values('${admin}','admin','active'),('${student}','student','active'),('${teacher}','teacher','active');insert into auth.users values('${admin}',now()),('${student}',now()),('${teacher}',now());`);
const migration=readFileSync(new URL('../supabase/migrations/202610040001_renewal_followups.sql',import.meta.url),'utf8');await db.exec(migration);await db.exec(migration);
async function login(id){await db.exec(`reset role;set request.jwt.claim.sub='${id}';set role authenticated`);}
await login(admin);
await db.query("insert into renewal_followups(student_id,status,note,updated_by) values($1,'waiting','private',$2)",[student,teacher]);
const row=(await db.query('select * from renewal_followups')).rows[0];assert.equal(row.updated_by,admin);
assert.equal((await db.query("update renewal_followups set status='contacted' where student_id=$1 and updated_at=$2 returning student_id",[student,row.updated_at])).rows.length,1);
assert.equal((await db.query("update renewal_followups set note='stale' where student_id=$1 and updated_at=$2 returning student_id",[student,row.updated_at])).rows.length,0);
await assert.rejects(db.query("insert into renewal_followups(student_id,status,updated_by) values($1,'waiting',$2)",[teacher,admin]),/Student required/);
for(const id of [student,teacher]){await login(id);assert.equal((await db.query('select * from renewal_followups')).rows.length,0);await assert.rejects(db.query("insert into renewal_followups(student_id,status,updated_by) values($1,'waiting',$2)",[student,id]),/row-level security/);}
await db.exec(`reset role;update profiles set status='inactive' where id='${admin}'`);await login(admin);assert.equal((await db.query('select * from renewal_followups')).rows.length,0);
await db.exec(`reset role;update profiles set status='active' where id='${admin}';update auth.users set email_confirmed_at=null where id='${admin}'`);await login(admin);assert.equal((await db.query('select * from renewal_followups')).rows.length,0);
await db.exec('reset role;set role anon');await assert.rejects(db.query('select * from renewal_followups'),/permission denied/);
await db.close();console.log('PASS: private owner followups, verified active admin, stale edits, actor protection and migration reruns');
