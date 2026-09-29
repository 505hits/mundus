import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";

export default async function AdminTrialsPage() {
  await requireRole("admin");
  redirect("/admin/lessons");
}
