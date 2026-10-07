begin;

do $$
declare
  p record;
  q text;
  c text;
  alter_sql text;
begin
  for p in
    select schemaname, tablename, policyname, qual, with_check
    from pg_policies
    where schemaname='public'
      and (
        coalesce(qual,'') like '%auth.uid()%'
        or coalesce(with_check,'') like '%auth.uid()%'
        or coalesce(qual,'') like '%is_active_admin()%'
        or coalesce(with_check,'') like '%is_active_admin()%'
        or coalesce(qual,'') like '%mundus_active_portal_account()%'
        or coalesce(with_check,'') like '%mundus_active_portal_account()%'
        or coalesce(qual,'') like '%mundus_is_teacher_user()%'
        or coalesce(with_check,'') like '%mundus_is_teacher_user()%'
        or coalesce(qual,'') like '%mundus_followup_admin()%'
        or coalesce(with_check,'') like '%mundus_followup_admin()%'
      )
  loop
    q := p.qual;
    c := p.with_check;

    if q is not null then
      q := replace(q, '( SELECT auth.uid() AS uid)', '__UID_SELECT_ALIAS__');
      q := replace(q, '(select auth.uid())', '__UID_SELECT__');
      q := replace(q, '(select public.is_active_admin())', '__ADMIN_SELECT__');
      q := replace(q, '(select public.mundus_active_portal_account())', '__PORTAL_SELECT__');
      q := replace(q, '(select public.mundus_is_teacher_user())', '__TEACHER_SELECT__');
      q := replace(q, '(select public.mundus_followup_admin())', '__FOLLOWUP_SELECT__');

      q := replace(q, 'auth.uid()', '(select auth.uid())');
      q := replace(q, 'is_active_admin()', '(select public.is_active_admin())');
      q := replace(q, 'mundus_active_portal_account()', '(select public.mundus_active_portal_account())');
      q := replace(q, 'mundus_is_teacher_user()', '(select public.mundus_is_teacher_user())');
      q := replace(q, 'mundus_followup_admin()', '(select public.mundus_followup_admin())');

      q := replace(q, '__UID_SELECT_ALIAS__', '( SELECT auth.uid() AS uid)');
      q := replace(q, '__UID_SELECT__', '(select auth.uid())');
      q := replace(q, '__ADMIN_SELECT__', '(select public.is_active_admin())');
      q := replace(q, '__PORTAL_SELECT__', '(select public.mundus_active_portal_account())');
      q := replace(q, '__TEACHER_SELECT__', '(select public.mundus_is_teacher_user())');
      q := replace(q, '__FOLLOWUP_SELECT__', '(select public.mundus_followup_admin())');
    end if;

    if c is not null then
      c := replace(c, '( SELECT auth.uid() AS uid)', '__UID_SELECT_ALIAS__');
      c := replace(c, '(select auth.uid())', '__UID_SELECT__');
      c := replace(c, '(select public.is_active_admin())', '__ADMIN_SELECT__');
      c := replace(c, '(select public.mundus_active_portal_account())', '__PORTAL_SELECT__');
      c := replace(c, '(select public.mundus_is_teacher_user())', '__TEACHER_SELECT__');
      c := replace(c, '(select public.mundus_followup_admin())', '__FOLLOWUP_SELECT__');

      c := replace(c, 'auth.uid()', '(select auth.uid())');
      c := replace(c, 'is_active_admin()', '(select public.is_active_admin())');
      c := replace(c, 'mundus_active_portal_account()', '(select public.mundus_active_portal_account())');
      c := replace(c, 'mundus_is_teacher_user()', '(select public.mundus_is_teacher_user())');
      c := replace(c, 'mundus_followup_admin()', '(select public.mundus_followup_admin())');

      c := replace(c, '__UID_SELECT_ALIAS__', '( SELECT auth.uid() AS uid)');
      c := replace(c, '__UID_SELECT__', '(select auth.uid())');
      c := replace(c, '__ADMIN_SELECT__', '(select public.is_active_admin())');
      c := replace(c, '__PORTAL_SELECT__', '(select public.mundus_active_portal_account())');
      c := replace(c, '__TEACHER_SELECT__', '(select public.mundus_is_teacher_user())');
      c := replace(c, '__FOLLOWUP_SELECT__', '(select public.mundus_followup_admin())');
    end if;

    alter_sql := format('alter policy %I on %I.%I', p.policyname, p.schemaname, p.tablename);
    if q is not null then alter_sql := alter_sql || format(' using (%s)', q); end if;
    if c is not null then alter_sql := alter_sql || format(' with check (%s)', c); end if;
    execute alter_sql;
  end loop;
end $$;

commit;
