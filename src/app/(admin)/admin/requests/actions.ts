"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function updateContactRequest(form: FormData) {
  await requireRole("admin");
  const id = String(form.get("id") ?? "");
  const status = String(form.get("status") ?? "");
  const currentStatus = String(form.get("current_status") ?? "");
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id) ||
    !["new", "contacted", "closed"].includes(status) || !["new", "contacted", "closed"].includes(currentStatus)) {
    redirect("/admin/requests?problem=invalid");
  }
  let saved = false;
  try {
    const { data, error } = await createSupabaseAdminClient().from("contact_requests")
      .update({ status, updated_at: new Date().toISOString() }).eq("id", id).eq("status", currentStatus).select("id").maybeSingle();
    saved = !error && !!data;
  } catch { /* Keep configuration/database failures recoverable in the admin page. */ }
  if (!saved) redirect(`/admin/requests?status=${currentStatus}&problem=save`);
  revalidatePath("/admin/requests");
  redirect(`/admin/requests?status=${currentStatus}`);
}
