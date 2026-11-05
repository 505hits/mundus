begin;

alter table public.student_onboarding
  add column if not exists lessons_per_week smallint;

alter table public.student_onboarding
  drop constraint if exists student_onboarding_lessons_per_week_check;

alter table public.student_onboarding
  add constraint student_onboarding_lessons_per_week_check
  check (lessons_per_week is null or lessons_per_week between 1 and 5);

commit;
