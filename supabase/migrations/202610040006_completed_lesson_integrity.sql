begin;
-- Preserve charged lesson identity/history. Trusted SQL/service corrections are
-- outside this portal guard and must reconcile accounting explicitly.
create or replace function public.guard_completed_lesson_history()
returns trigger language plpgsql security definer set search_path = pg_catalog, public, pg_temp
as $$
begin
  if auth.uid() is not null and old.status='completed' then
    if new.status is distinct from old.status
      or new.student_id is distinct from old.student_id
      or new.teacher_id is distinct from old.teacher_id
      or new.package_id is distinct from old.package_id then
      raise exception 'Completed lesson history cannot be reopened or reassigned through the portal';
    end if;
  end if;
  return new;
end;
$$;
drop trigger if exists a_guard_completed_lesson_history on public.lessons;
create trigger a_guard_completed_lesson_history before update on public.lessons
for each row execute function public.guard_completed_lesson_history();
-- Trigger/event-trigger functions are internal entry points, not client RPCs.
-- Existing triggers still run; their creator retains execution rights.
do $$ declare f record;
begin
  for f in select p.oid::regprocedure as signature from pg_proc p
    join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='public' and p.prorettype in ('pg_catalog.trigger'::regtype,'pg_catalog.event_trigger'::regtype)
  loop
    execute format('revoke execute on function %s from public, anon, authenticated',f.signature);
  end loop;
end $$;
commit;
