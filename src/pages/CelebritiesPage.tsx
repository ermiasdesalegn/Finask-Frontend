import {
  ArrowLeft,
  Brain,
  ChevronRight,
  Heart,
  LayoutGrid,
  Search,
  Sparkles,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FlickeringHeartsBackground } from "../components/ui/flickering-hearts-background";
import { springPop, staggerBlurContainer, staggerBlurItem } from "../lib/motion/pageMotion";
import { useCelebritiesListQuery } from "../lib/queries";
import { celebrityPath } from "../lib/services/celebrityService";
import { unwrapMarkdownLink } from "../lib/unwrapMarkdownLink";
import { cn } from "../lib/utils";
import type { Celebrity } from "../types";

/** Deterministic rich gradients when `profileImage` / `coverImage` are null (matches API payloads). */
const AVATAR_GRADIENTS = [
  "from-amber-400 via-orange-600 to-rose-800",
  "from-emerald-400 via-teal-600 to-cyan-900",
  "from-violet-400 via-purple-600 to-indigo-950",
  "from-sky-400 via-blue-600 to-slate-900",
  "from-fuchsia-400 via-pink-600 to-rose-950",
  "from-lime-300 via-green-600 to-emerald-950",
  "from-orange-300 via-amber-600 to-amber-950",
  "from-cyan-300 via-sky-600 to-blue-950",
] as const;

