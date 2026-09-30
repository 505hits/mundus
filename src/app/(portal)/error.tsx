"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function StudentPortalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#f7f8f5] px-5 py-10 text-[#183f38]">
      <div className="w-full max-w-lg rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-700">
          <AlertCircle size={24} />
        </div>
        <h1 className="mt-5 text-2xl font-semibold">
          Niečo sa nepodarilo načítať
        </h1>
        <p className="mt-2 leading-7 text-gray-500">
          Vaše údaje zostali v bezpečí. Skúste stránku načítať znova.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#183f38] px-5 py-3 font-semibold text-white"
        >
          <RefreshCw size={17} />
          Skúsiť znova
        </button>
      </div>
    </main>
  );
}
