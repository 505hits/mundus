import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { purchaseReturnPath } from "@/lib/purchase-intent";
import { accountOrigin } from "@/lib/account-config";

export async function GET(request: NextRequest) {
  const token_hash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type");
  // Fixed destinations: no caller-controlled redirect or arbitrary OTP type.
  if (token_hash && (type === "signup" || type === "invite" || type === "recovery")) {
    try {
      const supabase = await createSupabaseServerClient();
      const { error } = await supabase.auth.verifyOtp({ token_hash, type });
      if (!error) {
        const next = purchaseReturnPath(request.nextUrl.searchParams.get("next"));
        return NextResponse.redirect(new URL(type === "recovery" ? "/reset-password" : type === "invite" ? "/set-password" : next ?? "/packages", accountOrigin()));
      }
    } catch {
      // Configuration or network failure must not turn an email link into a server error.
    }
  }
  return NextResponse.redirect(new URL("/auth/error", accountOrigin()));
}