function seedFromCelebrity(c: Celebrity): number {
  const s = c._id || c.slug || c.name || "x";
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function listThumb(c: Celebrity): {
  src?: string;
  initials: string;
  gradientClass: string;
} {
  const profile = unwrapMarkdownLink(c.profileImage ?? undefined);
  const cover = unwrapMarkdownLink(c.coverImage ?? undefined);
  const idx = seedFromCelebrity(c) % AVATAR_GRADIENTS.length;
  return {
    src: profile || cover,
    initials: initials(c.name),
    gradientClass: AVATAR_GRADIENTS[idx],
  };
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
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#05060c] pb-28 pt-4">
      <div className="pointer-events-none fixed inset-0 z-0">
        <FlickeringHeartsBackground className="h-full w-full" />
      </div>

      <div className="relative z-10 mx-auto max-w-lg px-4 md:max-w-3xl lg:max-w-4xl lg:px-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-2 flex items-center gap-2 rounded-full border border-white/10 bg-black/30 p-2.5 text-slate-200 backdrop-blur-md transition-colors hover:border-white/20 hover:bg-black/45 hover:text-white"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <motion.header
          initial="hidden"
          animate="show"
          variants={springPop}
          className="mb-8"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-transparent px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-100/90 shadow-[0_0_24px_-8px_rgba(251,191,36,0.55)] backdrop-blur-md">
            <Brain className="h-3.5 w-3.5 text-amber-300" strokeWidth={2.5} />
            Great minds
          </div>
          <div className="flex items-start gap-4">
            <span
              className="mt-1 h-12 w-1 shrink-0 rounded-full bg-gradient-to-b from-brand-blue via-sky-400 to-amber-400 shadow-[0_0_20px_rgba(56,189,248,0.45)]"
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <h1 className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-3xl font-black tracking-tight text-transparent md:text-4xl">
                Great Ethiopian Minds
              </h1>
              <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-slate-400 md:text-base">
                Discover the stories of brilliant Ethiopian scientists, inventors,
                and changemakers—profiles powered by your Finask catalog.
              </p>
              {!loading && celebrities.length > 0 ? (
                <p className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400/80" />
                  <span className="text-slate-400">
                    {search.trim()
                      ? `${filtered.length} match${filtered.length === 1 ? "" : "es"}`
                      : `${apiTotal ?? celebrities.length} profile${(apiTotal ?? celebrities.length) === 1 ? "" : "s"}`}
                  </span>
                  {search.trim() ? (
                    <span className="text-slate-600">
                      · {celebrities.length} total
                    </span>
                  ) : null}
                </p>
              ) : null}
            </div>
          </div>
        </motion.header>

        <div className="relative z-30 mb-8 flex w-full rounded-2xl border border-white/12 bg-black/35 p-1 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.85)] backdrop-blur-xl">
          <div className="group relative flex h-14 w-full flex-grow items-center">
            <Search className="absolute left-4 h-4 w-4 text-slate-500" />
            <input
              type="search"
              className="h-full w-full rounded-xl bg-transparent pl-11 pr-10 text-sm font-medium text-white outline-none placeholder:text-slate-500"
              placeholder="Search by name, field, role, or bio…"
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
                  className="absolute right-3 rounded-full bg-white/10 p-1.5 text-slate-400 transition-colors hover:bg-white/15 hover:text-white"
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
          <p className="mb-6 rounded-xl border border-red-500/30 bg-red-950/40 px-4 py-3 text-center text-sm font-medium text-red-300 backdrop-blur-sm">
            {error}
          </p>
        ) : null}

        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm"
              >
                <div className="flex gap-4">
                  <div className="h-[5.25rem] w-[5.25rem] shrink-0 rounded-xl bg-white/10" />
                  <div className="flex-1 space-y-3 py-1">
                    <div className="h-5 w-1/2 rounded-lg bg-white/10" />
                    <div className="h-3 w-full rounded bg-white/5" />
                    <div className="h-3 w-4/5 rounded bg-white/5" />
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
            className="flex flex-col gap-4"
          >
            {filtered.map((c) => {
              const key = c._id ?? c.slug ?? c.name;
              const thumb = listThumb(c);
              const primaryTag = c.tags?.[0];
              const secondaryTag = c.tags?.[1];
              const id = c._id ?? key;
              const saved = savedIds[id] ?? false;
              return (
                <motion.div key={key} variants={itemVariants}>
                  <Link
                    to={celebrityPath(c)}
                    className="group relative flex gap-4 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-4 pr-14 shadow-[0_12px_40px_-20px_rgba(0,0,0,0.9)] backdrop-blur-md transition-all duration-300 hover:border-sky-400/35 hover:shadow-[0_16px_48px_-12px_rgba(56,189,248,0.22)]"
                  >
                    <div
                      className={cn(
                        "relative h-[5.25rem] w-[5.25rem] shrink-0 overflow-hidden rounded-xl shadow-lg ring-2 ring-white/10 transition-transform duration-300 group-hover:scale-[1.02] group-hover:ring-sky-400/40"
                      )}
                    >
                      {thumb.src ? (
                        <img
                          src={thumb.src}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div
                          className={cn(
                            "flex h-full w-full items-center justify-center bg-gradient-to-br text-lg font-black tracking-tight text-white shadow-inner",
                            thumb.gradientClass
                          )}
                        >
                          <span className="drop-shadow-md">{thumb.initials}</span>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1 py-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-black leading-tight text-white transition-colors group-hover:text-sky-100">
                          {c.name}
                        </h2>
                        {c.questionCount != null && c.questionCount > 0 ? (
                          <span className="rounded-full border border-sky-500/30 bg-sky-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sky-200">
                            {c.questionCount} Q&amp;A
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {primaryTag ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/25 px-2.5 py-0.5 text-[11px] font-bold text-amber-100/90">
                            <LayoutGrid
                              className="h-3 w-3 shrink-0 text-amber-400/90"
                              strokeWidth={2}
                            />
                            {primaryTag}
                          </span>
                        ) : null}
                        {secondaryTag ? (
                          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-semibold text-slate-400">
                            {secondaryTag}
                          </span>
                        ) : null}
                      </div>
                      {c.notablePosition ? (
                        <p className="mt-2 flex items-start gap-1.5 text-xs leading-snug text-slate-400">
                          <User
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500"
                            strokeWidth={2}
                          />
                          <span className="line-clamp-2">{c.notablePosition}</span>
                        </p>
                      ) : null}
                    </div>
                    <ChevronRight className="absolute right-11 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-600 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:text-sky-400/80 sm:opacity-100" />
                    <button
                      type="button"
                      onClick={(e) => toggleSaved(e, id)}
                      className="absolute right-3 top-3 rounded-full border border-transparent p-2 text-slate-500 transition-all hover:border-white/15 hover:bg-white/10 hover:text-sky-400"
                      aria-label={saved ? "Unsave" : "Save"}
                    >
                      <Heart
                        className={cn(
                          "h-5 w-5",
                          saved
                            ? "fill-sky-400 text-sky-400"
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
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-black/30 py-20 text-center backdrop-blur-md"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 shadow-[0_0_40px_-12px_rgba(251,191,36,0.5)]">
              <Search className="h-7 w-7 text-amber-300/90" />
            </div>
            <p className="text-lg font-black text-white">
              No profiles match your search
            </p>
            <p className="mt-2 max-w-sm text-sm text-slate-500">
              Try another keyword—or clear the search to see every mind in the
              collection.
            </p>
            {search ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-6 rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:border-sky-400/40 hover:bg-sky-500/20"
              >
                Clear search
              </button>
            ) : null}
          </motion.div>
        ) : null}
      </div>
    </div>
  );
};

export default CelebritiesPage;
