begin;

drop policy if exists "Admins can manage packages" on public.lesson_packages;
drop policy if exists "Students can view own packages" on public.lesson_packages;
drop policy if exists "Teachers can view assigned student packages" on public.lesson_packages;
create policy "Package read access" on public.lesson_packages for select to authenticated
using ((select public.is_active_admin()) or student_id=(select auth.uid()) or public.teacher_is_assigned_to_student(student_id));
create policy "Admins can insert packages" on public.lesson_packages for insert to authenticated
with check ((select public.is_active_admin()));
create policy "Admins can update packages" on public.lesson_packages for update to authenticated
using ((select public.is_active_admin())) with check ((select public.is_active_admin()));
create policy "Admins can delete packages" on public.lesson_packages for delete to authenticated
using ((select public.is_active_admin()));

drop policy if exists "Admins can manage lesson reports" on public.lesson_reports;
drop policy if exists "Teachers can create assigned lesson reports" on public.lesson_reports;
drop policy if exists "Students can view own lesson reports" on public.lesson_reports;
drop policy if exists "Teachers can view assigned lesson reports" on public.lesson_reports;
drop policy if exists "Teachers can update assigned lesson reports" on public.lesson_reports;
create policy "Lesson report read access" on public.lesson_reports for select to authenticated
using (
  (select public.is_active_admin())
  or student_id=(select auth.uid())
  or (teacher_id=(select auth.uid()) and exists (
    select 1 from public.lessons l
    where l.id=lesson_reports.lesson_id and l.teacher_id=(select auth.uid()) and l.student_id=lesson_reports.student_id
  ))
);
create policy "Lesson report insert access" on public.lesson_reports for insert to authenticated
with check (
  (select public.is_active_admin())
  or (teacher_id=(select auth.uid()) and exists (
    select 1 from public.lessons l
    where l.id=lesson_reports.lesson_id and l.teacher_id=(select auth.uid())
      and l.student_id=lesson_reports.student_id and l.status='completed'
  ))
);
create policy "Lesson report update access" on public.lesson_reports for update to authenticated
using (
  (select public.is_active_admin())
  or (teacher_id=(select auth.uid()) and exists (
    select 1 from public.lessons l
    where l.id=lesson_reports.lesson_id and l.teacher_id=(select auth.uid()) and l.student_id=lesson_reports.student_id
  ))
)
with check (
  (select public.is_active_admin())
  or (teacher_id=(select auth.uid()) and exists (
    select 1 from public.lessons l
    where l.id=lesson_reports.lesson_id and l.teacher_id=(select auth.uid()) and l.student_id=lesson_reports.student_id
  ))
);
create policy "Admins can delete lesson reports" on public.lesson_reports for delete to authenticated
using ((select public.is_active_admin()));

drop policy if exists "Admins can manage lessons" on public.lessons;
drop policy if exists "Teachers can create lessons for assigned students" on public.lessons;
drop policy if exists "Students can view own lessons" on public.lessons;
drop policy if exists "Teachers can view assigned lessons" on public.lessons;
drop policy if exists "Teachers can update assigned lessons" on public.lessons;
create policy "Lesson read access" on public.lessons for select to authenticated
using ((select public.is_active_admin()) or student_id=(select auth.uid()) or teacher_id=(select auth.uid()));
create policy "Lesson insert access" on public.lessons for insert to authenticated
with check ((select public.is_active_admin()) or (teacher_id=(select auth.uid()) and public.teacher_is_assigned_to_student(student_id)));
create policy "Lesson update access" on public.lessons for update to authenticated
using ((select public.is_active_admin()) or teacher_id=(select auth.uid()))
with check ((select public.is_active_admin()) or teacher_id=(select auth.uid()));
create policy "Admins can delete lessons" on public.lessons for delete to authenticated
using ((select public.is_active_admin()));

drop policy if exists "Admins can view all profiles" on public.profiles;
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Profile read access" on public.profiles for select to authenticated
using (id=(select auth.uid()) or (select public.is_active_admin()));

drop policy if exists "Admins can manage change requests" on public.schedule_change_requests;
drop policy if exists "Assigned teachers can create change requests" on public.schedule_change_requests;
drop policy if exists "Students can create own change requests" on public.schedule_change_requests;
drop policy if exists "Assigned teachers can view change requests" on public.schedule_change_requests;
drop policy if exists "Students can view own change requests" on public.schedule_change_requests;
drop policy if exists "Assigned teachers can update change requests" on public.schedule_change_requests;
drop policy if exists "Students can respond to teacher change requests" on public.schedule_change_requests;
create policy "Schedule request read access" on public.schedule_change_requests for select to authenticated
using (
  (select public.is_active_admin())
  or student_id=(select auth.uid())
  or exists (select 1 from public.lessons l where l.id=schedule_change_requests.lesson_id and l.teacher_id=(select auth.uid()))
);
create policy "Schedule request insert access" on public.schedule_change_requests for insert to authenticated
with check (
  (select public.is_active_admin())
  or (
    requested_by=(select auth.uid()) and (
      (
        student_id=(select auth.uid())
        and exists (select 1 from public.lessons l where l.id=schedule_change_requests.lesson_id and l.student_id=(select auth.uid()))
      )
      or exists (
        select 1 from public.lessons l
        where l.id=schedule_change_requests.lesson_id and l.teacher_id=(select auth.uid()) and l.student_id=schedule_change_requests.student_id
      )
    )
  )
);
create policy "Schedule request update access" on public.schedule_change_requests for update to authenticated
using (
  (select public.is_active_admin())
  or exists (select 1 from public.lessons l where l.id=schedule_change_requests.lesson_id and l.teacher_id=(select auth.uid()))
  or (student_id=(select auth.uid()) and requested_by<>(select auth.uid()))
)
with check (
  (select public.is_active_admin())
  or exists (select 1 from public.lessons l where l.id=schedule_change_requests.lesson_id and l.teacher_id=(select auth.uid()))
  or (student_id=(select auth.uid()) and requested_by<>(select auth.uid()))
);
create policy "Admins can delete change requests" on public.schedule_change_requests for delete to authenticated
using ((select public.is_active_admin()));

commit;
