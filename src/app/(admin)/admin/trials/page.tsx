import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  UserPlus,
} from "lucide-react";

const trials = [
  {
    name: "Sofia M.",
    language: "English",
    level: "A2",
    goal: "Speaking confidence",
    teacher: "Anna",
    date: "23 Sep · 16:00",
    status: "Follow-up needed",
  },
  {
    name: "Nina K.",
    language: "Italian",
    level: "Beginner",
    goal: "Travel",
    teacher: "Roland",
    date: "25 Sep · 17:00",
    status: "Scheduled",
  },
  {
    name: "Jakub P.",
    language: "English",
    level: "B1",
    goal: "English for work",
    teacher: "Anna",
    date: "26 Sep · 18:30",
    status: "Scheduled",
  },
];

export default function AdminTrialsPage() {
  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#183f38]">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9a8049]">
              Trials
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Trial lessons
            </h1>

            <p className="mt-2 max-w-2xl text-gray-500">
              Keep every new student moving from their first lesson to the
              right Mundus course.
            </p>
          </div>

          <button
            disabled
            className="flex w-fit items-center gap-2 rounded-xl bg-[#183f38] px-5 py-3 text-sm font-semibold text-white"
          >
            <UserPlus size={18} />
            Add trial
          </button>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <CalendarDays size={20} className="text-[#9a8049]" />
            <p className="mt-4 text-3xl font-semibold">2</p>
            <p className="mt-1 text-sm text-gray-500">Upcoming trials</p>
          </div>

          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <CheckCircle2 size={20} className="text-[#9a8049]" />
            <p className="mt-4 text-3xl font-semibold">1</p>
            <p className="mt-1 text-sm text-gray-500">Completed</p>
          </div>

          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <AlertCircle size={20} className="text-[#9a8049]" />
            <p className="mt-4 text-3xl font-semibold">1</p>
            <p className="mt-1 text-sm text-gray-500">Follow-up needed</p>
          </div>

          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <UserPlus size={20} className="text-[#9a8049]" />
            <p className="mt-4 text-3xl font-semibold">1</p>
            <p className="mt-1 text-sm text-gray-500">
              Converted to student
            </p>
          </div>
        </section>

        <section className="mt-8">
          <div className="flex flex-wrap gap-2">
            {[
              "All trials",
              "Scheduled",
              "Assessment ready",
              "Follow-up needed",
              "Converted",
            ].map((filter, index) => (
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
            ))}
          </div>

          <div className="mt-5 space-y-3">
            {trials.map((trial) => (
              <article
                key={trial.name}
                className={`rounded-3xl border p-5 shadow-sm sm:p-6 ${
                  trial.status === "Follow-up needed"
                    ? "border-[#c6a65b]/20 bg-[#faf6eb]"
                    : "border-black/5 bg-white"
                }`}
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold">{trial.name}</h2>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          trial.status === "Follow-up needed"
                            ? "bg-white text-[#9a8049]"
                            : "bg-[#eef3ef] text-[#527064]"
                        }`}
                      >
                        {trial.status}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-gray-500">
                      {trial.language} · {trial.level}
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                      Goal: {trial.goal}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:flex lg:items-center lg:gap-8">
                    <div>
                      <p className="text-xs text-gray-400">Teacher</p>
                      <p className="mt-1 text-sm font-medium">
                        {trial.teacher}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">Trial lesson</p>
                      <p className="mt-1 flex items-center gap-2 text-sm font-medium">
                        <Clock3 size={15} />
                        {trial.date}
                      </p>
                    </div>

                    <button
                      disabled
                      className="rounded-xl border border-black/5 bg-white px-4 py-2.5 text-sm font-semibold text-[#183f38]"
                    >
                      Manage
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-400">Trial pipeline</p>

          <h2 className="mt-1 text-lg font-semibold">
            From first contact to active student
          </h2>

          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
            {[
              "Trial scheduled",
              "Completed",
              "Assessment ready",
              "Follow-up",
              "Package purchased",
            ].map((step, index) => (
              <div key={step} className="flex items-center gap-2">
                <span className="rounded-xl bg-[#eef3ef] px-3 py-2 font-medium">
                  {step}
                </span>

                {index < 4 && (
                  <span className="text-gray-300">→</span>
                )}
              </div>
            ))}
          </div>
        </section>

        <p className="mt-8 text-center text-xs text-gray-400">
          Preview data · Mundus Admin Portal
        </p>
      </div>
    </main>
  );
}
