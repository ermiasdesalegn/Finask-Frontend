import {
  ArrowLeft,
  BookOpen,
  Clock,
  ExternalLink,
  Sparkles,
  Star,
} from "lucide-react";
import { motion } from "motion/react";
import React from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ProgramUniversitiesScroller } from "../components/programs/ProgramUniversitiesScroller";
import {
  DEFAULT_PROGRAM_FIELD_STYLE,
  PROGRAM_FIELD_STYLES,
} from "../constants/programFieldStyles";
import { useProgramDetailQuery } from "../lib/queries/programs";
import { blurReveal } from "../lib/motion/pageMotion";
import { formatRatingsQuantityCompact } from "../lib/universityUi";

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
          {program.coverImage && (
            <div className="overflow-hidden rounded-3xl border border-slate-200/60 dark:border-white/10">
              <img
                src={program.coverImage}
                alt={program.name}
                className="h-56 w-full object-cover md:h-72"
              />
            </div>
          )}

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

          <div>
            <h2 className="mb-4 text-lg font-black text-slate-900 dark:text-white">
              Universities offering this program
            </h2>
            <ProgramUniversitiesScroller
              program={program}
              cat={cat}
              enabled
            />
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ProgramPage;
