"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { paymentEnabled } from "@/lib/payments";

export async function setFirstPackageDiscount(form: FormData) {
  const { user } = await requireRole("admin");
  if (!paymentEnabled()) return;
  const studentId = String(form.get("student_id") ?? "");
  const choice = String(form.get("allowed") ?? "");
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(studentId) || !["true", "false"].includes(choice)) {
    redirect("/admin/payments?problem=discount");
  }
  const { error } = await createSupabaseAdminClient().rpc("mundus_set_first_discount", {
    buyer_id: studentId, allowed: choice === "true", admin_id: user.id,
  });
  if (error) redirect("/admin/payments?problem=discount");
  revalidatePath("/admin/payments");
  revalidatePath("/packages");
}
