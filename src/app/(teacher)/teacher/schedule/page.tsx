import {
  CalendarDays,
  Check,
  Clock3,
  Plus,
  RefreshCw,
  Video,
} from "lucide-react";

const lessons = [
  {
    student: "Emma K.",
    level: "B1",
    date: "24 September",
    day: "Thursday",
    time: "15:00",
    status: "Next",
  },
  {
    student: "Martin S.",
    level: "A2",
    date: "24 September",
    day: "Thursday",
    time: "17:30",
    status: "Scheduled",
  },
  {
    student: "Lucia P.",
    level: "B2",
    date: "24 September",
    day: "Thursday",
    time: "19:00",
    status: "Scheduled",
  },
  {
    student: "Peter M.",
    level: "B1",
    date: "29 September",
    day: "Tuesday",
    time: "18:00",
    status: "Scheduled",
  },
];

export default function TeacherSchedulePage() {
  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#183f38]">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        {/* Intro */}
        <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9a8049]">
              Schedule
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Your lessons
            </h1>

            <p className="mt-2 text-gray-500">
              Manage upcoming lessons and student schedule requests.
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

        {/* Change requests */}
        <section className="mt-8">
          <div className="flex items-center gap-2">
            <RefreshCw size={19} className="text-[#9a8049]" />
            <h2 className="text-xl font-semibold">Change requests</h2>
          </div>

          <div className="mt-4 rounded-3xl border border-[#c6a65b]/20 bg-[#faf6eb] p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-[#7e693a]">Emma K.</p>

                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-[#9a8049]">
                    New request
                  </span>
                </div>

                <p className="mt-3 text-sm text-[#7e693a]/70">
                  English · B1
                </p>

                <div className="mt-4 flex flex-col gap-2 text-sm text-[#7e693a] sm:flex-row sm:gap-6">
                  <span>
                    <strong>Current:</strong> Thursday · 15:00
                  </span>

                  <span>
                    <strong>Requested:</strong> Friday · 16:30
                  </span>
                </div>

                <p className="mt-3 text-sm italic text-[#7e693a]/65">
                  “Would Friday afternoon work instead?”
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  disabled
                  className="flex items-center gap-2 rounded-xl bg-[#183f38] px-4 py-2.5 text-sm font-semibold text-white"
                >
                  <Check size={16} />
                  Accept
                </button>

                <button
                  disabled
                  className="rounded-xl border border-[#7e693a]/20 bg-white px-4 py-2.5 text-sm font-medium text-[#7e693a]"
                >
                  Suggest another time
                </button>

                <button
                  disabled
                  className="rounded-xl px-4 py-2.5 text-sm font-medium text-[#7e693a]/65"
                >
                  Keep original
                </button>
              </div>
            </div>
          </div>

          <p className="mt-3 text-xs text-gray-400">
            The original lesson time stays confirmed until you approve a
            change.
          </p>
        </section>

        {/* Upcoming lessons */}
        <section className="mt-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Upcoming</p>
              <h2 className="mt-1 text-xl font-semibold">
                Scheduled lessons
              </h2>
            </div>

            <CalendarDays size={21} className="text-[#9a8049]" />
          </div>

          <div className="mt-4 space-y-3">
            {lessons.map((lesson, index) => (
              <article
                key={`${lesson.student}-${lesson.date}-${lesson.time}`}
                className={`rounded-3xl border p-5 shadow-sm sm:p-6 ${
                  index === 0
                    ? "border-[#183f38]/10 bg-[#183f38] text-white"
                    : "border-black/5 bg-white"
                }`}
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl ${
                        index === 0 ? "bg-white/10" : "bg-[#eef3ef]"
                      }`}
                    >
                      <Clock3 size={18} />
                      <span className="mt-1 text-sm font-semibold">
                        {lesson.time}
                      </span>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{lesson.student}</h3>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            index === 0
                              ? "bg-white/10"
                              : "bg-[#eef3ef] text-[#527064]"
                          }`}
                        >
                          {lesson.status}
                        </span>
                      </div>

                      <p
                        className={`mt-2 text-sm ${
                          index === 0 ? "text-white/60" : "text-gray-400"
                        }`}
                      >
                        English · {lesson.level}
                      </p>

                      <p
                        className={`mt-1 text-sm ${
                          index === 0 ? "text-white/60" : "text-gray-500"
                        }`}
                      >
                        {lesson.day}, {lesson.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      disabled
                      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold ${
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
                      className={`rounded-xl border px-4 py-2.5 text-sm font-medium ${
                        index === 0
                          ? "border-white/20 text-white"
                          : "border-gray-200 text-gray-500"
                      }`}
                    >
                      Manage
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Scheduling rules */}
        <section className="mt-8 rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
          <h2 className="font-semibold">Scheduling</h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
            You control confirmed lesson times. Students can request a change,
            but a lesson only moves after you or a Mundus administrator
            approves the new time.
          </p>
        </section>

        <p className="mt-8 text-center text-xs text-gray-400">
          Preview data · Mundus Teacher Portal
        </p>
      </div>
    </main>
  );
}
