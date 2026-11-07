import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROOTS=new Set(["","languages","pricing","prices","group-lessons","companies","contact","privacy","terms","cookies","learn","payment","teachers"]);

export function proxy(request:NextRequest){
  const parts=request.nextUrl.pathname.split("/").filter(Boolean);
  const locale=parts[0];
  if(locale!=="sk"&&locale!=="en") return NextResponse.next();

  const rest=parts.slice(1);
  const root=rest[0]??"";
  if(!PUBLIC_ROOTS.has(root)) return NextResponse.next();

  const url=request.nextUrl.clone();
  url.pathname="/"+rest.join("/");
  if(url.pathname==="/") url.pathname="/";

  const headers=new Headers(request.headers);
  const existing=request.headers.get("cookie")??"";
  const cookie=`mundus_language=${locale}`;
  headers.set("cookie",existing? `${existing}; ${cookie}` : cookie);

  const response=NextResponse.rewrite(url,{request:{headers}});
  response.cookies.set("mundus_language",locale,{path:"/",maxAge:31536000,sameSite:"lax"});
  return response;
}

export const config={matcher:["/sk/:path*","/en/:path*"]};
