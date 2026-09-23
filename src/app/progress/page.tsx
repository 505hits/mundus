import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Check,
  MessageCircle,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";

const levels = [
  { name: "A1", status: "completed" },
  { name: "A2", status: "completed" },
  { name: "B1", status: "current" },
  { name: "B2", status: "future" },
  { name: "C1", status: "future" },
  { name: "C2", status: "future" },
];

const skills = [
  {
    name: "Speaking",
    value: 72,
    note: "Improving",
  },
  {
    name: "Listening",
    value: 68,
    note: "Improving",
  },
  {
    name: "Vocabulary",
    value: 64,
    note: "Good progress",
  },
  {
    name: "Grammar",
    value: 58,
    note: "Keep practising",
  },
];

export default function ProgressPage() {
  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#183f38]">
      {/* Header */}
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <ArrowLeft size={17} />
            Dashboard
          </Link>

          <p className="text-sm font-semibold">Mundus Learning Portal</p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-10">
        {/* Intro */}
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9a8049]">
            My progress
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            See how far you&apos;ve come
          </h1>

          <p className="mt-2 max-w-2xl text-gray-500">
            Follow your learning journey, see your strengths and know what to
            focus on next.
          </p>
        </section>

        {/* Current level */}
        <section className="mt-8 rounded-3xl bg-[#183f38] p-6 text-white shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-white/55">
                Current estimated level
              </p>

              <div className="mt-3 flex items-end gap-3">
                <span className="text-5xl font-semibold">B1</span>
                <span className="pb-1 text-white/60">English</span>
              </div>

              <p className="mt-4 max-w-xl text-sm leading-6 text-white/60">
                Your Mundus learning progress is aligned with the CEFR
                framework. This is a learning estimate, not an official
                language certificate.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4">
              <TrendingUp size={26} />
            </div>
          </div>
        </section>

        {/* CEFR journey */}
        <section className="mt-6 rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
          <div>
            <p className="text-sm text-gray-400">Your language journey</p>
            <h2 className="mt-1 text-xl font-semibold">
              CEFR learning path
            </h2>
          </div>

          <div className="mt-8 grid grid-cols-6 gap-2">
            {levels.map((level) => (
              <div key={level.name} className="text-center">
                <div
                  className={`mx-auto flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold ${
                    level.status === "completed"
                      ? "bg-[#183f38] text-white"
                      : level.status === "current"
                        ? "bg-[#c6a65b] text-white ring-4 ring-[#c6a65b]/15"
                        : "bg-[#edf0ec] text-gray-400"
                  }`}
                >
                  {level.status === "completed" ? (
                    <Check size={17} />
                  ) : (
                    level.name
                  )}
                </div>

                <p
                  className={`mt-3 text-xs font-semibold ${
                    level.status === "current"
                      ? "text-[#9a8049]"
                      : level.status === "future"
                        ? "text-gray-300"
                        : "text-[#183f38]"
                  }`}
                >
                  {level.name}
                </p>

                {level.status === "current" && (
                  <p className="mt-1 text-[11px] text-[#9a8049]">
                    You are here
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Goal */}
        <section className="mt-6 rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-[#faf6eb] p-3 text-[#9a8049]">
              <Target size={22} />
            </div>

            <div>
              <p className="text-sm text-gray-400">Your learning goal</p>

              <h2 className="mt-1 text-xl font-semibold">
                Speak confidently at work
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
                Feel comfortable speaking English in meetings, everyday work
                conversations and situations where you need to respond
                naturally without overthinking.
              </p>
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className="mt-10">
          <div>
            <p className="text-sm text-gray-400">Skills</p>
            <h2 className="mt-1 text-xl font-semibold">
              What you&apos;re working on
            </h2>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {skills.map((skill) => (
              <article
                key={skill.name}
                className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{skill.name}</p>

                  <span className="text-xs font-semibold text-[#9a8049]">
                    {skill.note}
                  </span>
                </div>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#edf0ec]">
                  <div
                    className="h-full rounded-full bg-[#183f38]"
                    style={{ width: `${skill.value}%` }}
                  />
                </div>

                <p className="mt-3 text-xs text-gray-400">
                  Based on your recent Mundus progress checks
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Progress check */}
        <section className="mt-6 rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-gray-400">
                Latest teacher progress check
              </p>

              <h2 className="mt-1 text-xl font-semibold">
                You&apos;re becoming more confident
              </h2>
            </div>

            <div className="rounded-2xl bg-[#eef3ef] p-3">
              <MessageCircle size={22} />
            </div>
          </div>

          <p className="mt-5 max-w-3xl text-sm leading-7 text-gray-500">
            Your speaking is becoming more natural and you&apos;re responding
            faster in conversation. You&apos;ve also started using more of the
            vocabulary from previous lessons without prompting.
          </p>

          <div className="mt-6 rounded-2xl bg-[#f7f8f5] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9a8049]">
              Next focus
            </p>

            <p className="mt-2 font-medium">
              Building longer answers and improving grammar accuracy while
              speaking.
            </p>
          </div>
        </section>

        {/* Milestone */}
        <section className="mt-6 flex flex-col gap-5 rounded-3xl border border-[#c6a65b]/20 bg-[#faf6eb] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-white p-3 text-[#9a8049] shadow-sm">
              <Trophy size={23} />
            </div>

            <div>
              <p className="font-semibold">Learning milestone</p>
              <p className="mt-1 text-sm text-[#7e693a]/75">
                You&apos;ve completed 10 lessons with Mundus.
              </p>
            </div>
          </div>

          <span className="text-sm font-semibold text-[#9a8049]">
            Keep going ✨
          </span>
        </section>

        {/* Next step */}
        <section className="mt-6 rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-[#eef3ef] p-3">
              <BookOpen size={22} />
            </div>

            <div>
              <p className="text-sm text-gray-400">Your next step</p>

              <h2 className="mt-1 text-xl font-semibold">
                Keep building speaking confidence
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Your next lessons will focus on real work situations, longer
                conversations and using new vocabulary naturally.
              </p>
            </div>
          </div>
        </section>

        <p className="mt-8 text-center text-xs text-gray-400">
          Preview data · Mundus Learning Portal
        </p>
      </div>
    </main>
  );
}
