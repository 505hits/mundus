import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  UserPlus,
  Users,
} from "lucide-react";

const teachers = [
  {
    name: "Anna",
    languages: "English",
    students: 4,
    lessonsThisWeek: 9,
    availability: "Accepting students",
    status: "Active",
  },
  {
    name: "Valerio",
    languages: "Italian",
    students: 3,
    lessonsThisWeek: 6,
    availability: "Accepting students",
    status: "Active",
  },
  {
    name: "Adriana",
    languages: "English",
    students: 4,
    lessonsThisWeek: 8,
    availability: "Not accepting",
    status: "Active",
  },
  {
    name: "Roland",
    languages: "Italian",
    students: 2,
    lessonsThisWeek: 4,
    availability: "Accepting students",
    status: "Active",
  },
];

export default function AdminTeachersPage() {
  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#183f38]">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9a8049]">
              Teachers
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Teacher management
            </h1>

            <p className="mt-2 text-gray-500">
              Manage teachers, workload and new teacher applications.
            </p>
          </div>

          <button
            disabled
            className="flex w-fit items-center gap-2 rounded-xl bg-[#183f38] px-5 py-3 text-sm font-semibold text-white"
          >
            <UserPlus size={18} />
            Add teacher
          </button>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <GraduationCap size={20} className="text-[#9a8049]" />
            <p className="mt-4 text-3xl font-semibold">6</p>
            <p className="mt-1 text-sm text-gray-500">Active teachers</p>
          </div>

          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <Users size={20} className="text-[#9a8049]" />
            <p className="mt-4 text-3xl font-semibold">18</p>
            <p className="mt-1 text-sm text-gray-500">Assigned students</p>
          </div>

          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <CalendarDays size={20} className="text-[#9a8049]" />
            <p className="mt-4 text-3xl font-semibold">31</p>
            <p className="mt-1 text-sm text-gray-500">
              Lessons this week
            </p>
          </div>

          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <AlertCircle size={20} className="text-[#9a8049]" />
            <p className="mt-4 text-3xl font-semibold">1</p>
            <p className="mt-1 text-sm text-gray-500">
              Pending application
            </p>
          </div>
        </section>

        {/* Pending teacher */}
        <section className="mt-8">
          <div className="flex items-center gap-2">
            <AlertCircle size={19} className="text-[#9a8049]" />
            <h2 className="text-xl font-semibold">Pending approval</h2>
          </div>

          <div className="mt-4 rounded-3xl border border-[#c6a65b]/20 bg-[#faf6eb] p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">Laura M.</p>

                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-[#9a8049]">
                    New application
                  </span>
                </div>

                <p className="mt-2 text-sm text-gray-500">
                  English · Spanish
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Teacher profile awaiting Mundus approval
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  disabled
                  className="flex items-center gap-2 rounded-xl bg-[#183f38] px-4 py-2.5 text-sm font-semibold text-white"
                >
                  <CheckCircle2 size={16} />
                  Approve
                </button>

                <button
                  disabled
                  className="rounded-xl border border-[#7e693a]/20 bg-white px-4 py-2.5 text-sm font-medium text-[#7e693a]"
                >
                  Review profile
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Teachers */}
        <section className="mt-10">
          <p className="text-sm text-gray-400">Team</p>
          <h2 className="mt-1 text-xl font-semibold">Active teachers</h2>

          <div className="mt-4 overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
            <div className="hidden grid-cols-[1.3fr_0.8fr_0.9fr_1.3fr_0.7fr] gap-4 border-b border-gray-100 px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400 lg:grid">
              <span>Teacher</span>
              <span>Students</span>
              <span>This week</span>
              <span>Availability</span>
              <span>Status</span>
            </div>

            <div className="divide-y divide-gray-100">
              {teachers.map((teacher) => (
                <div
                  key={teacher.name}
                  className="grid gap-4 px-5 py-5 lg:grid-cols-[1.3fr_0.8fr_0.9fr_1.3fr_0.7fr] lg:items-center lg:px-6"
                >
                  <div>
                    <p className="font-semibold">{teacher.name}</p>
                    <p className="mt-1 text-sm text-gray-400">
                      {teacher.languages}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 lg:hidden">
                      Students
                    </p>
                    <p className="mt-1 text-sm font-medium lg:mt-0">
                      {teacher.students}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 lg:hidden">
                      Lessons this week
                    </p>
                    <p className="mt-1 text-sm font-medium lg:mt-0">
                      {teacher.lessonsThisWeek}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 lg:hidden">
                      Availability
                    </p>

                    <span
                      className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold lg:mt-0 ${
                        teacher.availability === "Accepting students"
                          ? "bg-[#eef3ef] text-[#527064]"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {teacher.availability}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium">
                      {teacher.status}
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
