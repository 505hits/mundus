import { NextRequest,NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { accountOrigin } from "@/lib/account-config";

export async function GET(request:NextRequest){
  const token=request.nextUrl.searchParams.get("token");
  const admin=createSupabaseAdminClient();
  if(!token) return NextResponse.redirect(new URL("/newsletter/confirmed?status=invalid",accountOrigin()));
  const {data,error}=await admin.from("newsletter_subscribers").select("id,status").eq("confirm_token",token).maybeSingle();
  if(error||!data) return NextResponse.redirect(new URL("/newsletter/confirmed?status=invalid",accountOrigin()));
  if(data.status!=="active"){
    const {error:updateError}=await admin.from("newsletter_subscribers").update({status:"active",confirmed_at:new Date().toISOString(),unsubscribed_at:null,updated_at:new Date().toISOString()}).eq("id",data.id);
    if(updateError) return NextResponse.redirect(new URL("/newsletter/confirmed?status=error",accountOrigin()));
  }
  return NextResponse.redirect(new URL("/newsletter/confirmed?status=success",accountOrigin()));
}
