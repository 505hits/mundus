import Link from "next/link";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  GraduationCap,
  Users,
  Video,
} from "lucide-react";

const todaysLessons = [
  {
    student: "Emma K.",
    language: "English",
    level: "B1",
    time: "15:00",
    type: "Conversation",
  },
  {
    student: "Martin S.",
    language: "English",
    level: "A2",
    time: "17:30",
    type: "General English",
  },
  {
    student: "Lucia P.",
    language: "English",
    level: "B2",
    time: "19:00",
    type: "Business English",
  },
];

const students = [
  {
    name: "Emma K.",
    language: "English",
    level: "B1",
    next: "Today · 15:00",
    homework: "Completed",
  },
  {
    name: "Martin S.",
    language: "English",
    level: "A2",
    next: "Today · 17:30",
    homework: "To review",
  },
  {
    name: "Lucia P.",
    language: "English",
    level: "B2",
    next: "Today · 19:00",
    homework: "No homework",
  },
  {
    name: "Peter M.",
    language: "English",
    level: "B1",
    next: "29 Sep · 18:00",
    homework: "To do",
  },
];

export default function TeacherDashboardPage() {
  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#183f38]">
      {/* Header */}
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="text-xl font-bold tracking-tight">
            mundus
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">Teacher Portal</p>
              <p className="text-xs text-gray-400">Preview account</p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#183f38] text-sm font-semibold text-white">
              T
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        {/* Intro */}
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9a8049]">
            Teacher dashboard
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Good morning 👋
          </h1>

          <p className="mt-2 text-gray-500">
            Here&apos;s what&apos;s happening with your students today.
          </p>
        </section>

        {/* Overview */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">Today</p>
              <CalendarDays size={19} className="text-[#9a8049]" />
            </div>
            <p className="mt-3 text-3xl font-semibold">3</p>
            <p className="mt-1 text-sm text-gray-500">lessons</p>
          </article>

          <article className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">My students</p>
              <Users size={19} className="text-[#9a8049]" />
            </div>
            <p className="mt-3 text-3xl font-semibold">8</p>
            <p className="mt-1 text-sm text-gray-500">active students</p>
          </article>

          <article className="rounded-3xl border border-[#c6a65b]/20 bg-[#faf6eb] p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#7e693a]/70">Change requests</p>
              <Clock3 size={19} className="text-[#9a8049]" />
            </div>
            <p className="mt-3 text-3xl font-semibold text-[#7e693a]">2</p>
            <p className="mt-1 text-sm text-[#7e693a]/70">
              waiting for you
            </p>
          </article>

          <article className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">Reports</p>
              <CheckCircle2 size={19} className="text-[#9a8049]" />
            </div>
            <p className="mt-3 text-3xl font-semibold">1</p>
            <p className="mt-1 text-sm text-gray-500">to complete</p>
          </article>
        </div>

        {/* Today's lessons */}
        <section className="mt-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Schedule</p>
              <h2 className="mt-1 text-xl font-semibold">
                Today&apos;s lessons
              </h2>
            </div>

            <button
              disabled
              className="rounded-xl bg-[#183f38] px-4 py-2.5 text-sm font-semibold text-white"
            >
              + Add lesson
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {todaysLessons.map((lesson, index) => (
              <article
                key={`${lesson.student}-${lesson.time}`}
                className={`rounded-3xl border p-5 shadow-sm sm:p-6 ${
                  index === 0
                    ? "border-[#183f38]/10 bg-[#183f38] text-white"
                    : "border-black/5 bg-white"
                }`}
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl text-sm font-semibold ${
                        index === 0
                          ? "bg-white/10"
                          : "bg-[#eef3ef] text-[#183f38]"
                      }`}
                    >
                      {lesson.time}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{lesson.student}</h3>

                        {index === 0 && (
                          <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold">
                            Next
                          </span>
                        )}
                      </div>

                      <p
                        className={`mt-1 text-sm ${
                          index === 0 ? "text-white/60" : "text-gray-400"
                        }`}
                      >
                        {lesson.language} · {lesson.level} · {lesson.type}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      disabled
                      className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${
                        index === 0
                          ? "bg-white text-[#183f38]"
                          : "bg-[#eef3ef] text-[#183f38]"
                      }`}
                    >
                      <Video size={17} />
                      Join lesson
                    </button>

                    <button
                      disabled
                      className={`rounded-xl border px-4 py-3 text-sm font-medium ${
                        index === 0
                          ? "border-white/20 text-white"
                          : "border-gray-200 text-gray-500"
                      }`}
                    >
                      Student
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Needs attention */}
        <section className="mt-10">
          <div className="flex items-center gap-2">
            <AlertCircle size={20} className="text-[#9a8049]" />
            <h2 className="text-xl font-semibold">Needs your attention</h2>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <article className="rounded-3xl border border-[#c6a65b]/20 bg-[#faf6eb] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9a8049]">
                Schedule change
              </p>

              <h3 className="mt-3 font-semibold text-[#7e693a]">
                Emma K. requested a new lesson time
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#7e693a]/75">
                Current: Thursday · 15:00
                <br />
                Requested: Friday · 16:30
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  disabled
                  className="rounded-xl bg-[#183f38] px-4 py-2.5 text-sm font-semibold text-white"
                >
                  Accept
                </button>

                <button
                  disabled
                  className="rounded-xl border border-[#7e693a]/20 bg-white px-4 py-2.5 text-sm font-medium text-[#7e693a]"
                >
                  Suggest another time
                </button>
              </div>
            </article>

            <article className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9a8049]">
                Lesson report
              </p>

              <h3 className="mt-3 font-semibold">
                Report missing for Peter M.
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Lesson completed yesterday. Add a short progress note and
                homework if needed.
              </p>

              <button
                disabled
                className="mt-5 rounded-xl bg-[#eef3ef] px-4 py-2.5 text-sm font-semibold"
              >
                Complete report
              </button>
            </article>
          </div>
        </section>

        {/* Students */}
        <section className="mt-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Students</p>
              <h2 className="mt-1 text-xl font-semibold">My students</h2>
            </div>

            <GraduationCap size={21} className="text-[#9a8049]" />
          </div>

          <div className="mt-4 overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
            {students.map((student, index) => (
              <div
                key={student.name}
                className={`flex items-center justify-between gap-4 p-5 sm:p-6 ${
                  index !== students.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{student.name}</p>

                    <span className="rounded-full bg-[#eef3ef] px-2.5 py-1 text-xs font-semibold">
                      {student.level}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-gray-400">
                    {student.language} · Next: {student.next}
                  </p>

                  <p className="mt-2 text-xs text-gray-500">
                    Homework: {student.homework}
                  </p>
                </div>

                <ChevronRight
                  size={18}
                  className="shrink-0 text-gray-300"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Availability */}
        <section className="mt-6 flex flex-col gap-5 rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-400">Teacher availability</p>
            <p className="mt-1 font-semibold">
              Accepting new students
            </p>
          </div>

          <span className="inline-flex w-fit rounded-full bg-[#eaf4ed] px-3 py-1.5 text-xs font-semibold text-[#527064]">
            Available
          </span>
        </section>

        <p className="mt-8 text-center text-xs text-gray-400">
          Preview data · Mundus Teacher Portal
        </p>
      </div>
    </main>
  );
}
