"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { uploadLearningFile } from "@/app/learning-file-actions";
import { LEARNING_FILE_LIMIT } from "@/lib/learning-files";
import { useLanguage } from "@/context/LanguageContext";

type State = { error?: string; success?: string };
export default function LearningUploadForm({ studentId, teacher }: { studentId: string; teacher: boolean }) {
  const router = useRouter();
  const { language } = useLanguage();
  const sk = language === "sk";
  const busy = useRef(false);
  const [pending, setPending] = useState(false);
  const [fileError, setFileError] = useState("");
  const [state, setState] = useState<State>({});

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current || fileError) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    busy.current = true;
    setPending(true);
    setState({});
    try {
      const result = await uploadLearningFile({}, data);
      setState(result);
      if (result.success) {
        form.reset();
        setFileError("");
        router.refresh();
      }
    } catch {
      setState({ error: sk ? "Nahrávanie sa nepodarilo. Súbor a údaje zostali vybrané. Skontrolujte pripojenie a skúste znova." : "Upload failed. The selected file and details remain in the form. Check your connection and try again." });
    } finally {
      busy.current = false;
      setPending(false);
    }
  }

  return <form onSubmit={submit} onChange={() => setState({})} className="mt-5 space-y-3" aria-busy={pending}>
    <input type="hidden" name="student_id" value={studentId} />
    <fieldset disabled={pending} className="space-y-3">
      <label className="block text-sm">{sk ? "Typ súboru" : "File type"}<select name="kind" className="ml-3 rounded-lg border p-2">{teacher ? <><option value="material">{sk ? "Materiál" : "Material"}</option><option value="homework_assignment">{sk ? "Zadanie domácej úlohy" : "Homework assignment"}</option></> : <option value="homework_submission">{sk ? "Vypracovaná domáca úloha" : "Homework submission"}</option>}</select></label>
      <label className="block text-sm">{sk ? "Názov" : "Title"}<input name="title" required maxLength={150} className="mt-1 block w-full rounded-xl border p-3" /></label>
      <label className="block text-sm">{sk ? "Súbor (PDF, PNG, JPG, TXT; do 3 MB)" : "File (PDF, PNG, JPG, TXT; up to 3 MB)"}<input name="file" type="file" required onChange={event => {
        const file = event.target.files?.[0];
        setFileError(file && file.size > LEARNING_FILE_LIMIT ? (sk ? "Vyberte súbor do 3 MB." : "Choose a file up to 3 MB.") : "");
      }} accept="application/pdf,image/png,image/jpeg,text/plain" className="mt-2 block max-w-full" /></label>
    </fieldset>
    {fileError && <p role="alert" className="text-sm text-red-700">{fileError}</p>}
    {state.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
    {state.success && <p role="status" className="text-sm text-[#2F3AA2]">{state.success}</p>}
    <button type="submit" disabled={pending || !!fileError} className="rounded-xl bg-[#2F3AA2] px-5 py-3 font-semibold text-white disabled:opacity-50">{pending ? (sk ? "Nahrávam…" : "Uploading…") : (sk ? "Nahrať súbor" : "Upload file")}</button>
  </form>;
}
