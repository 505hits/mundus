import { PGlite } from "@electric-sql/pglite";
import assert from "node:assert/strict";
import { buildEmptyInstall } from "../scripts/build-empty-database-install.mjs";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
const db = new PGlite();
await db.exec(`
create role anon; create role authenticated; create role service_role bypassrls;
alter default privileges in schema public grant all on tables to anon,authenticated,service_role;
create schema auth; create schema storage;
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
create function auth.role() returns text language sql stable as $$ select nullif(current_setting('request.jwt.claim.role',true),'') $$;
grant usage on schema auth,public to anon,authenticated,service_role;
create table auth.users(id uuid primary key, email text, email_confirmed_at timestamptz, raw_user_meta_data jsonb default '{}', raw_app_meta_data jsonb default '{}');
create table storage.buckets(id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
`);
const student='00000000-0000-4000-8000-000000000001', teacher='00000000-0000-4000-8000-000000000002',
  admin='00000000-0000-4000-8000-000000000003', other='00000000-0000-4000-8000-000000000004';
await db.exec(`insert into auth.users(id,email,email_confirmed_at,raw_user_meta_data) values
('${student}','student@test.invalid',now(),'{"role":"admin","full_name":"Student"}');`);
try { await db.exec(buildEmptyInstall()); }
catch(error) { console.error('INSTALL FAILED:', error.message, error.where ?? '', error.detail ?? ''); await db.close(); process.exit(1); }
// Check static application SELECTs against the installed schema, including admin pages.
const columns = (await db.query("select table_name,column_name from information_schema.columns where table_schema='public'")).rows;
const tableColumns = new Map();
for (const row of columns) {
  if (!tableColumns.has(row.table_name)) tableColumns.set(row.table_name, new Set());
  tableColumns.get(row.table_name).add(row.column_name);
}
function tableFor(node) {
  if (!ts.isCallExpression(node) || !ts.isPropertyAccessExpression(node.expression)) return null;
  if (node.expression.name.text === 'from' && ts.isStringLiteral(node.arguments[0])) return node.arguments[0].text;
  return tableFor(node.expression.expression);
}
function checkSelections() {
  const missing = [];
  function checkList(table, selection, path) {
    const parts=[];let depth=0,start=0;
    for(let i=0;i<selection.length;i++) {
      if(selection[i]==='(') depth++;
      if(selection[i]===')') depth--;
      if(selection[i]===',' && depth===0) { parts.push(selection.slice(start,i)); start=i+1; }
    }
    parts.push(selection.slice(start));
    for(const item of parts) {
      const open=item.indexOf('(');
      if(open>=0) {
        const relation=item.slice(0,open).trim().split(':').at(-1).split('!')[0];
        checkList(relation,item.slice(open+1,item.lastIndexOf(')')),path);
      } else {
        const column=item.trim().split(':').at(-1);
        if(column && column!=='*' && !tableColumns.get(table)?.has(column)) missing.push(`${path}: ${table}.${column}`);
      }
    }
  }
  function walk(dir) {
    for (const entry of readdirSync(dir,{withFileTypes:true})) {
      const path=join(dir,entry.name);
      if(entry.isDirectory()) { walk(path); continue; }
      if(!/\.tsx?$/.test(entry.name)) continue;
      const ast=ts.createSourceFile(path,readFileSync(path,'utf8'),ts.ScriptTarget.Latest,true);
      function visit(node) {
        if(ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression) && node.expression.name.text==='select') {
          const table=tableFor(node.expression.expression), arg=node.arguments[0];
          if(table && arg && (ts.isStringLiteral(arg)||ts.isNoSubstitutionTemplateLiteral(arg))) {
            checkList(table,arg.text,path);
          }
        }
        ts.forEachChild(node,visit);
      }
      visit(ast);
    }
  }
  walk(fileURLToPath(new URL('../src/',import.meta.url)));
  assert.deepEqual(missing,[], 'Application SELECT columns must exist after a fresh install');
}
checkSelections();
assert.equal((await db.query('select role from public.profiles')).rows[0].role,'student');
// The owner must opt in to one verified account; installation never picks an administrator.
const promoteSql=readFileSync(new URL('../supabase/bootstrap-admin.sql',import.meta.url),'utf8');
await assert.rejects(db.exec(promoteSql),/Remplacez/);
await db.exec('rollback');
await db.exec(promoteSql.replace("admin_email text := 'REMPLACER_PAR_VOTRE_EMAIL'", "admin_email text := 'student@test.invalid'"));
assert.equal((await db.query('select role from profiles where id=$1',[student])).rows[0].role,'admin');
await db.exec(`set request.jwt.claim.role='service_role';update profiles set role='student' where id='${student}';set request.jwt.claim.role='';`);
await db.exec(`insert into auth.users(id,email,email_confirmed_at) values
('${teacher}','teacher@test.invalid',now()),('${admin}','admin@test.invalid',now()),('${other}','other@test.invalid',now());
set request.jwt.claim.role='service_role';
update profiles set role='teacher' where id='${teacher}'; update profiles set role='admin' where id='${admin}';
set request.jwt.claim.role='';`);
async function login(id) {
  await db.exec(`reset role;set request.jwt.claim.sub='${id}';set request.jwt.claim.role='authenticated';set role authenticated;`);
}
await login(admin);
assert.equal((await db.query('select count(*)::int n from profiles')).rows[0].n,4);
const pkg=(await db.query(`insert into lesson_packages(student_id,package_type,total_lessons,remaining_lessons) values($1,'5_lessons',5,5) returning id`,[student])).rows[0].id;
const lesson=(await db.query(`insert into lessons(student_id,teacher_id,package_id,scheduled_at,language) values($1,$2,$3,now()-interval '1 day','English') returning id`,[student,teacher,pkg])).rows[0].id;
await login(student);
assert.equal((await db.query('select count(*)::int n from profiles')).rows[0].n,1);
assert.equal((await db.query('select count(*)::int n from lessons')).rows[0].n,1);
await assert.rejects(db.query(`update profiles set role='admin' where id=$1`,[student]), /cannot be changed/);
await assert.rejects(db.query(`insert into lesson_packages(student_id,package_type,total_lessons,remaining_lessons) values($1,'5_lessons',5,5)`,[student]), /row-level security/);
await login(other);
assert.equal((await db.query('select count(*)::int n from lessons')).rows[0].n,0);
await login(teacher);
assert.equal((await db.query("select count(*)::int n from profiles where role='student'")).rows[0].n,0);
await db.query('select mundus_complete_lesson($1)',[lesson]);
await db.query('select mundus_complete_lesson($1)',[lesson]);
assert.deepEqual((await db.query('select used_lessons,remaining_lessons from lesson_packages')).rows[0],{used_lessons:1,remaining_lessons:4});
await db.query(`insert into lesson_reports(lesson_id,student_id,teacher_id,homework,private_teacher_note) values($1,$2,$3,'Shared work','Private note')`,[lesson,student,teacher]);
await login(student);
assert.equal((await db.query('select count(*)::int n from lesson_reports')).rows[0].n,0);
assert.equal((await db.query('select homework from student_lesson_reports()')).rows[0].homework,'Shared work');
await assert.rejects(db.query('select private_teacher_note from student_lesson_reports()'),/does not exist/);
await db.exec(`reset role;set request.jwt.claim.role='';set request.jwt.claim.sub='';set role anon;`);
await assert.rejects(db.query('select * from lessons'),/permission denied/);
await db.exec('reset role');
assert.equal((await db.query("select public from storage.buckets where id='mundus-learning'")).rows[0].public,false);
assert.equal((await db.query("select count(*)::int n from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relkind='r' and not c.relrowsecurity")).rows[0].n,0);
assert.equal((await db.query("select has_table_privilege('authenticated','teacher_monthly_feedback','TRUNCATE') allowed")).rows[0].allowed,false);
assert.equal((await db.query("select has_table_privilege('authenticated','contact_requests','SELECT') allowed")).rows[0].allowed,false);
await assert.rejects(db.exec(buildEmptyInstall()),/public schema is not empty/);
await db.exec('rollback');
console.log('PASS: full empty installation, Auth profiles, admin writes, role isolation, one-credit completion retry and private reports/storage');
await db.close();
