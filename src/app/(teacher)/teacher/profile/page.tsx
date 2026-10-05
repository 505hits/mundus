import {requireRole} from "@/lib/auth";
import {createSupabaseAdminClient} from "@/lib/supabase/admin";
import TeacherProfileForm from "./TeacherProfileForm";

export default async function TeacherProfilePage(){
 const {user}=await requireRole("teacher");
 const admin=createSupabaseAdminClient();
 const [{data:record},{data:prefs}]=await Promise.all([
   admin.from("teacher_public_profiles").select("headline,bio,languages,photo_path,website_visible").eq("teacher_id",user.id).maybeSingle(),
   admin.from("teacher_preferences").select("languages").eq("teacher_id",user.id).maybeSingle(),
 ]);
 const base=process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/,"");
 const photoUrl=record?.photo_path&&base?`${base}/storage/v1/object/public/teacher-public/${encodeURI(record.photo_path)}`:null;
 return <main className="mx-auto max-w-4xl px-5 py-10">
   <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">Profil lektora</p>
   <h1 className="mt-2 text-3xl font-semibold">Ako sa zobrazíte študentom</h1>
   <p className="mt-3 max-w-2xl text-gray-600">Doplňte fotku, jazyky a krátke predstavenie. Kapacitu a dostupnosť naďalej nastavujete samostatne v sekcii Kapacita.</p>
   <TeacherProfileForm record={{headline:record?.headline??"",bio:record?.bio??"",languages:record?.languages??prefs?.languages??[],photoUrl,website_visible:record?.website_visible??true}}/>
 </main>;
}
