begin;

create index if not exists learning_files_uploaded_by_idx on public.learning_files(uploaded_by);
create index if not exists lesson_packages_student_id_idx on public.lesson_packages(student_id);
create index if not exists lesson_reports_student_id_idx on public.lesson_reports(student_id);
create index if not exists lesson_reports_teacher_id_idx on public.lesson_reports(teacher_id);
create index if not exists lessons_package_id_idx on public.lessons(package_id);
create index if not exists lessons_student_id_idx on public.lessons(student_id);
create index if not exists lessons_teacher_id_idx on public.lessons(teacher_id);
create index if not exists notification_outbox_recipient_id_idx on public.notification_outbox(recipient_id);
create index if not exists payment_discount_settings_updated_by_idx on public.payment_discount_settings(updated_by);
create index if not exists renewal_followups_updated_by_idx on public.renewal_followups(updated_by);
create index if not exists schedule_change_requests_requested_by_idx on public.schedule_change_requests(requested_by);
create index if not exists schedule_change_requests_student_id_idx on public.schedule_change_requests(student_id);

commit;
