import { createSupabaseServerClient } from "@/lib/supabase/server";
import { downloadLearningFile } from "@/app/learning-file-actions";
import LearningUploadForm from "./LearningUploadForm";
import { currentLanguage, localeFor } from "@/lib/i18n";
export default async function LearningFiles({studentId,teacher=false}:{studentId:string;teacher?:boolean}) {
 const language = await currentLanguage();
 const sk = language === "sk";
 const supabase=await createSupabaseServerClient();
 const {data,error}=await supabase.from("learning_files").select("id,title,kind,file_name,created_at").eq("student_id",studentId).order("created_at",{ascending:false}).limit(50);
 return <section className="my-6 rounded-2xl border border-indigo-100 bg-white p-5"><h2 className="text-xl font-semibold">{sk ? "Materiály a súbory domácich úloh" : "Materials and homework files"}</h2>
 {error ? <p className="mt-3 text-sm text-gray-500">{sk ? "Súbory momentálne nie sú dostupné." : "Files are currently unavailable."}</p> : <><ul className="mt-4 space-y-3">{data?.map(file=><li key={file.id} className="rounded-xl border p-3"><p className="font-semibold">{file.title}</p><p className="text-sm text-gray-500">{file.kind==="material" ? (sk ? "Materiál" : "Material") : file.kind==="homework_assignment" ? (sk ? "Zadanie úlohy" : "Homework assignment") : (sk ? "Vypracovaná úloha" : "Homework submission")} · {file.file_name} · {new Intl.DateTimeFormat(localeFor(language), { dateStyle: "medium", timeZone: "Europe/Bratislava" }).format(new Date(file.created_at))}</p><form action={downloadLearningFile}><input type="hidden" name="file_id" value={file.id}/><button className="mt-2 text-sm font-semibold text-[#2F3AA2] underline">{sk ? "Stiahnuť súbor" : "Download file"}</button></form></li>)}</ul>{!data?.length&&<p className="mt-3 text-sm text-gray-500">{sk ? "Zatiaľ bez súborov." : "No files yet."}</p>}<LearningUploadForm key={`${studentId}:${teacher ? "teacher" : "student"}`} studentId={studentId} teacher={teacher}/></>}
 </section>;
}
