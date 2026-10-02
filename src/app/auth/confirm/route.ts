import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { purchaseReturnPath } from "@/lib/purchase-intent";

export async function GET(request: NextRequest) {
  const token_hash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type");
  // Fixed destinations: no caller-controlled redirect or arbitrary OTP type.
  if (token_hash && (type === "signup" || type === "invite" || type === "recovery")) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.verifyOtp({ token_hash, type });
    if (!error) {
      const next = purchaseReturnPath(request.nextUrl.searchParams.get("next"));
      return NextResponse.redirect(new URL(type === "recovery" ? "/reset-password" : type === "invite" ? "/set-password" : next ? `/onboarding?next=${encodeURIComponent(next)}` : "/onboarding", request.url));
    }
  }
  return NextResponse.redirect(new URL("/auth/error", request.url));
}
