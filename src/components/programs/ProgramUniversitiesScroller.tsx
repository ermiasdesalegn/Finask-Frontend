import { GraduationCap, Heart, MapPin, Star } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ProgramFieldStyle } from "../../constants/programFieldStyles";
import { useProgramUniversitiesQuery } from "../../lib/queries/programs";
import {
  displayRating,
  formatRatingsQuantityCompact,
  universityCity,
  universityCover,
  universityPath,
} from "../../lib/universityUi";
import type { Program, University } from "../../types";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

function programStableId(program: Program): string {
  const a = program._id?.trim();
  if (a) return a;
  const b = program.id?.trim();
  return b ?? "";
}

export function ProgramUniversitiesScroller({
  program,
  cat,
  enabled = false,
  /** Program detail page: fetch as soon as enabled (no scroll gate) */
  eager = false,
}: {
  program: Program;
  cat: ProgramFieldStyle;
  /** Parent allows fetch once this program row is near the viewport */
  enabled?: boolean;
  eager?: boolean;
}) {
  void cat;
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [rowInView, setRowInView] = useState(() => Boolean(eager));
  const programId = programStableId(program);

  useEffect(() => {
    if (eager) {
      setRowInView(true);
      return;
    }
    if (!enabled || !programId) return;
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRowInView(true);
          obs.disconnect();
        }
      },
      { rootMargin: "80px 0px", threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [enabled, programId, eager]);

  const shouldFetch = enabled && rowInView && Boolean(programId);
  const { data, isPending } = useProgramUniversitiesQuery(
    shouldFetch ? programId : ""
  );

  const rows = data?.data?.universityprograms ?? [];
  const rowsWithUni = rows.filter(
    (r): r is (typeof rows)[number] & { university: University } =>
      typeof r.university === "object" && r.university != null && Boolean(r.university.name || r.university.slug || r.university._id)
  );

  if (!enabled || !programId) return null;

  return (
    <div ref={containerRef} className="w-full min-h-[1px]">
      {rowInView && isPending ? (
        <div className="flex gap-5 overflow-x-auto pb-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 w-64 shrink-0 animate-pulse rounded-[2rem] bg-slate-100 dark:bg-zinc-800"
            />
          ))}
        </div>
      ) : null}
      {rowInView && !isPending && rowsWithUni.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="-mx-6 flex gap-5 overflow-x-auto px-6 pb-3 [scrollbar-width:none] lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {rowsWithUni.map((row) => {
            const uni = row.university;
            return (
            <motion.div
              variants={itemVariants}
              key={row._id || uni._id || uni.slug}
              onClick={() => navigate(universityPath(uni))}
              className="group w-64 shrink-0 cursor-pointer overflow-hidden rounded-[2rem] border border-slate-200/60 bg-white/90 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-blue/30 hover:shadow-xl hover:shadow-brand-blue/10 dark:border-white/10 dark:bg-zinc-900/90"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={universityCover(uni)}
                  alt={uni.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {uni.isFeatured && (
                  <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-brand-yellow px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-slate-900">
                    <Star size={9} fill="currentColor" /> Featured
                  </div>
                )}
                <button
                  type="button"
                  className="absolute right-3 top-3 rounded-full bg-black/40 p-2 text-white backdrop-blur transition-all hover:scale-110 hover:bg-black/60"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Heart size={13} />
                </button>
              </div>
              <div className="p-4">
                <h4 className="mb-1 line-clamp-1 text-sm font-black text-slate-900 transition-colors group-hover:text-brand-blue dark:text-white">
                  {uni.name}
                </h4>
                <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin size={11} className="shrink-0 text-brand-blue" />{" "}
                    {universityCity(uni) || "Ethiopia"}
                  </span>
                  {row.yearOffered != null ? (
                    <span className="text-[11px] font-semibold text-slate-400">
                      Since {row.yearOffered}
                    </span>
                  ) : null}
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-white/10">
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <Star size={11} className="text-brand-yellow" fill="currentColor" />
                    {displayRating(uni)}{" "}
                    <span className="font-normal text-slate-400">
                      ({formatRatingsQuantityCompact(uni.ratingsQuantity)})
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <GraduationCap size={11} />{" "}
                    {program.duration != null ? `${program.duration} yrs` : "—"}
                  </div>
                </div>
              </div>
            </motion.div>
          );
          })}
        </motion.div>
      ) : null}
      {rowInView && !isPending && rows.length === 0 ? (
        <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          No universities are linked to this program in the directory yet. Check back later or browse
          universities from the home page.
        </p>
      ) : null}
    </div>
  );
}
