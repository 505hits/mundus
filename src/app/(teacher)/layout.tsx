import TeacherNav from "@/components/TeacherNav";
import { requireRole } from "@/lib/auth";

export default async function TeacherLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireRole("teacher");

  return (
    <div className="portal-surface min-h-screen lg:flex">
      <TeacherNav />

      <div className="min-w-0 flex-1 pb-24 lg:pb-0">
        {children}
      </div>
    </div>
  );
}
