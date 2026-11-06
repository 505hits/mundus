"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Users } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import LanguageToggle from "@/components/LanguageToggle";
import LogoutButton from "@/components/LogoutButton";
import { useLanguage } from "@/context/LanguageContext";

export default function CompanyNav() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const items = [
    { href: "/company/dashboard", sk: "Prehľad", en: "Overview", icon: Building2 },
    { href: "/company/employees", sk: "Zamestnanci", en: "Employees", icon: Users },
  ];
  return <>
    <aside className="hidden min-h-screen w-64 shrink-0 border-r border-[#E5E7F0] bg-white/95 lg:flex lg:flex-col">
      <div className="px-6 py-7"><BrandLogo href="/company/dashboard" compact />
        <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-[#2F3AA2]">{language==="sk"?"Firemný portál":"Company portal"}</p>
      </div>
      <div className="px-6 pb-4"><LanguageToggle /></div>
      <nav className="flex-1 px-3">
        {items.map(item=>{const Icon=item.icon; const active=pathname===item.href||pathname.startsWith(item.href+"/"); return <Link key={item.href} href={item.href} aria-current={active?"page":undefined} className={`mb-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${active?"bg-[#2F3AA2] text-white":"text-gray-500 hover:bg-[#EEF2FF] hover:text-[#2F3AA2]"}`}><Icon size={18}/>{language==="sk"?item.sk:item.en}</Link>})}
      </nav>
      <div className="border-t border-black/5 p-5"><LogoutButton /></div>
    </aside>
    <div className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between border-b border-black/5 bg-white/95 px-4 lg:hidden">
      <BrandLogo href="/company/dashboard" compact/><div className="flex items-center gap-2"><LanguageToggle compact/><LogoutButton compact/></div>
    </div>
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/5 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] lg:hidden">
      <div className="mx-auto flex max-w-md">{items.map(item=>{const Icon=item.icon; const active=pathname===item.href||pathname.startsWith(item.href+"/"); return <Link key={item.href} href={item.href} className={`flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium ${active?"text-[#2F3AA2]":"text-gray-400"}`}><Icon size={19}/>{language==="sk"?item.sk:item.en}</Link>})}</div>
    </nav>
  </>;
}
