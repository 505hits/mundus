import Link from "next/link";
export default function AssessmentUnavailable() {
  return <div role="status" className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950"><p>Test momentálne nie je dostupný. Skúste to neskôr. S určením úrovne alebo kontrolou pokroku vám zatiaľ pomôže lektor.</p><Link href="/contact" className="mt-3 inline-block font-semibold underline">Kontaktovať Mundus</Link></div>;
}
