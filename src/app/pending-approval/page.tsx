import Link from "next/link";

export default function PendingApprovalPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f8f5] px-6">
      <div className="w-full max-w-lg rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#163f3a]/10 text-2xl">
          ✓
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-[#8a7445]">
          Mundus Teacher Portal
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#163f3a]">
          Your account is being reviewed
        </h1>

        <p className="mt-4 leading-7 text-gray-500">
          Your teacher account has been created successfully. Mundus Languages
          needs to approve it before you can access the Teacher Portal.
        </p>

        <p className="mt-3 text-sm leading-6 text-gray-400">
          You&apos;ll be able to access your students, lessons and teaching
          tools once your account is approved.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex rounded-2xl bg-[#163f3a] px-6 py-3.5 font-semibold text-white transition hover:bg-[#12342f]"
        >
          Back to Mundus Languages
        </Link>
      </div>
    </main>
  );
}
