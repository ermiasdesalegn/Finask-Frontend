import { ArrowLeft, Loader2, Search } from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLoginModal } from "../context/LoginModalContext";
import { useHomePageQuery } from "../lib/queries/home";
import {
  useFeaturedUniversitiesQuery,
  useSuggestedByLocationQuery,
  useSuggestedByProgramQuery,
  useTopRatedUniversitiesQuery,
  useTrendingUniversitiesQuery,
  useUniversitiesListQuery,
  useUniversitiesNearQuery,
} from "../lib/queries/universities";
import { displayRating, universityCover, universityPath } from "../lib/universityUi";
import type { University } from "../types";
import { useEffect, useMemo, useState } from "react";

const GENERATION_TABS = [
  { id: "firstgeneration", label: "1st Generation" },
  { id: "secondgeneration", label: "2nd Generation" },
  { id: "thirdgeneration", label: "3rd Generation" },
  { id: "fourthgeneration", label: "4th Generation" },
] as const;

const EXCELLENCE_TABS = [
  { id: "research", label: "Research" },
  { id: "general", label: "General" },
  { id: "specialized", label: "Specialized" },
  { id: "applied", label: "Applied" },
] as const;

type SortOption = "rating-desc" | "name-asc" | "name-desc";

function sortUniversities(list: University[], sort: SortOption): University[] {
  const copy = [...list];
  if (sort === "rating-desc") {
    return copy.sort((a, b) => (b.ratingsAverage ?? 0) - (a.ratingsAverage ?? 0));
  }
  if (sort === "name-asc") return copy.sort((a, b) => a.name.localeCompare(b.name));
  return copy.sort((a, b) => b.name.localeCompare(a.name));
}

