import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  ChevronRight,
  Clock3,
  FileText,
  GraduationCap,
  Video,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#183f38]">
      {/* Top navigation */}
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="text-xl font-bold tracking-tight">
            mundus
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-[#183f38]">
                Student Portal
              </p>
              <p className="text-xs text-gray-400">Preview account</p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#183f38] text-sm font-semibold text-white">
              S
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        {/* Welcome */}
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9a8049]">
            My learning
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Welcome back 👋
          </h1>

          <p className="mt-2 text-gray-500">
            Here&apos;s what&apos;s happening with your English course.
          </p>
        </section>

        {/* Main grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Next lesson */}
          <section className="rounded-3xl bg-[#183f38] p-6 text-white shadow-sm lg:col-span-2 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-white/60">
                  Your next lesson
                </p>

                <h2 className="mt-3 text-2xl font-semibold">
                  English · Conversation
                </h2>

                <div className="mt-5 flex flex-wrap gap-4 text-sm text-white/75">
                  <span className="flex items-center gap-2">
                    <CalendarDays size={17} />
                    Thursday, 24 September
                  </span>

                  <span className="flex items-center gap-2">
                    <Clock3 size={17} />
                    18:00
                  </span>
                </div>

                <p className="mt-4 text-sm text-white/60">
                  with your Mundus teacher
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-3">
                <GraduationCap size={25} />
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                disabled
                className="flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 font-semibold text-[#183f38]"
              >
                <Video size={18} />
                Join lesson
              </button>

              <button
                disabled
                className="rounded-2xl border border-white/20 px-5 py-3.5 font-medium text-white"
              >
                Request a change
              </button>
            </div>
          </section>

          {/* Lessons left */}
          <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium text-gray-500">
              Current package
            </p>

            <div className="mt-4 flex items-end gap-2">
              <span className="text-5xl font-semibold tracking-tight">7</span>
              <span className="pb-1 text-gray-400">lessons left</span>
            </div>

            <div className="mt-6 h-2 overflow-hidden rounded-full bg-[#edf0ec]">
              <div className="h-full w-[30%] rounded-full bg-[#c6a65b]" />
            </div>

            <p className="mt-3 text-sm text-gray-400">
              3 of 10 lessons completed
            </p>
          </section>
        </div>

        {/* Course + progress */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Current level</p>
                <h2 className="mt-1 text-2xl font-semibold">B1 English</h2>
              </div>

              <div className="rounded-2xl bg-[#eef3ef] p-3">
                <BookOpen size={22} />
              </div>
            </div>

            <div className="mt-7">
              <p className="text-sm font-medium text-gray-600">
                Learning goal
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Speak more confidently in everyday and work conversations.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#9a8049]">
              View my progress
              <ChevronRight size={16} />
            </div>
          </section>

          {/* Homework */}
          <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Homework</p>
                <h2 className="mt-1 text-xl font-semibold">
                  Practice: Work conversations
                </h2>
              </div>

              <div className="rounded-2xl bg-[#f7f2e7] p-3 text-[#9a8049]">
                <FileText size={22} />
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-gray-500">
              Review today&apos;s vocabulary and prepare a short conversation
              for your next lesson.
            </p>

            <div className="mt-6 inline-flex rounded-full bg-[#fff7e6] px-3 py-1.5 text-xs font-semibold text-[#9a8049]">
              To do
            </div>
          </section>
        </div>

        {/* Upcoming */}
        <section className="mt-6 rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Schedule</p>
              <h2 className="mt-1 text-xl font-semibold">Upcoming lessons</h2>
            </div>

            <CalendarDays size={21} className="text-[#9a8049]" />
          </div>

          <div className="mt-6 divide-y divide-gray-100">
            <div className="flex items-center justify-between gap-4 py-4">
              <div>
                <p className="font-medium">English lesson</p>
                <p className="mt-1 text-sm text-gray-400">
                  Thursday, 24 September · 18:00
                </p>
              </div>

              <span className="rounded-full bg-[#eef3ef] px-3 py-1.5 text-xs font-semibold">
                Next
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 py-4">
              <div>
                <p className="font-medium">English lesson</p>
                <p className="mt-1 text-sm text-gray-400">
                  Tuesday, 29 September · 17:30
                </p>
              </div>

              <ChevronRight size={18} className="text-gray-300" />
            </div>
          </div>
        </section>

        <p className="mt-8 text-center text-xs text-gray-400">
          Preview data · Mundus Learning Portal
        </p>
      </div>
    </main>
  );
}
