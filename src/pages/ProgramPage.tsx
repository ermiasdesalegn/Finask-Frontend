import {
  ArrowLeft,
  BookOpen,
  Clock,
  ExternalLink,
  ListChecks,
  MessageCircleQuestion,
  Sparkles,
  Star,
  ThumbsUp,
  User,
  Wrench,
} from "lucide-react";
import { motion } from "motion/react";
import React from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ProgramUniversitiesScroller } from "../components/programs/ProgramUniversitiesScroller";
import { PROGRAM_IMAGE_FALLBACK } from "../constants/defaultMediaFallbacks";
import {
  DEFAULT_PROGRAM_FIELD_STYLE,
  PROGRAM_FIELD_STYLES,
} from "../constants/programFieldStyles";
import { useProgramDetailQuery } from "../lib/queries/programs";
import { blurReveal } from "../lib/motion/pageMotion";
import {
  formatRatingsQuantityCompact,
  universityCover,
  universityPath,
} from "../lib/universityUi";
import { unwrapMarkdownLink } from "../lib/unwrapMarkdownLink";
import type { Review } from "../types";

function reviewAuthorName(r: Review): string {
  const u = r.user;
  if (!u) return "Student";
  const full = u.fullName?.trim();
  if (full) return full;
  const parts = [u.firstName, u.lastName].filter(Boolean);
  return parts.length ? parts.join(" ") : "Student";
}

const ProgramPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isRareShortcut = slug === "rare";
  const programQuery = useProgramDetailQuery(
    isRareShortcut ? undefined : slug
  );

  if (isRareShortcut) {
    return <Navigate to="/programs?filter=rare" replace />;
  }
  const program = programQuery.data ?? null;

  const loading = programQuery.isPending;
  const error = programQuery.isError
    ? programQuery.error instanceof Error
      ? programQuery.error.message
      : "Failed to load"
    : null;

  if (loading) {
    return (
      <div className="min-h-screen pb-20 pt-8 dark:bg-[#121212]">
        <div className="mx-auto max-w-5xl animate-pulse space-y-6 px-6">
          <div className="h-10 w-2/3 rounded-xl bg-slate-200 dark:bg-zinc-800" />
          <div className="h-48 rounded-3xl bg-slate-200 dark:bg-zinc-800" />
          <div className="h-32 rounded-2xl bg-slate-200 dark:bg-zinc-800" />
        </div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 dark:bg-[#121212]">
        <p className="font-bold text-slate-700 dark:text-slate-300">
          {error || "Program not found."}
        </p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-full bg-brand-blue px-6 py-2 font-bold text-white"
        >
          Go back
        </button>
      </div>
    );
  }

  const cat =
    PROGRAM_FIELD_STYLES[program.field] ?? DEFAULT_PROGRAM_FIELD_STYLE;
  const tags: string[] = program.tagsDisplayNames ?? program.tags ?? [];
  const heroImage =
    unwrapMarkdownLink(program.coverImage) ||
    program.images?.map((u) => unwrapMarkdownLink(u)).find(Boolean) ||
    PROGRAM_IMAGE_FALLBACK;
  const reviews = program.reviews ?? [];
  const questions = program.questions ?? [];
  const embeddedOfferingCount =
    program.universityOfferings?.filter((o) => {
      const u = o.university;
      return u != null && typeof u !== "string" && Boolean(u.name);
    }).length ?? 0;
  /** Avoid duplicate / conflicting data: detail payload wins over GET /programs/:id/universities */
  const showUniversitiesScroller = embeddedOfferingCount === 0;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 dark:bg-[#0a0a0a]">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 px-6 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/85">
        <div className="mx-auto flex max-w-5xl items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-full bg-slate-100 p-2.5 transition-all hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
          >
            <ArrowLeft size={18} className="text-slate-700 dark:text-slate-300" />
          </button>
          <div className="min-w-0 flex-1">
            <div className="mb-0.5 flex items-center gap-2">
              <span className="text-xl">{cat.icon}</span>
              <h1 className="truncate text-xl font-black tracking-tight text-slate-900 dark:text-white md:text-2xl">
                {program.name}
              </h1>
            </div>
            <p className="truncate text-sm text-slate-500 dark:text-slate-400">
              {program.fieldDisplayName ?? program.field}
              {program.duration != null ? ` · ${program.duration} yrs` : ""}
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8 lg:px-8">
        <motion.div initial="hidden" animate="show" variants={blurReveal} className="space-y-8">
          <div className="overflow-hidden rounded-3xl border border-slate-200/60 dark:border-white/10">
            <img
              src={heroImage}
              alt={program.name}
              className="h-56 w-full object-cover md:h-72"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black ${cat.pill}`}
            >
              <BookOpen size={12} />
              {program.fieldDisplayName ?? program.field}
            </span>
            {program.duration != null && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 dark:bg-zinc-800 dark:text-slate-300">
                <Clock size={12} />
                {program.duration} years
              </span>
            )}
            {program.ratingsAverage != null && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                <Star size={12} className="fill-current" />
                {program.ratingsAverage != null
                  ? program.ratingsAverage.toFixed(1)
                  : "—"}{" "}
                (
                {formatRatingsQuantityCompact(program.ratingsQuantity)})
              </span>
            )}
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 text-xs font-bold text-slate-600 dark:border-white/10 dark:bg-zinc-800 dark:text-slate-300"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {program.overview && (
            <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-6 dark:border-white/5 dark:bg-zinc-900/80">
              <h2 className="mb-3 flex items-center gap-2 text-lg font-black text-slate-900 dark:text-white">
                <Sparkles size={18} className="text-brand-blue" />
                Overview
              </h2>
              <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                {program.overview}
              </p>
              {program.wikipediaLink && (
                <a
                  href={program.wikipediaLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-blue hover:underline"
                >
                  Wikipedia <ExternalLink size={13} />
                </a>
              )}
            </div>
          )}

          {program.careerPaths && program.careerPaths.length > 0 && (
            <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-6 dark:border-white/5 dark:bg-zinc-900/80">
              <h2 className="mb-3 text-lg font-black text-slate-900 dark:text-white">
                Career paths
              </h2>
              <div className="flex flex-wrap gap-2">
                {program.careerPaths.map((c) => (
                  <span
                    key={c}
                    className="rounded-xl bg-brand-blue/10 px-3 py-1.5 text-xs font-bold text-brand-blue dark:bg-brand-blue/20"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {program.courses && program.courses.length > 0 && (
            <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-6 dark:border-white/5 dark:bg-zinc-900/80">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-900 dark:text-white">
                <ListChecks size={18} className="text-brand-blue" />
                Typical courses
              </h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {program.courses.map((course) => (
                  <li
                    key={course}
                    className="rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2 text-sm font-medium text-slate-700 dark:border-white/10 dark:bg-zinc-800/60 dark:text-slate-300"
                  >
                    {course}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {program.skills && program.skills.length > 0 && (
            <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-6 dark:border-white/5 dark:bg-zinc-900/80">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-900 dark:text-white">
                <Wrench size={18} className="text-brand-blue" />
                Skills you build
              </h2>
              <ul className="space-y-2">
                {program.skills.map((skill) => (
                  <li
                    key={skill}
                    className="flex gap-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-blue" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {reviews.length > 0 && (
            <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-6 dark:border-white/5 dark:bg-zinc-900/80">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-900 dark:text-white">
                <Star size={18} className="text-amber-500" fill="currentColor" />
                Reviews
              </h2>
              <ul className="space-y-4">
                {reviews.map((r) => {
                  const likes = r.likesCount ?? r.likes?.length ?? 0;
                  const when = r.createdAt
                    ? new Date(r.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : null;
                  return (
                    <li
                      key={r._id}
                      className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-white/10 dark:bg-zinc-800/40"
                    >
                      <div className="mb-3 flex items-start gap-3">
                        {r.user?.profileImage ? (
                          <img
                            src={r.user.profileImage}
                            alt=""
                            className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-white dark:ring-zinc-700"
                          />
                        ) : (
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-200 ring-2 ring-white dark:bg-zinc-700 dark:ring-zinc-700">
                            <User size={20} className="text-slate-500 dark:text-slate-400" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-slate-900 dark:text-white">
                            {reviewAuthorName(r)}
                          </p>
                          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500 dark:text-slate-400">
                            <span className="inline-flex items-center gap-0.5 font-semibold text-amber-700 dark:text-amber-400">
                              <Star size={11} className="fill-current" />
                              {r.rating.toFixed(1)}
                            </span>
                            {when ? <span>{when}</span> : null}
                          </div>
                        </div>
                      </div>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {r.review}
                      </p>
                      {likes > 0 ? (
                        <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                          <ThumbsUp size={13} className="text-brand-blue" />
                          {likes} {likes === 1 ? "like" : "likes"}
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {questions.length > 0 && (
            <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-6 dark:border-white/5 dark:bg-zinc-900/80">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-900 dark:text-white">
                <MessageCircleQuestion size={18} className="text-brand-blue" />
                Questions
              </h2>
              <ul className="space-y-3">
                {questions.map((q) => (
                  <li
                    key={q._id}
                    className="rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-zinc-800/40 dark:text-slate-300"
                  >
                    {q.question}
                    {q.replyCount != null && q.replyCount > 0 ? (
                      <span className="mt-2 block text-xs font-semibold text-slate-500">
                        {q.replyCount} {q.replyCount === 1 ? "reply" : "replies"}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {questions.length === 0 &&
          program.questionCount != null &&
          program.questionCount > 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200/70 bg-white/60 p-6 dark:border-white/15 dark:bg-zinc-900/50">
              <h2 className="mb-2 flex items-center gap-2 text-lg font-black text-slate-900 dark:text-white">
                <MessageCircleQuestion size={18} className="text-brand-blue" />
                Questions
              </h2>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {program.questionCount === 1
                  ? "There is 1 community question for this program."
                  : `There are ${program.questionCount} community questions.`}{" "}
                Question text will show here when the API includes the questions list on this endpoint.
              </p>
            </div>
          ) : null}

          <div>
            <h2 className="mb-4 text-lg font-black text-slate-900 dark:text-white">
              Universities offering this program
            </h2>
            {embeddedOfferingCount > 0 ? (
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {program.universityOfferings.map((o) => {
                  const u = o.university;
                  if (u == null) return null;
                  if (typeof u === "string") return null;
                  if (!u.name) return null;
                  return (
                    <Link
                      key={o._id}
                      to={universityPath(u)}
                      className="group flex max-w-full items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/90 p-3 pr-4 shadow-sm transition-all hover:border-brand-blue/35 hover:shadow-md dark:border-white/10 dark:bg-zinc-900/80 sm:min-w-[240px]"
                    >
                      <img
                        src={universityCover(u)}
                        alt=""
                        className="h-14 w-14 shrink-0 rounded-xl object-cover"
                      />
                      <div className="min-w-0">
                        <p className="truncate font-bold text-slate-900 group-hover:text-brand-blue dark:text-white">
                          {u.name}
                        </p>
                        <div className="mt-0.5 flex flex-wrap gap-x-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                          {o.yearOffered != null ? (
                            <span>Since {o.yearOffered}</span>
                          ) : null}
                          {o.graduatesCount != null ? (
                            <span>
                              {o.yearOffered != null ? "· " : ""}
                              {o.graduatesCount.toLocaleString()} grads
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : null}
            <ProgramUniversitiesScroller
              program={program}
              cat={cat}
              enabled={showUniversitiesScroller}
              eager={showUniversitiesScroller}
            />
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ProgramPage;
