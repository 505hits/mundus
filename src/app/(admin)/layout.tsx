import AdminNav from "@/components/AdminNav";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#f7f8f5] lg:flex">
      <AdminNav />

      <div className="min-w-0 flex-1 pb-24 lg:pb-0">
        {children}
      </div>
    </div>
  );
}
