import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasCompletedOnboarding } from "@/lib/account-policy";

export default async function LegacyOnboardingPage() {
  const { user } = await requireRole("student");
  const supabase = await createSupabaseServerClient();
  const [{ data: onboarding }, { data: packages }] = await Promise.all([
    supabase.from("student_onboarding").select("completed_at").eq("student_id", user.id).maybeSingle(),
    supabase.from("lesson_packages").select("id").eq("student_id", user.id).eq("status", "active").gt("remaining_lessons", 0).limit(1),
  ]);

  if (hasCompletedOnboarding(onboarding)) redirect("/dashboard");
  if (packages?.length) redirect("/dashboard/setup");
  redirect("/packages");
}
