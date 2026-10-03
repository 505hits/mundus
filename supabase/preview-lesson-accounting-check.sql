-- PREVIEW ONLY. Run the entire file in one SQL-editor execution.
-- Use an isolated preview database with a disposable overdue scheduled lesson,
-- linked to a disposable active package with at least two credits.
-- Do not use a real student's lesson or a production database.
-- This tests existing accounting; it installs no deduction trigger.
-- Database writes roll back. External effects from custom triggers do not:
-- disable external workers/webhooks in the isolated preview first.
-- Replace the single UUID below. Never change the final ROLLBACK to COMMIT.
begin;
set local lock_timeout = '5s';
set local statement_timeout = '30s';
select set_config('mundus.preview_fixture_lesson_id', 'REPLACE_WITH_DISPOSABLE_PREVIEW_LESSON_UUID', true);

create temporary table mundus_accounting_baseline on commit drop as
select l.id as lesson_id, l.package_id, p.total_lessons, p.used_lessons,
       p.remaining_lessons, p.status as package_status, l.scheduled_at
from public.lessons l
join public.lesson_packages p on p.id=l.package_id and p.student_id=l.student_id
where l.id=current_setting('mundus.preview_fixture_lesson_id')::uuid
  and l.status='scheduled' and l.scheduled_at < now()
  and p.status='active' and p.remaining_lessons >= 2
  and p.used_lessons >= 0 and p.used_lessons+p.remaining_lessons=p.total_lessons;

do $$ begin
  if (select count(*) from mundus_accounting_baseline) <> 1 then
    raise exception 'Fixture must be an overdue scheduled preview lesson linked to a consistent active package with >=2 credits';
  end if;
end $$;
-- Lock fixture rows so another preview operation cannot change the comparison.
select l.id from public.lessons l join mundus_accounting_baseline b on b.lesson_id=l.id for update of l;
select p.id from public.lesson_packages p join mundus_accounting_baseline b on b.package_id=p.id for update of p;

savepoint schedule_probe;
update public.lessons set status='rescheduled', scheduled_at=now()+interval '1 day',updated_at=now()
where id=(select lesson_id from mundus_accounting_baseline);
do $$ begin
  if exists(select 1 from public.lesson_packages p join mundus_accounting_baseline b on b.package_id=p.id
    where p.used_lessons is distinct from b.used_lessons or p.remaining_lessons is distinct from b.remaining_lessons
      or p.status is distinct from b.package_status or p.total_lessons is distinct from b.total_lessons) then
    raise exception 'FAIL: rescheduling changed package credits';
  end if;
end $$;
rollback to savepoint schedule_probe;

savepoint cancel_probe;
update public.lessons set status='teacher_cancelled',updated_at=now()
where id=(select lesson_id from mundus_accounting_baseline);
do $$ begin
  if exists(select 1 from public.lesson_packages p join mundus_accounting_baseline b on b.package_id=p.id
    where p.used_lessons is distinct from b.used_lessons or p.remaining_lessons is distinct from b.remaining_lessons
      or p.status is distinct from b.package_status or p.total_lessons is distinct from b.total_lessons) then
    raise exception 'FAIL: teacher cancellation charged package credits';
  end if;
end $$;
rollback to savepoint cancel_probe;

update public.lessons set status='completed',updated_at=now()
where id=(select lesson_id from mundus_accounting_baseline);
do $$ begin
  if not exists(select 1 from public.lesson_packages p join mundus_accounting_baseline b on b.package_id=p.id
    where p.used_lessons=b.used_lessons+1 and p.remaining_lessons=b.remaining_lessons-1
      and p.total_lessons=b.total_lessons and p.status='active') then
    raise exception 'FAIL: completing a lesson must use exactly one package credit';
  end if;
end $$;

update public.lessons set status='completed',updated_at=now()
where id=(select lesson_id from mundus_accounting_baseline);
do $$ begin
  if not exists(select 1 from public.lesson_packages p join mundus_accounting_baseline b on b.package_id=p.id
    where p.used_lessons=b.used_lessons+1 and p.remaining_lessons=b.remaining_lessons-1
      and p.total_lessons=b.total_lessons and p.status='active') then
    raise exception 'FAIL: repeated completion charged again or changed package accounting';
  end if;
end $$;
select 'PASS: preview reschedule/cancel unchanged; completion deducts once; repeated completion unchanged. All database writes rolled back.' as result;
rollback;
