import {
  AlertCircle,
  CheckCircle2,
  Package,
  Plus,
  RefreshCw,
} from "lucide-react";

const packages = [
  {
    student: "Emma K.",
    language: "English",
    purchased: 10,
    used: 7,
    remaining: 3,
    status: "Active",
  },
  {
    student: "Martin S.",
    language: "English",
    purchased: 10,
    used: 3,
    remaining: 7,
    status: "Active",
  },
  {
    student: "Lucia P.",
    language: "English",
    purchased: 10,
    used: 8,
    remaining: 2,
    status: "Renewal soon",
  },
  {
    student: "Peter M.",
    language: "English",
    purchased: 10,
    used: 5,
    remaining: 5,
    status: "Active",
  },
  {
    student: "Daniela R.",
    language: "German",
    purchased: 5,
    used: 5,
    remaining: 0,
    status: "Renewal due",
  },
];

export default function AdminPackagesPage() {
  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#183f38]">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9a8049]">
              Packages
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Package tracking
            </h1>

            <p className="mt-2 max-w-2xl text-gray-500">
              Track lesson balances and know when a student is ready to renew.
            </p>
          </div>

          <button
            disabled
            className="flex w-fit items-center gap-2 rounded-xl bg-[#183f38] px-5 py-3 text-sm font-semibold text-white"
          >
            <Plus size={18} />
            Add package
          </button>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <Package size={20} className="text-[#9a8049]" />
            <p className="mt-4 text-3xl font-semibold">18</p>
            <p className="mt-1 text-sm text-gray-500">Active packages</p>
          </div>

          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <AlertCircle size={20} className="text-[#9a8049]" />
            <p className="mt-4 text-3xl font-semibold">3</p>
            <p className="mt-1 text-sm text-gray-500">
              2 lessons or fewer
            </p>
          </div>

          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <RefreshCw size={20} className="text-[#9a8049]" />
            <p className="mt-4 text-3xl font-semibold">2</p>
            <p className="mt-1 text-sm text-gray-500">Renewal due</p>
          </div>

          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <CheckCircle2 size={20} className="text-[#9a8049]" />
            <p className="mt-4 text-3xl font-semibold">24</p>
            <p className="mt-1 text-sm text-gray-500">
              Lessons used this week
            </p>
          </div>
        </section>

        <section className="mt-8">
          <div className="flex flex-wrap gap-2">
            {["All packages", "Active", "Renewal soon", "Renewal due"].map(
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
            <div className="hidden grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr_1fr] gap-4 border-b border-gray-100 px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400 lg:grid">
              <span>Student</span>
              <span>Purchased</span>
              <span>Used</span>
              <span>Left</span>
              <span>Status</span>
            </div>

            <div className="divide-y divide-gray-100">
              {packages.map((item) => {
                const percentage =
                  item.purchased > 0
                    ? Math.min(
                        100,
                        Math.round((item.used / item.purchased) * 100)
                      )
                    : 0;

                const warning = item.remaining <= 2;

                return (
                  <div
                    key={item.student}
                    className="grid gap-4 px-5 py-5 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr_1fr] lg:items-center lg:px-6"
                  >
                    <div>
                      <p className="font-semibold">{item.student}</p>
                      <p className="mt-1 text-sm text-gray-400">
                        {item.language}
                      </p>

                      <div className="mt-3 h-1.5 max-w-[180px] overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-[#183f38]"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400 lg:hidden">
                        Purchased
                      </p>
                      <p className="mt-1 text-sm font-medium lg:mt-0">
                        {item.purchased}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400 lg:hidden">
                        Used
                      </p>
                      <p className="mt-1 text-sm font-medium lg:mt-0">
                        {item.used}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400 lg:hidden">
                        Lessons left
                      </p>
                      <p
                        className={`mt-1 text-lg font-semibold lg:mt-0 ${
                          warning ? "text-[#9a8049]" : "text-[#183f38]"
                        }`}
                      >
                        {item.remaining}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          warning
                            ? "bg-[#faf1d9] text-[#9a8049]"
                            : "bg-[#eef3ef] text-[#527064]"
                        }`}
                      >
                        {item.status}
                      </span>

                      <button
                        disabled
                        className="text-sm font-semibold text-[#183f38]"
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-[#c6a65b]/20 bg-[#faf6eb] p-6">
          <div className="flex items-start gap-3">
            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0 text-[#9a8049]"
            />

            <div>
              <h2 className="font-semibold">Renewal rule</h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
                Mundus should flag a student when only 2 lessons remain and
                create a stronger renewal alert when the package reaches 1 or
                0 lessons. The balance is based on completed chargeable
                lessons, not estimated package end dates.
              </p>
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
