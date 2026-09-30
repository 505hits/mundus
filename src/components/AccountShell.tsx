import Link from "next/link";
import type { ReactNode } from "react";

export default function AccountShell({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return <main className="flex min-h-screen items-center justify-center bg-[#f7f8f5] px-5 py-12 text-[#163f3a]">
    <section className="w-full max-w-lg rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-10">
      <Link href="/" className="text-xl font-bold">mundus</Link>
      <h1 className="mt-8 text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-3 text-sm leading-6 text-gray-600">{description}</p>
      <div className="mt-7">{children}</div>
    </section>
  </main>;
}
