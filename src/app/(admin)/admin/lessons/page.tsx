import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Plus,
  Video,
} from "lucide-react";

const lessons = [
  {
    student: "Emma K.",
    teacher: "Anna",
    language: "English",
    date: "24 Sep",
    time: "15:00",
    status: "Scheduled",
    charge: "Pending",
  },
  {
    student: "Martin S.",
    teacher: "Anna",
    language: "English",
    date: "24 Sep",
    time: "17:30",
    status: "Scheduled",
    charge: "Pending",
  },
  {
    student: "Lucia P.",
    teacher: "Anna",
    language: "English",
    date: "24 Sep",
    time: "19:00",
    status: "Scheduled",
    charge: "Pending",
  },
  {
    student: "Peter M.",
    teacher: "Anna",
    language: "English",
    date: "23 Sep",
    time: "18:00",
    status: "Completed",
    charge: "1 lesson",
  },
  {
    student: "Emma K.",
    teacher: "Anna",
    language: "English",
    date: "22 Sep",
    time: "15:00",
    status: "Completed",
    charge: "1 lesson",
  },
];

export default function AdminLessonsPage() {
  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#183f38]">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9a8049]">
              Lessons
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Lesson management
            </h1>

            <p className="mt-2 text-gray-500">
              See and manage lessons across all Mundus students and teachers.
            </p>
          </div>

          <button
            disabled
            className="flex w-fit items-center gap-2 rounded-xl bg-[#183f38] px-5 py-3 text-sm font-semibold text-white"
          >
            <Plus size={18} />
            Add lesson
          </button>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <CalendarDays size={20} className="text-[#9a8049]" />
            <p className="mt-4 text-3xl font-semibold">3</p>
            <p className="mt-1 text-sm text-gray-500">Today</p>
          </div>

          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <Clock3 size={20} className="text-[#9a8049]" />
            <p className="mt-4 text-3xl font-semibold">31</p>
            <p className="mt-1 text-sm text-gray-500">This week</p>
          </div>

          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <CheckCircle2 size={20} className="text-[#9a8049]" />
            <p className="mt-4 text-3xl font-semibold">24</p>
            <p className="mt-1 text-sm text-gray-500">
              Completed this week
            </p>
          </div>

          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <AlertCircle size={20} className="text-[#9a8049]" />
            <p className="mt-4 text-3xl font-semibold">1</p>
            <p className="mt-1 text-sm text-gray-500">
              Needs attention
            </p>
          </div>
        </section>

        <section className="mt-8">
          <div className="flex flex-wrap gap-2">
            {["All lessons", "Scheduled", "Completed", "Cancelled"].map(
              (filter, index) => (
                <button
                  key={filter}
                  disabled
                  className={`rounded-xl px-4 py-2 text-sm font-medium ${
                    index === 0
                      ? "bg-[#183f38] text-white"
                      : "border border-black/5 bg-white text-gray-500"
                  }`}
                >
                  {filter}
                </button>
              )
            )}
          </div>

          <div className="mt-5 overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
            <div className="hidden grid-cols-[1.2fr_1fr_0.8fr_0.8fr_0.9fr_0.8fr] gap-4 border-b border-gray-100 px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400 lg:grid">
              <span>Student</span>
              <span>Teacher</span>
              <span>Date</span>
              <span>Time</span>
              <span>Status</span>
              <span>Package</span>
            </div>

            <div className="divide-y divide-gray-100">
              {lessons.map((lesson, index) => (
                <div
                  key={`${lesson.student}-${lesson.date}-${lesson.time}`}
                  className="grid gap-4 px-5 py-5 lg:grid-cols-[1.2fr_1fr_0.8fr_0.8fr_0.9fr_0.8fr] lg:items-center lg:px-6"
                >
                  <div>
                    <p className="font-semibold">{lesson.student}</p>
                    <p className="mt-1 text-sm text-gray-400">
                      {lesson.language}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 lg:hidden">
                      Teacher
                    </p>
                    <p className="mt-1 text-sm font-medium lg:mt-0">
                      {lesson.teacher}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 lg:hidden">
                      Date
                    </p>
                    <p className="mt-1 text-sm lg:mt-0">
                      {lesson.date}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 lg:hidden">
                      Time
                    </p>
                    <p className="mt-1 text-sm font-semibold lg:mt-0">
                      {lesson.time}
                    </p>
                  </div>

                  <div>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        lesson.status === "Completed"
                          ? "bg-[#eef3ef] text-[#527064]"
                          : "bg-[#f4f1e8] text-[#9a8049]"
                      }`}
                    >
                      {lesson.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-gray-500">
                      {lesson.charge}
                    </span>

                    {index === 0 && (
                      <button
                        disabled
                        aria-label="Open lesson"
                        className="text-[#183f38]"
                      >
                        <Video size={17} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
          <h2 className="font-semibold">How lesson credits work</h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
            A lesson should only reduce a student&apos;s package balance after
            it is marked as completed or otherwise chargeable according to
            Mundus cancellation rules. Rescheduled lessons should never be
            counted twice.
          </p>
        </section>

        <p className="mt-8 text-center text-xs text-gray-400">
          Preview data · Mundus Admin Portal
        </p>
      </div>
    </main>
  );
}
