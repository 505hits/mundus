import {
  AlertCircle,
  BookOpen,
  CalendarDays,
  Clock3,
  GraduationCap,
  Package,
  RefreshCw,
  UserPlus,
  Users,
} from "lucide-react";

const attentionItems = [
  {
    title: "Lucia P. has 2 lessons left",
    description: "Renewal follow-up recommended",
    type: "Package",
  },
  {
    title: "Emma K. requested a schedule change",
    description: "Teacher response pending",
    type: "Schedule",
  },
  {
    title: "Trial completed — follow-up needed",
    description: "Sofia M. · English",
    type: "Trial",
  },
  {
    title: "Lesson report missing",
    description: "Emma K. · 22 September",
    type: "Report",
  },
];

const todayLessons = [
  {
    student: "Emma K.",
    teacher: "Anna",
    language: "English",
    time: "15:00",
  },
  {
    student: "Martin S.",
    teacher: "Anna",
    language: "English",
    time: "17:30",
  },
  {
    student: "Lucia P.",
    teacher: "Anna",
    language: "English",
    time: "19:00",
  },
];

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#183f38]">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9a8049]">
            Mundus Admin
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Good morning, Anikó
          </h1>

          <p className="mt-2 text-gray-500">
            Here&apos;s what&apos;s happening across Mundus today.
          </p>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <Users size={20} className="text-[#9a8049]" />
            <p className="mt-4 text-3xl font-semibold">18</p>
            <p className="mt-1 text-sm text-gray-500">Active students</p>
          </div>

          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <GraduationCap size={20} className="text-[#9a8049]" />
            <p className="mt-4 text-3xl font-semibold">6</p>
            <p className="mt-1 text-sm text-gray-500">Active teachers</p>
          </div>

          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <CalendarDays size={20} className="text-[#9a8049]" />
            <p className="mt-4 text-3xl font-semibold">3</p>
            <p className="mt-1 text-sm text-gray-500">Lessons today</p>
          </div>

          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <UserPlus size={20} className="text-[#9a8049]" />
            <p className="mt-4 text-3xl font-semibold">2</p>
            <p className="mt-1 text-sm text-gray-500">Trials this week</p>
          </div>
        </section>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Priority</p>
                <h2 className="mt-1 text-xl font-semibold">
                  Needs attention
                </h2>
              </div>

              <AlertCircle size={21} className="text-[#9a8049]" />
            </div>

            <div className="mt-5 space-y-3">
              {attentionItems.map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col gap-3 rounded-2xl bg-[#faf8f2] p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="mt-1 text-sm text-gray-500">
                      {item.description}
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#9a8049]">
                    {item.type}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-black/5 bg-[#183f38] p-6 text-white shadow-sm">
            <p className="text-sm text-white/50">Packages</p>
            <h2 className="mt-1 text-xl font-semibold">
              Renewal overview
            </h2>

            <div className="mt-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Package size={19} className="text-[#d7b56d]" />
                  <span className="text-sm text-white/70">
                    2 lessons left
                  </span>
                </div>
                <strong>3</strong>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <RefreshCw size={19} className="text-[#d7b56d]" />
                  <span className="text-sm text-white/70">
                    Renewal due
                  </span>
                </div>
                <strong>2</strong>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle size={19} className="text-[#d7b56d]" />
                  <span className="text-sm text-white/70">
                    No upcoming lesson
                  </span>
                </div>
                <strong>1</strong>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">24 September</p>
              <h2 className="mt-1 text-xl font-semibold">
                Today&apos;s lessons
              </h2>
            </div>

            <BookOpen size={21} className="text-[#9a8049]" />
          </div>

          <div className="mt-5 divide-y divide-gray-100">
            {todayLessons.map((lesson) => (
              <div
                key={`${lesson.student}-${lesson.time}`}
                className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef3ef]">
                    <Clock3 size={18} />
                  </div>

                  <div>
                    <p className="font-semibold">{lesson.student}</p>
                    <p className="mt-1 text-sm text-gray-500">
                      {lesson.language} · {lesson.teacher}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-semibold">{lesson.time}</span>

                  <span className="rounded-full bg-[#eef3ef] px-3 py-1 text-xs font-semibold text-[#527064]">
                    Scheduled
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-400">Follow-up</p>
            <p className="mt-2 text-lg font-semibold">
              1 trial needs follow-up
            </p>
          </div>

          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-400">Reports</p>
            <p className="mt-2 text-lg font-semibold">
              1 teacher report missing
            </p>
          </div>

          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-400">Scheduling</p>
            <p className="mt-2 text-lg font-semibold">
              1 student has no next lesson
            </p>
          </div>
        </section>

        <p className="mt-8 text-center text-xs text-gray-400">
          Preview data · Mundus Admin Portal
        </p>
      </div>
    </main>
  );
}
