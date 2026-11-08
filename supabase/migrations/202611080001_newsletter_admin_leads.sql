begin;
alter table public.newsletter_email_outbox drop constraint if exists newsletter_email_outbox_kind_check;
alter table public.newsletter_email_outbox add constraint newsletter_email_outbox_kind_check check (kind in ('confirm','admin_notice'));
commit;
