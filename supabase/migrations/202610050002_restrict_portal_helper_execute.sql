begin;

revoke execute on function public.mundus_active_portal_account() from anon;
grant execute on function public.mundus_active_portal_account() to authenticated;

commit;
