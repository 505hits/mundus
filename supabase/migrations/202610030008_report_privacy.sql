-- Students receive only shared report fields through this own-account RPC.
-- A restrictive policy also protects against legacy broad SELECT policies.
begin;
alter table public.lesson_reports enable row level security;
drop policy if exists "Report private fields require staff access" on public.lesson_reports;
create policy "Report private fields require staff access"
on public.lesson_reports as restrictive for select to public
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.status = 'active'
      and (
        p.role = 'admin'
        or (p.role = 'teacher' and teacher_id = auth.uid()
          and exists (
            select 1 from public.lessons l
            where l.id = lesson_reports.lesson_id
              and l.teacher_id = auth.uid()
              and l.student_id = lesson_reports.student_id
          ))
      )
  )
);

-- Restrictive writes also constrain broad pre-existing teacher report policies.
drop policy if exists "Report writes require completed assigned lesson" on public.lesson_reports;
create policy "Report writes require completed assigned lesson"
on public.lesson_reports as restrictive for insert to authenticated
with check (
  exists (select 1 from public.profiles p where p.id=auth.uid() and p.status='active'
    and (p.role='admin' or (p.role='teacher' and teacher_id=auth.uid()
      and exists (select 1 from public.lessons l where l.id=lesson_reports.lesson_id
        and l.teacher_id=auth.uid() and l.student_id=lesson_reports.student_id and l.status='completed'))))
);
drop policy if exists "Report updates require completed assigned lesson" on public.lesson_reports;
create policy "Report updates require completed assigned lesson"
on public.lesson_reports as restrictive for update to authenticated
using (
  exists (select 1 from public.profiles p where p.id=auth.uid() and p.status='active'
    and (p.role='admin' or (p.role='teacher' and teacher_id=auth.uid()
      and exists (select 1 from public.lessons l where l.id=lesson_reports.lesson_id
        and l.teacher_id=auth.uid() and l.student_id=lesson_reports.student_id and l.status='completed'))))
)
with check (
  exists (select 1 from public.profiles p where p.id=auth.uid() and p.status='active'
    and (p.role='admin' or (p.role='teacher' and teacher_id=auth.uid()
      and exists (select 1 from public.lessons l where l.id=lesson_reports.lesson_id
        and l.teacher_id=auth.uid() and l.student_id=lesson_reports.student_id and l.status='completed'))))
);

create or replace function public.student_lesson_reports()
returns table (
  id uuid, lesson_id uuid, topic text, progress text, student_note text,
  homework text, next_focus text, updated_at timestamptz
)
language sql stable security definer set search_path = ''
as $$
  select r.id, r.lesson_id, r.topic, r.progress, r.student_note,
         r.homework, r.next_focus, r.updated_at
  from public.lesson_reports r
  where r.student_id = auth.uid()
    and exists (
      select 1 from public.profiles p
      join auth.users u on u.id = p.id
      where p.id = auth.uid() and p.role = 'student' and p.status = 'active'
        and u.email_confirmed_at is not null
    );
$$;
revoke all on function public.student_lesson_reports() from public, anon;
grant execute on function public.student_lesson_reports() to authenticated;
commit;
