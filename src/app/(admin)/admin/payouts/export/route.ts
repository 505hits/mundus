import {NextRequest} from "next/server";
import {createSupabaseServerClient} from "@/lib/supabase/server";
import {currentBratislavaMonth,parseBratislavaMonth} from "@/lib/month";

function csv(value:unknown){
 const s=String(value??"");
 return /[",\n]/.test(s)?`"${s.replaceAll('"','""')}"`:s;
}

export async function GET(request:NextRequest){
 const db=await createSupabaseServerClient();
 const {data:{user}}=await db.auth.getUser();
 if(!user) return new Response("Unauthorized",{status:401});
 const {data:profile}=await db.from("profiles").select("role,status").eq("id",user.id).maybeSingle();
 if(profile?.role!=="admin"||profile.status!=="active") return new Response("Forbidden",{status:403});

 const requested=request.nextUrl.searchParams.get("month");
 const month=parseBratislavaMonth(requested)||currentBratislavaMonth();
 const [{data:teachers},{data:lessons},{data:rates}]=await Promise.all([
  db.from("profiles").select("id,full_name,email").eq("role","teacher"),
  db.from("lessons").select("teacher_id").eq("status","completed").gte("scheduled_at",month.start).lt("scheduled_at",month.end),
  db.from("teacher_pay_rates").select("teacher_id,effective_month,rate_cents_per_lesson").lte("effective_month",month.key).order("effective_month",{ascending:false})
 ]);
 const lines=[["Teacher","Email","Month","Completed lessons","Rate EUR","Payout EUR"]];
 for(const teacher of teachers??[]){
  const count=(lessons??[]).filter(l=>l.teacher_id===teacher.id).length;
  const rate=(rates??[]).find(r=>r.teacher_id===teacher.id)?.rate_cents_per_lesson??0;
  if(!count&&!rate) continue;
  lines.push([teacher.full_name||teacher.email||"Teacher",teacher.email||"",month.key.slice(0,7),String(count),(rate/100).toFixed(2),((count*rate)/100).toFixed(2)]);
 }
 return new Response(lines.map(row=>row.map(csv).join(",")).join("\n"),{headers:{"content-type":"text/csv; charset=utf-8","content-disposition":`attachment; filename="mundus-payout-${month.key.slice(0,7)}.csv"`}});
}
