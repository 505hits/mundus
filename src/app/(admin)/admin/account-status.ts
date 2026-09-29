"use server";

import { requireRole } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function updateAccountStatus(id: string, role: "student" | "teacher", status: "active" | "inactive") {
  await requireRole("admin");
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
    || !["student", "teacher"].includes(role) || !["active", "inactive"].includes(status)) return false;
  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.from("profiles")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id).eq("role", role).select("id").maybeSingle();
    if (error || !data) return false;
    revalidatePath(role === "student" ? "/admin/students" : "/admin/teachers");
    return true;
  } catch { return false; }
}
