import {requireRole} from "@/lib/auth";
import {createSupabaseAdminClient} from "@/lib/supabase/admin";
import TeacherProfileForm from "./TeacherProfileForm";
import {currentLanguage} from "@/lib/i18n";

export default async function TeacherProfilePage(){
 const language=await currentLanguage();
 const sk=language==="sk";
 const {user}=await requireRole("teacher");
 const admin=createSupabaseAdminClient();
 const [{data:record},{data:prefs}]=await Promise.all([
   admin.from("teacher_public_profiles").select("headline,bio,languages,photo_path,website_visible").eq("teacher_id",user.id).maybeSingle(),
   admin.from("teacher_preferences").select("languages").eq("teacher_id",user.id).maybeSingle(),
 ]);
 const base=process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/,"");
 const photoUrl=record?.photo_path&&base?`${base}/storage/v1/object/public/teacher-public/${encodeURI(record.photo_path)}`:null;
 return <main className="mx-auto max-w-4xl px-5 py-10">
   <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">{sk?"Profil lektora":"Teacher profile"}</p>
   <h1 className="mt-2 text-3xl font-semibold">{sk?"Ako sa zobrazíte študentom":"How students will see you"}</h1>
   <p className="mt-3 max-w-2xl text-gray-600">{sk?"Doplňte fotku, jazyky a krátke predstavenie. Kapacitu a dostupnosť naďalej nastavujete samostatne v sekcii Kapacita.":"Add a photo, languages and a short introduction. Capacity and availability are still managed separately in the Availability section."}</p>
   <TeacherProfileForm record={{headline:record?.headline??"",bio:record?.bio??"",languages:record?.languages??prefs?.languages??[],photoUrl,website_visible:record?.website_visible??true}}/>
 </main>;
}
