import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  RefreshCw,
} from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import RequestChangeForm from "./RequestChangeForm";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Bratislava",
  }).format(new Date(value));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Bratislava",
  }).format(new Date(value));
}

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function RequestChangePage({
  params,
}: PageProps) {
  const { id } = await params;

  const { user } = await requireRole("student");
  const supabase = await createSupabaseServerClient();

  const { data: lesson, error } = await supabase
    .from("lessons")
    .select(
      "id,student_id,scheduled_at,duration_minutes,status,language"
    )
    .eq("id", id)
    .eq("student_id", user.id)
    .single();

  if (error || !lesson) {
    notFound();
  }

  if (
    lesson.status !== "scheduled" &&
    lesson.status !== "rescheduled"
  ) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#183f38]">
      <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8 lg:py-10">
        <Link
          href="/lessons"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#183f38]"
        >
          <ArrowLeft size={17} />
          Back to my lessons
        </Link>

        <section className="mt-7">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9a8049]">
            Schedule
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Request a change
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-gray-500">
            Let your teacher know which new date and time would work
            better for you. Your current lesson stays confirmed until
            the request is accepted.
          </p>
        </section>

        <section className="mt-8 rounded-3xl bg-[#183f38] p-6 text-white shadow-sm sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-white/60">
                Current lesson
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                {lesson.language || "Language"} lesson
              </h2>

              <div className="mt-5 flex flex-wrap gap-4 text-sm text-white/75">
                <span className="flex items-center gap-2">
                  <CalendarDays size={17} />
                  {formatDate(lesson.scheduled_at)}
                </span>

                <span className="flex items-center gap-2">
                  <Clock3 size={17} />
                  {formatTime(lesson.scheduled_at)}
                </span>
              </div>

              <p className="mt-3 text-sm text-white/60">
                {lesson.duration_minutes || 60} minutes
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-3">
              <RefreshCw size={22} />
            </div>
          </div>
        </section>

        <RequestChangeForm
          lessonId={lesson.id}
          studentId={user.id}
        />
      </div>
    </main>
  );
}
