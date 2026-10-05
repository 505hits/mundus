import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type PublicTeacher = {
  id: string;
  name: string;
  headline: string;
  bio: string;
  languages: string[];
  photoUrl: string | null;
};

function photoUrl(path: string | null) {
  const base=process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/,"");
  return path && base ? `${base}/storage/v1/object/public/teacher-public/${encodeURI(path)}` : null;
}

export async function publicTeachers(): Promise<PublicTeacher[]> {
  try {
    const admin=createSupabaseAdminClient();
    const {data,error}=await admin.from("teacher_public_profiles").select(`
      teacher_id,headline,bio,languages,photo_path,website_visible,
      profile:profiles!teacher_public_profiles_teacher_id_fkey(full_name,status)
    `).eq("website_visible",true).order("updated_at",{ascending:false});
    if(error) return [];
    return (data??[]).flatMap(row=>{
      const profile=Array.isArray(row.profile)?row.profile[0]:row.profile;
      if(profile?.status!=="active") return [];
      return [{
        id:row.teacher_id,
        name:profile.full_name?.trim()||"Lektor Mundus",
        headline:row.headline||"",
        bio:row.bio||"",
        languages:row.languages??[],
        photoUrl:photoUrl(row.photo_path),
      }];
    });
  } catch { return []; }
}
