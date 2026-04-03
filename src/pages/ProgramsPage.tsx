import {
  Clock,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useMemo, useState } from "react";
import { AnimatedGridPattern } from "../components/ui/animated-grid-pattern";
import { ProgramUniversitiesScroller } from "../components/programs/ProgramUniversitiesScroller";
import {
  DEFAULT_PROGRAM_FIELD_STYLE,
  PROGRAM_FIELD_STYLES,
} from "../constants/programFieldStyles";
import { useProgramsListQuery } from "../lib/queries";
import { cn } from "../lib/utils";
import type { Program } from "../types";

const ProgramsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [activeField, setActiveField] = useState<string | null>(null);

  const programsQuery = useProgramsListQuery();

  const programs = programsQuery.data?.data?.programs ?? [];
  const loading = programsQuery.isPending;
  const error = programsQuery.isError
    ? programsQuery.error instanceof Error
      ? programsQuery.error.message
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
      if (activeField && fieldKey !== activeField) return false;
      const progs = grouped.get(fieldKey) ?? [];
      if (!q) return true;
      return progs.some(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.fieldDisplayName ?? "").toLowerCase().includes(q)
      );
    });
  }, [fieldKeys, grouped, search, activeField]);

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
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex justify-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-4 py-2 text-sm font-bold text-brand-blue backdrop-blur-md dark:border-blue-500/20 dark:bg-blue-500/10">
              <Sparkles size={15} className="text-brand-yellow" /> Browse
              programs across Ethiopia
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-4 text-center text-5xl font-black leading-[0.92] tracking-tighter text-slate-900 dark:text-white md:text-7xl"
          >
            Find Your
            <br />
            <span className="text-brand-blue">Perfect Program</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mb-10 max-w-xl text-center text-lg font-medium text-slate-500 dark:text-slate-400"
          >
            Explore fields of study across Ethiopia&apos;s top universities and
            start shaping your future.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
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
                onClick={() => setActiveField(null)}
                className={`rounded-[2rem] px-4 py-2 text-sm font-bold transition-all duration-200 ${
                  activeField === null
                    ? "scale-105 bg-brand-blue text-white shadow-lg shadow-brand-blue/30"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-zinc-800 dark:text-slate-300 dark:hover:bg-zinc-700"
                }`}
              >
                All Fields
              </button>
              {fieldKeys.map((fk) => {
                const style = PROGRAM_FIELD_STYLES[fk] ?? DEFAULT_PROGRAM_FIELD_STYLE;
                const label =
                  grouped.get(fk)?.[0]?.fieldDisplayName ??
                  fk.replace(/([A-Z])/g, " $1");
                return (
                  <button
                    key={fk}
                    type="button"
                    onClick={() =>
                      setActiveField(activeField === fk ? null : fk)
                    }
                    className={`flex items-center gap-1.5 rounded-[2rem] px-4 py-2 text-sm font-bold transition-all duration-200 ${
                      activeField === fk
                        ? "scale-105 bg-slate-900 text-white shadow-md dark:bg-white dark:text-slate-900"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-zinc-800 dark:text-slate-300 dark:hover:bg-zinc-700"
                    }`}
                  >
                    <span>{style.icon}</span>
                    <span className="hidden sm:inline">{label}</span>
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
            const progs = (grouped.get(fieldKey) ?? []).filter(
              (p) =>
                !search ||
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                (p.fieldDisplayName ?? "")
                  .toLowerCase()
                  .includes(search.toLowerCase())
            );
            if (progs.length === 0) return null;
            const sectionTitle =
              progs[0]?.fieldDisplayName ?? fieldKey.replace(/([A-Z])/g, " $1");

            return (
              <motion.section
                key={fieldKey}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: catIndex * 0.04 }}
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

                <div className="space-y-10">
                  {progs.map((program) => (
                    <div key={program._id}>
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-black ${cat.pill}`}
                          >
                            {program.name}
                          </span>
                        </div>
                      </div>
                      <ProgramUniversitiesScroller program={program} cat={cat} />
                    </div>
                  ))}
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
                setActiveField(null);
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
