import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { canAcceptTeacherInvitation } from "@/lib/account-policy";
import { purchaseReturnPath } from "@/lib/purchase-intent";

export type MundusRole = "student" | "teacher" | "admin";

export async function requireRole(requiredRole: MundusRole, returnTo?: string) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    const safeReturn = purchaseReturnPath(returnTo);
    redirect(safeReturn ? `/login?next=${encodeURIComponent(safeReturn)}` : "/login");
  }

  if (!user.email_confirmed_at) redirect("/auth/error");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, status, full_name")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    redirect("/login");
  }

  if (profile.role === "teacher" && profile.status !== "active") {
    if (profile.status === "pending" && canAcceptTeacherInvitation(user.app_metadata)) redirect("/set-password");
    redirect("/pending-approval");
  }

  if (profile.role !== requiredRole || profile.status !== "active") {
    if (profile.role === "admin" && profile.status === "active") {
      redirect("/admin/dashboard");
    }

    if (profile.role === "teacher" && profile.status === "active") {
      redirect("/teacher/dashboard");
    }

    if (profile.role === "student" && profile.status === "active") {
      redirect("/dashboard");
    }

    redirect("/login");
  }

  return { user, profile };
}
