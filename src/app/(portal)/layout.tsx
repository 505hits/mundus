import PortalNav from "@/components/PortalNav";
import { requireRole } from "@/lib/auth";

export default async function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireRole("student");

  return (
    <div className="min-h-screen bg-[#f7f8f5] lg:flex">
      <PortalNav />

      <div className="min-w-0 flex-1 pb-24 lg:pb-0">
        {children}
      </div>
    </div>
  );
}
