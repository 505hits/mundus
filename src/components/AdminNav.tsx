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
  Building2,
  Mail,
  Menu,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { sk: "Domov", en: "Home", href: "/admin/dashboard", icon: Home },
  { sk: "Kalendár", en: "Calendar", href: "/admin/calendar", icon: CalendarRange },
  { sk: "Priradenie", en: "Matching", href: "/admin/matching", icon: Users },
  { sk: "Študenti", en: "Students", href: "/admin/students", icon: Users },
  { sk: "Lektori", en: "Teachers", href: "/admin/teachers", icon: GraduationCap },
  { sk: "Firmy", en: "Companies", href: "/admin/companies", icon: Building2 },
  { sk: "Newsletter", en: "Newsletter", href: "/admin/newsletter", icon: Mail },
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

      {/* Four primary destinations plus an accessible, scrollable More menu. */}
      <div className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b border-[#E1E5F3] bg-white/95 px-4 shadow-sm backdrop-blur-xl lg:hidden">
        <BrandLogo href="/admin/dashboard" compact />
        <div className="flex items-center gap-2"><LanguageToggle compact /><LogoutButton compact /></div>
      </div>
      <nav aria-label={language==="sk"?"Mobilná navigácia administrácie":"Mobile admin navigation"} className="fixed inset-x-0 bottom-0 z-50 border-t border-[#DDE1EF] bg-white/95 px-2 pt-2 shadow-[0_-8px_35px_rgba(23,26,43,.06)] backdrop-blur-xl lg:hidden" style={{paddingBottom:"max(.5rem, env(safe-area-inset-bottom))"}}>
        <div className="mx-auto flex max-w-xl items-center justify-between gap-1">
          {items.slice(0,4).map(item => {
            const Icon=item.icon;
            const active=pathname===item.href || (item.href!=="/admin/dashboard" && pathname.startsWith(item.href+"/"));
            return <Link key={item.href} href={item.href} aria-current={active?"page":undefined} className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-semibold transition ${active?"bg-[#EEF0FF] text-[#2F3AA2]":"text-[#6A7287] hover:bg-[#F3F5FC]"}`}>
              <Icon size={19}/><span className="truncate">{language==="sk"?item.sk:item.en}</span>
            </Link>;
          })}
          <details className="group relative min-w-0 flex-1">
            <summary className="flex cursor-pointer list-none flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-semibold text-[#535B77] hover:bg-[#F3F5FC]"><Menu size={19}/>{language==="sk"?"Viac":"More"}</summary>
            <div className="absolute bottom-[calc(100%+1rem)] right-0 z-[60] max-h-[min(65dvh,500px)] w-[min(92vw,350px)] overflow-y-auto overscroll-contain rounded-2xl border border-[#DDE1EF] bg-white p-2 shadow-[0_20px_70px_rgba(23,26,43,.2)]">
              <p className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#5361AD]">{language==="sk"?"Všetky sekcie":"All sections"}</p>
              {items.slice(4).map(item=>{const Icon=item.icon;const active=pathname===item.href||pathname.startsWith(item.href+"/");return <Link key={item.href} href={item.href} aria-current={active?"page":undefined} className={`flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${active?"bg-[#EEF0FF] text-[#2F3AA2]":"text-[#30384E] hover:bg-[#F5F6FC]"}`}><Icon size={18}/><span className="flex-1">{language==="sk"?item.sk:item.en}</span><ChevronRight size={15}/></Link>})}
            </div>
          </details>
        </div>
      </nav>
    </>
  );
}
