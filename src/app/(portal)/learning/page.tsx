import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  FileText,
  Link2,
  Upload,
} from "lucide-react";

const materials = [
  {
    title: "Work conversation vocabulary",
    type: "PDF",
    lesson: "17 September · Work conversations",
    icon: FileText,
  },
  {
    title: "Useful phrases for meetings",
    type: "Document",
    lesson: "17 September · Work conversations",
    icon: BookOpen,
  },
  {
    title: "Listening practice",
    type: "Link",
    lesson: "10 September · Everyday communication",
    icon: Link2,
  },
];

export default function LearningPage() {
  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#183f38]">
      {/* Header */}
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <ArrowLeft size={17} />
            Dashboard
          </Link>

          <p className="text-sm font-semibold">Mundus Learning Portal</p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-10">
        {/* Intro */}
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9a8049]">
            Learning
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Homework & materials
          </h1>

          <p className="mt-2 max-w-2xl text-gray-500">
            Everything from your lessons, organized in one place.
          </p>
        </section>

        {/* Current homework */}
        <section className="mt-8 rounded-3xl bg-[#183f38] p-6 text-white shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#c6a65b] px-3 py-1 text-xs font-semibold text-white">
                  To do
                </span>

                <span className="text-sm text-white/50">
                  Next lesson
                </span>
              </div>

              <h2 className="mt-5 text-2xl font-semibold">
                Practice: Work conversations
              </h2>

              <p className="mt-3 max-w-xl leading-7 text-white/65">
                Review the vocabulary from your last lesson and prepare a
                short conversation about a typical situation at work.
              </p>

              <p className="mt-5 text-sm text-white/45">
                Assigned after your lesson on 17 September
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4">
              <FileText size={26} />
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              disabled
              className="flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-semibold text-[#183f38]"
            >
              <Upload size={17} />
              Submit homework
            </button>

            <button
              disabled
              className="rounded-2xl border border-white/20 px-5 py-3.5 text-sm font-medium"
            >
              Mark as completed
            </button>
          </div>
        </section>

        {/* Teacher note */}
        <section className="mt-5 rounded-2xl border border-[#c6a65b]/20 bg-[#faf6eb] p-5">
          <p className="text-sm font-semibold text-[#7e693a]">
            Teacher tip
          </p>

          <p className="mt-1 text-sm leading-6 text-[#7e693a]/80">
            Don&apos;t worry about being perfect. Focus on speaking naturally
            and using at least five of the new expressions.
          </p>
        </section>

        {/* Materials */}
        <section className="mt-10">
          <div className="flex items-center gap-2">
            <BookOpen size={20} className="text-[#9a8049]" />
            <h2 className="text-xl font-semibold">Lesson materials</h2>
          </div>

          <div className="mt-4 overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
            {materials.map((material, index) => {
              const Icon = material.icon;

              return (
                <div
                  key={material.title}
                  className={`flex items-center justify-between gap-4 p-5 sm:p-6 ${
                    index !== materials.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="shrink-0 rounded-2xl bg-[#eef3ef] p-3">
                      <Icon size={20} />
                    </div>

                    <div className="min-w-0">
                      <p className="font-semibold">{material.title}</p>

                      <p className="mt-1 text-sm text-gray-400">
                        {material.type} · {material.lesson}
                      </p>
                    </div>
                  </div>

                  <button
                    disabled
                    aria-label={`Open ${material.title}`}
                    className="shrink-0 text-gray-300"
                  >
                    {material.type === "Link" ? (
                      <ExternalLink size={18} />
                    ) : (
                      <ChevronRight size={18} />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Previous homework */}
        <section className="mt-10">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={20} className="text-[#9a8049]" />
            <h2 className="text-xl font-semibold">Previous homework</h2>
          </div>

          <div className="mt-4 space-y-3">
            <article className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">
                      Everyday communication practice
                    </p>

                    <span className="rounded-full bg-[#eef3ef] px-2.5 py-1 text-xs font-semibold text-[#527064]">
                      Reviewed
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-gray-400">
                    Lesson · 10 September
                  </p>

                  <p className="mt-4 text-sm leading-6 text-gray-500">
                    Teacher feedback: Good work. Your answers were clear and
                    you used the new expressions correctly.
                  </p>
                </div>

                <ChevronRight
                  size={18}
                  className="shrink-0 text-gray-300"
                />
              </div>
            </article>

            <article className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">
                      Introductions & small talk
                    </p>

                    <span className="rounded-full bg-[#eef3ef] px-2.5 py-1 text-xs font-semibold text-[#527064]">
                      Completed
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-gray-400">
                    Lesson · 3 September
                  </p>
                </div>

                <ChevronRight
                  size={18}
                  className="shrink-0 text-gray-300"
                />
              </div>
            </article>
          </div>
        </section>

        <p className="mt-8 text-center text-xs text-gray-400">
          Preview data · Mundus Learning Portal
        </p>
      </div>
    </main>
  );
}
