begin;

drop policy if exists teacher_monthly_feedback_student_read on public.teacher_monthly_feedback;
drop policy if exists teacher_monthly_feedback_admin_read on public.teacher_monthly_feedback;

create policy teacher_monthly_feedback_read
on public.teacher_monthly_feedback for select
to authenticated
using (
  (
    (select auth.uid()) = student_id
    and public.mundus_matching_role('student')
  )
  or public.is_active_admin()
);

commit;
