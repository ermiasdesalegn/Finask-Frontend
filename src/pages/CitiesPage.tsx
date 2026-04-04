import {
  ArrowLeft,
  CloudSun,
  MapPin,
  Plane,
  Search,
  Sparkles,
  Star,
} from "lucide-react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatedGridPattern } from "../components/ui/animated-grid-pattern";
import { staggerBlurContainer, staggerBlurItem } from "../lib/motion/pageMotion";
import { useCitiesListQuery } from "../lib/queries";
import { cn } from "../lib/utils";
import type { City } from "../types";

const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=800";

const CitiesPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const citiesQuery = useCitiesListQuery({
    limit: 250,
    sort: "name",
  });

  const cities = citiesQuery.data?.data?.cities ?? [];
  const loading = citiesQuery.isPending;
  const error = citiesQuery.isError
    ? citiesQuery.error instanceof Error
      ? citiesQuery.error.message
      : "Failed to load cities"
    : null;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return cities;
    return cities.filter((c) => {
      const name = (c.name ?? "").toLowerCase();
      const region = (c.regionDisplayName ?? c.region ?? "").toLowerCase();
      const overview = (c.overview ?? "").toLowerCase();
      return name.includes(q) || region.includes(q) || overview.includes(q);
    });
  }, [cities, search]);

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
        <div className="absolute -right-[10%] -top-[20%] h-[60%] w-[60%] rounded-full bg-emerald-500/5 blur-[120px] mix-blend-multiply dark:bg-emerald-400/10 dark:mix-blend-screen" />
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
              className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200/60 bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:text-emerald-400"
            >
              <Sparkles size={14} className="text-brand-yellow" />
              City directory
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl"
            >
              Explore <span className="text-brand-blue">Ethiopia</span> by city
            </motion.h1>
            <p className="max-w-xl text-sm font-medium text-slate-600 dark:text-slate-400">
              Browse every hub in our directory. Open a city for climate, universities, and local highlights.
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
              placeholder="Search by city, region, or keyword..."
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
                className="h-72 animate-pulse rounded-[1.5rem] bg-slate-200/80 dark:bg-zinc-800/80"
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
            {filtered.map((city) => (
              <CityCard
                key={city._id}
                city={city}
                variants={itemVariants}
                onOpen={() => navigate(`/cities/${city._id}`)}
              />
            ))}
          </motion.div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <p className="py-16 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
            No cities match your search.
          </p>
        )}
      </div>
    </div>
  );
};

function CityCard({
  city,
  variants,
  onOpen,
}: {
  city: City;
  variants: Variants;
  onOpen: () => void;
}) {
  return (
    <motion.article
      variants={variants}
      className="group cursor-pointer overflow-hidden rounded-[1.5rem] border border-slate-200/60 bg-white/70 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-brand-blue/30 hover:shadow-xl hover:shadow-brand-blue/5 dark:border-white/5 dark:bg-zinc-900/70"
      onClick={onOpen}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
    >
      <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-zinc-800 md:h-48">
        <img
          src={city.coverImage || FALLBACK_COVER}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/20 to-transparent" />
        <div className="absolute bottom-4 left-5 right-5">
          <h2 className="text-xl font-black tracking-tight text-white md:text-2xl">
            {city.name}
          </h2>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-bold text-white/90">
            <span className="flex items-center gap-1">
              <MapPin size={12} className="shrink-0" />
              {city.regionDisplayName || city.region || "—"}
            </span>
            {city.ratingsAverage != null && (
              <span className="flex items-center gap-1">
                <Star size={12} className="shrink-0 fill-brand-yellow text-brand-yellow" />
                {city.ratingsAverage.toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="space-y-3 p-5">
        <p className="line-clamp-2 text-xs font-medium leading-relaxed text-slate-600 dark:text-slate-400">
          {city.overview || "Open the city profile for details."}
        </p>
        <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5 truncate">
            <CloudSun size={13} className="shrink-0 text-slate-400" />
            {city.climate?.climateTag || city.climate?.summary || "—"}
          </span>
          <span className="flex items-center gap-1.5 truncate">
            <Plane size={13} className="shrink-0 text-slate-400" />
            {city.cityProfile?.hasAirport ? "Airport" : "No airport"}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

export default CitiesPage;
