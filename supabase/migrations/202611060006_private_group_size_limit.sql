begin;

alter table public.contact_requests
  drop constraint if exists contact_requests_group_size_check;

alter table public.contact_requests
  add constraint contact_requests_group_size_check
  check (group_size is null or group_size between 2 and 5);

commit;