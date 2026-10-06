"use server";
import {requireRole} from "@/lib/auth";
import {createSupabaseServerClient} from "@/lib/supabase/server";
import {revalidatePath} from "next/cache";
import { MUNDUS_LANGUAGE_VALUES } from "@/lib/language-offer";
import { formUiLanguage, uiText } from "@/lib/i18n";
export async function savePreferences(_state:{error?:string;success?:string},form:FormData):Promise<{error?:string;success?:string}> {
 const {user}=await requireRole("teacher");
 const language=formUiLanguage(form); const t=(sk:string,en:string)=>uiText(language,sk,en);
 try {
  const list=(key:string,allowed:readonly string[])=>{const values=form.getAll(key);if(values.some(value=>typeof value!=="string"||!allowed.includes(value)))throw new Error("choice");return [...new Set(values as string[])];};
  const accepting=form.get("accepting")==="true";
  const languages=list("languages",MUNDUS_LANGUAGE_VALUES);
  const levels=list("levels",['A1','A2','B1','B2','C1','C2']);
  const days=list("days",['1','2','3','4','5','6','7']);
  const capacity=String(form.get("capacity")||"");
  const note=String(form.get("note")||"").trim();
  const from=String(form.get("from")||""),to=String(form.get("to")||"");
  if(!/^(0|[1-9]|1[0-9]|20)$/.test(capacity)||note.length>1000||(accepting&&(!languages.length||!levels.length||Number(capacity)<1))||((from||to)&&(!/^([01]\d|2[0-3]):[0-5]\d$/.test(from)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(to)||from>=to)))return {error:t("Skontrolujte jazyky, úrovne, kapacitu a čas od–do v rámci jedného dňa.","Check languages, levels, capacity and the from–to time range within one day.")};
  const values={teacher_id:user.id,accepting_students:accepting,languages,levels,days,max_new_students:Number(capacity),time_from:from||null,time_to:to||null,note};
  const db=await createSupabaseServerClient();const version=String(form.get("version")||"");
  const query=version?db.from("teacher_preferences").update(values).eq("teacher_id",user.id).eq("updated_at",version):db.from("teacher_preferences").insert(values);
  const {data,error}=await query.select("teacher_id");if(error||!data?.length)return {error:t("Uloženie zlyhalo alebo sa údaje zmenili. Obnovte stránku a overte aktuálny stav.","Saving failed or the data changed. Refresh the page and verify the current state.")};
  revalidatePath("/teacher/availability");revalidatePath("/admin/matching");return {success:t("Preferencie uložené. Študenta priradí správca po dohode.","Preferences saved. An administrator will assign students after agreement.")};
 }catch{return {error:t("Preferencie sa nepodarilo uložiť. Skúste znova.","Preferences could not be saved. Try again.")};}
}
