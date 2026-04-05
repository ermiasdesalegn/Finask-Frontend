import {
    ArrowUpDown,
    Building2,
    Check,
    ChevronRight,
    CloudSun,
    Filter,
    GitCompare,
    Heart,
    Landmark,
    LayoutGrid,
    Map as MapIcon,
    MapPin,
    Plane,
    Search,
    SlidersHorizontal,
    Sparkles,
    Star,
    Thermometer,
    Trees,
    Trophy,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import EthiopiaMap from "../components/home/EthiopiaMap";
import { AnimatedGridPattern } from "../components/ui/animated-grid-pattern";
import { REGION_FILTERS } from "../constants";
import { useCompare } from "../context/CompareContext";
import { CITY_IMAGE_FALLBACK } from "../constants/defaultMediaFallbacks";
import { showApiToast } from "../lib/api";
import { comparePathFromUniversityIds } from "../lib/compareQueue";
import { useDebounce } from "../lib/hooks/useDebounce";
import { staggerBlurContainer, staggerBlurItem } from "../lib/motion/pageMotion";
import {
    useCitiesListQuery,
    useFeaturedUniversitiesQuery,
    useTopRankedUniversitiesQuery,
    useTopRatedUniversitiesQuery,
    useTrendingUniversitiesQuery,
    useUniversitiesListQuery,
} from "../lib/queries";
import { DISCOVER_TOP_LIMIT } from "../lib/services/universityService";
import { useSearchQuery } from "../lib/queries/search";
import {
    displayRating,
    universityCity,
    universityCover,
    universityPath,
} from "../lib/universityUi";
import { cn } from "../lib/utils";
import type { University } from "../types";

const containerVariants = staggerBlurContainer;
const itemVariants = staggerBlurItem;

type FilterState = {
  minRating: number | null;
  featuredOnly: boolean;
  type: string | null;
  setting: string | null;
};
type SortOption = "rating-desc" | "name-asc" | "name-desc";

type DiscoverPreset = "trending" | "featured" | "top-ranked" | "top-rated";

const CLIMATE_ZONE_FILTERS: { id: string | null; label: string }[] = [
  { id: null, label: "All zones" },
  { id: "dega", label: "Dega" },
  { id: "weynadega", label: "Weynadega" },
  { id: "kolla", label: "Kolla" },
  { id: "berha", label: "Berha" },
  { id: "wurch", label: "Wurch" },
];

const UniversitiesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeRegionLabel, setActiveRegionLabel] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("rating-desc");
  const [filters, setFilters] = useState<FilterState>({
    minRating: null,
    featuredOnly: false,
    type: null,
    setting: null,
  });
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    ids: compareIds,
    add: addToCompare,
    remove: removeFromCompare,
    contains: isInCompare,
  } = useCompare();

  const debouncedQuery = useDebounce(searchQuery, 300);
  const isSearching = debouncedQuery.trim().length >= 2;

  const discoverPreset = useMemo((): DiscoverPreset | null => {
    const f = searchParams.get("filter");
    const s = searchParams.get("sort");
    if (f === "trending") return "trending";
    if (f === "featured") return "featured";
    if (f === "research") return null;
    if (s === "rank") return "top-ranked";
    if (s === "rating") return "top-rated";
    return null;
  }, [searchParams]);

  const researchFromUrl = searchParams.get("filter") === "research";
  const galleryView = searchParams.get("view") === "gallery";
  const climateView = searchParams.get("view") === "climate";
  const climateZoneParam = searchParams.get("zone");

  const useMainList = discoverPreset === null;

  const activeRegionApi = REGION_FILTERS.find(
    (r) => r.label === activeRegionLabel
  )?.value;

  const listFilters = useMemo(
    () => ({
      cityRegion: activeRegionApi ?? null,
      limit: 250,
      sort: "-ratingsAverage" as const,
      ratingsAverageGte: filters.minRating,
      isFeatured: filters.featuredOnly ? true : null,
      tags: researchFromUrl ? ("research" as const) : null,
      elevationName: climateView && climateZoneParam ? climateZoneParam : null,
    }),
    [
      activeRegionApi,
      filters.minRating,
      filters.featuredOnly,
      researchFromUrl,
      climateView,
      climateZoneParam,
    ]
  );

  const universitiesQuery = useUniversitiesListQuery(listFilters, {
    enabled: useMainList,
  });
  const trendingQuery = useTrendingUniversitiesQuery({
    enabled: discoverPreset === "trending",
  });
  const featuredDiscoverQuery = useFeaturedUniversitiesQuery({
    enabled: discoverPreset === "featured",
  });
  const topRankedQuery = useTopRankedUniversitiesQuery(DISCOVER_TOP_LIMIT, {
    enabled: discoverPreset === "top-ranked",
  });
  const topRatedQuery = useTopRatedUniversitiesQuery(DISCOVER_TOP_LIMIT, {
    enabled: discoverPreset === "top-rated",
  });

  const citiesQuery = useCitiesListQuery();
  const searchQuery_ = useSearchQuery(debouncedQuery, 20);

  const rawUniversities = useMemo(() => {
    switch (discoverPreset) {
      case "trending":
        return trendingQuery.data?.data?.universities ?? [];
      case "featured":
        return featuredDiscoverQuery.data?.data?.universities ?? [];
      case "top-ranked":
        return topRankedQuery.data?.data?.universities ?? [];
      case "top-rated":
        return topRatedQuery.data?.data?.universities ?? [];
      default:
        return universitiesQuery.data?.data?.universities ?? [];
    }
  }, [
    discoverPreset,
    trendingQuery.data,
    featuredDiscoverQuery.data,
    topRankedQuery.data,
    topRatedQuery.data,
    universitiesQuery.data,
  ]);

  const browseListUniversities =
    universitiesQuery.data?.data?.universities ?? [];
  const cities = citiesQuery.data?.data?.cities ?? [];
  const listLoading =
    (useMainList && universitiesQuery.isPending) ||
    (discoverPreset === "trending" && trendingQuery.isPending) ||
    (discoverPreset === "featured" && featuredDiscoverQuery.isPending) ||
    (discoverPreset === "top-ranked" && topRankedQuery.isPending) ||
    (discoverPreset === "top-rated" && topRatedQuery.isPending);

  const searchLoading = isSearching && searchQuery_.isFetching;
  const listError = useMemo(() => {
    const q =
      useMainList && universitiesQuery.isError
        ? universitiesQuery.error
        : discoverPreset === "trending" && trendingQuery.isError
          ? trendingQuery.error
          : discoverPreset === "featured" && featuredDiscoverQuery.isError
            ? featuredDiscoverQuery.error
            : discoverPreset === "top-ranked" && topRankedQuery.isError
              ? topRankedQuery.error
              : discoverPreset === "top-rated" && topRatedQuery.isError
                ? topRatedQuery.error
                : null;
    if (!q) return null;
    return q instanceof Error ? q.message : "Failed to load";
  }, [
    useMainList,
    universitiesQuery.isError,
    universitiesQuery.error,
    discoverPreset,
    trendingQuery.isError,
    trendingQuery.error,
    featuredDiscoverQuery.isError,
    featuredDiscoverQuery.error,
    topRankedQuery.isError,
    topRankedQuery.error,
    topRatedQuery.isError,
    topRatedQuery.error,
  ]);

  const activeFilterCount = Object.values(filters).filter(
    (v) => v !== null && v !== false
  ).length;
  const clearFilters = () =>
    setFilters({
      minRating: null,
      featuredOnly: false,
      type: null,
      setting: null,
    });

  const discoverActive =
    discoverPreset !== null ||
    researchFromUrl ||
    galleryView ||
    climateView;

  /** Elevation zone query only applies to GET /universities (not trending/featured/top-*). */
  const showClimateChips =
    climateView && !isSearching && discoverPreset === null;

  const isBrowsingMode =
    !isSearching &&
    activeFilterCount === 0 &&
    activeRegionLabel === "All" &&
    !discoverActive;

  const discoverHeading = useMemo(() => {
    if (isBrowsingMode || isSearching) return null;
    const g = galleryView ? " Larger campus photos." : "";
    if (discoverPreset === "trending") {
      return {
        title: "Trending",
        subtitle: `Universities gaining attention right now.${g}`,
      };
    }
    if (discoverPreset === "featured") {
      return {
        title: "Just for you",
        subtitle: `Featured picks from our editors.${g}`,
      };
    }
    if (discoverPreset === "top-ranked") {
      return {
        title: "Top ranked",
        subtitle: `Sorted by Ethiopia rank (EduRank).${g}`,
      };
    }
    if (discoverPreset === "top-rated") {
      return {
        title: "Top rated",
        subtitle: `Highest average ratings in the directory.${g}`,
      };
    }
    if (researchFromUrl) {
      return {
        title: "Research universities",
        subtitle: `Institutions tagged for research strength.${g}`,
      };
    }
    if (climateView) {
      const z = climateZoneParam
        ? CLIMATE_ZONE_FILTERS.find((c) => c.id === climateZoneParam)?.label ??
          climateZoneParam
        : null;
      return {
        title: z ? `Climate: ${z}` : "Browse by climate",
        subtitle: z
          ? "Universities whose city sits in this elevation zone."
          : "Filter by Ethiopian elevation / climate zone (Köppen-style buckets).",
      };
    }
    if (galleryView) {
      return {
        title: "Campus gallery",
        subtitle: "Larger photos to preview each campus.",
      };
    }
    return null;
  }, [
    isBrowsingMode,
    isSearching,
    discoverPreset,
    researchFromUrl,
    galleryView,
    climateView,
    climateZoneParam,
  ]);

  const filteredAndSortedUniversities = useMemo(() => {
    if (isSearching) {
      const apiResults = (searchQuery_.data?.data?.universities ?? []) as University[];
      return [...apiResults].sort((a, b) => {
        if (sortBy === "rating-desc")
          return (b.ratingsAverage ?? 0) - (a.ratingsAverage ?? 0);
        if (sortBy === "name-asc") return a.name.localeCompare(b.name);
        if (sortBy === "name-desc") return b.name.localeCompare(a.name);
        return 0;
      });
    }

    let result = rawUniversities.filter((u) => {
      const rating = u.ratingsAverage ?? 0;
      const matchRating =
        filters.minRating === null || rating >= filters.minRating;
      const matchFeatured = !filters.featuredOnly || u.isFeatured;
      const matchRegion =
        activeRegionApi == null ||
        (u.address?.region ?? "").toLowerCase() ===
          activeRegionApi.toLowerCase();
      return matchRating && matchFeatured && matchRegion;
    });

    result = [...result].sort((a, b) => {
      if (sortBy === "rating-desc")
        return (b.ratingsAverage ?? 0) - (a.ratingsAverage ?? 0);
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      return 0;
    });
    return result;
  }, [
    rawUniversities,
    isSearching,
    searchQuery_.data,
    filters,
    sortBy,
    activeRegionApi,
  ]);

  const researchUnis = useMemo(
    () =>
      browseListUniversities.filter((u) =>
        (u.tags ?? []).includes("research")
      ),
    [browseListUniversities]
  );
  const interestUnis = useMemo(
    () =>
      browseListUniversities.filter(
        (u) =>
          u.isFeatured || (u.tags ?? []).includes("specialized")
      ),
    [browseListUniversities]
  );
  const nearSlice = useMemo(
    () => browseListUniversities.slice(0, 4),
    [browseListUniversities]
  );

  const HorizontalRow = ({
    title,
    subtitle,
    items,
    renderItem,
  }: {
    title: string;
    subtitle?: string;
    items: unknown[];
    renderItem: (item: unknown) => React.ReactNode;
  }) => (
    <section className="mb-16">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-6 w-1.5 rounded-full bg-gradient-to-b from-brand-blue to-brand-yellow shadow-[0_0_8px_rgba(250,204,21,0.4)]" />
          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white md:text-2xl">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 md:text-sm">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-8 [scrollbar-width:none] lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden">
        {items.map((item) => renderItem(item))}
      </div>
    </section>
  );

  const renderUniCard = (
    uni: University,
    variant: "scroller" | "grid" = "scroller"
  ) => {
    const inGallery = variant === "grid" && galleryView;
    const imgCount = Math.max(1, (uni.images?.length ?? 0) + 1);
    const scrollerClass =
      "group w-72 shrink-0 cursor-pointer snap-start rounded-[1.5rem] border border-slate-200/60 bg-white/70 p-2 backdrop-blur-md transition-all duration-300 hover:border-brand-blue/30 hover:shadow-xl hover:shadow-brand-blue/5 dark:border-white/5 dark:bg-zinc-900/70 md:w-80";
    const gridClass =
      "group w-full cursor-pointer rounded-[1.5rem] border border-slate-200/60 bg-white/70 p-2 backdrop-blur-md transition-all duration-300 hover:border-brand-blue/30 hover:shadow-xl hover:shadow-brand-blue/5 dark:border-white/5 dark:bg-zinc-900/70";
    return (
      <motion.div
        variants={itemVariants}
        key={uni._id || uni.slug}
        onClick={() => navigate(universityPath(uni))}
        className={variant === "scroller" ? scrollerClass : gridClass}
      >
        <div
          className={cn(
            "relative mb-3 overflow-hidden rounded-xl bg-slate-100 dark:bg-zinc-800",
            inGallery ? "h-52 md:h-64" : "h-44 md:h-48"
          )}
        >
          <img
            src={universityCover(uni)}
            alt={uni.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {inGallery && (
            <span className="absolute bottom-2 right-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-black text-white backdrop-blur-sm">
              1 / {imgCount}
            </span>
          )}
          <button
            type="button"
            title={
              uni._id && isInCompare(uni._id)
                ? "Remove from compare"
                : "Add to compare"
            }
            className={cn(
              "absolute right-12 top-3 rounded-full p-1.5 text-white backdrop-blur-md transition-all hover:scale-110 active:scale-95",
              uni._id && isInCompare(uni._id)
                ? "bg-brand-blue/90 hover:bg-brand-blue"
                : "bg-black/40 hover:bg-black/60"
            )}
            onClick={(e) => {
              e.stopPropagation();
              const id = uni._id;
              if (!id) return;
              if (isInCompare(id)) {
                removeFromCompare(id);
                return;
              }
              const r = addToCompare(id);
              if (r === "max") {
                showApiToast(
                  "Compare list is full (max 3). Remove one to add another."
                );
              }
            }}
          >
            <GitCompare size={14} />
          </button>
          <button
            type="button"
            className="absolute right-3 top-3 rounded-full bg-black/40 p-1.5 text-white backdrop-blur-md transition-all hover:scale-110 hover:bg-black/60 active:scale-95"
            onClick={(e) => e.stopPropagation()}
          >
            <Heart size={14} />
          </button>
          {inGallery && (
            <div className="absolute left-3 top-3 rounded-full bg-black/40 p-1.5 text-white backdrop-blur-md">
              <LayoutGrid size={14} />
            </div>
          )}
        </div>
        <div className="px-3 pb-3">
          <h3 className="mb-1.5 truncate text-base font-black text-slate-900 transition-colors group-hover:text-brand-blue dark:text-white md:text-lg">
            {uni.name}
          </h3>
          <div className="mb-3 flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
            <MapPin size={12} className="text-brand-blue" />{" "}
            {universityCity(uni) || "—"}
            <span className="mx-1 text-slate-300 dark:text-slate-600">•</span>
            <Star size={12} className="text-brand-yellow" fill="currentColor" />{" "}
            {displayRating(uni)}
          </div>
          <div className="flex flex-wrap gap-2">
            {uni.rank?.eduRank?.ethiopiaRank != null && (
              <span className="flex items-center gap-1 rounded-md bg-blue-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-brand-blue dark:bg-brand-blue/10 md:text-[10px]">
                <Trophy size={10} /> #{uni.rank.eduRank.ethiopiaRank} in Ethiopia
              </span>
            )}
            <span className="flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-slate-600 dark:bg-zinc-800 dark:text-slate-300 md:text-[10px]">
              <CloudSun size={10} />{" "}
              {inGallery ? "Gallery view" : "Featured picks"}
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderCityCard = (city: (typeof cities)[0]) => (
    <motion.div
      variants={itemVariants}
      key={city._id}
      className="group w-80 shrink-0 snap-start overflow-hidden rounded-[1.5rem] border border-slate-200/60 bg-white/70 backdrop-blur-md transition-all duration-300 hover:border-brand-blue/30 hover:shadow-xl hover:shadow-brand-blue/5 dark:border-white/5 dark:bg-zinc-900/70 md:w-96"
    >
      <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-zinc-800">
        <img
          src={
            city.coverImage || CITY_IMAGE_FALLBACK
          }
          alt={city.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-80" />
        <h3 className="absolute bottom-4 left-5 text-2xl font-black tracking-tight text-white">
          {city.name}
        </h3>
        <button
          type="button"
          className="absolute right-4 top-4 rounded-full bg-black/40 p-2 text-white backdrop-blur-md transition-all hover:scale-110 hover:bg-black/60 active:scale-95"
        >
          <Heart size={14} />
        </button>
      </div>
      <div className="space-y-3 p-5">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
          <Landmark size={14} className="text-slate-400" /> Explore local
          universities
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs font-bold text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <CloudSun size={14} />{" "}
            {city.climate?.climateTag || city.climate?.summary || "—"}
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} /> {city.regionDisplayName || city.region || "—"}
          </div>
          <div className="flex items-center gap-2">
            <Plane size={14} />{" "}
            {city.cityProfile?.hasAirport ? "Airport" : "—"}
          </div>
          <div className="flex items-center gap-2">
            <MapIcon size={14} /> Hub city
          </div>
        </div>
      </div>
    </motion.div>
  );

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
        <div className="absolute -right-[10%] -top-[20%] h-[60%] w-[60%] rounded-full bg-brand-blue/5 blur-[120px] mix-blend-multiply dark:bg-brand-blue/10 dark:mix-blend-screen" />
        <div className="absolute -left-[10%] top-[20%] h-[50%] w-[50%] rounded-full bg-brand-yellow/5 blur-[120px] mix-blend-multiply dark:bg-brand-yellow/10 dark:mix-blend-screen" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <section className="flex flex-col items-center justify-between gap-6 pb-6 pt-4 text-center md:flex-row md:items-end md:text-left">
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200/60 bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-blue shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:text-blue-400"
            >
              <Sparkles size={14} className="text-brand-yellow" />
              University Directory
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl lg:text-6xl"
            >
              Find Your <span className="text-brand-blue">Perfect Fit</span>
            </motion.h1>
          </div>
          <div className="flex w-full max-w-xs shrink-0 flex-col items-stretch gap-3 md:max-w-sm md:items-end">
            {compareIds.length >= 2 ? (
              <Link
                to={comparePathFromUniversityIds(compareIds)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-colors hover:bg-blue-700"
              >
                <GitCompare size={18} aria-hidden />
                See side-by-side comparison
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold tabular-nums">
                  {compareIds.length}/3
                </span>
              </Link>
            ) : compareIds.length === 1 ? (
              <Link
                to="/compare"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-brand-blue/50 bg-brand-blue/10 px-6 py-3 text-sm font-bold text-brand-blue transition-colors hover:border-brand-blue hover:bg-brand-blue/15 dark:bg-brand-blue/15"
              >
                <GitCompare size={18} aria-hidden />
                Compare list — add one more
              </Link>
            ) : (
              <button
                type="button"
                onClick={() =>
                  document.getElementById("browse-university-cards")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  })
                }
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-slate-200 bg-white/80 px-6 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-brand-blue/40 hover:text-brand-blue dark:border-white/15 dark:bg-zinc-800/80 dark:text-slate-200 dark:hover:border-brand-blue/50"
              >
                <GitCompare size={18} aria-hidden />
                Browse schools to compare
              </button>
            )}
            <p className="text-center text-sm leading-relaxed text-slate-600 dark:text-slate-400 md:text-right">
              {compareIds.length === 0
                ? "Tap the compare icon on a card to start a shortlist. When you’ve picked at least two, you’ll get a full breakdown—rankings, climate, ratings, and more."
                : compareIds.length === 1
                  ? "You’ve chosen one. Add another from the cards below, then open the comparison to see them together."
                  : "Your picks are saved. Open the comparison whenever you’re ready for the full view."}
            </p>
          </div>
        </section>

        {listError && (
          <p className="mb-4 text-center text-sm font-medium text-red-600 dark:text-red-400">
            {listError}
          </p>
        )}

        <section className="mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative z-30 flex w-full flex-col items-center gap-2 rounded-3xl border border-slate-200/80 bg-white/80 p-2 shadow-xl shadow-slate-200/40 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/80 dark:shadow-none md:flex-row"
          >
            <div className="group relative flex h-12 w-full flex-grow items-center md:h-14">
              <Search className="absolute left-5 h-5 w-5 text-slate-400 transition-colors group-focus-within:text-brand-blue" />
              <input
                type="text"
                className="h-full w-full bg-transparent pl-12 pr-12 text-base font-medium text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                placeholder="Search by university or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <AnimatePresence>
                {searchLoading && (
                  <motion.div
                    key="spinner"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute right-4 h-4 w-4 animate-spin rounded-full border-2 border-brand-blue border-t-transparent"
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
                    className="absolute right-4 rounded-full bg-slate-100 p-1 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:hover:text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <div className="hidden items-center gap-1.5 pr-2 md:flex">
              <div className="mx-2 h-6 w-px bg-slate-200 dark:bg-zinc-800" />

              <button
                type="button"
                onClick={() => {
                  setShowFilters(!showFilters);
                  setShowSort(false);
                }}
                className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold transition-all duration-300 ${
                  showFilters || activeFilterCount > 0
                    ? "bg-slate-900 text-white shadow-md dark:bg-white dark:text-slate-900"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-zinc-800"
                }`}
              >
                <Filter size={14} /> Filter
                {activeFilterCount > 0 && (
                  <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-blue text-[10px] text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowSort(!showSort);
                    setShowFilters(false);
                  }}
                  className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold transition-all duration-300 ${
                    showSort
                      ? "bg-slate-100 text-slate-900 dark:bg-zinc-800 dark:text-white"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-zinc-800"
                  }`}
                >
                  <ArrowUpDown size={14} /> Sort
                </button>

                <AnimatePresence>
                  {showSort && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full z-50 mt-3 w-48 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1 shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
                    >
                      {[
                        { id: "rating-desc" as const, label: "Highest Rated" },
                        { id: "name-asc" as const, label: "Name (A-Z)" },
                        { id: "name-desc" as const, label: "Name (Z-A)" },
                      ].map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => {
                            setSortBy(option.id);
                            setShowSort(false);
                          }}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs font-bold transition-colors ${
                            sortBy === option.id
                              ? "bg-blue-50 text-brand-blue dark:bg-brand-blue/10"
                              : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-zinc-800"
                          }`}
                        >
                          {option.label}
                          {sortBy === option.id && (
                            <Check size={14} className="text-brand-blue" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>


          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.3 }}
                className="relative z-20 overflow-hidden"
              >
                <div className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-5 text-left shadow-xl shadow-slate-200/30 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/90 dark:shadow-none lg:p-6">
                  <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-zinc-800/50">
                    <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                      <SlidersHorizontal size={14} className="text-brand-blue" />{" "}
                      Advanced Filters
                    </h3>
                    {activeFilterCount > 0 && (
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-bold text-brand-blue transition-colors hover:text-blue-700 dark:bg-brand-blue/10 dark:hover:text-blue-400"
                      >
                        Reset All
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2.5">
                      <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <Star size={10} /> Min Rating
                      </p>
                      <div className="flex w-full rounded-xl bg-slate-100/80 p-1 dark:bg-zinc-800/80">
                        {([null, 4.0, 4.4, 4.7] as (number | null)[]).map(
                          (val) => (
                            <button
                              key={String(val)}
                              type="button"
                              onClick={() =>
                                setFilters((f) => ({ ...f, minRating: val }))
                              }
                              className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all duration-200 ${
                                filters.minRating === val
                                  ? "bg-white text-slate-900 shadow-sm dark:bg-zinc-700 dark:text-white"
                                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                              }`}
                            >
                              {val === null ? "Any" : `${val}+`}
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <Building2 size={10} /> Status
                      </p>
                      <div className="flex w-full rounded-xl bg-slate-100/80 p-1 dark:bg-zinc-800/80">
                        {([null, "Public", "Private"] as const).map((val) => (
                          <button
                            key={String(val)}
                            type="button"
                            onClick={() =>
                              setFilters((f) => ({ ...f, type: val }))
                            }
                            className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all duration-200 ${
                              filters.type === val
                                ? "bg-white text-brand-blue shadow-sm dark:bg-zinc-700"
                                : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                            }`}
                          >
                            {val === null ? "Any" : val}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <Trees size={10} /> Setting
                      </p>
                      <div className="flex w-full rounded-xl bg-slate-100/80 p-1 dark:bg-zinc-800/80">
                        {([null, "Urban", "Suburban", "Rural"] as const).map(
                          (val) => (
                            <button
                              key={String(val)}
                              type="button"
                              onClick={() =>
                                setFilters((f) => ({ ...f, setting: val }))
                              }
                              className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all duration-200 ${
                                filters.setting === val
                                  ? "bg-white text-brand-blue shadow-sm dark:bg-zinc-700"
                                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                              }`}
                            >
                              {val === null ? "Any" : val}
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <Sparkles size={10} /> Highlights
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          setFilters((f) => ({
                            ...f,
                            featuredOnly: !f.featuredOnly,
                          }))
                        }
                        className={`flex w-full items-center justify-between rounded-xl border py-1.5 pl-3 pr-3 transition-all duration-300 ${
                          filters.featuredOnly
                            ? "border-amber-200 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-900/20"
                            : "border-slate-200 bg-white hover:border-slate-300 dark:border-white/5 dark:bg-zinc-800/50"
                        }`}
                      >
                        <span
                          className={`text-xs font-bold ${
                            filters.featuredOnly
                              ? "text-amber-700 dark:text-amber-400"
                              : "text-slate-600 dark:text-slate-300"
                          }`}
                        >
                          Featured Only
                        </span>
                        <div
                          className={`flex h-4.5 w-8 items-center rounded-full p-0.5 transition-colors duration-300 ${
                            filters.featuredOnly
                              ? "bg-brand-yellow"
                              : "bg-slate-300 dark:bg-zinc-600"
                          }`}
                        >
                          <motion.div
                            layout
                            className="h-3.5 w-3.5 rounded-full bg-white shadow-sm"
                            animate={{ x: filters.featuredOnly ? 14 : 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 30,
                            }}
                          />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-5 w-full"
          >
            <div className="flex snap-x snap-mandatory items-center gap-2.5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {REGION_FILTERS.map((region) => (
                <button
                  key={region.label}
                  type="button"
                  onClick={() => setActiveRegionLabel(region.label)}
                  className={`shrink-0 snap-start rounded-xl px-4 py-2 text-xs font-bold transition-all duration-300 ${
                    activeRegionLabel === region.label
                      ? "bg-brand-blue text-white shadow-md shadow-brand-blue/30"
                      : "border border-slate-200/80 bg-white/80 text-slate-600 backdrop-blur-md hover:bg-white dark:border-white/10 dark:bg-zinc-900/80 dark:text-slate-400 dark:hover:bg-zinc-800"
                  }`}
                >
                  {region.label}
                </button>
              ))}
            </div>
          </motion.div>
        </section>

        {listLoading && rawUniversities.length === 0 ? (
          <div
            id="browse-university-cards"
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-[1.5rem] bg-slate-100 dark:bg-zinc-800"
              />
            ))}
          </div>
        ) : isBrowsingMode ? (
          <motion.div
            id="browse-university-cards"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <EthiopiaMap
              universities={browseListUniversities}
              loading={listLoading}
            />
            <HorizontalRow
              title="Universities Near You"
              subtitle="Popular picks from our directory"
              items={nearSlice}
              renderItem={(u) => renderUniCard(u as University, "scroller")}
            />

            <HorizontalRow
              title="Institutional Excellence"
              subtitle="Research-focused institutions"
              items={researchUnis.slice(0, 12)}
              renderItem={(u) => renderUniCard(u as University, "scroller")}
            />

            <HorizontalRow
              title="Explore Cities"
              subtitle="Discover universities by major hubs"
              items={cities.slice(0, 8)}
              renderItem={(c) => renderCityCard(c as (typeof cities)[0])}
            />

            <HorizontalRow
              title="Matching your Interests"
              subtitle="Featured and specialized schools"
              items={interestUnis.slice(0, 12)}
              renderItem={(u) => renderUniCard(u as University, "scroller")}
            />
          </motion.div>
        ) : (
          <section id="browse-university-cards" className="mb-20">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-1.5 rounded-full bg-brand-blue shadow-[0_0_12px_rgba(37,99,235,0.6)]" />
                  <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white md:text-2xl">
                    {isSearching
                      ? `Results for "${debouncedQuery}"`
                      : discoverHeading?.title ?? "Campus Directory"}
                  </h2>
                </div>
                {discoverHeading?.subtitle && !isSearching && (
                  <p className="max-w-xl text-xs font-medium text-slate-500 dark:text-slate-400 sm:ml-2 md:text-sm">
                    {discoverHeading.subtitle}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {discoverActive && !isSearching && (
                  <button
                    type="button"
                    onClick={() => navigate("/universities")}
                    className="rounded-full border border-slate-200/80 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition-colors hover:border-brand-blue/40 hover:text-brand-blue dark:border-white/10 dark:bg-zinc-900 dark:text-slate-300"
                  >
                    Full directory
                  </button>
                )}
                <div className="flex items-center gap-2 rounded-lg border border-slate-200/60 bg-white px-3 py-1.5 shadow-sm dark:border-white/5 dark:bg-zinc-900">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-brand-yellow shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    {filteredAndSortedUniversities.length}{" "}
                    {filteredAndSortedUniversities.length === 1
                      ? "Result"
                      : "Results"}
                  </span>
                </div>
              </div>
            </div>

            {showClimateChips && (
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <Thermometer
                  size={14}
                  className="text-teal-600 dark:text-teal-400"
                />
                {CLIMATE_ZONE_FILTERS.map((z) => {
                  const active =
                    (z.id === null && !climateZoneParam) ||
                    z.id === climateZoneParam;
                  return (
                    <button
                      key={String(z.id)}
                      type="button"
                      onClick={() => {
                        setSearchParams(
                          (prev) => {
                            const n = new URLSearchParams(prev);
                            if (z.id) n.set("zone", z.id);
                            else n.delete("zone");
                            return n;
                          },
                          { replace: true }
                        );
                      }}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-xs font-bold transition-all",
                        active
                          ? "bg-teal-600 text-white shadow-md shadow-teal-600/25"
                          : "border border-slate-200/80 bg-white/80 text-slate-600 hover:border-teal-500/40 dark:border-white/10 dark:bg-zinc-900 dark:text-slate-300"
                      )}
                    >
                      {z.label}
                    </button>
                  );
                })}
              </div>
            )}

            {searchLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-64 animate-pulse rounded-[1.5rem] bg-slate-100 dark:bg-zinc-800" />
                ))}
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  key="directory-grid"
                  className={cn(
                    "grid gap-5",
                    galleryView
                      ? "sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2"
                      : "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  )}
                >
                  {filteredAndSortedUniversities.map((u) =>
                    renderUniCard(u, "grid")
                  )}

                  {filteredAndSortedUniversities.length === 0 && (
                    <div className="col-span-full py-16 text-center">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200/60 bg-white text-slate-300 shadow-sm dark:border-white/5 dark:bg-zinc-900 dark:text-slate-600"
                      >
                        <Search size={24} />
                      </motion.div>
                      <h3 className="mb-2 text-xl font-black tracking-tight text-slate-900 dark:text-white">
                        No campuses found
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Try tweaking your search terms or clearing the filters.
                      </p>
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="mt-4 text-sm font-bold text-brand-blue hover:underline"
                      >
                        Clear all filters
                      </button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default UniversitiesPage;
