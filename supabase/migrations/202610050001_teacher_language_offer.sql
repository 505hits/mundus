begin;

alter table public.teacher_preferences
  drop constraint if exists teacher_preferences_languages_check;

alter table public.teacher_preferences
  add constraint teacher_preferences_languages_check
  check (
    languages <@ array[
      'English','German','Spanish','Italian','French','Portuguese',
      'Hungarian','Polish','Russian','Chinese','Slovak','Ukrainian','Modern Hebrew'
    ]::text[]
  );

update public.teacher_preferences
set languages = array_remove(languages, 'Turkish'),
    updated_at = clock_timestamp()
where languages @> array['Turkish']::text[];

commit;
