import "server-only";
import type { createSupabaseServerClient } from "@/lib/supabase/server";
export async function teacherDirectory(db: Awaited<ReturnType<typeof createSupabaseServerClient>>) {
 const {data,error}=await db.rpc("teacher_student_directory");
 // No fallback to raw student profiles/contact data if the privacy migration is missing.
 if(error)throw new Error("Assigned student directory is unavailable");
 return new Map<string,{full_name:string|null}>((data??[]).map((row:{id:string;full_name:string|null})=>[row.id,{full_name:row.full_name}]));
}
