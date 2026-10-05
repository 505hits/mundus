begin;

create or replace function public.sync_lesson_attendance()
returns trigger
language plpgsql
security invoker
set search_path=public
as $$
begin
  if new.status = 'completed' then
    new.attendance_status := 'attended';
  elsif new.status in ('student_no_show','late_cancellation','student_cancelled','teacher_cancelled') then
    new.attendance_status := new.status;
  elsif new.status in ('scheduled','rescheduled') then
    new.attendance_status := null;
  end if;

  if new.attendance_status is distinct from old.attendance_status then
    new.attendance_marked_at := case when new.attendance_status is null then null else now() end;
    new.attendance_marked_by := case when new.attendance_status is null then null else auth.uid() end;
  end if;

  return new;
end;
$$;

drop trigger if exists z_sync_lesson_attendance on public.lessons;
create trigger z_sync_lesson_attendance
before update of status on public.lessons
for each row execute function public.sync_lesson_attendance();

update public.lessons
set attendance_status = case
  when status='completed' then 'attended'
  when status in ('student_no_show','late_cancellation','student_cancelled','teacher_cancelled') then status
  else null
end,
attendance_marked_at = case
  when status in ('completed','student_no_show','late_cancellation','student_cancelled','teacher_cancelled')
    then coalesce(completed_at,updated_at,scheduled_at,now())
  else null
end
where attendance_status is distinct from case
  when status='completed' then 'attended'
  when status in ('student_no_show','late_cancellation','student_cancelled','teacher_cancelled') then status
  else null
end;

commit;
