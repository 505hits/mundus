"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Home,
  Users,
  ClipboardCheck,
} from "lucide-react";

const navItems = [
  {
    label: "Home",
    href: "/teacher/dashboard",
    icon: Home,
  },
  {
    label: "Schedule",
    href: "/teacher/schedule",
    icon: CalendarDays,
  },
  {
    label: "Students",
    href: "/teacher/students",
    icon: Users,
  },
  {
    label: "Reports",
    href: "/teacher/reports",
    icon: ClipboardCheck,
  },
];

export default function TeacherNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop navigation */}
      <aside className="hidden w-64 shrink-0 border-r border-black/5 bg-white lg:block">
        <div className="sticky top-0 flex h-screen flex-col p-5">
          <Link
            href="/"
            className="px-3 py-3 text-xl font-bold tracking-tight text-[#183f38]"
          >
            mundus
          </Link>

          <p className="mt-6 px-3 text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">
            Teacher Portal
          </p>

          <nav className="mt-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              const active =
                pathname === item.href ||
                (item.href === "/teacher/students" &&
                  pathname.startsWith("/teacher/student"));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-[#183f38] text-white"
                      : "text-gray-500 hover:bg-[#f4f6f3] hover:text-[#183f38]"
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-2xl bg-[#f4f6f3] p-4">
            <p className="text-sm font-semibold text-[#183f38]">
              Teacher account
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Manage your lessons, students and lesson reports in one place.
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/5 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-4">
          {navItems.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              (item.href === "/teacher/students" &&
                pathname.startsWith("/teacher/student"));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 py-3 text-[11px] font-medium ${
                  active ? "text-[#183f38]" : "text-gray-400"
                }`}
              >
                <div
                  className={`rounded-xl p-1.5 ${
                    active ? "bg-[#eef3ef]" : ""
                  }`}
                >
                  <Icon size={19} />
                </div>

                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
