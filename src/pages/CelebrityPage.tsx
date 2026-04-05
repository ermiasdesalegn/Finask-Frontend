import {
  ArrowLeft,
  Briefcase,
  Cake,
  Clock,
  ExternalLink,
  Globe,
  Heart,
  LayoutGrid,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import React, { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  DEFAULT_PROGRAM_FIELD_STYLE,
  PROGRAM_FIELD_LABELS,
  PROGRAM_FIELD_STYLES,
} from "../constants/programFieldStyles";
import { blurReveal, springPop } from "../lib/motion/pageMotion";
import {
  useCelebritiesListQuery,
  useCelebrityDetailQuery,
} from "../lib/queries";
import { celebrityPath } from "../lib/services/celebrityService";
import { unwrapMarkdownLink } from "../lib/unwrapMarkdownLink";
import { cn } from "../lib/utils";
import type { Celebrity, Program, Question } from "../types";

const HERO_FALLBACK =
  "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=1200";

const BIO_PREVIEW_CHARS = 280;

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function formatBirthLine(
  birthday?: string,
  birthplace?: string
): string | null {
  if (!birthday && !birthplace) return null;
  const d = birthday ? new Date(birthday) : null;
  const ok = d && !Number.isNaN(d.getTime());
  const dateStr = ok
    ? d!.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";
  if (dateStr && birthplace) return `${dateStr}, in ${birthplace}`;
  if (dateStr) return dateStr;
  if (birthplace) return birthplace;
  return null;
}

function formatDeathLine(
  deathday?: string | null,
  deathplace?: string | null
): string | null {
  if (!deathday && !deathplace) return null;
  const d = deathday ? new Date(deathday) : null;
  const ok = d && !Number.isNaN(d.getTime());
  const dateStr = ok
    ? d!.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";
  if (dateStr && deathplace) return `${dateStr}, in ${deathplace}`;
  if (dateStr) return dateStr;
  if (deathplace) return String(deathplace);
  return null;
}

function renderBoldSegments(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-black text-slate-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function fieldStyleForProgram(p: Program) {
  const k = p.field || "";
  return PROGRAM_FIELD_STYLES[k] ?? DEFAULT_PROGRAM_FIELD_STYLE;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 flex items-center gap-3 text-lg font-black tracking-tight text-slate-900 dark:text-white">
      <span
        className="h-8 w-1 shrink-0 rounded-full bg-brand-yellow shadow-[0_0_12px_rgba(250,204,21,0.35)]"
        aria-hidden
      />
      {children}
    </h2>
  );
}

const CelebrityPage: React.FC = () => {
  const { slugOrId } = useParams<{ slugOrId: string }>();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [bioExpanded, setBioExpanded] = useState(false);

  const detailQuery = useCelebrityDetailQuery(slugOrId);
  const celeb = detailQuery.data?.data?.celebrity ?? null;

  const listQuery = useCelebritiesListQuery({ limit: 250, sort: "name" });
  const allCelebrities = listQuery.data?.data?.celebrities ?? [];

  const related = useMemo(() => {
    if (!celeb) return [];
    return allCelebrities
      .filter((c) => {
        if (celeb._id && c._id) return c._id !== celeb._id;
        if (celeb.slug && c.slug) return c.slug !== celeb.slug;
        return c.name !== celeb.name;
      })
      .slice(0, 12);
  }, [allCelebrities, celeb]);

  const programs = useMemo(() => {
    const raw = celeb?.recommendedPrograms ?? [];
    return raw.filter(
      (p): p is Program =>
        typeof p === "object" && p != null && typeof p.name === "string"
    );
  }, [celeb?.recommendedPrograms]);

  const coverSrc =
    unwrapMarkdownLink(celeb?.coverImage ?? undefined) ||
    unwrapMarkdownLink(celeb?.profileImage ?? undefined) ||
    HERO_FALLBACK;
  const profileSrc = unwrapMarkdownLink(celeb?.profileImage ?? undefined);

  const birthLine = formatBirthLine(celeb?.birthday, celeb?.birthplace);
  const deathLine = formatDeathLine(celeb?.deathday, celeb?.deathplace);
  const bio = celeb?.bio?.trim() ?? "";
  const bioNeedsToggle = bio.length > BIO_PREVIEW_CHARS;
  const bioShown =
    bioExpanded || !bioNeedsToggle
      ? bio
      : `${bio.slice(0, BIO_PREVIEW_CHARS).trim()}…`;

  const loading = detailQuery.isPending;
  const errMsg = detailQuery.isError
    ? detailQuery.error instanceof Error
      ? detailQuery.error.message
      : "Something went wrong"
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 pb-20 pt-6 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl animate-pulse space-y-6 px-4">
          <div className="h-48 rounded-2xl bg-slate-200 dark:bg-zinc-800" />
          <div className="h-8 w-2/3 rounded-lg bg-slate-200 dark:bg-zinc-800" />
          <div className="h-24 rounded-xl bg-slate-200 dark:bg-zinc-800" />
        </div>
      </div>
    );
  }

  if (errMsg || !celeb) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-100 px-6 dark:bg-zinc-950">
        <p className="text-center font-bold text-slate-700 dark:text-slate-300">
          {errMsg || "Profile not found."}
        </p>
        <button
          type="button"
          onClick={() => navigate("/celebrities")}
          className="rounded-full bg-brand-blue px-6 py-2.5 font-bold text-white"
        >
          Back to Great Minds
        </button>
      </div>
    );
  }

  const questions: Question[] = Array.isArray(celeb.questions)
    ? celeb.questions
    : [];

  return (
    <div className="min-h-screen bg-slate-100 pb-24 dark:bg-zinc-950">
      {/* Hero */}
      <div className="relative">
        <div className="relative h-52 w-full overflow-hidden sm:h-60 md:h-72">
          <img
            src={coverSrc}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute left-0 right-0 top-0 flex items-start justify-between p-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-full bg-white/90 p-2.5 shadow-md backdrop-blur-sm transition-colors hover:bg-white dark:bg-zinc-900/90 dark:hover:bg-zinc-800"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5 text-slate-800 dark:text-white" />
            </button>
            <button
              type="button"
              onClick={() => setSaved((s) => !s)}
              className="rounded-full bg-white/90 p-2.5 shadow-md backdrop-blur-sm transition-colors hover:bg-white dark:bg-zinc-900/90 dark:hover:bg-zinc-800"
              aria-label={saved ? "Remove from saved" : "Save"}
            >
              <Heart
                className={cn(
                  "h-5 w-5",
                  saved
                    ? "fill-brand-blue text-brand-blue"
                    : "fill-none text-slate-800 dark:text-white"
                )}
              />
            </button>
          </div>
        </div>

        <div className="relative mx-auto max-w-3xl px-4">
          <div className="absolute -top-14 left-4 z-10 sm:-top-16">
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-slate-200 shadow-xl dark:border-zinc-900 dark:bg-zinc-800 sm:h-32 sm:w-32">
              {profileSrc ? (
                <img
                  src={profileSrc}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-2xl font-black text-slate-600 dark:text-slate-300">
                  {initials(celeb.name)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={springPop}
        className="mx-auto max-w-3xl px-4 pt-20 sm:pt-[4.5rem]"
      >
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          {celeb.name}
        </h1>

        <ul className="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-400">
          {birthLine ? (
            <li className="flex gap-3">
              <Cake
                className="mt-0.5 h-4 w-4 shrink-0 text-slate-400"
                aria-hidden
              />
              <span>{birthLine}</span>
            </li>
          ) : null}
          {deathLine ? (
            <li className="flex gap-3">
              <Clock
                className="mt-0.5 h-4 w-4 shrink-0 text-slate-400"
                aria-hidden
              />
              <span>{deathLine}</span>
            </li>
          ) : null}
          {celeb.nationality ? (
            <li className="flex gap-3">
              <User
                className="mt-0.5 h-4 w-4 shrink-0 text-slate-400"
                aria-hidden
              />
              <span>{celeb.nationality}</span>
            </li>
          ) : null}
          {celeb.notablePosition ? (
            <li className="flex gap-3">
              <Briefcase
                className="mt-0.5 h-4 w-4 shrink-0 text-slate-400"
                aria-hidden
              />
              <span>{celeb.notablePosition}</span>
            </li>
          ) : null}
        </ul>

        {celeb.tags && celeb.tags.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {celeb.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 dark:border-white/15 dark:bg-zinc-900 dark:text-slate-300"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}
      </motion.div>

      <motion.div
        variants={blurReveal}
        initial="hidden"
        animate="show"
        className="mx-auto mt-10 max-w-3xl space-y-12 px-4"
      >
        {bio ? (
          <section>
            <SectionTitle>Bio</SectionTitle>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 text-sm leading-relaxed text-slate-700 shadow-sm dark:border-white/10 dark:bg-zinc-900 dark:text-slate-300">
              <p>{bioShown}</p>
              {bioNeedsToggle ? (
                <button
                  type="button"
                  onClick={() => setBioExpanded((e) => !e)}
                  className="mt-2 text-sm font-bold text-brand-blue hover:underline"
                >
                  {bioExpanded ? "Show less" : "Read more"}
                </button>
              ) : null}
              {celeb.wikipediaLink ? (
                <a
                  href={celeb.wikipediaLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-brand-blue hover:underline"
                >
                  <Globe className="h-4 w-4" />
                  Full article on Wikipedia
                  <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                </a>
              ) : null}
            </div>
          </section>
        ) : null}

        {celeb.education && celeb.education.length > 0 ? (
          <section>
            <SectionTitle>Education</SectionTitle>
            <ul className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900">
              {celeb.education.map((line, i) => (
                <li
                  key={i}
                  className="text-sm leading-relaxed text-slate-700 dark:text-slate-300"
                >
                  {line}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {celeb.careerHighlights && celeb.careerHighlights.length > 0 ? (
          <section>
            <SectionTitle>Career highlights</SectionTitle>
            <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:divide-white/10 dark:border-white/10 dark:bg-zinc-900">
              {celeb.careerHighlights.map((line, i) => (
                <p
                  key={i}
                  className="p-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300"
                >
                  {renderBoldSegments(line)}
                </p>
              ))}
            </div>
          </section>
        ) : null}

        {celeb.legacyImpact && celeb.legacyImpact.length > 0 ? (
          <section>
            <SectionTitle>Legacy &amp; impact</SectionTitle>
            <ul className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900">
              {celeb.legacyImpact.map((line, i) => (
                <li
                  key={i}
                  className="text-sm leading-relaxed text-slate-700 dark:text-slate-300"
                >
                  {line}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {celeb.family?.trim() ? (
          <section>
            <SectionTitle>Family</SectionTitle>
            <p className="rounded-2xl border border-slate-200/80 bg-white p-5 text-sm leading-relaxed text-slate-700 shadow-sm dark:border-white/10 dark:bg-zinc-900 dark:text-slate-300">
              {celeb.family}
            </p>
          </section>
        ) : null}

        {programs.length > 0 ? (
          <section>
            <SectionTitle>Be like them</SectionTitle>
            <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
              Related programs you can explore on Finask.
            </p>
            <div className="flex gap-4 overflow-x-auto pb-2 pt-1 [scrollbar-width:thin]">
              {programs.map((p) => {
                const cat = fieldStyleForProgram(p);
                const slug = p.slug?.trim() || p._id;
                const cover =
                  unwrapMarkdownLink(p.coverImage) ||
                  p.images?.map((x) => unwrapMarkdownLink(x)).find(Boolean);
                const fieldLabel =
                  p.fieldDisplayName?.trim() ||
                  PROGRAM_FIELD_LABELS[p.field || ""] ||
                  p.field;
                return (
                  <Link
                    key={p._id}
                    to={`/programs/${encodeURIComponent(slug)}`}
                    className="group flex w-[200px] shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all hover:border-brand-blue/30 hover:shadow-md dark:border-white/10 dark:bg-zinc-900"
                  >
                    <div
                      className={cn(
                        "relative h-28 overflow-hidden bg-slate-100 dark:bg-zinc-800",
                        cat.bg
                      )}
                    >
                      {cover ? (
                        <img
                          src={cover}
                          alt=""
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-3xl">
                          {cat.icon}
                        </div>
                      )}
                      <span className="absolute right-2 top-2 rounded-full bg-black/35 p-1 backdrop-blur-sm">
                        <Heart className="h-3.5 w-3.5 fill-none text-white" />
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col gap-1 p-3">
                      <p className="line-clamp-2 text-sm font-black leading-snug text-slate-900 dark:text-white">
                        {p.name}
                      </p>
                      <p
                        className={cn(
                          "flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide",
                          cat.accent
                        )}
                      >
                        <LayoutGrid className="h-3 w-3" />
                        {fieldLabel}
                      </p>
                      <p className="mt-auto flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <Clock className="h-3.5 w-3.5" />
                        {p.duration != null ? `${p.duration} yrs` : "—"}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ) : null}

        {questions.length > 0 ? (
          <section>
            <SectionTitle>Community questions</SectionTitle>
            <ul className="space-y-3">
              {questions.map((q) => (
                <li
                  key={q._id}
                  className="rounded-2xl border border-slate-200/80 bg-white p-4 text-sm shadow-sm dark:border-white/10 dark:bg-zinc-900"
                >
                  <p className="font-medium text-slate-900 dark:text-white">
                    {q.question}
                  </p>
                  {q.user?.firstName ? (
                    <p className="mt-2 text-xs text-slate-500">
                      — {q.user.firstName}
                      {q.replyCount != null && q.replyCount > 0
                        ? ` · ${q.replyCount} replies`
                        : ""}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {related.length > 0 ? (
          <section>
            <SectionTitle>You might also like</SectionTitle>
            <div className="flex gap-4 overflow-x-auto pb-2 pt-1 [scrollbar-width:thin]">
              {related.map((c) => {
                const thumb =
                  unwrapMarkdownLink(c.profileImage ?? undefined) ||
                  unwrapMarkdownLink(c.coverImage ?? undefined);
                return (
                  <Link
                    key={c._id ?? c.slug ?? c.name}
                    to={celebrityPath(c)}
                    className="group flex w-[160px] shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all hover:border-brand-blue/25 dark:border-white/10 dark:bg-zinc-900"
                  >
                    <div className="relative h-24 overflow-hidden bg-slate-200 dark:bg-zinc-800">
                      {thumb ? (
                        <img
                          src={thumb}
                          alt=""
                          className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-slate-300 to-slate-400 dark:from-zinc-700 dark:to-zinc-600" />
                      )}
                      <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-white shadow-md dark:border-zinc-900 dark:bg-zinc-800">
                        {unwrapMarkdownLink(c.profileImage ?? undefined) ? (
                          <img
                            src={
                              unwrapMarkdownLink(c.profileImage ?? undefined)!
                            }
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-black text-slate-600">
                            {initials(c.name)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-3 text-center">
                      <p className="line-clamp-2 text-sm font-black text-slate-900 dark:text-white">
                        {c.name}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                        {c.notablePosition}
                      </p>
                      {c.bio ? (
                        <p className="mt-2 line-clamp-3 text-[11px] leading-snug text-slate-500 dark:text-slate-500">
                          {c.bio}
                        </p>
                      ) : null}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ) : null}
      </motion.div>
    </div>
  );
};

export default CelebrityPage;
