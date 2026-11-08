import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  // Public /sk and /en paths must win over a stale or absent cookie, on the
  // FIRST request, so server-rendered text and metadata match the URL.
  const match = request.nextUrl.pathname.match(/^\/(sk|en)(?:\/|$)/);
  const locale = match?.[1] === "en" ? "en" : match?.[1] === "sk" ? "sk" : null;
  if (locale) request.cookies.set("mundus_language", locale);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  let response = NextResponse.next({ request });
  if (locale) response.cookies.set("mundus_language", locale, { path: "/", sameSite: "lax", maxAge: 31536000 });

  if (!supabaseUrl || !supabaseKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({ request });
        if (locale) response.cookies.set("mundus_language", locale, { path: "/", sameSite: "lax", maxAge: 31536000 });

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // Refresh the auth session when needed so protected server routes
  // receive the latest Supabase cookies.
  await supabase.auth.getUser();

  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  matcher: [
    "/login", "/signup", "/forgot-password", "/reset-password",
    "/auth/:path*", "/onboarding/:path*", "/set-password/:path*",
    "/sk", "/en", "/sk/community", "/en/community", "/sk/:path*", "/en/:path*",
    "/pending-approval", "/dashboard/:path*", "/lessons/:path*",
    "/progress-test/:path*", "/level-test/:path*", "/learning/:path*", "/progress/:path*", "/packages/:path*",
    "/teacher/:path*", "/admin/:path*",
  ],
};
