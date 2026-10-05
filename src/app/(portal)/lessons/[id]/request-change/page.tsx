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
import { currentLanguage, localeFor } from "@/lib/i18n";
import type { Language } from "@/context/LanguageContext";

function formatDate(value: string, language: Language) {
  return new Intl.DateTimeFormat(localeFor(language), {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Bratislava",
  }).format(new Date(value));
}

function formatTime(value: string, language: Language) {
  return new Intl.DateTimeFormat(localeFor(language), {
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
  const language = await currentLanguage();
  const sk = language === "sk";

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
    return <main className="mx-auto max-w-3xl px-5 py-10"><h1 className="text-2xl font-semibold">{sk ? "Hodinu sa nepodarilo načítať" : "Lesson could not be loaded"}</h1><p role="alert" className="mt-4 text-gray-600">{sk ? "Obnovte stránku alebo to skúste o chvíľu znova. Pôvodný termín zostáva platný." : "Refresh the page or try again shortly. The original time remains valid."}</p><Link href="/lessons" className="mt-5 inline-block font-semibold underline">{sk ? "Späť na moje hodiny" : "Back to my lessons"}</Link></main>;
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
          {sk ? "Späť na moje hodiny" : "Back to my lessons"}
        </Link>

        <section className="mt-7">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">
            {sk ? "Rozvrh" : "Schedule"}
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {sk ? "Požiadať o zmenu" : "Request a change"}
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-gray-500">
            {sk ? "Navrhnite nový dátum a čas, ktorý vám vyhovuje. Pôvodný termín zostáva platný, kým lektor zmenu nepotvrdí." : "Suggest a new date and time that suits you. The original time remains valid until your teacher confirms the change."}
          </p>
        </section>

        <section className="mt-8 rounded-3xl bg-[#2F3AA2] p-6 text-white shadow-sm sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-white/60">
                {sk ? "Aktuálna hodina" : "Current lesson"}
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                {formatLanguage(lesson.language, language)} · {sk ? "hodina" : "lesson"}
              </h2>

              <div className="mt-5 flex flex-wrap gap-4 text-sm text-white/75">
                <span className="flex items-center gap-2">
                  <CalendarDays size={17} />
                  {formatDate(lesson.scheduled_at, language)}
                </span>

                <span className="flex items-center gap-2">
                  <Clock3 size={17} />
                  {formatTime(lesson.scheduled_at, language)}
                </span>
              </div>

              <p className="mt-3 text-sm text-white/60">
                {lesson.duration_minutes || 60} {sk ? "minút" : "minutes"}
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-3">
              <RefreshCw size={22} />
            </div>
          </div>
        </section>

        {pendingError ? <section role="alert" className="mt-6 rounded-3xl bg-white p-6 text-red-700"><h2 className="text-xl font-semibold">{sk ? "Stav žiadosti sa nepodarilo overiť" : "Request status could not be verified"}</h2><p className="mt-2">{sk ? "Obnovte stránku alebo to skúste o chvíľu znova. Novú žiadosť môžete odoslať po overení stavu. Pôvodný termín zostáva platný." : "Refresh the page or try again shortly. You can send a new request once the status is verified. The original time remains valid."}</p></section> : pendingRequest ? (
          <section className="mt-6 rounded-3xl border border-[#E0E7FF] bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-semibold">
              {sk ? "Žiadosť o zmenu čaká na vybavenie" : "Schedule change request is pending"}
            </h2>

            <p className="mt-2 leading-7 text-gray-500">
              {sk ? "Pre túto hodinu už máte odoslanú žiadosť o zmenu. Pôvodný termín zostáva platný, kým nebude žiadosť schválená." : "You already sent a change request for this lesson. The original time remains valid until the request is approved."}
            </p>

            <Link
              href="/lessons"
              className="mt-6 inline-flex rounded-2xl bg-[#2F3AA2] px-5 py-3 font-semibold text-white"
            >
              {sk ? "Späť na moje hodiny" : "Back to my lessons"}
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
