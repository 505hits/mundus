import CompanyNav from "@/components/CompanyNav";
import { requireRole } from "@/lib/auth";

export default async function CompanyLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requireRole("company");
  return <div className="portal-surface min-h-screen lg:flex"><CompanyNav/><div className="min-w-0 flex-1 pb-24 pt-14 lg:pb-0 lg:pt-0">{children}</div></div>;
}
