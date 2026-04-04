import {
  Clock,
  Gem,
  LayoutGrid,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ProgramBrowseCard } from "../components/programs/ProgramBrowseCard";
import { AnimatedGridPattern } from "../components/ui/animated-grid-pattern";
import {
  DEFAULT_PROGRAM_FIELD_STYLE,
  PROGRAM_FIELD_LABELS,
  PROGRAM_FIELD_STYLES,
} from "../constants/programFieldStyles";
import { blurReveal, springPop } from "../lib/motion/pageMotion";
import { useProgramsListQuery, useRareProgramsQuery } from "../lib/queries";
import { cn } from "../lib/utils";
import type { Program } from "../types";

const EMPTY_PROGRAMS: Program[] = [];

function programListKey(p: Program): string {
  const id = p._id?.trim() || p.id?.trim();
  if (id) return id;
  return p.slug;
}

function fieldLabelForProgram(p: Program): string {
  const fd = p.fieldDisplayName?.trim();
  if (fd) return fd;
  const k = p.field || "";
  return PROGRAM_FIELD_LABELS[k] ?? "";
}

/** Stable field order for filter chips (matches Discover). */
const ALL_FIELD_KEYS = (Object.keys(PROGRAM_FIELD_LABELS) as string[]).filter(
  (k) => k in PROGRAM_FIELD_STYLES
);

const ProgramsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filterRare = searchParams.get("filter") === "rare";
  const fieldParamRaw = searchParams.get("field");
  const fieldParam =
    fieldParamRaw && fieldParamRaw in PROGRAM_FIELD_STYLES
      ? fieldParamRaw
      : null;

  const setFieldParam = (field: string | null) => {
    setSearchParams(
      (prev) => {
        const n = new URLSearchParams(prev);
        if (field) n.set("field", field);
        else n.delete("field");
        return n;
      },
      { replace: true }
    );
  };

  const setFilterRare = (rare: boolean) => {
    setSearchParams(
      (prev) => {
        const n = new URLSearchParams(prev);
        if (rare) n.set("filter", "rare");
        else n.delete("filter");
        return n;
      },
      { replace: true }
    );
  };

  useEffect(() => {
    if (!fieldParamRaw || fieldParamRaw in PROGRAM_FIELD_STYLES) return;
    setSearchParams(
      (prev) => {
        const n = new URLSearchParams(prev);
        n.delete("field");
        return n;
      },
      { replace: true }
    );
  }, [fieldParamRaw, setSearchParams]);

  const [search, setSearch] = useState("");

  const listFilters = useMemo(
    () => ({
      limit: 500,
      sort: "name",
      field: filterRare ? null : fieldParam,
    }),
    [fieldParam, filterRare]
  );

  const programsListQuery = useProgramsListQuery(listFilters, {
    enabled: !filterRare,
  });
  const rareQuery = useRareProgramsQuery({
    limit: 100,
    enabled: filterRare,
  });

  const rawPrograms = useMemo(() => {
    if (filterRare) return rareQuery.data ?? EMPTY_PROGRAMS;
    const list = programsListQuery.data?.data?.programs;
    return list ?? EMPTY_PROGRAMS;
  }, [filterRare, rareQuery.data, programsListQuery.data?.data?.programs]);

  const programs = useMemo(() => {
    if (!fieldParam) return rawPrograms;
    return rawPrograms.filter((p) => (p.field || "other") === fieldParam);
  }, [rawPrograms, fieldParam]);

  const loading = filterRare
    ? rareQuery.isPending
    : programsListQuery.isPending;
  const error = filterRare
    ? rareQuery.isError
      ? rareQuery.error instanceof Error
        ? rareQuery.error.message
        : "Failed to load"
      : null
    : programsListQuery.isError
      ? programsListQuery.error instanceof Error
        ? programsListQuery.error.message
        : "Failed to load"
      : null;

  const grouped = useMemo(() => {
    const g = new Map<string, Program[]>();
    for (const p of programs) {
      const key = p.field || "other";
      if (!g.has(key)) g.set(key, []);
      g.get(key)!.push(p);
    }
    return g;
  }, [programs]);

  const fieldKeys = useMemo(() => [...grouped.keys()].sort(), [grouped]);

  const filteredFieldKeys = useMemo(() => {
    const q = search.toLowerCase();
    return fieldKeys.filter((fieldKey) => {
      if (fieldParam && fieldKey !== fieldParam) return false;
      const progs = grouped.get(fieldKey) ?? [];
      if (!q) return true;
      return progs.some(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.fieldDisplayName ?? "").toLowerCase().includes(q)
      );
    });
  }, [fieldKeys, grouped, search, fieldParam]);

  const [visibleFields, setVisibleFields] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
    setVisibleFields(new Set());
  }, [filterRare, fieldParam]);

  useEffect(() => {
    if (sectionRefs.current.size === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const fieldKey = (entry.target as HTMLElement).dataset.fieldKey;
          if (!fieldKey) return;
          setVisibleFields((prev) => {
            if (prev.has(fieldKey)) return prev;
            return new Set([...prev, fieldKey]);
          });
        });
      },
      { rootMargin: "200px" }
    );
    sectionRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  // Re-run whenever the list of visible field keys changes (new sections rendered)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredFieldKeys.join(","), loading]);

  return (
    <div className="relative min-h-screen w-full bg-white pb-24 transition-colors duration-300 dark:bg-[#121212]">
      <div className="fixed inset-0 z-0">
        <AnimatedGridPattern
          numSquares={45}
          maxOpacity={0.15}
          duration={4}
          repeatDelay={0.5}
          className={cn(
            "absolute inset-0 h-full w-full",
            "[mask-image:radial-gradient(800px_circle_at_top,white,transparent)]",
            "-skew-y-12"
          )}
        />
      </div>

      <div className="pointer-events-none fixed right-0 top-0 z-0 h-[45%] w-[45%] -translate-y-1/2 translate-x-1/4 rounded-full bg-brand-blue/5 blur-[140px]" />
      <div className="pointer-events-none fixed bottom-0 left-0 z-0 h-[45%] w-[45%] -translate-x-1/4 translate-y-1/4 rounded-full bg-brand-yellow/5 blur-[140px]" />

      <section className="relative z-10 mb-8 overflow-hidden px-6 pb-16 pt-16">
        <div className="relative mx-auto max-w-5xl">
          <motion.div
            initial="hidden"
            animate="show"
            variants={springPop}
            className="mb-6 flex flex-col items-center gap-3"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-4 py-2 text-sm font-bold text-brand-blue backdrop-blur-md dark:border-blue-500/20 dark:bg-blue-500/10">
              <Sparkles size={15} className="text-brand-yellow" /> Browse
              programs across Ethiopia
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setFilterRare(false)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-black uppercase tracking-wider transition-all ${
                  !filterRare
                    ? "border-brand-blue bg-brand-blue text-white shadow-md shadow-brand-blue/25"
                    : "border-slate-200 bg-white/80 text-slate-600 hover:border-brand-blue/40 dark:border-white/10 dark:bg-zinc-900 dark:text-slate-300"
                }`}
              >
                <LayoutGrid size={14} /> Full catalog
              </button>
              <button
                type="button"
                onClick={() => setFilterRare(true)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-black uppercase tracking-wider transition-all ${
                  filterRare
                    ? "border-violet-500 bg-violet-600 text-white shadow-md shadow-violet-500/25 dark:bg-violet-600"
                    : "border-slate-200 bg-white/80 text-slate-600 hover:border-violet-400/50 dark:border-white/10 dark:bg-zinc-900 dark:text-slate-300"
                }`}
              >
                <Gem size={14} /> Rare programs
              </button>
            </div>
            {filterRare && (
              <p className="max-w-md text-center text-xs font-medium text-slate-500 dark:text-slate-400">
                From{" "}
                <code className="rounded bg-slate-100 px-1 py-0.5 text-[10px] dark:bg-zinc-800">
                  GET /programs/rare
                </code>
                . Use field chips to narrow;{" "}
                <button
                  type="button"
                  onClick={() => setFilterRare(false)}
                  className="font-bold text-brand-blue underline-offset-2 hover:underline"
                >
                  open full catalog
                </button>{" "}
                for server-side field filters.
              </p>
            )}
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="show"
            variants={blurReveal}
            transition={{ delay: 0.06 }}
            className="mb-4 text-center text-5xl font-black leading-[0.92] tracking-tighter text-slate-900 dark:text-white md:text-7xl"
          >
            Find Your
            <br />
            <span className="text-brand-blue">Perfect Program</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="show"
            variants={springPop}
            transition={{ delay: 0.12 }}
            className="mx-auto mb-10 max-w-xl text-center text-lg font-medium text-slate-500 dark:text-slate-400"
          >
            Explore fields of study across Ethiopia&apos;s top universities and
            start shaping your future.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="show"
            variants={blurReveal}
            transition={{ delay: 0.18 }}
            className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white/80 shadow-[0_20px_60px_-15px_rgba(37,99,235,0.12)] backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-900/80 dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4 dark:border-white/10">
              <Search className="h-5 w-5 flex-shrink-0 text-brand-blue" />
              <input
                type="text"
                className="flex-1 bg-transparent text-base font-medium text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600"
                placeholder="Search programs, e.g. Medicine, Engineering..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <AnimatePresence>
                {search && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    type="button"
                    onClick={() => setSearch("")}
                    className="rounded-full bg-slate-100 p-1.5 text-slate-500 transition-colors hover:text-slate-900 dark:bg-zinc-800 dark:hover:text-white"
                  >
                    <X size={14} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
            <div className="flex flex-wrap gap-2 px-5 py-4">
              <button
                type="button"
                onClick={() => setFieldParam(null)}
                className={`rounded-[2rem] px-4 py-2 text-sm font-bold transition-all duration-200 ${
                  !fieldParam
                    ? "scale-105 bg-brand-blue text-white shadow-lg shadow-brand-blue/30"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-zinc-800 dark:text-slate-300 dark:hover:bg-zinc-700"
                }`}
              >
                All Fields
              </button>
              {ALL_FIELD_KEYS.map((fk) => {
                const style = PROGRAM_FIELD_STYLES[fk] ?? DEFAULT_PROGRAM_FIELD_STYLE;
                const count = (grouped.get(fk) ?? []).length;
                const label = PROGRAM_FIELD_LABELS[fk] ?? fk;
                return (
                  <button
                    key={fk}
                    type="button"
                    onClick={() =>
                      setFieldParam(fieldParam === fk ? null : fk)
                    }
                    className={`flex items-center gap-1.5 rounded-[2rem] px-4 py-2 text-sm font-bold transition-all duration-200 ${
                      fieldParam === fk
                        ? "scale-105 bg-slate-900 text-white shadow-md dark:bg-white dark:text-slate-900"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-zinc-800 dark:text-slate-300 dark:hover:bg-zinc-700"
                    }`}
                  >
                    <span>{style.icon}</span>
                    <span className="hidden sm:inline">{label}</span>
                    {count > 0 && (
                      <span
                        className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-black ${
                          fieldParam === fk
                            ? "bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900"
                            : "bg-slate-200/80 text-slate-600 dark:bg-zinc-700 dark:text-slate-300"
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {error && (
        <p className="relative z-10 px-6 text-center text-sm font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <div className="relative z-10 mx-auto max-w-7xl space-y-20 px-6 lg:px-8">
        {loading ? (
          <div className="space-y-12 py-12">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-3xl bg-slate-100 dark:bg-zinc-800"
              />
            ))}
          </div>
        ) : (
          filteredFieldKeys.map((fieldKey, catIndex) => {
            const cat = PROGRAM_FIELD_STYLES[fieldKey] ?? DEFAULT_PROGRAM_FIELD_STYLE;
            const prefetchUniversities =
              visibleFields.has(fieldKey) ||
              filteredFieldKeys.indexOf(fieldKey) < 3 ||
              (fieldParam != null && fieldKey === fieldParam);
            const progs = (grouped.get(fieldKey) ?? []).filter(
              (p) =>
                !search ||
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                fieldLabelForProgram(p)
                  .toLowerCase()
                  .includes(search.toLowerCase())
            );
            if (progs.length === 0) return null;
            const sectionTitle =
              progs[0]?.fieldDisplayName?.trim() ||
              PROGRAM_FIELD_LABELS[fieldKey] ||
              fieldKey;

            return (
              <motion.section
                key={fieldKey}
                ref={(el) => {
                  if (el) {
                    sectionRefs.current.set(fieldKey, el);
                  } else {
                    sectionRefs.current.delete(fieldKey);
                  }
                }}
                data-field-key={fieldKey}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-48px", amount: 0.08 }}
                variants={blurReveal}
                transition={{ delay: Math.min(catIndex * 0.05, 0.35) }}
              >
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-2 rounded-full shadow-lg ${cat.bar}`} />
                    <div>
                      <div className="mb-0.5 flex items-center gap-2">
                        <span className="text-2xl">{cat.icon}</span>
                        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white md:text-3xl">
                          {sectionTitle}
                        </h2>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {progs.length} program{progs.length === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`hidden items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold sm:flex ${cat.bg} ${cat.accent} ${cat.border}`}
                  >
                    <Clock size={11} /> Field
                  </span>
                </div>

                <div className="space-y-8">
                  {progs.map((program) => {
                    const detailPath =
                      program.slug
                        ? `/programs/${encodeURIComponent(program.slug)}`
                        : `/programs/${encodeURIComponent(programListKey(program))}`;
                    return (
                      <ProgramBrowseCard
                        key={programListKey(program)}
                        program={program}
                        cat={cat}
                        detailPath={detailPath}
                        prefetchUniversities={prefetchUniversities}
                      />
                    );
                  })}
                </div>
              </motion.section>
            );
          })
        )}

        {!loading && filteredFieldKeys.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-32 text-center"
          >
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-[2rem] border border-slate-100 bg-white text-slate-300 shadow-xl dark:border-white/5 dark:bg-zinc-900 dark:text-slate-600">
              <Search size={36} />
            </div>
            <h3 className="mb-2 text-2xl font-black text-slate-900 dark:text-white">
              No programs found
            </h3>
            <p className="mb-6 text-slate-500 dark:text-slate-400">
              Try a different search term or clear the filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSearchParams({}, { replace: true });
              }}
              className="rounded-2xl bg-brand-blue px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-blue/30 transition-colors hover:bg-blue-700"
            >
              Clear Search
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProgramsPage;
