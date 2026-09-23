import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  Clock3,
} from "lucide-react";

const completedLessons = [
  {
    student: "Emma K.",
    language: "English",
    level: "B1",
    date: "22 September",
    time: "15:00",
    report: "Missing",
  },
  {
    student: "Martin S.",
    language: "English",
    level: "A2",
    date: "21 September",
    time: "17:30",
    report: "Completed",
  },
  {
    student: "Lucia P.",
    language: "English",
    level: "B2",
    date: "20 September",
    time: "19:00",
    report: "Completed",
  },
];

export default function TeacherReportsPage() {
  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#183f38]">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9a8049]">
            Reports
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Lesson reports
          </h1>

          <p className="mt-2 max-w-2xl text-gray-500">
            Add a short update after each lesson so the student&apos;s learning
            journey stays up to date.
          </p>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <ClipboardList size={20} className="text-[#9a8049]" />
            <p className="mt-4 text-3xl font-semibold">3</p>
            <p className="mt-1 text-sm text-gray-500">Recent lessons</p>
          </div>

          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <AlertCircle size={20} className="text-[#9a8049]" />
            <p className="mt-4 text-3xl font-semibold">1</p>
            <p className="mt-1 text-sm text-gray-500">Report needed</p>
          </div>

          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <CheckCircle2 size={20} className="text-[#9a8049]" />
            <p className="mt-4 text-3xl font-semibold">2</p>
            <p className="mt-1 text-sm text-gray-500">Completed reports</p>
          </div>
        </section>

        <section className="mt-8">
          <div>
            <p className="text-sm text-gray-400">Recent activity</p>
            <h2 className="mt-1 text-xl font-semibold">
              Completed lessons
            </h2>
          </div>

          <div className="mt-4 space-y-3">
            {completedLessons.map((lesson, index) => (
              <article
                key={`${lesson.student}-${lesson.date}`}
                className={`rounded-3xl border p-5 shadow-sm sm:p-6 ${
                  lesson.report === "Missing"
                    ? "border-[#c6a65b]/20 bg-[#faf6eb]"
                    : "border-black/5 bg-white"
                }`}
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{lesson.student}</h3>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          lesson.report === "Missing"
                            ? "bg-white text-[#9a8049]"
                            : "bg-[#eef3ef] text-[#527064]"
                        }`}
                      >
                        {lesson.report === "Missing"
                          ? "Report needed"
                          : "Report completed"}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-gray-500">
                      {lesson.language} · {lesson.level}
                    </p>

                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
                      <Clock3 size={15} />
                      {lesson.date} · {lesson.time}
                    </div>
                  </div>

                  {index === 0 ? (
                    <button
                      disabled
                      className="rounded-xl bg-[#183f38] px-5 py-2.5 text-sm font-semibold text-white"
                    >
                      Add report
                    </button>
                  ) : (
                    <button
                      disabled
                      className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500"
                    >
                      View report
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <ClipboardList size={19} className="text-[#9a8049]" />
            <h2 className="font-semibold">Quick lesson report</h2>
          </div>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Reports are intentionally short. After a lesson, record the topic,
            how the student is progressing, homework if needed, and the next
            focus.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="text-sm font-medium">
              Lesson topic
              <input
                disabled
                placeholder="e.g. Past tense & conversation"
                className="mt-2 w-full rounded-xl border border-gray-200 bg-[#fafafa] px-4 py-3 font-normal text-gray-500"
              />
            </label>

            <label className="text-sm font-medium">
              Progress
              <select
                disabled
                className="mt-2 w-full rounded-xl border border-gray-200 bg-[#fafafa] px-4 py-3 font-normal text-gray-500"
              >
                <option>Good progress</option>
                <option>Normal progress</option>
                <option>Needs attention</option>
              </select>
            </label>

            <label className="text-sm font-medium md:col-span-2">
              Student-visible note
              <textarea
                disabled
                rows={3}
                placeholder="What went well and what should the student focus on next?"
                className="mt-2 w-full resize-none rounded-xl border border-gray-200 bg-[#fafafa] px-4 py-3 font-normal text-gray-500"
              />
            </label>

            <label className="text-sm font-medium">
              Homework
              <input
                disabled
                placeholder="Optional"
                className="mt-2 w-full rounded-xl border border-gray-200 bg-[#fafafa] px-4 py-3 font-normal text-gray-500"
              />
            </label>

            <label className="text-sm font-medium">
              Next focus
              <input
                disabled
                placeholder="e.g. Speaking confidence"
                className="mt-2 w-full rounded-xl border border-gray-200 bg-[#fafafa] px-4 py-3 font-normal text-gray-500"
              />
            </label>

            <label className="text-sm font-medium md:col-span-2">
              Private teacher note
              <textarea
                disabled
                rows={2}
                placeholder="Visible only to teachers and Mundus admin"
                className="mt-2 w-full resize-none rounded-xl border border-gray-200 bg-[#fafafa] px-4 py-3 font-normal text-gray-500"
              />
            </label>
          </div>

          <button
            disabled
            className="mt-6 rounded-xl bg-[#183f38] px-5 py-3 text-sm font-semibold text-white"
          >
            Save lesson report
          </button>
        </section>

        <p className="mt-8 text-center text-xs text-gray-400">
          Preview data · Mundus Teacher Portal
        </p>
      </div>
    </main>
  );
}
