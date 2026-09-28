import AdminNav from "@/components/AdminNav";
import { requireRole } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireRole("admin");

  return (
    <div className="min-h-screen bg-[#f7f8f5] lg:flex">
      <AdminNav />

      <div className="min-w-0 flex-1 pb-24 lg:pb-0">
        {children}
      </div>
    </div>
  );
}
