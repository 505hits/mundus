begin;

alter table public.student_onboarding drop constraint if exists student_onboarding_language_check;
alter table public.student_onboarding add constraint student_onboarding_language_check
  check (language in ('Angličtina','Nemčina','Španielčina','Taliančina','Francúzština','Portugalčina','Maďarčina','Poľština','Ruština','Čínština','Slovenčina','Ukrajinčina','Moderná hebrejčina'));

alter table public.student_onboarding
  add column if not exists preferred_days text[] not null default '{}',
  add column if not exists preferred_time_from time,
  add column if not exists preferred_time_to time;

alter table public.student_onboarding drop constraint if exists student_onboarding_preferred_days_check;
alter table public.student_onboarding add constraint student_onboarding_preferred_days_check
  check (preferred_days <@ array['1','2','3','4','5','6','7']::text[]);
alter table public.student_onboarding drop constraint if exists student_onboarding_preferred_time_check;
alter table public.student_onboarding add constraint student_onboarding_preferred_time_check
  check ((preferred_time_from is null and preferred_time_to is null) or
         (preferred_time_from is not null and preferred_time_to is not null and preferred_time_from < preferred_time_to));

commit;
