import {
  ArrowLeft,
  Heart,
  LayoutGrid,
  Search,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FlickeringHeartsBackground } from "../components/ui/flickering-hearts-background";
import { springPop, staggerBlurContainer, staggerBlurItem } from "../lib/motion/pageMotion";
import { useCelebritiesListQuery } from "../lib/queries";
import { celebrityPath } from "../lib/services/celebrityService";
import { CELEBRITY_PROFILE_FALLBACK } from "../constants/celebrityFallback";
import { unwrapMarkdownLink } from "../lib/unwrapMarkdownLink";
import { cn } from "../lib/utils";
import type { Celebrity } from "../types";

function listThumbSrc(c: Celebrity): string {
  const profile = unwrapMarkdownLink(c.profileImage ?? undefined);
  const cover = unwrapMarkdownLink(c.coverImage ?? undefined);
  return profile || cover || CELEBRITY_PROFILE_FALLBACK;
}

const CelebritiesPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});

  const listQuery = useCelebritiesListQuery({ limit: 250, sort: "name" });
  const celebrities = listQuery.data?.data?.celebrities ?? [];
  const apiTotal = listQuery.data?.results;
  const loading = listQuery.isPending;
  const error = listQuery.isError
    ? listQuery.error instanceof Error
      ? listQuery.error.message
      : "Failed to load profiles"
    : null;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return celebrities;
    return celebrities.filter((c) => {
      const name = (c.name ?? "").toLowerCase();
      const role = (c.notablePosition ?? "").toLowerCase();
      const nat = (c.nationality ?? "").toLowerCase();
      const tags = (c.tags ?? []).join(" ").toLowerCase();
      const bio = (c.bio ?? "").toLowerCase();
      return (
        name.includes(q) ||
        role.includes(q) ||
        nat.includes(q) ||
        tags.includes(q) ||
        bio.includes(q)
      );
    });
  }, [celebrities, search]);

  const containerVariants = staggerBlurContainer;
  const itemVariants = staggerBlurItem;

  const toggleSaved = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedIds((m) => ({ ...m, [id]: !m[id] }));
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-slate-50 pb-24 pt-4 transition-colors dark:bg-[#05060c] md:pt-8">
      {/* Hearts + vignette are dark-mode-only; light mode matches other listing pages (slate-50). */}
      <div className="pointer-events-none fixed inset-0 z-0 hidden dark:block">
        <FlickeringHeartsBackground className="h-full w-full" />
      </div>

      {/* Figma-style light sheet on top of flicker — wider on desktop */}
      <div className="relative z-10 mx-auto max-w-lg px-4 sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl lg:px-8 xl:px-10">
        <div
          className={cn(
            "rounded-2xl border border-white/25 bg-white/[0.94] shadow-[0_25px_80px_-20px_rgba(0,0,0,0.55)] backdrop-blur-2xl md:rounded-3xl",
            "dark:border-white/10 dark:bg-zinc-950/88 dark:shadow-[0_25px_80px_-20px_rgba(0,0,0,0.75)]"
          )}
        >
          <div className="px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-10 lg:py-12">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mb-5 flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" strokeWidth={2.2} />
            </button>

            <motion.header
              initial="hidden"
              animate="show"
              variants={springPop}
              className="mb-2"
            >
              <div className="flex items-start gap-3 md:gap-4">
                <span
                  className="mt-1 h-9 w-1 shrink-0 rounded-full bg-brand-blue md:mt-1.5 md:h-11 md:w-1.5"
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white md:text-3xl lg:text-4xl">
                    Great Ethiopian Minds
                  </h1>
                  <p className="mt-2 max-w-3xl text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-400 md:text-base">
                    Discover the stories of brilliant Ethiopian scientists,
                    inventors, and changemakers.
                  </p>
                  {!loading && celebrities.length > 0 ? (
                    <p className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-500">
                      {search.trim()
                        ? `${filtered.length} match${filtered.length === 1 ? "" : "es"} · ${celebrities.length} total`
                        : `${apiTotal ?? celebrities.length} profile${(apiTotal ?? celebrities.length) === 1 ? "" : "s"}`}
                    </p>
                  ) : null}
                </div>
              </div>
            </motion.header>

            <hr className="my-6 border-slate-200 dark:border-white/10 md:my-8" />

            <div className="relative z-30 mb-8 flex w-full rounded-xl border border-slate-200/90 bg-slate-50/80 p-1 shadow-inner dark:border-white/10 dark:bg-zinc-900/50">
              <div className="relative flex h-12 w-full flex-grow items-center md:h-14">
                <Search className="absolute left-3.5 h-4 w-4 text-slate-400 md:left-4" />
                <input
                  type="search"
                  className="h-full w-full rounded-lg bg-transparent pl-10 pr-10 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 md:pl-11 md:text-[15px] dark:text-white dark:placeholder:text-slate-500"
                  placeholder="Search by name, field, or role…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <AnimatePresence>
                  {search ? (
                    <motion.button
                      key="clear"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      type="button"
                      onClick={() => setSearch("")}
                      className="absolute right-2.5 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-200/80 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
                    >
                      <span className="sr-only">Clear</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </motion.button>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>

            {error ? (
              <p className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-700 dark:border-red-500/30 dark:bg-red-950/40 dark:text-red-300">
                {error}
              </p>
            ) : null}

            {loading ? (
              <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-xl border border-slate-200/90 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-zinc-900/80"
                  >
                    <div className="flex gap-3">
                      <div className="h-[4.5rem] w-[4.5rem] shrink-0 rounded-lg bg-slate-200 dark:bg-zinc-800" />
                      <div className="min-w-0 flex-1 space-y-2 py-1">
                        <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-zinc-800" />
                        <div className="h-3 w-full rounded bg-slate-100 dark:bg-zinc-800/80" />
                        <div className="h-3 w-4/5 rounded bg-slate-100 dark:bg-zinc-800/80" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {!loading ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-2 xl:grid-cols-3"
              >
                {filtered.map((c) => {
                  const key = c._id ?? c.slug ?? c.name;
                  const thumbSrc = listThumbSrc(c);
                  const primaryTag = c.tags?.[0];
                  const id = c._id ?? key;
                  const saved = savedIds[id] ?? false;
                  return (
                    <motion.div key={key} variants={itemVariants} className="h-full">
                      <Link
                        to={celebrityPath(c)}
                        className={cn(
                          "group relative flex h-full gap-3 overflow-hidden rounded-xl border border-slate-200/90 bg-white p-3 pr-12 shadow-sm",
                          "transition-all duration-300 md:gap-3.5 md:p-4 md:pr-14",
                          "hover:-translate-y-0.5 hover:border-brand-blue/25 hover:shadow-lg hover:shadow-slate-200/60",
                          "dark:border-white/10 dark:bg-zinc-900/90 dark:hover:border-brand-blue/35 dark:hover:shadow-black/40"
                        )}
                      >
                        {/* Figma-style subtle blue accent on hover */}
                        <span
                          className="absolute bottom-0 left-0 top-0 w-0.5 scale-y-0 rounded-full bg-brand-blue opacity-0 transition-all duration-300 group-hover:scale-y-100 group-hover:opacity-100"
                          aria-hidden
                        />
                        <div
                          className={cn(
                            "relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-100 shadow-sm dark:border-white/10 dark:bg-zinc-800 md:h-[5rem] md:w-[5rem]"
                          )}
                        >
                      <img
                        src={thumbSrc}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                        </div>
                        <div className="min-w-0 flex-1 py-0.5">
                          <h2 className="font-black leading-tight text-slate-900 dark:text-white md:text-[17px]">
                            {c.name}
                          </h2>
                          {primaryTag ? (
                            <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                              <LayoutGrid
                                className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-500"
                                strokeWidth={2}
                              />
                              <span className="truncate">{primaryTag}</span>
                            </p>
                          ) : null}
                          {c.notablePosition ? (
                            <p className="mt-1 flex items-start gap-1.5 text-xs leading-snug text-slate-600 dark:text-slate-500">
                              <User
                                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-500"
                                strokeWidth={2}
                              />
                              <span className="line-clamp-2 md:line-clamp-3">
                                {c.notablePosition}
                              </span>
                            </p>
                          ) : null}
                        </div>
                        <button
                          type="button"
                          onClick={(e) => toggleSaved(e, id)}
                          className="absolute right-2.5 top-2.5 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-brand-blue dark:hover:bg-white/10 md:right-3 md:top-3"
                          aria-label={saved ? "Unsave" : "Save"}
                        >
                          <Heart
                            className={cn(
                              "h-5 w-5",
                              saved
                                ? "fill-brand-blue text-brand-blue"
                                : "fill-none stroke-[1.75]"
                            )}
                          />
                        </button>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : null}

            {!loading && filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-16 text-center dark:border-white/15 dark:bg-zinc-900/40 md:py-24"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900">
                  <Search className="h-6 w-6 text-slate-400" />
                </div>
                <p className="text-base font-bold text-slate-800 dark:text-slate-200 md:text-lg">
                  No profiles match your search
                </p>
                <p className="mt-2 max-w-sm px-4 text-sm text-slate-500 dark:text-slate-400">
                  Try another keyword—or clear the search to see the full list.
                </p>
                {search ? (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="mt-6 rounded-full bg-brand-blue px-6 py-2.5 text-sm font-bold text-white shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Clear search
                  </button>
                ) : null}
              </motion.div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CelebritiesPage;
