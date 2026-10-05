import {PGlite} from "@electric-sql/pglite";
import {readFileSync} from "node:fs";
import assert from "node:assert/strict";
const db=new PGlite();
await db.exec(`
create table profiles(id uuid primary key);
create table student_onboarding(
 student_id uuid primary key references profiles(id),
 language text not null check(language in ('Angličtina','Nemčina','Španielčina','Taliančina','Francúzština','Portugalčina','Ruština','Turečtina')),
 level text not null,goal text not null,completed_at timestamptz not null default now()
);
`);
await db.exec(readFileSync(new URL("../supabase/migrations/202610050004_student_matching_preferences.sql",import.meta.url),"utf8"));
const columns=(await db.query("select column_name from information_schema.columns where table_name='student_onboarding'")).rows.map(r=>r.column_name);
for(const name of ["preferred_days","preferred_time_from","preferred_time_to"]) assert.ok(columns.includes(name));
await db.exec("insert into profiles values('00000000-0000-4000-8000-000000000001')");
await db.exec("insert into student_onboarding(student_id,language,level,goal,preferred_days,preferred_time_from,preferred_time_to) values('00000000-0000-4000-8000-000000000001','Maďarčina','A1','Konverzácia',array['2','4'],'17:00','20:00')");
await assert.rejects(db.query("update student_onboarding set language='Turečtina'"),/check constraint/);
await assert.rejects(db.query("update student_onboarding set preferred_days=array['9']"),/check constraint/);
await assert.rejects(db.query("update student_onboarding set preferred_time_from='20:00',preferred_time_to='17:00'"),/check constraint/);
await db.close();
console.log("PASS: current onboarding languages and matching availability constraints");
