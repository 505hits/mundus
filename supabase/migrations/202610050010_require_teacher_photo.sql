begin;

alter table public.teacher_public_profiles
  drop constraint if exists teacher_public_profiles_visible_content_check;

alter table public.teacher_public_profiles
  add constraint teacher_public_profiles_visible_content_check
  check (
    not website_visible or
    (
      photo_path is not null and
      char_length(btrim(headline)) >= 3 and
      char_length(btrim(bio)) >= 20 and
      cardinality(languages) > 0
    )
  );

commit;
