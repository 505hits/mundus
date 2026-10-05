"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import BrandLogo from "@/components/BrandLogo";
import {
  BookOpen,
  ChartNoAxesColumnIncreasing,
  GraduationCap,
  Home,
  Package,
} from "lucide-react";

const navItems = [
  {
    label: "Domov",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "Hodiny",
    href: "/lessons",
    icon: GraduationCap,
  },
  {
    label: "Učenie",
    href: "/learning",
    icon: BookOpen,
  },
  {
    label: "Pokrok",
    href: "/progress",
    icon: ChartNoAxesColumnIncreasing,
  },
  { label: "Vstupný test", href: "/level-test", icon: BookOpen },
  { label: "Kontrolný test", href: "/progress-test", icon: ChartNoAxesColumnIncreasing },
];

export default function PortalNav({ paymentsEnabled }: { paymentsEnabled: boolean }) {
  const pathname = usePathname();
  const items = paymentsEnabled ? [...navItems, { label: "Balíčky", href: "/packages", icon: Package }] : navItems;
  const mobileItems = items.filter((item) => !["/level-test", "/progress-test"].includes(item.href));

  return (
    <>
      {/* Desktop navigation */}
      <aside className="hidden w-64 shrink-0 border-r border-black/5 bg-white lg:block">
        <div className="sticky top-0 flex h-screen flex-col p-5">
          <div className="px-3 py-1"><BrandLogo compact /></div>

          <p className="mt-6 px-3 text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">
            Vzdelávací portál
          </p>

          <nav className="mt-3 space-y-1">
            {items.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F3AA2] flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition ${
                    active ? "bg-[#2F3AA2] text-white shadow-sm"
                      : "text-gray-500 hover:bg-[#EEF2FF] hover:text-[#2F3AA2]"
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
              Potrebujete pomoc?
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Kontaktujte Mundus Languages a radi vám pomôžeme.
            </p>
          </div>
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Mobile bottom navigation */}
      <div className="fixed right-4 top-4 z-50 lg:hidden"><LogoutButton compact /></div>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/5 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-3xl overflow-x-auto">
          {mobileItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                  aria-current={active ? "page" : undefined}
                className={`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F3AA2] flex min-w-[80px] flex-1 flex-col items-center justify-center gap-1 whitespace-nowrap py-3 text-[11px] font-medium ${
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
