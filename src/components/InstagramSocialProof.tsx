"use client";

import { Instagram, ExternalLink } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { setAnalyticsConsent, useAnalyticsConsent } from "@/components/AnalyticsManager";

const teacherPosts = [
  "DfPIUSjjVZf",
  "DdjYZh5DVIB",
  "Da2WeDTjeQJ",
  "DXjsNYMjUKq",
  "DVlzW5cDUkS",
  "DUbA1PqDdMg",
  "DSZhwDmjdHL",
  "DRjrYFGDe0T",
] as const;

const testimonialPosts = [
  "DYUFE0ijV_3",
  "DfbmEUTjWxU",
] as const;

function InstagramCard({ shortcode, title }: { shortcode: string; title: string }) {
  const consent = useAnalyticsConsent();
  const postUrl = `https://www.instagram.com/p/${shortcode}/`;

  if (consent !== "granted") {
    return (
      <article className="flex min-h-[420px] flex-col justify-between rounded-[1.75rem] border border-[#E5E7F0] bg-gradient-to-br from-white to-[#F5F6FF] p-6 shadow-[0_14px_36px_rgba(23,26,43,.06)]">
        <div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF2FF] text-[#2F3AA2]">
            <Instagram size={23} />
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">Instagram</p>
          <h3 className="mt-2 text-xl font-semibold text-[#171A2B]">{title}</h3>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Instagram content is loaded only after you accept cookies.
          </p>
        </div>
        <div className="mt-8 grid gap-3">
          <button
            type="button"
            onClick={() => setAnalyticsConsent("granted")}
            className="rounded-xl bg-[#2F3AA2] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#252E82]"
          >
            Show Instagram content
          </button>
          <a
            href={postUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#DDE2FB] bg-white px-4 py-3 text-sm font-semibold text-[#2F3AA2]"
          >
            Open on Instagram <ExternalLink size={15} />
          </a>
        </div>
      </article>
    );
  }

  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-[#E5E7F0] bg-white shadow-[0_14px_36px_rgba(23,26,43,.06)]">
      <iframe
        title={title}
        src={`https://www.instagram.com/p/${shortcode}/embed/`}
        loading="lazy"
        allow="clipboard-write; encrypted-media; picture-in-picture; web-share"
        className="h-[610px] w-full border-0 bg-white"
      />
      <a
        href={postUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 border-t border-[#E5E7F0] px-4 py-3 text-sm font-semibold text-[#2F3AA2] transition hover:bg-[#F7F8FF]"
      >
        Open on Instagram <ExternalLink size={15} />
      </a>
    </article>
  );
}

export function InstagramTeachersSection() {
  const { language } = useLanguage();
  const sk = language === "sk";

  return (
    <section id="teachers" className="bg-white px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">
              {sk ? "Naši lektori" : "Our teachers"}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-.035em] text-[#171A2B] sm:text-5xl">
              {sk ? "Spoznajte ľudí, s ktorými sa budete učiť." : "Meet the people you can learn with."}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-gray-600">
              {sk
                ? "Reálni lektori Mundus, predstavení priamo na našom Instagrame."
                : "Real Mundus teachers, introduced directly on our Instagram."}
            </p>
          </div>
          <a
            href="https://www.instagram.com/mundus.languages/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 self-start rounded-2xl border border-[#DDE2FB] bg-[#F5F6FF] px-5 py-3 font-semibold text-[#2F3AA2] transition hover:bg-[#EEF2FF]"
          >
            <Instagram size={18} /> @mundus.languages
          </a>
        </div>

        <div className="mt-9 flex snap-x gap-5 overflow-x-auto pb-4">
          {teacherPosts.map((shortcode, index) => (
            <div key={shortcode} className="w-[320px] shrink-0 snap-start sm:w-[360px]">
              <InstagramCard
                shortcode={shortcode}
                title={sk ? `Predstavenie lektora ${index + 1}` : `Teacher introduction ${index + 1}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function InstagramTestimonialsSection() {
  const { language } = useLanguage();
  const sk = language === "sk";

  return (
    <section id="testimonials" className="bg-[#F8F9FF] px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">
            {sk ? "Skúsenosti študentov" : "Student experiences"}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-.035em] text-[#171A2B] sm:text-5xl">
            {sk ? "Čo o Mundus hovoria naši študenti." : "What our students say about Mundus."}
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-gray-600">
            {sk
              ? "Zdieľame iba reálne referencie z nášho Instagramu."
              : "We only show real testimonials published on our Instagram."}
          </p>
        </div>

        <div className="mt-9 grid gap-5 lg:grid-cols-2">
          {testimonialPosts.map((shortcode, index) => (
            <InstagramCard
              key={shortcode}
              shortcode={shortcode}
              title={sk ? `Referencie študentov ${index + 1}` : `Student testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
