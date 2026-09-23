import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Video,
} from "lucide-react";

const upcomingLessons = [
  {
    date: "24 SEP",
    day: "Thursday",
    time: "18:00",
    subject: "English · Conversation",
    teacher: "Your Mundus teacher",
    next: true,
  },
  {
    date: "29 SEP",
    day: "Tuesday",
    time: "17:30",
    subject: "English lesson",
    teacher: "Your Mundus teacher",
    next: false,
  },
  {
    date: "06 OCT",
    day: "Tuesday",
    time: "18:00",
    subject: "English lesson",
    teacher: "Your Mundus teacher",
    next: false,
  },
];

const completedLessons = [
  {
    date: "17 September",
    topic: "Work conversations",
    note: "Useful vocabulary and speaking practice",
  },
  {
    date: "10 September",
    topic: "Everyday communication",
    note: "Fluency and confidence practice",
  },
  {
    date: "3 September",
    topic: "Introductions & small talk",
    note: "Speaking practice and useful expressions",
  },
];

export default function LessonsPage() {
  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#183f38]">
      {/* Header */}
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium">
            <ArrowLeft size={17} />
            Dashboard
          </Link>

          <p className="text-sm font-semibold">Mundus Learning Portal</p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-10">
        {/* Page intro */}
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9a8049]">
            My lessons
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Your lesson schedule
          </h1>

          <p className="mt-2 max-w-2xl text-gray-500">
            See your upcoming lessons, join your next class and review what
            you&apos;ve already completed.
          </p>
        </section>

        {/* Package */}
        <section className="mt-8 flex flex-col gap-5 rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-400">Current package</p>

            <div className="mt-1 flex items-end gap-2">
              <span className="text-3xl font-semibold">7</span>
              <span className="pb-1 text-sm text-gray-500">
                lessons remaining
              </span>
            </div>
          </div>

          <div className="w-full sm:max-w-xs">
            <div className="flex justify-between text-xs text-gray-400">
              <span>3 completed</span>
              <span>10 total</span>
            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#edf0ec]">
              <div className="h-full w-[30%] rounded-full bg-[#c6a65b]" />
            </div>
          </div>
        </section>

        {/* Upcoming lessons */}
        <section className="mt-8">
          <div className="flex items-center gap-2">
            <CalendarDays size={20} className="text-[#9a8049]" />
            <h2 className="text-xl font-semibold">Upcoming lessons</h2>
          </div>

          <div className="mt-4 space-y-4">
            {upcomingLessons.map((lesson) => (
              <article
                key={`${lesson.date}-${lesson.time}`}
                className={`rounded-3xl border p-5 shadow-sm sm:p-6 ${
                  lesson.next
                    ? "border-[#183f38]/10 bg-[#183f38] text-white"
                    : "border-black/5 bg-white"
                }`}
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl ${
                        lesson.next
                          ? "bg-white/10"
                          : "bg-[#eef3ef] text-[#183f38]"
                      }`}
                    >
                      <span className="text-xs font-semibold">
                        {lesson.date.split(" ")[1]}
                      </span>
                      <span className="text-xl font-semibold">
                        {lesson.date.split(" ")[0]}
                      </span>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{lesson.subject}</h3>

                        {lesson.next && (
                          <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold">
                            Next lesson
                          </span>
                        )}
                      </div>

                      <div
                        className={`mt-2 flex flex-wrap gap-3 text-sm ${
                          lesson.next ? "text-white/65" : "text-gray-400"
                        }`}
                      >
                        <span>{lesson.day}</span>

                        <span className="flex items-center gap-1.5">
                          <Clock3 size={15} />
                          {lesson.time}
                        </span>
                      </div>

                      <p
                        className={`mt-2 text-sm ${
                          lesson.next ? "text-white/50" : "text-gray-400"
                        }`}
                      >
                        {lesson.teacher}
                      </p>
                    </div>
                  </div>

                  {lesson.next ? (
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <button
                        disabled
                        className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#183f38]"
                      >
                        <Video size={17} />
                        Join lesson
                      </button>

                      <button
                        disabled
                        className="rounded-xl border border-white/20 px-4 py-3 text-sm font-medium"
                      >
                        Request a change
                      </button>
                    </div>
                  ) : (
                    <button
                      disabled
                      className="flex items-center gap-1 text-sm font-medium text-gray-400"
                    >
                      Details
                      <ChevronRight size={16} />
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Important scheduling rule */}
        <section className="mt-6 rounded-2xl border border-[#c6a65b]/20 bg-[#faf6eb] p-5">
          <p className="text-sm font-semibold text-[#7e693a]">
            Need a different time?
          </p>

          <p className="mt-1 text-sm leading-6 text-[#7e693a]/80">
            Send a change request to your teacher. Your lesson stays at its
            original time until the new time is confirmed.
          </p>
        </section>

        {/* Lesson history */}
        <section className="mt-10">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={20} className="text-[#9a8049]" />
            <h2 className="text-xl font-semibold">Completed lessons</h2>
          </div>

          <div className="mt-4 overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
            {completedLessons.map((lesson, index) => (
              <div
                key={lesson.date}
                className={`flex items-center justify-between gap-5 p-5 sm:p-6 ${
                  index !== completedLessons.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
              >
                <div>
                  <p className="font-semibold">{lesson.topic}</p>
                  <p className="mt-1 text-sm text-gray-400">
                    {lesson.date} · {lesson.note}
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

        <p className="mt-8 text-center text-xs text-gray-400">
          Preview data · Mundus Learning Portal
        </p>
      </div>
    </main>
  );
}
