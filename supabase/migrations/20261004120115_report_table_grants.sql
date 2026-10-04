-- Staff report reads/upserts need table grants as well as row policies.
-- Existing restrictive RLS keeps students out of private report rows.
begin;
alter table public.lesson_reports enable row level security;
grant select, insert, update on public.lesson_reports to authenticated;
commit;
