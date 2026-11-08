"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import BrandLogo from "@/components/BrandLogo";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/context/LanguageContext";
import {
  CalendarDays,
  Home,
  Users,
  ClipboardCheck,
  UserRound,
  Menu,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { sk: "Domov", en: "Home", href: "/teacher/dashboard", icon: Home },
  { sk: "Rozvrh", en: "Schedule", href: "/teacher/schedule", icon: CalendarDays },
  { sk: "Študenti", en: "Students", href: "/teacher/students", icon: Users },
  { sk: "Záznamy", en: "Reports", href: "/teacher/reports", icon: ClipboardCheck },
  { sk: "Kapacita", en: "Availability", href: "/teacher/availability", icon: CalendarDays },
  { sk: "Profil", en: "Profile", href: "/teacher/profile", icon: UserRound },
];

export default function TeacherNav() {
  const pathname = usePathname();
  const { language } = useLanguage();

  return (
    <>
      {/* Desktop navigation */}
      <aside className="hidden w-64 shrink-0 border-r border-[#E5E7F0] bg-white/95 lg:block">
        <div className="sticky top-0 flex h-screen flex-col overflow-y-auto p-5">
          <div className="px-3 py-1"><BrandLogo compact /></div>

          <p className="mt-6 px-3 text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">
            {language === "sk" ? "Portál lektora" : "Teacher portal"}
          </p>

          <div className="mt-4 px-3"><LanguageToggle /></div>

          <nav className="mt-4 space-y-1">
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
                    active ? "bg-[#2F3AA2] text-white shadow-sm"
                      : "text-gray-500 hover:bg-[#EEF2FF] hover:text-[#2F3AA2]"
                  }`}
                >
                  <Icon size={18} />
                  {language === "sk" ? item.sk : item.en}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto space-y-3">
            <div className="rounded-2xl bg-[#F3F5FB] p-4">
            <p className="text-sm font-semibold text-[#0a0a0f]">
              {language === "sk" ? "Účet lektora" : "Teacher account"}
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              {language === "sk" ? "Majte svoje hodiny, študentov a záznamy z hodín na jednom mieste." : "Keep your lessons, students and lesson reports in one place."}
            </p>
          </div>
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Mobile navigation: primary tabs remain visible, secondary tools under More. */}
      <div className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b border-[#E1E5F3] bg-white/95 px-4 shadow-sm backdrop-blur-xl lg:hidden">
        <BrandLogo compact />
        <div className="flex items-center gap-2"><LanguageToggle compact /><LogoutButton compact /></div>
      </div>
      <nav aria-label={language==="sk"?"Mobilné menu lektora":"Mobile teacher menu"} className="fixed inset-x-0 bottom-0 z-50 border-t border-[#DDE1EF] bg-white/95 px-2 pt-2 shadow-[0_-8px_35px_rgba(23,26,43,.06)] backdrop-blur-xl lg:hidden" style={{paddingBottom:"max(.5rem, env(safe-area-inset-bottom))"}}>
        <div className="mx-auto flex max-w-xl items-center justify-between gap-1">
          {navItems.slice(0,4).map(item=>{
            const Icon=item.icon;const active=pathname===item.href||(item.href==="/teacher/students"&&pathname.startsWith("/teacher/student"));
            return <Link key={item.href} href={item.href} aria-current={active?"page":undefined} className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-semibold transition ${active?"bg-[#EEF0FF] text-[#2F3AA2]":"text-[#6A7287] hover:bg-[#F3F5FC]"}`}><Icon size={19}/><span className="truncate">{language==="sk"?item.sk:item.en}</span></Link>
          })}
          <details className="group relative min-w-0 flex-1">
            <summary className="flex cursor-pointer list-none flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-semibold text-[#535B77] hover:bg-[#F3F5FC]"><Menu size={19}/>{language==="sk"?"Viac":"More"}</summary>
            <div className="absolute bottom-[calc(100%+1rem)] right-0 z-[60] w-[min(92vw,300px)] overflow-y-auto rounded-2xl border border-[#DDE1EF] bg-white p-2 shadow-[0_20px_70px_rgba(23,26,43,.2)]">
              {navItems.slice(4).map(item=>{const Icon=item.icon;return <Link key={item.href} href={item.href} className="flex min-h-12 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#30384E] hover:bg-[#F5F6FC]"><Icon size={18}/><span className="flex-1">{language==="sk"?item.sk:item.en}</span><ChevronRight size={16}/></Link>})}
            </div>
          </details>
        </div>
      </nav>
    </>
  );
}
