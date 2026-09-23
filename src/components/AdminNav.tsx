"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  GraduationCap,
  Home,
  Package,
  UserPlus,
  Users,
} from "lucide-react";

const navItems = [
  {
    name: "Home",
    href: "/admin/dashboard",
    icon: Home,
  },
  {
    name: "Students",
    href: "/admin/students",
    icon: Users,
  },
  {
    name: "Teachers",
    href: "/admin/teachers",
    icon: GraduationCap,
  },
  {
    name: "Lessons",
    href: "/admin/lessons",
    icon: CalendarDays,
  },
  {
    name: "Trials",
    href: "/admin/trials",
    icon: UserPlus,
  },
  {
    name: "Packages",
    href: "/admin/packages",
    icon: Package,
  },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop navigation */}
      <aside className="hidden min-h-screen w-64 shrink-0 border-r border-black/5 bg-white lg:flex lg:flex-col">
        <div className="px-6 py-7">
          <Link
            href="/admin/dashboard"
            className="text-xl font-semibold tracking-tight text-[#183f38]"
          >
            Mundus
          </Link>

          <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-[#9a8049]">
            Admin Portal
          </p>
        </div>

        <nav className="flex-1 px-3">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              const active =
                pathname === item.href ||
                (item.href !== "/admin/dashboard" &&
                  pathname.startsWith(`${item.href}/`));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-[#183f38] text-white"
                      : "text-gray-500 hover:bg-[#f3f5f2] hover:text-[#183f38]"
                  }`}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-black/5 p-5">
          <div className="rounded-2xl bg-[#f7f8f5] p-4">
            <p className="text-sm font-semibold text-[#183f38]">
              Anikó
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Mundus administrator
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/5 bg-white/95 px-2 py-2 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-xl items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              (item.href !== "/admin/dashboard" &&
                pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-medium ${
                  active ? "text-[#183f38]" : "text-gray-400"
                }`}
              >
                <Icon size={18} />
                <span className="max-w-full truncate">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
