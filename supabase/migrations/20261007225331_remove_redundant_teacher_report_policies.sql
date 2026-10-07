begin;
drop policy if exists "Teachers can create their lesson reports" on public.lesson_reports;
drop policy if exists "Teachers can view their lesson reports" on public.lesson_reports;
drop policy if exists "Teachers can update their lesson reports" on public.lesson_reports;
commit;