function UniGrid({ universities, loading }: { universities: University[]; loading?: boolean }) {
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="animate-spin text-brand-blue" size={36} />
      </div>
    );
  }
  if (!universities.length) {
    return (
      <p className="py-12 text-center text-slate-500">No universities found for this section.</p>
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {universities.map((u) => (
        <Link
          key={u._id ?? u.slug}
          to={universityPath(u)}
          className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-blue/30 hover:shadow-lg dark:border-white/10 dark:bg-zinc-900"
        >
          <div className="relative h-40 overflow-hidden bg-slate-100 dark:bg-zinc-800">
            <img
              src={universityCover(u)}
              alt=""
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {u.isFeatured && (
              <span className="absolute left-3 top-3 rounded-full bg-brand-yellow px-2 py-0.5 text-[10px] font-black uppercase text-black">
                Featured
              </span>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-black text-slate-900 group-hover:text-brand-blue dark:text-white">
              {u.name}
            </h3>
            {u.ratingsAverage != null && (
              <p className="mt-1 text-xs font-bold text-slate-500">
                {displayRating(u)} rating
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function DiscoverSectionPage() {
  const { section } = useParams<{ section: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated, sessionStatus } = useAuth();
  const { openLogin } = useLoginModal();
  const tokenFp =
    sessionStatus === "loading"
      ? "bootstrapping"
      : isAuthenticated
        ? "auth"
        : "guest";
  const homeQ = useHomePageQuery(tokenFp);

  const genTab =
    searchParams.get("tag") &&
    GENERATION_TABS.some((t) => t.id === searchParams.get("tag"))
      ? (searchParams.get("tag") as (typeof GENERATION_TABS)[number]["id"])
      : GENERATION_TABS[0].id;
  const excTab =
    searchParams.get("tag") &&
    EXCELLENCE_TABS.some((t) => t.id === searchParams.get("tag"))
      ? (searchParams.get("tag") as (typeof EXCELLENCE_TABS)[number]["id"])
      : EXCELLENCE_TABS[0].id;

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("rating-desc");
  const [nearCoords, setNearCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [geoDenied, setGeoDenied] = useState(false);
  const [geoPending, setGeoPending] = useState(false);

  const setGenTab = (id: string) => {
    setSearchParams({ tag: id }, { replace: true });
  };
  const setExcTab = (id: string) => {
    setSearchParams({ tag: id }, { replace: true });
  };

  const genList = useUniversitiesListQuery(
    { tags: genTab, limit: 60 },
    { enabled: section === "generation" }
  );
  const excList = useUniversitiesListQuery(
    { tags: excTab, limit: 60 },
    { enabled: section === "excellence" }
  );
  const trendingQ = useTrendingUniversitiesQuery({
    enabled: section === "trending" || section === "discover",
  });
  const topRatedQ = useTopRatedUniversitiesQuery(20, {
    enabled: section === "trending" || section === "discover",
  });
  const featuredQ = useFeaturedUniversitiesQuery({
    enabled: section === "discover" || section === "for-you",
  });
  const suggestedLocQ = useSuggestedByLocationQuery(
    section === "for-you" && isAuthenticated
  );
  const suggestedProgQ = useSuggestedByProgramQuery(
    section === "for-you" && isAuthenticated
  );

  useEffect(() => {
    if (section !== "nearby") return;
    if (nearCoords || geoDenied) return;
    if (!navigator.geolocation) {
      setGeoDenied(true);
      return;
    }
    setGeoPending(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setNearCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoPending(false);
      },
      () => {
        setGeoDenied(true);
        setGeoPending(false);
      },
      { enableHighAccuracy: false, timeout: 12_000, maximumAge: 300_000 }
    );
  }, [section, nearCoords, geoDenied]);

  const nearQ = useUniversitiesNearQuery(nearCoords, {
    enabled: section === "nearby" && nearCoords != null,
  });

  const titles: Record<string, string> = {
    generation: "By generation",
    excellence: "Institutional excellence",
    nearby: "Universities near you",
    trending: "Top rated & trending",
    discover: "Discover highlights",
    "for-you": "Personalized picks",
  };

  const rawUniversities = useMemo(() => {
    let list: University[] = [];
    let loading = false;

    if (section === "generation") {
      list = genList.data?.data?.universities ?? [];
      loading = genList.isPending;
    } else if (section === "excellence") {
      list = excList.data?.data?.universities ?? [];
      loading = excList.isPending;
    } else if (section === "nearby") {
      list =
        nearQ.data?.data?.universities ?? homeQ.data?.data?.nearBy ?? [];
      loading = geoPending || (nearCoords != null && nearQ.isPending);
    } else if (section === "trending" || section === "discover") {
      const trending =
        trendingQ.data?.data?.universities ?? homeQ.data?.data?.trending ?? [];
      const rated =
        topRatedQ.data?.data?.universities ?? homeQ.data?.data?.topRated ?? [];
      const featured =
        featuredQ.data?.data?.universities ?? homeQ.data?.data?.featured ?? [];
      const seen = new Set<string>();
      const merge = [...trending, ...rated, ...featured];
      list = merge.filter((u) => {
        const id = u._id ?? u.slug ?? "";
        if (!id || seen.has(id)) return false;
        seen.add(id);
        return true;
      });
      loading =
        trendingQ.isPending || topRatedQ.isPending || featuredQ.isPending;
    } else if (section === "for-you") {
      if (isAuthenticated) {
        const a =
          suggestedLocQ.data?.data?.universities ??
          homeQ.data?.data?.suggestedByLocation ??
          [];
        const b =
          suggestedProgQ.data?.data?.universities ??
          homeQ.data?.data?.suggestedByProgram ??
          [];
        const seen = new Set<string>();
        const personalized = [...a, ...b].filter((u) => {
          const id = u._id ?? u.slug ?? "";
          if (!id || seen.has(id)) return false;
          seen.add(id);
          return true;
        });
        if (personalized.length > 0) {
          list = personalized;
        } else {
          list =
            featuredQ.data?.data?.universities ??
            homeQ.data?.data?.featured ??
            [];
        }
        loading = suggestedLocQ.isPending || suggestedProgQ.isPending;
      } else {
        list = featuredQ.data?.data?.universities ?? homeQ.data?.data?.featured ?? [];
        loading = featuredQ.isPending;
      }
    }

    return { list, loading };
  }, [
    section,
    genList.data,
    genList.isPending,
    excList.data,
    excList.isPending,
    nearQ.data,
    nearQ.isPending,
    nearCoords,
    geoPending,
    trendingQ.data,
    trendingQ.isPending,
    topRatedQ.data,
    topRatedQ.isPending,
    featuredQ.data,
    featuredQ.isPending,
    suggestedLocQ.data,
    suggestedProgQ.data,
    homeQ.data,
    isAuthenticated,
  ]);

  const universities = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = rawUniversities.list;
    if (q) {
      list = list.filter((u) => u.name.toLowerCase().includes(q));
    }
    return sortUniversities(list, sort);
  }, [rawUniversities.list, search, sort]);

  const showToolbar =
    section !== "nearby" || nearCoords != null || geoDenied;

  return (
    <div className="min-h-screen bg-[#FAFAFA] px-6 pb-24 pt-28 dark:bg-[#050505]">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/discover"
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-brand-blue hover:underline"
        >
          <ArrowLeft size={16} /> Back to Discover
        </Link>
        <h1 className="mb-2 text-3xl font-black text-slate-900 dark:text-white">
          {titles[section ?? ""] ?? "Discover"}
        </h1>

        {section === "generation" && (
          <div className="mb-6 flex flex-wrap gap-2">
            {GENERATION_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setGenTab(t.id)}
                className={`rounded-full px-4 py-2 text-sm font-bold ${
                  genTab === t.id
                    ? "bg-brand-blue text-white"
                    : "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-slate-300"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        {section === "excellence" && (
          <div className="mb-6 flex flex-wrap gap-2">
            {EXCELLENCE_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setExcTab(t.id)}
                className={`rounded-full px-4 py-2 text-sm font-bold ${
                  excTab === t.id
                    ? "bg-brand-blue text-white"
                    : "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-slate-300"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        {section === "for-you" && !isAuthenticated && (
          <p className="mb-6 text-sm text-slate-500">
            <button
              type="button"
              className="font-bold text-brand-blue hover:underline"
              onClick={() => openLogin()}
            >
              Sign in
            </button>{" "}
            for program- and climate-based suggestions. Showing featured picks for now.
          </p>
        )}

        {section === "for-you" &&
          isAuthenticated &&
          !rawUniversities.loading &&
          universities.length > 0 &&
          (suggestedLocQ.data?.data?.universities?.length ?? 0) +
            (suggestedProgQ.data?.data?.universities?.length ?? 0) ===
            0 && (
            <p className="mb-6 text-sm text-slate-500">
              Personalized matches need a profile location and program interests.
              Showing featured picks until those are set.{" "}
              <Link to="/account" className="font-bold text-brand-blue hover:underline">
                Update profile
              </Link>
            </p>
          )}

        {section === "nearby" && geoPending && (
          <p className="mb-6 text-sm text-slate-500">Getting your location…</p>
        )}

        {section === "nearby" && geoDenied && !nearCoords && (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-zinc-900">
            <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">
              Location access is off or unavailable. Browse universities sorted by
              popularity instead, or enable location in your browser.
            </p>
            <Link
              to="/universities?filter=nearby"
              className="inline-block rounded-xl bg-brand-blue px-5 py-2.5 text-sm font-bold text-white"
            >
              Browse near-me directory
            </Link>
          </div>
        )}

        {showToolbar && (
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search in this list…"
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-medium dark:border-white/10 dark:bg-zinc-900"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold dark:border-white/10 dark:bg-zinc-900"
            >
              <option value="rating-desc">Highest rated</option>
              <option value="name-asc">Name A–Z</option>
              <option value="name-desc">Name Z–A</option>
            </select>
          </div>
        )}

        <UniGrid
          universities={universities}
          loading={rawUniversities.loading && section !== "nearby"}
        />
      </div>
    </div>
  );
}
