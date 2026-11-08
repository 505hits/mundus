import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROOTS=new Set(["","languages","pricing","prices","group-lessons","companies","contact","privacy","terms","cookies","learn","payment","teachers"]);

export function proxy(request:NextRequest){
  const parts=request.nextUrl.pathname.split("/").filter(Boolean);
  const locale=parts[0];
  if(locale!=="sk"&&locale!=="en") return NextResponse.next();

  const rest=parts.slice(1);
  const root=rest[0]??"";
  if (!PUBLIC_ROOTS.has(root) && root !== "community") return NextResponse.next();

  request.cookies.set("mundus_language", locale);
  const requestHeaders = { request: { headers: new Headers(request.headers) } };
  const url = request.nextUrl.clone();
  url.pathname = "/" + rest.join("/");

  // Community has real locale-specific routes. Keep its URL intact and
  // forward the locale so the shared layout renders the matching html lang.
  const response = root === "community"
    ? NextResponse.next(requestHeaders)
    : NextResponse.rewrite(url, requestHeaders);
  response.cookies.set("mundus_language",locale,{path:"/",maxAge:31536000,sameSite:"lax"});
  return response;
}

export const config={matcher:["/sk/:path*","/en/:path*"]};
