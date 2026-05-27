import {
  AlertCircle,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  ImageIcon,
  Map as MapIcon,
  Search,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CampusGallerySectionTitle from "../components/campus/CampusGallerySectionTitle";
import CampusGalleryUniversityCard from "../components/campus/CampusGalleryUniversityCard";
import { AnimatedGridPattern } from "../components/ui/animated-grid-pattern";
import { useUniversitiesListQuery } from "../lib/queries";
import {
  filterGalleryGroups,
  sortGalleryGroups,
  universitiesToGalleryGroups,
  type GallerySort,
} from "../lib/campusGalleryUtils";
import { cn } from "../lib/utils";

const PAGE_SIZE = 9;

const SORT_OPTIONS: { id: GallerySort; label: string }[] = [
  { id: "popular", label: "Popular" },
  { id: "photos-desc", label: "Most photos" },
  { id: "name-asc", label: "Name (A–Z)" },
  { id: "name-desc", label: "Name (Z–A)" },
];

const CampusesPage: React.FC = () => {
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<GallerySort>("popular");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [page, setPage] = useState(1);

  const universitiesQuery = useUniversitiesListQuery({
    limit: 300,
    sort: "-ratingsAverage",
  });
  const universities =
    universitiesQuery.data?.data?.universities ?? [];
  const loading = universitiesQuery.isPending;
  const error = universitiesQuery.isError
    ? universitiesQuery.error instanceof Error
      ? universitiesQuery.error.message
      : "Something went wrong"
    : null;

  const allGroups = useMemo(
    () => universitiesToGalleryGroups(universities),
    [universities]
  );

  const filtered = useMemo(() => {
    let rows = filterGalleryGroups(allGroups, search);
    if (featuredOnly) {
      rows = rows.filter((g) => g.uni?.isFeatured);
    }
    return sortGalleryGroups(rows, sort);
  }, [allGroups, search, sort, featuredOnly]);

  const totalPhotos = useMemo(
    () => allGroups.reduce((n, g) => n + g.images.length, 0),
    [allGroups]
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageItems = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  useEffect(() => {
    setPage(1);
  }, [search, sort, featuredOnly]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const sortLabel =
    SORT_OPTIONS.find((o) => o.id === sort)?.label ?? "Popular";

  return (
    <div className="relative min-h-screen w-full pb-24">
      <div className="pointer-events-none fixed inset-0 z-0">
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.16}
          duration={3}
          repeatDelay={1}
          className={cn(
            "absolute inset-0 h-full w-full",
            "[mask-image:radial-gradient(800px_circle_at_50%_0%,white,transparent)]"
          )}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Hero */}
        <header className="pb-8 pt-2 md:pb-10 md:pt-4">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl text-3xl font-black leading-tight tracking-tight text-slate-900 dark:text-white md:text-5xl"
          >
            Find the best{" "}
            <span className="text-brand-blue">Universities</span> for you
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
            className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-400 md:text-base"
          >
            Explore campus life through photos — browse galleries by university,
            compare settings, and discover your next study destination across
            Ethiopia.
          </motion.p>
          <motion.dl
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 flex flex-wrap gap-3 text-sm"
          >
            <div className="rounded-xl border border-slate-200/80 bg-white/90 px-4 py-2 dark:border-white/10 dark:bg-zinc-900/80">
              <span className="font-bold text-slate-900 dark:text-white">
                {loading ? "—" : allGroups.length}
              </span>
              <span className="ml-1.5 text-slate-500">universities</span>
            </div>
            <div className="rounded-xl border border-slate-200/80 bg-white/90 px-4 py-2 dark:border-white/10 dark:bg-zinc-900/80">
              <span className="font-bold text-slate-900 dark:text-white">
                {loading ? "—" : totalPhotos}
              </span>
              <span className="ml-1.5 text-slate-500">photos</span>
            </div>
          </motion.dl>
        </header>

        {/* Search + toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="sticky top-[64px] z-30 mb-10 rounded-2xl border border-slate-200/80 bg-white/95 p-2 shadow-lg shadow-slate-200/25 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/95 dark:shadow-none"
        >
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <div className="group relative flex h-12 flex-1 items-center md:h-14">
              <Search className="absolute left-4 h-5 w-5 text-slate-400 group-focus-within:text-brand-blue" />
              <input
                ref={searchRef}
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search universities…"
                className="h-full w-full rounded-xl bg-slate-50/80 pl-11 pr-20 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-brand-blue/20 dark:bg-zinc-800/80 dark:text-white md:text-base"
                aria-label="Search universities"
              />
              <kbd className="pointer-events-none absolute right-3 hidden rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-400 md:inline dark:border-white/10 dark:bg-zinc-900">
                Ctrl K
              </kbd>
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 rounded-full p-1 text-slate-400 hover:bg-slate-200 md:hidden dark:hover:bg-zinc-700"
                  aria-label="Clear"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1 border-t border-slate-100 pt-2 md:border-t-0 md:pt-0 dark:border-white/5">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowFilter(!showFilter);
                    setShowSort(false);
                  }}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition",
                    showFilter || featuredOnly
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-zinc-800"
                  )}
                >
                  <Filter size={15} />
                  Filter
                </button>
                <AnimatePresence>
                  {showFilter && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute left-0 top-full z-50 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
                    >
                      <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                        <input
                          type="checkbox"
                          checked={featuredOnly}
                          onChange={(e) => setFeaturedOnly(e.target.checked)}
                          className="rounded border-slate-300"
                        />
                        Featured only
                      </label>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowSort(!showSort);
                    setShowFilter(false);
                  }}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition",
                    showSort
                      ? "bg-slate-100 text-slate-900 dark:bg-zinc-800 dark:text-white"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-zinc-800"
                  )}
                >
                  <ArrowUpDown size={15} />
                  <span className="hidden sm:inline">Sort by:</span> {sortLabel}
                </button>
                <AnimatePresence>
                  {showSort && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 top-full z-50 mt-2 w-48 rounded-2xl border border-slate-200 bg-white p-1 shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setSort(opt.id);
                            setShowSort(false);
                          }}
                          className={cn(
                            "flex w-full rounded-xl px-3 py-2 text-left text-sm font-bold transition",
                            sort === opt.id
                              ? "bg-brand-blue/10 text-brand-blue"
                              : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-zinc-800"
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                type="button"
                onClick={() => navigate("/universities")}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-zinc-800"
              >
                <MapIcon size={15} />
                Map view
              </button>
            </div>
          </div>
        </motion.div>

        {/* Gallery grid */}
        <CampusGallerySectionTitle title="Campus Gallery" />

        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] animate-pulse rounded-[1.25rem] bg-slate-200/90 dark:bg-zinc-800"
              />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-3xl border border-red-200/80 bg-red-50/80 px-8 py-14 text-center dark:border-red-500/20 dark:bg-red-950/30">
            <AlertCircle className="mx-auto mb-3 text-red-500" size={32} />
            <p className="font-black text-slate-900 dark:text-white">
              Couldn&apos;t load galleries
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{error}</p>
            <button
              type="button"
              onClick={() => void universitiesQuery.refetch()}
              className="mt-6 rounded-xl bg-brand-blue px-6 py-2.5 text-sm font-bold text-white"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white/80 px-8 py-20 text-center dark:border-white/10 dark:bg-zinc-900/50">
            <ImageIcon className="mx-auto mb-3 text-slate-300" size={40} />
            <p className="font-black text-slate-900 dark:text-white">No results</p>
            <p className="mt-2 text-sm text-slate-500">
              {search || featuredOnly
                ? "Try clearing filters or search."
                : "University galleries will appear here once photos are added."}
            </p>
            {(search || featuredOnly) && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setFeaturedOnly(false);
                }}
                className="mt-4 text-sm font-bold text-brand-blue hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {!loading && !error && pageItems.length > 0 && (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {pageItems.map((group, i) => (
                <CampusGalleryUniversityCard
                  key={group.key}
                  group={group}
                  index={i}
                />
              ))}
            </div>

            {pageCount > 1 && (
              <nav
                className="mt-12 flex items-center justify-center gap-2"
                aria-label="Pagination"
              >
                <button
                  type="button"
                  disabled={safePage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-brand-blue/30 disabled:opacity-40 dark:border-white/10 dark:bg-zinc-900 dark:text-slate-300"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={18} />
                </button>
                {Array.from({ length: pageCount }, (_, i) => i + 1)
                  .filter(
                    (n) =>
                      n === 1 ||
                      n === pageCount ||
                      Math.abs(n - safePage) <= 1
                  )
                  .map((n, idx, arr) => {
                    const prev = arr[idx - 1];
                    const showEllipsis = prev != null && n - prev > 1;
                    return (
                      <React.Fragment key={n}>
                        {showEllipsis && (
                          <span className="px-1 text-slate-400">…</span>
                        )}
                        <button
                          type="button"
                          onClick={() => setPage(n)}
                          className={cn(
                            "flex h-10 min-w-10 items-center justify-center rounded-xl px-3 text-sm font-bold transition",
                            n === safePage
                              ? "bg-brand-blue text-white shadow-md shadow-brand-blue/25"
                              : "border border-slate-200 bg-white text-slate-600 hover:border-brand-blue/30 dark:border-white/10 dark:bg-zinc-900 dark:text-slate-300"
                          )}
                        >
                          {n}
                        </button>
                      </React.Fragment>
                    );
                  })}
                <button
                  type="button"
                  disabled={safePage >= pageCount}
                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-brand-blue/30 disabled:opacity-40 dark:border-white/10 dark:bg-zinc-900 dark:text-slate-300"
                  aria-label="Next page"
                >
                  <ChevronRight size={18} />
                </button>
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CampusesPage;
