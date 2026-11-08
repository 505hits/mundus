import type { Metadata } from "next";
import AdminNav from "@/components/AdminNav";
import { requireRole } from "@/lib/auth";
import { paymentEnabled } from "@/lib/payments";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireRole("admin");

  return (
    <div className="portal-surface min-h-screen lg:flex">
      <AdminNav paymentsEnabled={paymentEnabled()} />

      <div className="min-w-0 flex-1 pb-24 pt-14 lg:pb-0 lg:pt-0">
        {children}
      </div>
    </div>
  );
}
