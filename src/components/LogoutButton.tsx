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
  const [error, setError] = useState("");

  async function signOut() {
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        setError("Odhlásenie sa nepodarilo. Skúste to znova.");
        return;
      }
      window.location.href = "/login";
    } catch {
      setError("Odhlásenie sa nepodarilo. Skontrolujte pripojenie a skúste to znova.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
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
    {error && <p role="alert" className="mt-2 text-xs text-red-700">{error}</p>}
    </div>
  );
}
