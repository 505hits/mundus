"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import {
  CalendarDays,
  Home,
  Users,
  ClipboardCheck,
} from "lucide-react";

const navItems = [
  {label:"Kapacita",href:"/teacher/availability",icon:CalendarDays},
  {
    label: "Domov",
    href: "/teacher/dashboard",
    icon: Home,
  },
  {
    label: "Rozvrh",
    href: "/teacher/schedule",
    icon: CalendarDays,
  },
  {
    label: "Študenti",
    href: "/teacher/students",
    icon: Users,
  },
  {
    label: "Záznamy",
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
            className="px-3 py-3 text-xl font-bold tracking-tight text-[#0a0a0f]"
          >
            mundus
          </Link>

          <p className="mt-6 px-3 text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">
            Portál lektora
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
                  aria-current={active ? "page" : undefined}
                  className={`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F3AA2] flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-[#0a0a0f] text-white"
                      : "text-gray-500 hover:bg-[#F5F5F4] hover:text-[#0a0a0f]"
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto space-y-3">
            <div className="rounded-2xl bg-[#F5F5F4] p-4">
            <p className="text-sm font-semibold text-[#0a0a0f]">
              Účet lektora
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Majte svoje hodiny, študentov a záznamy z hodín na jednom mieste.
            </p>
          </div>
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Mobile navigation */}
      <div className="fixed right-4 top-4 z-50 lg:hidden"><LogoutButton compact /></div>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/5 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-5">
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
                  aria-current={active ? "page" : undefined}
                className={`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F3AA2] flex flex-col items-center justify-center gap-1 py-3 text-[11px] font-medium ${
                  active ? "text-[#0a0a0f]" : "text-gray-400"
                }`}
              >
                <div
                  className={`rounded-xl p-1.5 ${
                    active ? "bg-[#EEF2FF]" : ""
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
