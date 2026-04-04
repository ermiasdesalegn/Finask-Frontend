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
import { staggerBlurContainer, staggerBlurItem } from "../lib/motion/pageMotion";
import { useCelebritiesListQuery } from "../lib/queries";
import { celebrityPath } from "../lib/services/celebrityService";
import { unwrapMarkdownLink } from "../lib/unwrapMarkdownLink";
import { cn } from "../lib/utils";
import type { Celebrity } from "../types";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

/** Square list thumbnail: profile first, then cover, else initials tile */
function listThumb(c: Celebrity): { src?: string; initials: string } {
  const profile = unwrapMarkdownLink(c.profileImage ?? undefined);
  const cover = unwrapMarkdownLink(c.coverImage ?? undefined);
  return { src: profile || cover, initials: initials(c.name) };
}

const CelebritiesPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});

  const listQuery = useCelebritiesListQuery({ limit: 250, sort: "name" });
  const celebrities = listQuery.data?.data?.celebrities ?? [];
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
    <div className="min-h-screen w-full bg-slate-100 pb-24 pt-4 transition-colors dark:bg-zinc-950">
      <div className="relative z-10 mx-auto max-w-lg px-4 md:max-w-3xl lg:max-w-4xl lg:px-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 rounded-full p-2 text-slate-600 transition-colors hover:bg-white/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-zinc-900 dark:hover:text-white"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <header className="mb-2">
          <div className="flex items-start gap-3">
            <span
              className="mt-1 h-10 w-1 shrink-0 rounded-full bg-brand-blue"
              aria-hidden
            />
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white md:text-3xl">
                Great Ethiopian Minds
              </h1>
              <p className="mt-2 max-w-xl text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-400">
                Discover the stories of brilliant Ethiopian scientists, inventors,
                and changemakers.
              </p>
            </div>
          </div>
        </header>

        <hr className="my-6 border-slate-200 dark:border-white/10" />

        <div className="relative z-30 mb-8 flex w-full rounded-2xl border border-slate-200/90 bg-white p-1 shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <div className="group relative flex h-12 w-full flex-grow items-center">
            <Search className="absolute left-4 h-4 w-4 text-slate-400" />
            <input
              type="search"
              className="h-full w-full rounded-xl bg-transparent pl-11 pr-10 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
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
                  className="absolute right-3 rounded-full bg-slate-100 p-1 text-slate-500 dark:bg-zinc-800"
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
          <p className="mb-6 text-center text-sm font-medium text-red-600 dark:text-red-400">
            {error}
          </p>
        ) : null}

        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-xl border border-slate-200/80 bg-white p-3 dark:border-white/10 dark:bg-zinc-900"
              >
                <div className="flex gap-3">
                  <div className="h-[4.5rem] w-[4.5rem] shrink-0 rounded-lg bg-slate-200 dark:bg-zinc-800" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-zinc-800" />
                    <div className="h-3 w-full rounded bg-slate-100 dark:bg-zinc-800" />
                    <div className="h-3 w-4/5 rounded bg-slate-100 dark:bg-zinc-800" />
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
            className="flex flex-col gap-3"
          >
            {filtered.map((c) => {
              const key = c._id ?? c.slug ?? c.name;
              const thumb = listThumb(c);
              const primaryTag = c.tags?.[0];
              const id = c._id ?? key;
              const saved = savedIds[id] ?? false;
              return (
                <motion.div key={key} variants={itemVariants}>
                  <Link
                    to={celebrityPath(c)}
                    className="relative flex gap-3 rounded-xl border border-slate-200/90 bg-white p-3 pr-12 shadow-sm transition-all hover:border-brand-blue/25 hover:shadow-md dark:border-white/10 dark:bg-zinc-900 dark:hover:border-brand-blue/30"
                  >
                    <div className="relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-zinc-800">
                      {thumb.src ? (
                        <img
                          src={thumb.src}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 text-sm font-black text-slate-600 dark:from-zinc-700 dark:to-zinc-600 dark:text-slate-300">
                          {thumb.initials}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1 py-0.5">
                      <h2 className="font-black leading-tight text-slate-900 dark:text-white">
                        {c.name}
                      </h2>
                      {primaryTag ? (
                        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                          <LayoutGrid
                            className="h-3.5 w-3.5 shrink-0 text-slate-400"
                            strokeWidth={2}
                          />
                          <span className="truncate">{primaryTag}</span>
                        </p>
                      ) : null}
                      {c.notablePosition ? (
                        <p className="mt-1 flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-500">
                          <User
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400"
                            strokeWidth={2}
                          />
                          <span className="line-clamp-2 leading-snug">
                            {c.notablePosition}
                          </span>
                        </p>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => toggleSaved(id)}
                      className="absolute right-3 top-3 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-brand-blue dark:hover:bg-zinc-800"
                      aria-label={saved ? "Unsave" : "Save"}
                    >
                      <Heart
                        className={cn(
                          "h-5 w-5",
                          saved
                            ? "fill-brand-blue text-brand-blue"
                            : "fill-none"
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
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-base font-bold text-slate-700 dark:text-slate-300">
              No profiles match your search.
            </p>
            <p className="mt-1 text-sm text-slate-500">Try another keyword.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CelebritiesPage;
