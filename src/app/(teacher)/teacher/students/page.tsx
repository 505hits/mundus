import Link from "next/link";
import { ArrowRight, BookOpen, Search, Users } from "lucide-react";

const students = [
  {
    name: "Emma K.",
    language: "English",
    level: "B1",
    remaining: 3,
    nextLesson: "24 Sep · 15:00",
    status: "Active",
  },
  {
    name: "Martin S.",
    language: "English",
    level: "A2",
    remaining: 7,
    nextLesson: "24 Sep · 17:30",
    status: "Active",
  },
  {
    name: "Lucia P.",
    language: "English",
    level: "B2",
    remaining: 2,
    nextLesson: "24 Sep · 19:00",
    status: "Active",
  },
  {
    name: "Peter M.",
    language: "English",
    level: "B1",
    remaining: 5,
    nextLesson: "29 Sep · 18:00",
    status: "Active",
  },
];

export default function TeacherStudentsPage() {
  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#183f38]">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9a8049]">
            Students
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            My students
          </h1>

          <p className="mt-2 text-gray-500">
            See your assigned students and their learning progress.
          </p>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <Users size={20} className="text-[#9a8049]" />
            <p className="mt-4 text-3xl font-semibold">4</p>
            <p className="mt-1 text-sm text-gray-500">Active students</p>
          </div>

          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <BookOpen size={20} className="text-[#9a8049]" />
            <p className="mt-4 text-3xl font-semibold">17</p>
            <p className="mt-1 text-sm text-gray-500">
              Lessons remaining
            </p>
          </div>

          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <span className="text-xl">✓</span>
            <p className="mt-4 text-3xl font-semibold">4</p>
            <p className="mt-1 text-sm text-gray-500">
              Students on track
            </p>
          </div>
        </section>

        <section className="mt-8">
          <div className="relative max-w-md">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              disabled
              placeholder="Search students..."
              className="w-full rounded-2xl border border-black/5 bg-white py-3 pl-11 pr-4 text-sm outline-none"
            />
          </div>

          <div className="mt-5 space-y-3">
            {students.map((student, index) => (
              <article
                key={student.name}
                className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#eef3ef] font-semibold text-[#183f38]">
                      {student.name.charAt(0)}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-semibold">{student.name}</h2>

                        <span className="rounded-full bg-[#eef3ef] px-2.5 py-1 text-xs font-semibold text-[#527064]">
                          {student.status}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-gray-500">
                        {student.language} · {student.level}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 md:flex md:items-center md:gap-8">
                    <div>
                      <p className="text-xs text-gray-400">Lessons left</p>
                      <p className="mt-1 text-sm font-semibold">
                        {student.remaining}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">Next lesson</p>
                      <p className="mt-1 text-sm font-medium">
                        {student.nextLesson}
                      </p>
                    </div>

                    {index === 0 ? (
                      <Link
                        href="/teacher/student"
                        className="flex items-center gap-2 rounded-xl bg-[#183f38] px-4 py-2.5 text-sm font-semibold text-white"
                      >
                        View student
                        <ArrowRight size={16} />
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="flex items-center gap-2 rounded-xl bg-[#eef3ef] px-4 py-2.5 text-sm font-semibold text-[#183f38]/50"
                      >
                        View student
                        <ArrowRight size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <p className="mt-8 text-center text-xs text-gray-400">
          Preview data · Mundus Teacher Portal
        </p>
      </div>
    </main>
  );
}
