import { ArrowRight, Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import heroImg from "../../assets/hero-img.png";
import { useDebounce } from "../../lib/hooks/useDebounce";
import { useSearchQuery } from "../../lib/queries/search";
import {
    displayRating,
    formatRatingsQuantityCompact,
    universityCover,
} from "../../lib/universityUi";
import type { HomePagePayload } from "../../types";
import { SearchDropdown } from "../ui/SearchDropdown";

function uniqueBySlug(list: { slug?: string }[]): number {
  return new Set(list.map((u) => u.slug).filter(Boolean)).size;
}

function sumRatingsQuantity(
  lists: { ratingsQuantity?: number }[][]
): number {
  let t = 0;
  for (const list of lists) {
    for (const u of list) {
      t += u.ratingsQuantity ?? 0;
    }
  }
  return t;
}

const Hero = ({
  home,
  loading,
}: {
  home: HomePagePayload | null;
  loading: boolean;
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300);
  const isSearching = debouncedQuery.trim().length >= 2;
  const searchResults = useSearchQuery(debouncedQuery, 10);
  const searchLoading = isSearching && searchResults.isFetching;
  const topRated = home?.topRated ?? [];
  const avatars = topRated
    .filter((u) => universityCover(u))
    .slice(0, 4);

  const reviewTotal = home
    ? sumRatingsQuantity([
        home.topRated ?? [],
        home.topReviewed ?? [],
        home.featured ?? [],
      ])
    : 0;

  const uniStat = home
    ? uniqueBySlug([
        ...(home.featured ?? []),
        ...(home.trending ?? []),
        ...(home.topRated ?? []),
      ])
    : 0;

  const programStat = home?.rarePrograms?.length ?? 0;

  const compactReviews = formatRatingsQuantityCompact(reviewTotal);
  const extraReviews =
    reviewTotal > 0 ? `+${compactReviews}` : "+21k";

  return (
    <section className="relative overflow-x-hidden px-6 pb-20 pt-32">
      {/* Keep blurs inside the viewport — horizontal translate was causing page-wide overflow */}
      <div className="absolute right-0 top-0 h-[50%] w-[50%] -translate-y-1/2 rounded-full bg-brand-blue/5 blur-[120px]" />
      <div className="absolute bottom-0 left-0 h-[40%] w-[40%] translate-y-1/4 rounded-full bg-brand-yellow/5 blur-[100px]" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-bold text-brand-blue dark:border-blue-500/20 dark:bg-blue-500/10"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-brand-blue" />
            Ethiopia&apos;s First All-in-One University Guide
          </motion.div>
          <h1 className="mb-8 text-5xl font-black leading-[0.95] tracking-tighter dark:text-white lg:text-7xl">
            Smart <br />
            <span className="text-brand-blue">Discovery</span> <br />
            for Ethiopia
          </h1>
          <p className="mb-10 max-w-lg text-xl leading-relaxed text-slate-600 dark:text-slate-400">
            Empowering students with AI-driven insights to navigate their
            academic future with confidence.
          </p>
          <div className="flex flex-wrap gap-5">
            <Link
              to="/universities"
              className="flex items-center gap-3 rounded-2xl bg-brand-blue px-10 py-5 text-lg font-black text-white shadow-2xl shadow-blue-500/40 transition-all hover:-translate-y-1 hover:bg-blue-700 active:scale-95"
            >
              Get Started <ArrowRight size={22} />
            </Link>
            <button
              type="button"
              className="rounded-2xl border-2 border-slate-200 px-10 py-5 text-lg font-black transition-all hover:-translate-y-1 hover:bg-slate-50 active:scale-95 dark:border-white/10 dark:hover:bg-white/5"
            >
              Contact Us
            </button>
          </div>

          <div className="mt-16 flex flex-wrap items-center gap-8">
            <div className="flex -space-x-5">
              {loading &&
                [0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-14 w-14 shrink-0 animate-pulse rounded-2xl border-4 border-white bg-slate-200 dark:border-[#121212] dark:bg-zinc-700"
                  />
                ))}
              {!loading &&
                avatars.map((u) => (
                  <motion.img
                    key={u.slug || u._id}
                    whileHover={{ y: -5, zIndex: 10 }}
                    src={universityCover(u)}
                    className="h-14 w-14 rounded-2xl border-4 border-white object-cover shadow-lg dark:border-[#121212]"
                    alt=""
                  />
                ))}
              {!loading && avatars.length === 0 && (
                <div className="flex -space-x-5">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-14 w-14 rounded-2xl border-4 border-white bg-slate-200 dark:border-[#121212]"
                    />
                  ))}
                </div>
              )}
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-4 border-white bg-brand-yellow text-xs font-black text-black shadow-lg dark:border-[#121212]">
                {loading ? "…" : extraReviews}
              </div>
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-slate-500">
                Community
              </p>
              <p className="text-lg font-black dark:text-white">
                {loading ? (
                  <span className="inline-block h-6 w-40 animate-pulse rounded bg-slate-200 dark:bg-zinc-700" />
                ) : (
                  <>
                    <span className="text-brand-blue">{compactReviews}</span>{" "}
                    ratings across spotlight schools
                  </>
                )}
              </p>
            </div>
          </div>

          {!loading && home && (
            <div className="mt-10 flex flex-wrap gap-4">
              <div className="rounded-2xl border border-slate-100 bg-white/80 px-5 py-3 text-sm font-bold shadow-sm dark:border-white/10 dark:bg-zinc-900/80">
                <span className="text-brand-blue">{uniStat}</span>{" "}
                universities in spotlight
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white/80 px-5 py-3 text-sm font-bold shadow-sm dark:border-white/10 dark:bg-zinc-900/80">
                <span className="text-brand-blue">{programStat}</span> rare
                programs featured
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white/80 px-5 py-3 text-sm font-bold shadow-sm dark:border-white/10 dark:bg-zinc-900/80">
                Top rated{" "}
                <span className="text-brand-yellow">
                  {topRated[0] ? displayRating(topRated[0]) : "—"}
                </span>{" "}
                avg
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative mx-auto max-w-md lg:max-w-lg"
        >
          <div className="group relative z-10 overflow-hidden rounded-[4rem] border-[12px] border-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] dark:border-white/5">
            <img
              src={heroImg}
              className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
              alt="Student"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60" />
          </div>

          <motion.svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 400 500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.circle
              cx="200"
              cy="250"
              r="180"
              fill="none"
              stroke="#facc15"
              strokeWidth="2"
              strokeDasharray="8 8"
              initial={{ pathLength: 0, rotate: 0 }}
              animate={{ pathLength: 1, rotate: 360 }}
              transition={{
                pathLength: { duration: 2, ease: "easeInOut" },
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              }}
            />
          </motion.svg>
        </motion.div>
      </div>

      {/* Search bar — full width below the hero grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="relative z-30 mx-auto mt-12 max-w-2xl"
      >
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/90 px-5 py-4 shadow-xl shadow-slate-200/40 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/90">
          <Search size={20} className="shrink-0 text-slate-400" />
          <input
            type="text"
            placeholder="Search universities, programs, cities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-base font-medium text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
          />
          <AnimatePresence>
            {searchLoading && (
              <motion.div
                key="spin"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-4 w-4 animate-spin rounded-full border-2 border-brand-blue border-t-transparent"
              />
            )}
            {!searchLoading && searchQuery && (
              <motion.button
                key="clear"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                type="button"
                onClick={() => setSearchQuery("")}
                className="rounded-full bg-slate-100 p-1 text-slate-500 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </motion.button>
            )}
            {!searchLoading && !searchQuery && (
              <motion.button
                key="browse"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                type="button"
                onClick={() => navigate("/discover")}
                className="shrink-0 rounded-xl bg-brand-blue px-4 py-2 text-sm font-bold text-white transition-all hover:bg-blue-700"
              >
                Browse all
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        <SearchDropdown
          open={isSearching}
          results={searchResults.data?.data ?? null}
          loading={searchLoading}
          query={debouncedQuery}
          onClose={() => setSearchQuery("")}
        />
      </motion.div>
    </section>
  );
};

export default Hero;
