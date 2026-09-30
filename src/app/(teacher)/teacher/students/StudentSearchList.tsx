"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";

type StudentItem = {
  id: string;
  name: string;
  language: string;
  nextLesson: string | null;
  remaining: number;
  completed: number;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("sk-SK", {
    day: "numeric",
    month: "short",
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

export default function StudentSearchList({
  students,
}: {
  students: StudentItem[];
}) {
  const [query, setQuery] = useState("");

  const filteredStudents = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("sk-SK");
    if (!normalized) return students;

    return students.filter((student) =>
      [student.name, student.language]
        .join(" ")
        .toLocaleLowerCase("sk-SK")
        .includes(normalized)
    );
  }, [query, students]);

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
          placeholder="Vyhľadať študenta alebo jazyk"
          aria-label="Vyhľadať študenta"
          className="w-full rounded-2xl border border-black/5 bg-white py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#183f38]"
        />
      </label>

      {students.length === 0 ? (
        <div className="mt-5 rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
          <p className="font-medium">
            Zatiaľ nemáte priradených študentov
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Študenti sa zobrazia, keď budú mať s vami naplánované hodiny.
          </p>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="mt-5 rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
          <p className="font-medium">Nenašli sa žiadni študenti</p>
          <p className="mt-1 text-sm text-gray-400">
            Skúste zadať iné meno alebo jazyk.
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
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#eef3ef] font-semibold text-[#183f38]">
                    {student.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold">{student.name}</h2>
                      <span className="rounded-full bg-[#eef3ef] px-2.5 py-1 text-xs font-semibold text-[#527064]">
                        Aktívny
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {student.language}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 md:flex md:items-center md:gap-8">
                  <div>
                    <p className="text-xs text-gray-400">Zostáva hodín</p>
                    <p className="mt-1 text-sm font-semibold">
                      {student.remaining}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Dokončené</p>
                    <p className="mt-1 text-sm font-semibold">
                      {student.completed}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Najbližšia hodina</p>
                    <p className="mt-1 text-sm font-medium">
                      {student.nextLesson
                        ? `${formatDate(student.nextLesson)} · ${formatTime(student.nextLesson)}`
                        : "Nenaplánované"}
                    </p>
                  </div>

                  <Link
                    href={`/teacher/student/${student.id}`}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#183f38] px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    Zobraziť študenta
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
