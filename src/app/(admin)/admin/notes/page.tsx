import AdminNoteForm from "./AdminNoteForm";
import {requireRole} from "@/lib/auth";
import {createSupabaseServerClient} from "@/lib/supabase/server";
export default async function AdminNotesPage(){
 await requireRole("admin"); const db=await createSupabaseServerClient();
 const [{data:profiles,error:profilesError},{data:notes,error:notesError}]=await Promise.all([
  db.from("profiles").select("id,full_name,email,role").in("role",["student","teacher"]).order("full_name"),
  db.from("admin_profile_notes").select("id,subject_profile_id,note,created_at,subject:profiles!admin_profile_notes_subject_profile_id_fkey(full_name,email,role)").order("created_at",{ascending:false}).limit(100)
 ]);
 if(profilesError||notesError) throw new Error("Admin notes are unavailable");
 return <main className="min-h-screen bg-[#FAFAF9]"><div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-10">
  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">Interné poznámky</p><h1 className="mt-2 text-3xl font-semibold">Súkromné poznámky administrátora</h1><p className="mt-2 text-gray-500">Viditeľné iba administrátorom. Nepoužívajte ich na heslá ani citlivé zdravotné údaje.</p>
  <AdminNoteForm profiles={profiles??[]}/>
  <div className="mt-6 space-y-3">{(notes??[]).map((n)=>{const s=Array.isArray(n.subject)?n.subject[0]:n.subject;return <article key={n.id} className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-semibold">{s?.full_name?.trim()||s?.email||"Účet"}</p><p className="text-xs text-gray-400">{s?.role==="teacher"?"Lektor":"Študent"}</p></div><p className="text-xs text-gray-400">{new Intl.DateTimeFormat("sk-SK",{day:"numeric",month:"short",year:"numeric",timeZone:"Europe/Bratislava"}).format(new Date(n.created_at))}</p></div><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-600">{n.note}</p></article>})}</div>
 </div></main>;
}
