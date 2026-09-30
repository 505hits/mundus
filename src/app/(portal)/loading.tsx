export default function StudentPortalLoading() {
  return (
    <main className="min-h-screen bg-[#f7f8f5] px-5 py-10 text-[#183f38]">
      <div className="mx-auto max-w-6xl">
        <div className="h-4 w-28 animate-pulse rounded-full bg-black/10" />
        <div className="mt-4 h-10 w-64 max-w-full animate-pulse rounded-2xl bg-black/10" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-36 animate-pulse rounded-3xl border border-black/5 bg-white"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
