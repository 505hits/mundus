"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import BrandLogo from "@/components/BrandLogo";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/context/LanguageContext";
import {
  CalendarDays,
  CalendarRange,
  GraduationCap,
  Home,
  Package,
  CreditCard,
  Users,
  Trophy,
  HeartPulse,
  WalletCards,
  NotebookPen,
} from "lucide-react";

const navItems = [
  { sk: "Domov", en: "Home", href: "/admin/dashboard", icon: Home },
  { sk: "Kalendár", en: "Calendar", href: "/admin/calendar", icon: CalendarRange },
  { sk: "Priradenie", en: "Matching", href: "/admin/matching", icon: Users },
  { sk: "Študenti", en: "Students", href: "/admin/students", icon: Users },
  { sk: "Lektori", en: "Teachers", href: "/admin/teachers", icon: GraduationCap },
  { sk: "Hodiny", en: "Lessons", href: "/admin/lessons", icon: CalendarDays },
  { sk: "Výkon", en: "Performance", href: "/admin/teacher-ranking", icon: Trophy },
  { sk: "Retencia", en: "Retention", href: "/admin/retention", icon: HeartPulse },
  { sk: "Balíčky", en: "Packages", href: "/admin/packages", icon: Package },
  { sk: "Výplaty", en: "Payouts", href: "/admin/payouts", icon: WalletCards },
  { sk: "Poznámky", en: "Notes", href: "/admin/notes", icon: NotebookPen },
];

export default function AdminNav({ paymentsEnabled = false }: { paymentsEnabled?: boolean }) {
  const pathname = usePathname();
  const { language } = useLanguage();
  const items = paymentsEnabled ? [...navItems, { sk: "Platby", en: "Payments", href: "/admin/payments", icon: CreditCard }] : navItems;

  return (
    <>
      {/* Desktop navigation */}
      <aside className="hidden min-h-screen w-64 shrink-0 border-r border-[#E5E7F0] bg-white/95 lg:flex lg:flex-col">
        <div className="px-6 py-7">
          <BrandLogo href="/admin/dashboard" compact />

          <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-[#2F3AA2]">
            {language === "sk" ? "Admin portál" : "Admin portal"}
          </p>
        </div>

        <div className="px-6 pb-4"><LanguageToggle /></div>

        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          <div className="space-y-1">
            {items.map((item) => {
              const Icon = item.icon;

              const active =
                pathname === item.href ||
                (item.href !== "/admin/dashboard" &&
                  pathname.startsWith(`${item.href}/`));

              return (
                <Link
                  key={language === "sk" ? item.sk : item.en}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F3AA2] flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    active ? "bg-[#2F3AA2] text-white shadow-sm"
                      : "text-gray-500 hover:bg-[#EEF2FF] hover:text-[#2F3AA2]"
                  }`}
                >
                  <Icon size={18} />
                  {language === "sk" ? item.sk : item.en}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-black/5 p-5">
          <LogoutButton />
          <div className="mt-3">
          <div className="rounded-2xl bg-[#F3F5FB] p-4">
            <p className="text-sm font-semibold text-[#0a0a0f]">
              Mundus Languages
            </p>
            <p className="mt-1 text-xs text-gray-400">
              {language === "sk" ? "Administrátor Mundus" : "Mundus administrator"}
            </p>
          </div>
        </div>
        </div>
      </aside>

      {/* Mobile navigation */}
      <div className="fixed right-4 top-4 z-50 lg:hidden"><LogoutButton compact /></div>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/5 bg-white/95 px-2 pt-2 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-3xl items-center overflow-x-auto">
          {items.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              (item.href !== "/admin/dashboard" &&
                pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={language === "sk" ? item.sk : item.en}
                href={item.href}
                  aria-current={active ? "page" : undefined}
                className={`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F3AA2] flex min-w-[80px] flex-1 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-medium ${
                  active ? "text-[#0a0a0f]" : "text-gray-400"
                }`}
              >
                <Icon size={18} />
                <span className="max-w-full truncate">{language === "sk" ? item.sk : item.en}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
