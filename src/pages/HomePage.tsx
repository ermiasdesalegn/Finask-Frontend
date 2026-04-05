import { motion } from "motion/react";
import ComparisonEngine from "../components/home/ComparisonEngine";
import EthiopiaMap from "../components/home/EthiopiaMap";
import Hero from "../components/home/Hero";
import HomeHighlights from "../components/home/HomeHighlights";
import { useAuth } from "../context/AuthContext";
import { blurReveal, viewportOnce } from "../lib/motion/pageMotion";
import { useHomePageQuery, useUniversitiesListQuery } from "../lib/queries";

function SectionSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-3xl bg-slate-100 dark:bg-zinc-800 ${className ?? "h-48"}`}
    />
  );
}

const HomePage = () => {
  const { isAuthenticated, sessionStatus } = useAuth();
  const tokenFp =
    sessionStatus === "loading"
      ? "bootstrapping"
      : isAuthenticated
        ? "auth"
        : "guest";

  const { data, isPending, isError, error } = useHomePageQuery(tokenFp);
  const home = data?.data ?? null;
  const loading = isPending;

  // Dedicated universities query for the map — needs location coordinates
  const mapQuery = useUniversitiesListQuery({ limit: 60, sort: "-ratingsAverage" });
  const mapUniversities = mapQuery.data?.data?.universities ?? [];

  const errorMessage = isError
    ? error instanceof Error
      ? error.message
      : "Failed to load"
    : null;

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
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={blurReveal}
          >
            <EthiopiaMap universities={mapUniversities} loading={mapQuery.isPending} />
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={blurReveal}
          >
            <HomeHighlights home={home} loading={loading} />
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={blurReveal}
          >
            <ComparisonEngine
              universities={(home?.topRated ?? []).slice(0, 3)}
              loading={loading}
            />
          </motion.div>
        </>
      )}
    </>
  );
};

export default HomePage;
