import {
  AlertCircle,
  BookOpen,
  Search,
  UserPlus,
  Users,
} from "lucide-react";

const students = [
  {
    name: "Emma K.",
    language: "English",
    level: "B1",
    teacher: "Anna",
    remaining: 3,
    nextLesson: "24 Sep · 15:00",
    status: "Active",
    alert: "",
  },
  {
    name: "Martin S.",
    language: "English",
    level: "A2",
    teacher: "Anna",
    remaining: 7,
    nextLesson: "24 Sep · 17:30",
    status: "Active",
    alert: "",
  },
  {
    name: "Lucia P.",
    language: "English",
    level: "B2",
    teacher: "Anna",
    remaining: 2,
    nextLesson: "24 Sep · 19:00",
    status: "Active",
    alert: "Renewal soon",
  },
  {
    name: "Peter M.",
    language: "English",
    level: "B1",
    teacher: "Anna",
    remaining: 5,
    nextLesson: "29 Sep · 18:00",
    status: "Active",
    alert: "",
  },
  {
    name: "Sofia M.",
    language: "English",
    level: "A2",
    teacher: "Not assigned",
    remaining: 0,
    nextLesson: "No lesson scheduled",
    status: "Trial completed",
    alert: "Follow-up",
  },
];

export default function AdminStudentsPage() {
  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#183f38]">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9a8049]">
              Students
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Student management
            </h1>

            <p className="mt-2 text-gray-500">
              Manage students, teachers, packages and upcoming lessons.
            </p>
          </div>

          <button
            disabled
            className="flex w-fit items-center gap-2 rounded-xl bg-[#183f38] px-5 py-3 text-sm font-semibold text-white"
          >
            <UserPlus size={18} />
            Add student
          </button>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <Users size={20} className="text-[#9a8049]" />
            <p className="mt-4 text-3xl font-semibold">18</p>
            <p className="mt-1 text-sm text-gray-500">Active students</p>
          </div>

          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <BookOpen size={20} className="text-[#9a8049]" />
            <p className="mt-4 text-3xl font-semibold">3</p>
            <p className="mt-1 text-sm text-gray-500">
              Renewal approaching
            </p>
          </div>

          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <AlertCircle size={20} className="text-[#9a8049]" />
            <p className="mt-4 text-3xl font-semibold">2</p>
            <p className="mt-1 text-sm text-gray-500">
              Need attention
            </p>
          </div>
        </section>

        <section className="mt-8">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative w-full max-w-md">
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

            <select
              disabled
              className="rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm text-gray-500"
            >
              <option>All statuses</option>
              <option>Active</option>
              <option>Paused</option>
              <option>Trial completed</option>
              <option>Former</option>
            </select>
          </div>

          <div className="mt-5 overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
            <div className="hidden grid-cols-[1.4fr_1fr_1fr_0.7fr_1.2fr_0.8fr] gap-4 border-b border-gray-100 px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400 lg:grid">
              <span>Student</span>
              <span>Teacher</span>
              <span>Level</span>
              <span>Left</span>
              <span>Next lesson</span>
              <span>Status</span>
            </div>

            <div className="divide-y divide-gray-100">
              {students.map((student) => (
                <div
                  key={student.name}
                  className="grid gap-4 px-5 py-5 lg:grid-cols-[1.4fr_1fr_1fr_0.7fr_1.2fr_0.8fr] lg:items-center lg:px-6"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">{student.name}</p>

                      {student.alert && (
                        <span className="rounded-full bg-[#faf1d9] px-2.5 py-1 text-xs font-semibold text-[#9a8049]">
                          {student.alert}
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm text-gray-400">
                      {student.language}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 lg:hidden">
                      Teacher
                    </p>
                    <p className="mt-1 text-sm font-medium lg:mt-0">
                      {student.teacher}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 lg:hidden">
                      Level
                    </p>
                    <p className="mt-1 text-sm font-medium lg:mt-0">
                      {student.level}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 lg:hidden">
                      Lessons left
                    </p>
                    <p
                      className={`mt-1 text-sm font-semibold lg:mt-0 ${
                        student.remaining <= 2
                          ? "text-[#9a8049]"
                          : "text-[#183f38]"
                      }`}
                    >
                      {student.remaining}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 lg:hidden">
                      Next lesson
                    </p>
                    <p className="mt-1 text-sm text-gray-500 lg:mt-0">
                      {student.nextLesson}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-[#eef3ef] px-3 py-1 text-xs font-semibold text-[#527064]">
                      {student.status}
                    </span>

                    <button
                      disabled
                      className="text-sm font-semibold text-[#183f38]"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <p className="mt-8 text-center text-xs text-gray-400">
          Preview data · Mundus Admin Portal
        </p>
      </div>
    </main>
  );
}
