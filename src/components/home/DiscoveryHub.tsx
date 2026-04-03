import { ChevronRight, Heart, MapPin, Star } from "lucide-react";
import { motion } from "motion/react";
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  displayRating,
  formatRatingsQuantityCompact,
  universityCity,
  universityCover,
  universityPath,
} from "../../lib/universityUi";
import { cn } from "../../lib/utils";
import type { HomePagePayload, University } from "../../types";

const DiscoveryHub = ({
  home,
  loading,
}: {
  home: HomePagePayload | null;
  loading: boolean;
}) => {
  const [activeFilter, setActiveFilter] = useState("All");

  const list = useMemo((): University[] => {
    if (!home) return [];
    if (activeFilter === "Featured") return home.featured ?? [];
    if (activeFilter === "Top Rated") return home.topRated ?? [];
    if (activeFilter === "Nearby") {
      const n = home.nearBy ?? [];
      if (n.length) return n;
      return home.topRanked ?? [];
    }
    const merged: University[] = [];
    const seen = new Set<string>();
    const push = (u: University) => {
      const k = u.slug || u._id || "";
      if (!k || seen.has(k)) return;
      seen.add(k);
      merged.push(u);
    };
    (home.featured ?? []).forEach(push);
    (home.trending ?? []).forEach(push);
    (home.topRated ?? []).forEach(push);
    return merged;
  }, [home, activeFilter]);

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <h2 className="mb-4 text-4xl font-bold dark:text-white">
              Discovery Hub
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Find the perfect program for your future career
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1.5 dark:bg-white/5">
            {["All", "Featured", "Top Rated", "Nearby"].map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "rounded-xl px-6 py-2.5 text-sm font-bold transition-all",
                  activeFilter === filter
                    ? "bg-white text-brand-blue shadow-sm dark:bg-brand-blue dark:text-white"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {loading && !list.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-3xl bg-slate-100 dark:bg-zinc-800"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {list.map((uni) => (
              <motion.div
                key={uni.slug || uni._id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-xl dark:border-white/10 dark:bg-[#1e1e1e]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={universityCover(uni)}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    alt={uni.name}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-4 rounded-full bg-black/40 p-2.5 text-white backdrop-blur-md transition-colors hover:bg-black/60"
                  >
                    <Heart size={20} />
                  </button>
                  {uni.isFeatured && (
                    <div className="absolute left-4 top-4 rounded-full bg-brand-yellow px-3 py-1 text-[10px] font-black uppercase tracking-widest text-black">
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-lg font-bold transition-colors group-hover:text-brand-blue dark:text-white">
                    {uni.name}
                  </h3>
                  <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
                    <MapPin size={14} /> {universityCity(uni) || "Ethiopia"}
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-50 pt-4 dark:border-white/5">
                    <div className="flex items-center gap-1.5 font-bold dark:text-white">
                      <Star
                        size={16}
                        className="text-brand-yellow"
                        fill="currentColor"
                      />
                      {displayRating(uni)}{" "}
                      <span className="text-xs font-medium text-slate-400">
                        (
                        {formatRatingsQuantityCompact(uni.ratingsQuantity)}
                        )
                      </span>
                    </div>
                    <Link
                      to={universityPath(uni)}
                      className="rounded-xl bg-slate-50 p-2 text-brand-blue transition-all hover:bg-brand-blue hover:text-white dark:bg-white/5"
                    >
                      <ChevronRight size={20} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && list.length === 0 && (
          <p className="py-12 text-center text-slate-500 dark:text-slate-400">
            No universities to show for this filter yet.
          </p>
        )}
      </div>
    </section>
  );
};

export default DiscoveryHub;
