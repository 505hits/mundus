import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
const lessonId="11111111-1111-4111-8111-111111111111";
const sql=readFileSync(new URL("../supabase/preview-lesson-accounting-check.sql",import.meta.url),"utf8").replace("REPLACE_WITH_DISPOSABLE_PREVIEW_LESSON_UUID",lessonId);
async function fixture(mode) {
  const db=new PGlite();
  await db.exec(`
    create table lesson_packages(id uuid primary key,student_id uuid,total_lessons int,used_lessons int,remaining_lessons int,status text);
    create table lessons(id uuid primary key,student_id uuid,package_id uuid,status text,scheduled_at timestamptz,updated_at timestamptz);
    insert into lesson_packages values ('22222222-2222-4222-8222-222222222222','33333333-3333-4333-8333-333333333333',5,1,4,'active');
    insert into lessons values ('${lessonId}','33333333-3333-4333-8333-333333333333','22222222-2222-4222-8222-222222222222','scheduled',now()-interval '2 days',now());
  `);
  if(mode!=="missing") {
    const condition=mode==="repeat" ? "new.status='completed'" : mode==="cancel" ? "new.status in ('completed','teacher_cancelled') and old.status is distinct from new.status" : "new.status='completed' and old.status is distinct from 'completed'";
    await db.exec(`create function fixture_accounting() returns trigger language plpgsql as $$ begin
      if ${condition} then update lesson_packages set used_lessons=used_lessons+1,remaining_lessons=remaining_lessons-1 where id=new.package_id; end if;
      return new; end $$;
      create trigger accounting after update on lessons for each row execute function fixture_accounting();`);
  }
  return db;
}
for(const mode of ["correct","missing","repeat","cancel"]) {
  const db=await fixture(mode);
  if(mode==="correct") await db.exec(sql);
  else {
    await assert.rejects(db.exec(sql),mode==="missing" ? /exactly one/ : mode==="repeat" ? /repeated completion/ : /cancellation/);
    await db.exec("rollback");
  }
  const pkg=(await db.query("select used_lessons,remaining_lessons from lesson_packages")).rows[0];
  assert.deepEqual(pkg,{used_lessons:1,remaining_lessons:4},"probe must leave original counters intact");
  assert.equal((await db.query("select status from lessons")).rows[0].status,"scheduled");
  await db.close();
}
console.log("PASS: rollback-only preview accounting probe detects missing/repeated/cancellation deductions without retaining fixture changes");
