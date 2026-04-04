import { BookOpen, Clock, ExternalLink, Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { ProgramFieldStyle } from "../../constants/programFieldStyles";
import { formatRatingsQuantityCompact } from "../../lib/universityUi";
import type { Program } from "../../types";
import { ProgramUniversitiesScroller } from "./ProgramUniversitiesScroller";

function tagLabels(program: Program): string[] {
  if (program.tagsDisplayNames?.length) return program.tagsDisplayNames;
  if (!program.tags?.length) return [];
  return program.tags.map(
    (t) => t.charAt(0).toUpperCase() + t.slice(1).replace(/([a-z])([A-Z])/g, "$1 $2")
  );
}

function programCover(program: Program): string | undefined {
  const c = program.coverImage?.trim();
  if (c) return c;
  const first = program.images?.find((u) => typeof u === "string" && u.trim());
  return first?.trim();
}

export function ProgramBrowseCard({
  program,
  cat,
  detailPath,
  prefetchUniversities,
}: {
  program: Program;
  cat: ProgramFieldStyle;
  detailPath: string;
  prefetchUniversities: boolean;
}) {
  const cover = programCover(program);
  const tags = tagLabels(program);
  const overview = program.overview?.trim();
  const fieldLabel =
    program.fieldDisplayName?.trim() ||
    program.field ||
    "";

  return (
    <article
      className={`overflow-hidden rounded-[1.75rem] border border-slate-200/70 bg-white/90 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-brand-blue/25 hover:shadow-xl hover:shadow-brand-blue/5 dark:border-white/10 dark:bg-zinc-900/85 dark:hover:border-brand-blue/30`}
    >
      <div className="flex flex-col gap-0 md:flex-row">
        <div className="relative h-44 w-full shrink-0 overflow-hidden bg-slate-100 dark:bg-zinc-800 md:h-auto md:min-h-[200px] md:w-56 lg:w-64">
          {cover ? (
            <img
              src={cover}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full min-h-[11rem] flex-col items-center justify-center gap-2 bg-slate-100 px-4 dark:bg-zinc-800">
              <span className="text-5xl drop-shadow-sm">{cat.icon}</span>
              <BookOpen
                size={22}
                className={`opacity-50 ${cat.accent}`}
                strokeWidth={2}
              />
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent md:bg-gradient-to-r" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-4 p-5 md:p-6 md:pl-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <Link
                to={detailPath}
                className="group/title inline-block"
              >
                <h3 className="text-lg font-black leading-snug tracking-tight text-slate-900 transition-colors group-hover/title:text-brand-blue dark:text-white md:text-xl">
                  {program.name}
                </h3>
              </Link>
              {fieldLabel ? (
                <p className={`mt-1.5 text-xs font-bold uppercase tracking-wider ${cat.accent}`}>
                  {fieldLabel}
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              {program.duration != null ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600 dark:bg-zinc-800 dark:text-slate-300">
                  <Clock size={11} />
                  {program.duration} yrs
                </span>
              ) : null}
              {program.ratingsAverage != null ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-900 dark:bg-amber-900/35 dark:text-amber-200">
                  <Star size={11} className="fill-current" />
                  {program.ratingsAverage.toFixed(1)}
                  <span className="font-medium opacity-80">
                    ({formatRatingsQuantityCompact(program.ratingsQuantity)})
                  </span>
                </span>
              ) : null}
            </div>
          </div>

          {tags.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {tags.slice(0, 6).map((t) => (
                <span
                  key={t}
                  className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${cat.border} ${cat.bg} ${cat.accent}`}
                >
                  {t}
                </span>
              ))}
              {tags.length > 6 ? (
                <span className="self-center text-[10px] font-bold text-slate-400">
                  +{tags.length - 6}
                </span>
              ) : null}
            </div>
          ) : null}

          {overview ? (
            <p className="line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {overview}
            </p>
          ) : (
            <p className="text-sm italic text-slate-400 dark:text-slate-500">
              Open the program page for full details and universities offering this degree.
            </p>
          )}

          {program.careerPaths && program.careerPaths.length > 0 ? (
            <p className="line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Careers:{" "}
              </span>
              {program.careerPaths.slice(0, 6).join(" · ")}
              {program.careerPaths.length > 6
                ? ` · +${program.careerPaths.length - 6} more`
                : ""}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              to={detailPath}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-blue px-4 py-2 text-xs font-black text-white shadow-md shadow-brand-blue/25 transition-colors hover:bg-blue-700"
            >
              <BookOpen size={14} />
              View program
            </Link>
            {program.wikipediaLink ? (
              <a
                href={program.wikipediaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 underline-offset-2 hover:text-brand-blue hover:underline dark:text-slate-400"
              >
                <ExternalLink size={12} />
                Wikipedia
              </a>
            ) : null}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 px-5 py-5 dark:border-white/10 md:px-6">
        <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Universities offering this program
        </p>
        <ProgramUniversitiesScroller
          program={program}
          cat={cat}
          enabled={prefetchUniversities}
        />
      </div>
    </article>
  );
}
