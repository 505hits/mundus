"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

type StudentItem = {
  id: string;
  name: string;
  language: string;
  nextLesson: string | null;
  remaining: number;
  completed: number;
};

function formatDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    timeZone: "Europe/Bratislava",
  }).format(new Date(value));
}

function formatTime(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Bratislava",
  }).format(new Date(value));
}

export default function StudentSearchList({
  students,
}: {
  students: StudentItem[];
}) {
  const { language } = useLanguage();
  const sk = language === "sk";
  const locale = sk ? "sk-SK" : "en-GB";
  const [query, setQuery] = useState("");

  const filteredStudents = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase(locale);
    if (!normalized) return students;

    return students.filter((student) =>
      [student.name, student.language]
        .join(" ")
        .toLocaleLowerCase(locale)
        .includes(normalized)
    );
  }, [query, students, locale]);

  return (
    <section className="mt-8">
      <label className="relative block max-w-md">
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={sk ? "Vyhľadať študenta alebo jazyk" : "Search student or language"}
          aria-label={sk ? "Vyhľadať študenta" : "Search student"}
          className="w-full rounded-2xl border border-black/5 bg-white py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#2F3AA2]"
        />
      </label>

      {students.length === 0 ? (
        <div className="mt-5 rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
          <p className="font-medium">
            {sk ? "Zatiaľ nemáte priradených študentov" : "You do not have assigned students yet"}
          </p>
          <p className="mt-1 text-sm text-gray-400">
            {sk ? "Študenti sa zobrazia, keď budú mať s vami naplánované hodiny." : "Students will appear once they have lessons scheduled with you."}
          </p>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="mt-5 rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
          <p className="font-medium">{sk ? "Nenašli sa žiadni študenti" : "No students found"}</p>
          <p className="mt-1 text-sm text-gray-400">
            {sk ? "Skúste zadať iné meno alebo jazyk." : "Try another name or language."}
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {filteredStudents.map((student) => (
            <article
              key={student.id}
              className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EEF2FF] font-semibold text-[#0a0a0f]">
                    {student.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold">{student.name}</h2>
                      <span className="rounded-full bg-[#EEF2FF] px-2.5 py-1 text-xs font-semibold text-[#3730A3]">
                        {sk ? "Aktívny" : "Active"}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {student.language}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 md:flex md:items-center md:gap-8">
                  <div>
                    <p className="text-xs text-gray-400">{sk ? "Zostáva hodín" : "Lessons remaining"}</p>
                    <p className="mt-1 text-sm font-semibold">
                      {student.remaining}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">{sk ? "Dokončené" : "Completed"}</p>
                    <p className="mt-1 text-sm font-semibold">
                      {student.completed}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">{sk ? "Najbližšia hodina" : "Next lesson"}</p>
                    <p className="mt-1 text-sm font-medium">
                      {student.nextLesson
                        ? `${formatDate(student.nextLesson, locale)} · ${formatTime(student.nextLesson, locale)}`
                        : (sk ? "Nenaplánované" : "Not scheduled")}
                    </p>
                  </div>

                  <Link
                    href={`/teacher/student/${student.id}`}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#2F3AA2] px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    {sk ? "Zobraziť študenta" : "View student"}
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
