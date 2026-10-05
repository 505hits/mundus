begin;

create index if not exists portal_email_outbox_package_id_idx on public.portal_email_outbox(package_id);
create index if not exists portal_email_outbox_recipient_id_idx on public.portal_email_outbox(recipient_id);
create index if not exists portal_email_outbox_student_id_idx on public.portal_email_outbox(student_id);
create index if not exists portal_email_outbox_pending_idx
  on public.portal_email_outbox(status,available_at,created_at)
  where status in ('pending','sending');

commit;
