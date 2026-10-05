"use client";

import { Languages } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function LanguageToggle({ compact = false, dark = false }: { compact?: boolean; dark?: boolean }) {
  const { language, setLanguage } = useLanguage();
  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full border p-1 ${dark ? "border-white/15 bg-white/10" : "border-[#DDE2F0] bg-white/90"}`}
      aria-label={language === "sk" ? "Zmeniť jazyk" : "Change language"}
    >
      {!compact && <Languages size={14} className={dark ? "ml-2 text-white/60" : "ml-2 text-gray-400"} aria-hidden="true" />}
      {(["en","sk"] as const).map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setLanguage(item)}
          aria-pressed={language === item}
          className={`rounded-full px-2.5 py-1.5 text-xs font-bold transition ${language === item
            ? dark ? "bg-white text-[#171A2B]" : "bg-[#2F3AA2] text-white shadow-sm"
            : dark ? "text-white/65 hover:text-white" : "text-gray-500 hover:text-[#2F3AA2]"}`}
        >
          {item.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
