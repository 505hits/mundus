"use server";

import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContactRequest(form: FormData) {
  const fullName = String(form.get("full_name") ?? "").trim().replace(/\s+/g, " ");
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const language = String(form.get("language") ?? "").trim().replace(/\s+/g, " ");
  const message = String(form.get("message") ?? "").trim();
  const honeypot = String(form.get("website") ?? "").trim();
  const rawPackage = String(form.get("package_lessons") ?? "").trim();
  const packageLessons = rawPackage ? Number(rawPackage) : null;

  if (honeypot) redirect("/contact?sent=1");

  if (
    fullName.length < 2 ||
    fullName.length > 120 ||
    !emailPattern.test(email) ||
    email.length > 254 ||
    language.length < 2 ||
    language.length > 80 ||
    message.length > 2000 ||
    (packageLessons !== null && ![1, 5, 10, 20, 30].includes(packageLessons))
  ) {
    redirect("/contact?problem=invalid");
  }

  let admin;
  try { admin = createSupabaseAdminClient(); }
  catch { redirect("/contact?problem=unavailable"); }
  const cutoff = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();
  const { count, error: countError } = await admin
    .from("contact_requests")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .gte("created_at", cutoff);

  if (countError) redirect("/contact?problem=unavailable");
  if ((count ?? 0) >= 3) redirect("/contact?problem=rate");

  const { error } = await admin.from("contact_requests").insert({
    full_name: fullName,
    email,
    language,
    package_lessons: packageLessons,
    message,
  });

  if (error) redirect("/contact?problem=unavailable");
  redirect("/contact?sent=1");
}
