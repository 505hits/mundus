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
import { formatLanguage } from "@/lib/portalLabels";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("sk-SK", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Bratislava",
  }).format(new Date(value));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("sk-SK", {
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
    .maybeSingle();

  if (error) {
    return <main className="mx-auto max-w-3xl px-5 py-10"><h1 className="text-2xl font-semibold">Hodinu sa nepodarilo načítať</h1><p role="alert" className="mt-4 text-gray-600">Obnovte stránku alebo to skúste o chvíľu znova. Pôvodný termín zostáva platný.</p><Link href="/lessons" className="mt-5 inline-block font-semibold underline">Späť na moje hodiny</Link></main>;
  }
  if (!lesson) notFound();

  if (
    lesson.status !== "scheduled" &&
    lesson.status !== "rescheduled"
  ) {
    notFound();
  }

  if (new Date(lesson.scheduled_at).getTime() < new Date().getTime()) {
    notFound();
  }

  const { data: pendingRequest, error: pendingError } = await supabase
    .from("schedule_change_requests")
    .select("id")
    .eq("lesson_id", lesson.id)
    .eq("student_id", user.id)
    .eq("status", "pending")
    .limit(1)
    .maybeSingle();

  return (
    <main className="min-h-screen bg-[#FAFAF9] text-[#0a0a0f]">
      <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8 lg:py-10">
        <Link
          href="/lessons"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#0a0a0f]"
        >
          <ArrowLeft size={17} />
          Späť na moje hodiny
        </Link>

        <section className="mt-7">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">
            Rozvrh
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Požiadať o zmenu
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-gray-500">
            Navrhnite nový dátum a čas, ktorý vám vyhovuje. Pôvodný termín zostáva platný, kým lektor zmenu nepotvrdí.
          </p>
        </section>

        <section className="mt-8 rounded-3xl bg-[#2F3AA2] p-6 text-white shadow-sm sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-white/60">
                Aktuálna hodina
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                {formatLanguage(lesson.language)} hodina
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
                {lesson.duration_minutes || 60} minút
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-3">
              <RefreshCw size={22} />
            </div>
          </div>
        </section>

        {pendingError ? <section role="alert" className="mt-6 rounded-3xl bg-white p-6 text-red-700"><h2 className="text-xl font-semibold">Stav žiadosti sa nepodarilo overiť</h2><p className="mt-2">Obnovte stránku alebo to skúste o chvíľu znova. Novú žiadosť môžete odoslať po overení stavu. Pôvodný termín zostáva platný.</p></section> : pendingRequest ? (
          <section className="mt-6 rounded-3xl border border-[#E0E7FF] bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-semibold">
              Žiadosť o zmenu čaká na vybavenie
            </h2>

            <p className="mt-2 leading-7 text-gray-500">
              Pre túto hodinu už máte odoslanú žiadosť o zmenu. Pôvodný termín zostáva platný, kým nebude žiadosť schválená.
            </p>

            <Link
              href="/lessons"
              className="mt-6 inline-flex rounded-2xl bg-[#2F3AA2] px-5 py-3 font-semibold text-white"
            >
              Späť na moje hodiny
            </Link>
          </section>
        ) : (
          <RequestChangeForm
            lessonId={lesson.id}
            studentId={user.id}
          />
        )}
      </div>
    </main>
  );
}
