import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type MundusRole = "student" | "teacher" | "admin";

export async function requireRole(requiredRole: MundusRole) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    redirect("/login");
  }

  if (profile.role === "teacher" && profile.status !== "active") {
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
