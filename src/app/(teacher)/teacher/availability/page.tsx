import {requireRole} from "@/lib/auth";
import {createSupabaseServerClient} from "@/lib/supabase/server";
import PreferencesForm from "./PreferencesForm";
import {currentLanguage} from "@/lib/i18n";

export default async function AvailabilityPage(){
 const language=await currentLanguage();
 const sk=language==="sk";
 const {user}=await requireRole("teacher");
 const db=await createSupabaseServerClient();
 const {data,error}=await db.from("teacher_preferences").select("*").eq("teacher_id",user.id).maybeSingle();
 return <main className="mx-auto max-w-4xl px-5 py-10">
  <h1 className="text-3xl font-semibold">{sk?"Kapacita a preferencie výučby":"Teaching capacity and preferences"}</h1>
  <p className="mt-4 text-gray-600">{sk?"Uveďte, či prijímate nových študentov a aké hodiny vám vyhovujú. Časy sú v pásme Bratislava. Ide o preferencie, nie automatické rezervácie; konečné priradenie a prvú hodinu potvrdí správca po dohode.":"Set whether you accept new students and which lesson times suit you. Times use the Bratislava time zone. These are preferences, not automatic bookings; final matching and the first lesson are confirmed by the administrator."}</p>
  {error?<p role="alert" className="mt-6 text-red-700">{sk?"Preferencie nie sú dostupné. Obnovte stránku alebo požiadajte správcu o prípravu databázy.":"Preferences are unavailable. Refresh the page or ask the administrator to check the database setup."}</p>:<PreferencesForm key={data?.updated_at||'new'} record={data}/>}
 </main>;
}
