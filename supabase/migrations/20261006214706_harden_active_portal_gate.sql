begin;

alter policy "Active verified portal account required" on public.learning_files to authenticated;
alter policy "Active verified portal account required" on public.lesson_packages to authenticated;
alter policy "Active verified portal account required" on public.lesson_reports to authenticated;
alter policy "Active verified portal account required" on public.lessons to authenticated;
alter policy "Active verified portal account required" on public.payment_orders to authenticated;
alter policy "Active verified portal account required" on public.placement_results to authenticated;
alter policy "Active verified portal account required" on public.schedule_change_requests to authenticated;
alter policy "Active verified portal account required" on public.student_onboarding to authenticated;

revoke execute on function public.mundus_active_portal_account() from anon;

commit;
