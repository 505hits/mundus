"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import {useLanguage} from "@/context/LanguageContext";

export default function TeacherPortalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const {language}=useLanguage(); const sk=language==="sk";
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#FAFAF9] px-5 py-10 text-[#0a0a0f]">
      <div role="alert" className="w-full max-w-lg rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-700">
          <AlertCircle size={24} />
        </div>
        <h1 className="mt-5 text-2xl font-semibold">
          {sk?"Niečo sa nepodarilo načítať":"Something could not be loaded"}
        </h1>
        <p className="mt-2 leading-7 text-gray-500">
          {sk?"Skúste stránku načítať znova. Ak problém pretrváva, kontaktujte Mundus Languages.":"Try loading the page again. If the problem continues, contact Mundus Languages."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#2F3AA2] px-5 py-3 font-semibold text-white"
        >
          <RefreshCw size={17} />
          {sk?"Skúsiť znova":"Try again"}
        </button>
      </div>
    </main>
  );
}
