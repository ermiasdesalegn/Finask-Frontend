import ComparisonEngine from "../components/home/ComparisonEngine";
import EthiopiaMap from "../components/home/EthiopiaMap";
import Hero from "../components/home/Hero";
import HomeHighlights from "../components/home/HomeHighlights";
import { useAuth } from "../context/AuthContext";
import { pickUniversitiesForMap } from "../lib/home/mapUniversitiesFromHome";
import { useHomePageQuery } from "../lib/queries";

function SectionSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-3xl bg-slate-100 dark:bg-zinc-800 ${className ?? "h-48"}`}
    />
  );
}

const HomePage = () => {
  const { token } = useAuth();
  const tokenFp = token ? "auth" : "guest";

  const { data, isPending, isError, error } = useHomePageQuery(tokenFp);
  const home = data?.data ?? null;
  const loading = isPending;
  const errorMessage = isError
    ? error instanceof Error
      ? error.message
      : "Failed to load"
    : null;
  const mapUniversities = pickUniversitiesForMap(home);

  return (
    <>
      <Hero home={home} loading={loading} />
      {errorMessage && (
        <p className="mx-auto max-w-7xl px-6 pb-4 text-center text-sm font-medium text-red-600 dark:text-red-400">
          {errorMessage}
        </p>
      )}
      {loading && !home ? (
        <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
          <SectionSkeleton className="h-[28rem]" />
          <SectionSkeleton className="h-96" />
          <SectionSkeleton className="h-72" />
        </div>
      ) : (
        <>
          <EthiopiaMap universities={mapUniversities} loading={loading} />
          <HomeHighlights home={home} loading={loading} />
          <ComparisonEngine
            universities={(home?.topRated ?? []).slice(0, 3)}
            loading={loading}
          />
        </>
      )}
    </>
  );
};

export default HomePage;
