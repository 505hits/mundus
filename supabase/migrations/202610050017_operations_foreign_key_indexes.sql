begin;

create index if not exists admin_profile_notes_created_by_idx
  on public.admin_profile_notes(created_by);

create index if not exists lessons_attendance_marked_by_idx
  on public.lessons(attendance_marked_by)
  where attendance_marked_by is not null;

create index if not exists teacher_pay_rates_created_by_idx
  on public.teacher_pay_rates(created_by)
  where created_by is not null;

commit;
