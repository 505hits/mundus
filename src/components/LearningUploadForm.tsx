"use client";
import { useActionState, useState } from "react";
import { uploadLearningFile } from "@/app/learning-file-actions";
export default function LearningUploadForm({ studentId, teacher }: {studentId:string;teacher:boolean}) {
 const [fileError,setFileError]=useState("");
 const [state,action,pending]=useActionState(uploadLearningFile,{});
 return <form action={action} className="mt-5 space-y-3" aria-busy={pending}><input type="hidden" name="student_id" value={studentId}/>
 <label className="block text-sm">Typ súboru<select name="kind" className="ml-3 rounded-lg border p-2">{teacher ? <><option value="material">Materiál</option><option value="homework_assignment">Zadanie domácej úlohy</option></> : <option value="homework_submission">Vypracovaná domáca úloha</option>}</select></label>
 <label className="block text-sm">Názov<input name="title" required maxLength={150} className="mt-1 block w-full rounded-xl border p-3"/></label>
 <label className="block text-sm">Súbor (PDF, PNG, JPG, TXT; do 3 MB)<input name="file" type="file" required onChange={event=>{const file=event.target.files?.[0];setFileError(file && file.size>3*1024*1024 ? "Vyberte súbor do 3 MB." : "");}} accept="application/pdf,image/png,image/jpeg,text/plain" className="mt-2 block max-w-full"/></label>
 {fileError && <p role="alert" className="text-sm text-red-700">{fileError}</p>}
 {state.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}{state.success && <p role="status" className="text-sm text-[#2F3AA2]">{state.success}</p>}
 <button disabled={pending || !!fileError} className="rounded-xl bg-[#2F3AA2] px-5 py-3 font-semibold text-white disabled:opacity-50">{pending?"Nahrávam…":"Nahrať súbor"}</button></form>;
}
