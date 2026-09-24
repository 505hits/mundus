import TeacherNav from "@/components/TeacherNav";
import { requireRole } from "@/lib/auth";

export default async function TeacherLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireRole("teacher");

  return (
    <div className="min-h-screen bg-[#f7f8f5] lg:flex">
      <TeacherNav />

      <div className="min-w-0 flex-1 pb-24 lg:pb-0">
        {children}
      </div>
    </div>
  );
}
