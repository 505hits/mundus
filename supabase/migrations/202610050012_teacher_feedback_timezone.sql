begin;

drop policy if exists teacher_monthly_feedback_student_insert on public.teacher_monthly_feedback;
create policy teacher_monthly_feedback_student_insert
on public.teacher_monthly_feedback for insert
to authenticated
with check (
  (select auth.uid()) = student_id
  and public.mundus_matching_role('student')
  and exists (
    select 1
    from public.lessons l
    where l.student_id = (select auth.uid())
      and l.teacher_id = teacher_monthly_feedback.teacher_id
      and l.status = 'completed'
      and (timezone('Europe/Bratislava', l.scheduled_at))::date >= teacher_monthly_feedback.feedback_month
      and (timezone('Europe/Bratislava', l.scheduled_at))::date < (teacher_monthly_feedback.feedback_month + interval '1 month')::date
  )
);

drop policy if exists teacher_monthly_feedback_student_update on public.teacher_monthly_feedback;
create policy teacher_monthly_feedback_student_update
on public.teacher_monthly_feedback for update
to authenticated
using (
  (select auth.uid()) = student_id
  and public.mundus_matching_role('student')
)
with check (
  (select auth.uid()) = student_id
  and public.mundus_matching_role('student')
  and exists (
    select 1
    from public.lessons l
    where l.student_id = (select auth.uid())
      and l.teacher_id = teacher_monthly_feedback.teacher_id
      and l.status = 'completed'
      and (timezone('Europe/Bratislava', l.scheduled_at))::date >= teacher_monthly_feedback.feedback_month
      and (timezone('Europe/Bratislava', l.scheduled_at))::date < (teacher_monthly_feedback.feedback_month + interval '1 month')::date
  )
);

commit;
