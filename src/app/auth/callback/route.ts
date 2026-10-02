import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { purchaseReturnPath } from "@/lib/purchase-intent";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (code) {
    try {
      const supabase = await createSupabaseServerClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        const next = purchaseReturnPath(request.nextUrl.searchParams.get("next"));
        return NextResponse.redirect(new URL(next ? `/onboarding?next=${encodeURIComponent(next)}` : "/onboarding", request.url));
      }
    } catch {
      // Configuration or network failure must not turn an email link into a server error.
    }
  }
  return NextResponse.redirect(new URL("/auth/error", request.url));
}
