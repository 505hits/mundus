import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  MessageCircle,
  Target,
  TrendingUp,
  Video,
} from "lucide-react";

const lessonHistory = [
  {
    date: "17 Sep",
    topic: "Work conversations",
    status: "Completed",
  },
  {
    date: "10 Sep",
    topic: "Everyday communication",
    status: "Completed",
  },
  {
    date: "3 Sep",
    topic: "Introductions & small talk",
    status: "Completed",
  },
];

export default function TeacherStudentPage() {
  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#183f38]">
      {/* Header */}
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <Link
            href="/teacher/dashboard"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <ArrowLeft size={17} />
            Teacher dashboard
          </Link>

          <p className="text-sm font-semibold">Student overview</p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-10">
        {/* Student */}
        <section className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9a8049]">
              My student
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Emma K.
            </h1>

            <p className="mt-2 text-gray-500">
              English · B1 · Individual lessons
            </p>
          </div>

          <span className="w-fit rounded-full bg-[#eaf4ed] px-3 py-1.5 text-xs font-semibold text-[#527064]">
            Active student
          </span>
        </section>

        {/* Overview cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <BookOpen size={19} className="text-[#9a8049]" />
            <p className="mt-4 text-sm text-gray-400">Current level</p>
            <p className="mt-1 text-2xl font-semibold">B1</p>
          </article>

          <article className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <CheckCircle2 size={19} className="text-[#9a8049]" />
            <p className="mt-4 text-sm text-gray-400">Lessons completed</p>
            <p className="mt-1 text-2xl font-semibold">7</p>
          </article>

          <article className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <CalendarDays size={19} className="text-[#9a8049]" />
            <p className="mt-4 text-sm text-gray-400">Lessons remaining</p>
            <p className="mt-1 text-2xl font-semibold">3</p>
          </article>

          <article className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <TrendingUp size={19} className="text-[#9a8049]" />
            <p className="mt-4 text-sm text-gray-400">Progress</p>
            <p className="mt-1 text-sm font-semibold">Improving</p>
          </article>
        </div>

        {/* Next lesson */}
        <section className="mt-6 rounded-3xl bg-[#183f38] p-6 text-white shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-white/55">Next lesson</p>

              <h2 className="mt-2 text-2xl font-semibold">
                English · Conversation
              </h2>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/65">
                <span className="flex items-center gap-2">
                  <CalendarDays size={16} />
                  Thursday, 24 September
                </span>

                <span className="flex items-center gap-2">
                  <Clock3 size={16} />
                  15:00
                </span>
              </div>
            </div>

            <button
              disabled
              className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-[#183f38]"
            >
              <Video size={18} />
              Join lesson
            </button>
          </div>
        </section>

        {/* Goal + focus */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[#faf6eb] p-3 text-[#9a8049]">
                <Target size={21} />
              </div>

              <div>
                <p className="text-sm text-gray-400">Learning goal</p>
                <h2 className="font-semibold">Speak confidently at work</h2>
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-gray-500">
              Feel more comfortable speaking in meetings, everyday work
              conversations and situations where quick responses are needed.
            </p>
          </section>

          <section className="rounded-3xl border border-[#c6a65b]/20 bg-[#faf6eb] p-6">
            <div className="flex items-center gap-3">
              <TrendingUp size={21} className="text-[#9a8049]" />

              <div>
                <p className="text-sm text-[#7e693a]/65">Next focus</p>
                <h2 className="font-semibold text-[#7e693a]">
                  Longer, more natural answers
                </h2>
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-[#7e693a]/75">
              Continue building speaking confidence while improving grammar
              accuracy and using new vocabulary naturally.
            </p>
          </section>
        </div>

        {/* Homework */}
        <section className="mt-6 rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-[#eef3ef] p-3">
                <FileText size={21} />
              </div>

              <div>
                <p className="text-sm text-gray-400">Current homework</p>
                <h2 className="mt-1 text-lg font-semibold">
                  Work conversation practice
                </h2>
              </div>
            </div>

            <span className="rounded-full bg-[#eaf4ed] px-3 py-1.5 text-xs font-semibold text-[#527064]">
              Completed
            </span>
          </div>

          <p className="mt-5 text-sm leading-6 text-gray-500">
            Review the vocabulary from the last lesson and prepare a short
            example conversation for the next class.
          </p>

          <button
            disabled
            className="mt-5 rounded-xl bg-[#eef3ef] px-4 py-2.5 text-sm font-semibold"
          >
            Review homework
          </button>
        </section>

        {/* Teacher note */}
        <section className="mt-6 rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-2">
            <MessageCircle size={20} className="text-[#9a8049]" />
            <h2 className="text-lg font-semibold">Teacher notes</h2>
          </div>

          <div className="mt-5 rounded-2xl bg-[#f7f8f5] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">
              Private note
            </p>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Emma understands new vocabulary quickly but needs more time to
              respond spontaneously. Keep encouraging longer answers and
              natural conversation.
            </p>
          </div>

          <button
            disabled
            className="mt-4 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-500"
          >
            + Add note
          </button>
        </section>

        {/* Lesson history */}
        <section className="mt-10">
          <div>
            <p className="text-sm text-gray-400">History</p>
            <h2 className="mt-1 text-xl font-semibold">Recent lessons</h2>
          </div>

          <div className="mt-4 overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
            {lessonHistory.map((lesson, index) => (
              <div
                key={`${lesson.date}-${lesson.topic}`}
                className={`flex items-center justify-between gap-4 p-5 sm:p-6 ${
                  index !== lessonHistory.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
              >
                <div>
                  <p className="font-semibold">{lesson.topic}</p>
                  <p className="mt-1 text-sm text-gray-400">{lesson.date}</p>
                </div>

                <span className="rounded-full bg-[#eef3ef] px-3 py-1.5 text-xs font-semibold text-[#527064]">
                  {lesson.status}
                </span>
              </div>
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
