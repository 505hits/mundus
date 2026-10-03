export default function PortalLoading() {
  return (
    <main className="min-h-screen bg-[#FAFAF9] px-5 py-10 text-[#0a0a0f]">
      <div className="mx-auto max-w-7xl">
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
