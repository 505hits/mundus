"use client";

import { LogOut } from "lucide-react";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export default function LogoutButton({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [loading, setLoading] = useState(false);

  async function signOut() {
    if (loading) return;
    setLoading(true);

    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={loading}
      className={
        compact
          ? "inline-flex items-center gap-1.5 rounded-xl border border-black/5 bg-white/95 px-3 py-2 text-xs font-semibold text-[#0a0a0f] shadow-sm backdrop-blur disabled:opacity-50"
          : "flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-500 transition hover:bg-[#f4f6f3] hover:text-[#0a0a0f] disabled:opacity-50"
      }
    >
      <LogOut size={compact ? 15 : 17} />
      {loading ? "Odhlasujem..." : "Odhlásiť sa"}
    </button>
  );
}
