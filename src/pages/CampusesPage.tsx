import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Heart,
  MapPin,
  Search,
  Sparkles,
} from "lucide-react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatedGridPattern } from "../components/ui/animated-grid-pattern";
import { staggerBlurContainer, staggerBlurItem } from "../lib/motion/pageMotion";
import { useCampusesListQuery } from "../lib/queries";
import { cn } from "../lib/utils";
import type { Campus } from "../types";

const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&q=80&w=800";

function universityHref(c: Campus): string | null {
  const u = c.university;
  if (!u) return null;
  if (typeof u === "object") {
    if (u.slug) return `/universities/${u.slug}`;
    if (u._id) return `/universities/${u._id}`;
    return null;
  }
  return `/universities/${u}`;
}

const CampusesPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const campusesQuery = useCampusesListQuery({
    limit: 300,
    sort: "name",
  });

  const campuses = campusesQuery.data?.data?.campuses ?? [];
  const loading = campusesQuery.isPending;
  const error = campusesQuery.isError
    ? campusesQuery.error instanceof Error
      ? campusesQuery.error.message
      : "Failed to load campuses"
    : null;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return campuses;
    return campuses.filter((c) => {
      const name = (c.name ?? "").toLowerCase();
      const city = (c.address?.city ?? "").toLowerCase();
      const overview = (c.overview ?? "").toLowerCase();
      return name.includes(q) || city.includes(q) || overview.includes(q);
    });
  }, [campuses, search]);

  const containerVariants = staggerBlurContainer;
  const itemVariants = staggerBlurItem;

  return (
    <div className="relative min-h-screen w-full pb-20 pt-4 transition-colors duration-300">
      <div className="fixed inset-0 z-0">
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.2}
          duration={3}
          repeatDelay={1}
          className={cn(
            "absolute inset-0 h-full w-full",
            "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
            "skew-y-12"
          )}
        />
      </div>

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -right-[10%] -top-[20%] h-[60%] w-[60%] rounded-full bg-pink-500/5 blur-[120px] mix-blend-multiply dark:bg-pink-400/10 dark:mix-blend-screen" />
        <div className="absolute -left-[10%] top-[20%] h-[50%] w-[50%] rounded-full bg-brand-blue/5 blur-[120px] mix-blend-multiply dark:bg-brand-blue/10 dark:mix-blend-screen" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-1 flex-col gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="group flex w-fit items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-3 py-2 text-xs font-bold text-slate-600 shadow-sm backdrop-blur-md transition-all hover:border-brand-blue/30 hover:text-brand-blue dark:border-white/10 dark:bg-zinc-900/80 dark:text-slate-300 dark:hover:text-blue-400"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              Back
            </button>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200/60 bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-pink-700 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:text-pink-400"
            >
              <Sparkles size={14} className="text-brand-yellow" />
              Campus gallery
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl"
            >
              Every <span className="text-brand-blue">campus</span> in one place
            </motion.h1>
            <p className="max-w-xl text-sm font-medium text-slate-600 dark:text-slate-400">
              Data from{" "}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-zinc-800">
                GET /api/v1/campuses
              </code>
              . Open a university to see programs and details.
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-30 mb-10 flex w-full flex-col gap-2 rounded-3xl border border-slate-200/80 bg-white/80 p-2 shadow-xl shadow-slate-200/40 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/80 dark:shadow-none md:flex-row md:items-center"
        >
          <div className="group relative flex h-12 w-full flex-grow items-center md:h-14">
            <Search className="absolute left-5 h-5 w-5 text-slate-400 transition-colors group-focus-within:text-brand-blue" />
            <input
              type="text"
              className="h-full w-full bg-transparent pl-12 pr-10 text-base font-medium text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
              placeholder="Search campus name, city, or overview..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <AnimatePresence>
              {search && (
                <motion.button
                  key="clear"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-4 rounded-full bg-slate-100 p-1 text-slate-500 transition-colors hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                >
                  <span className="sr-only">Clear</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {error && (
          <p className="mb-6 text-center text-sm font-medium text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-[1.5rem] bg-slate-200/80 dark:bg-zinc-800/80"
              />
            ))}
          </div>
        )}

        {!loading && !error && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((campus) => (
              <CampusCard
                key={campus._id}
                campus={campus}
                variants={itemVariants}
                onOpenUniversity={() => {
                  const href = universityHref(campus);
                  if (href) navigate(href);
                }}
              />
            ))}
          </motion.div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <p className="py-16 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
            No campuses match your search.
          </p>
        )}
      </div>
    </div>
  );
};

function CampusCard({
  campus,
  variants,
  onOpenUniversity,
}: {
  campus: Campus;
  variants: Variants;
  onOpenUniversity: () => void;
}) {
  const uniLabel =
    typeof campus.university === "object" && campus.university?.name
      ? campus.university.name
      : null;
  const href = universityHref(campus);

  return (
    <motion.article
      variants={variants}
      className="flex flex-col overflow-hidden rounded-[1.5rem] border border-slate-200/60 bg-white/70 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-pink-400/30 hover:shadow-xl hover:shadow-pink-500/5 dark:border-white/5 dark:bg-zinc-900/70"
    >
      <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-zinc-800">
        <img
          src={campus.coverImage || campus.images?.[0] || FALLBACK_COVER}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/25 to-transparent" />
        <button
          type="button"
          className="absolute right-3 top-3 rounded-full bg-black/40 p-2 text-white backdrop-blur-md"
          aria-label="Favorite"
        >
          <Heart size={14} />
        </button>
        <div className="absolute bottom-4 left-5 right-5">
          <h2 className="text-lg font-black tracking-tight text-white md:text-xl">
            {campus.name}
          </h2>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-bold text-white/90">
            <span className="flex items-center gap-1">
              <MapPin size={12} className="shrink-0" />
              {campus.address?.city ?? "—"}
            </span>
            {uniLabel && (
              <span className="flex items-center gap-1">
                <Building2 size={12} className="shrink-0" />
                {uniLabel}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="line-clamp-3 text-xs font-medium leading-relaxed text-slate-600 dark:text-slate-400">
          {campus.overview || "Campus profile from the directory."}
        </p>
        {href && (
          <button
            type="button"
            onClick={onOpenUniversity}
            className="mt-auto flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-blue py-3 text-xs font-black text-white shadow-lg shadow-brand-blue/25 transition-all hover:bg-blue-700"
          >
            View university <ArrowRight size={14} />
          </button>
        )}
      </div>
    </motion.article>
  );
}

export default CampusesPage;
