"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function markContactRequestContacted(form: FormData) {
  await requireRole("admin");
  const id = String(form.get("request_id") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) return;
  const { error } = await createSupabaseAdminClient()
    .from("contact_requests")
    .update({ status: "contacted", updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("status", "new");
  if (!error) revalidatePath("/admin/dashboard");
}
