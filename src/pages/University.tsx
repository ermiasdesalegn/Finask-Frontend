import {
  ArrowLeft,
  Award,
  Building2,
  Calendar,
  ExternalLink,
  Globe,
  Heart,
  MapPin,
  Navigation,
  Plane,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUniversityBySlugQuery,
  useUniversityCampusesQuery,
} from "../lib/queries/universities";
import { trackUniversityClick } from "../lib/services/interactionService";
import {
  displayRating,
  formatRatingsQuantityCompact,
  universityCity,
  universityCover,
} from "../lib/universityUi";
import type { University } from "../types";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

const UniversityPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  const universityQuery = useUniversityBySlugQuery(slug);
  const uni =
    (universityQuery.data?.data?.data as University | undefined) ?? null;
  const uniId = uni?._id ?? "";

  const campusesQuery = useUniversityCampusesQuery(uniId || undefined);
  const campuses = campusesQuery.data?.data?.campuses ?? [];

  const loading = universityQuery.isPending;
  const error = universityQuery.isError
    ? universityQuery.error instanceof Error
      ? universityQuery.error.message
      : "Failed to load"
    : null;

  const gallery = useMemo(() => {
    if (!uni) return [];
    const imgs = [
      uni.coverImage,
      ...(uni.images ?? []),
    ].filter(Boolean) as string[];
    return imgs.length ? imgs : [universityCover(uni)];
  }, [uni]);

  const facts = useMemo(() => {
    if (!uni) return [];
    const rows: {
      label: string;
      value: string;
      icon: typeof Award;
    }[] = [];
    const rank = uni.rank?.eduRank?.ethiopiaRank;
    if (rank != null) {
      rows.push({
        label: "Rank",
        value: `#${rank} in Ethiopia`,
        icon: Award,
      });
    }
    const ug = uni.academicProfile?.undergraduateProgramsCount;
    if (ug != null) {
      rows.push({
        label: "UG Programs",
        value: String(ug),
        icon: Building2,
      });
    }
    rows.push({
      label: "Region / City",
      value: universityCity(uni) || "—",
      icon: Globe,
    });
    rows.push({
      label: "Founded",
      value: uni.academicProfile?.yearFounded
        ? String(uni.academicProfile.yearFounded)
        : "—",
      icon: Calendar,
    });
    const nCamp = uni.academicProfile?.numberOfCampuses;
    if (nCamp != null) {
      rows.push({
        label: "Campuses",
        value: String(nCamp),
        icon: Building2,
      });
    }
    rows.push({
      label: "Questions",
      value: String(uni.questionCount ?? 0),
      icon: Sparkles,
    });
    rows.push({
      label: "Rating",
      value: `${displayRating(uni)} (${formatRatingsQuantityCompact(uni.ratingsQuantity)} reviews)`,
      icon: Star,
    });
    rows.push({
      label: "Graduates",
      value:
        uni.academicProfile?.graduatesCount != null
          ? formatRatingsQuantityCompact(uni.academicProfile.graduatesCount)
          : "—",
      icon: Users,
    });
    rows.push({
      label: "Autonomous",
      value: (uni.tags ?? []).includes("autonomous") ? "Yes" : "—",
      icon: ShieldCheck,
    });
    rows.push({
      label: "Airport",
      value: "—",
      icon: Plane,
    });
    rows.push({
      label: "Distance",
      value: "—",
      icon: Navigation,
    });
    return rows;
  }, [uni]);

  const websiteUrl = uni?.contacts?.websiteUrl;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 pb-20 pt-8 dark:bg-[#0a0a0a]">
        <div className="mx-auto max-w-7xl animate-pulse space-y-8 px-6">
          <div className="h-10 w-2/3 rounded-lg bg-slate-200 dark:bg-zinc-800" />
          <div className="grid h-[50vh] gap-4 md:grid-cols-4">
            <div className="md:col-span-2 md:row-span-2 rounded-[2rem] bg-slate-200 dark:bg-zinc-800" />
            <div className="rounded-2xl bg-slate-200 dark:bg-zinc-800" />
            <div className="rounded-2xl bg-slate-200 dark:bg-zinc-800" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !uni) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 pb-20 pt-24 dark:bg-[#0a0a0a]">
        <p className="text-center font-bold text-slate-700 dark:text-slate-300">
          {error || "University not found."}
        </p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-full bg-brand-blue px-6 py-2 font-bold text-white"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 transition-colors duration-300 dark:bg-[#0a0a0a]">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute right-0 top-0 h-[40%] w-[40%] -translate-y-1/2 translate-x-1/4 rounded-full bg-brand-blue/5 blur-[120px] dark:bg-brand-blue/10" />
        <div className="absolute left-0 top-1/2 h-[50%] w-[50%] -translate-x-1/4 translate-y-1/4 rounded-full bg-brand-yellow/5 blur-[120px] dark:bg-brand-yellow/10" />
      </div>

      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200/80 bg-white/80 px-6 py-4 shadow-sm backdrop-blur-xl transition-colors duration-300 dark:border-white/10 dark:bg-zinc-900/80">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="group rounded-full bg-slate-100 p-2.5 transition-all duration-300 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
          >
            <ArrowLeft className="h-5 w-5 text-slate-700 transition-transform group-hover:-translate-x-0.5 dark:text-slate-300" />
          </button>

          <div className="flex flex-grow items-center gap-3">
            <div className="h-6 w-1.5 rounded-full bg-brand-yellow shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
            <h1 className="line-clamp-1 text-xl font-black tracking-tight text-slate-900 dark:text-white md:text-2xl">
              {uni.name}
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setIsFavorite(!isFavorite)}
            className="rounded-full bg-slate-100 p-2.5 shadow-sm transition-all duration-300 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
          >
            <Heart
              className={`h-5 w-5 transition-colors ${
                isFavorite
                  ? "fill-brand-blue text-brand-blue"
                  : "text-slate-700 dark:text-slate-300"
              }`}
            />
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto mt-8 max-w-7xl px-6 lg:px-8">
        <motion.div variants={containerVariants} initial="hidden" animate="show">
          <motion.div
            variants={itemVariants}
            className="mb-12 grid h-[50vh] min-h-[400px] grid-cols-1 gap-3 md:grid-cols-4 md:grid-rows-2 md:gap-4"
          >
            <div className="relative overflow-hidden rounded-[2rem] border-4 border-white shadow-md dark:border-zinc-800/50 md:col-span-2 md:row-span-2">
              <img
                src={gallery[0]}
                alt="Main Campus"
                className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />
            </div>

            {gallery[1] && (
              <div className="relative hidden overflow-hidden rounded-[1.5rem] border-2 border-white shadow-sm dark:border-zinc-800/50 md:block">
                <img
                  src={gallery[1]}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                />
              </div>
            )}
            {gallery[2] && (
              <div className="relative hidden overflow-hidden rounded-[1.5rem] border-2 border-white shadow-sm dark:border-zinc-800/50 md:block">
                <img
                  src={gallery[2]}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                />
              </div>
            )}
            {gallery[3] && (
              <div className="relative hidden cursor-pointer overflow-hidden rounded-[1.5rem] border-2 border-white shadow-sm dark:border-zinc-800/50 md:col-span-2 md:block">
                <img
                  src={gallery[3]}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                />
                <div className="absolute inset-0 flex items-end justify-end bg-black/20 p-4 transition-colors duration-300 hover:bg-black/40">
                  <div className="flex items-center gap-2 rounded-xl bg-white/90 px-4 py-2 text-sm font-bold text-slate-900 shadow-lg backdrop-blur-md transition-transform hover:scale-105 dark:bg-black/70 dark:text-white">
                    View photos <ArrowLeft className="h-4 w-4 rotate-180" />
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            <div className="space-y-12 lg:col-span-2">
              <motion.div variants={itemVariants}>
                <div className="mb-6 flex flex-wrap items-center gap-3 text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-brand-blue dark:bg-zinc-800 dark:text-blue-400">
                    <MapPin className="h-4 w-4" />{" "}
                    {universityCity(uni) || "Ethiopia"}
                  </span>
                  <span className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                    <Star className="h-4 w-4 fill-current" />
                    <span>{displayRating(uni)}</span>
                    <span className="opacity-70">
                      (
                      {formatRatingsQuantityCompact(uni.ratingsQuantity)}{" "}
                      reviews)
                    </span>
                  </span>
                </div>

                <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-gradient-to-br from-blue-50/80 to-amber-50/80 p-6 shadow-sm dark:border-white/5 dark:from-blue-900/10 dark:to-amber-900/10 md:p-8">
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-yellow/10 blur-2xl dark:bg-brand-yellow/5" />

                  <h3 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-900 dark:text-white md:text-xl">
                    <div className="rounded-xl bg-white p-2 shadow-sm dark:bg-zinc-800">
                      <Sparkles className="h-5 w-5 text-brand-blue" />
                    </div>
                    Overview
                  </h3>
                  <p className="relative z-10 text-base font-medium leading-relaxed text-slate-700 dark:text-slate-300">
                    {uni.overview}
                  </p>
                  {websiteUrl && (
                    <a
                      href={websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() =>
                        uniId &&
                        trackUniversityClick(uniId, "clickOfficialWebsite")
                      }
                      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-blue px-5 py-2.5 text-sm font-black text-white transition-colors hover:bg-blue-700"
                    >
                      Official website <ExternalLink size={16} />
                    </a>
                  )}
                  {uni.socialLinks && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {Object.entries(uni.socialLinks).map(([key, url]) =>
                        url ? (
                          <a
                            key={key}
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() =>
                              uniId &&
                              trackUniversityClick(uniId, "clickSocialLink")
                            }
                            className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-bold capitalize text-brand-blue hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5"
                          >
                            {key}
                          </a>
                        ) : null
                      )}
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="mb-2 flex items-center gap-4">
                  <div className="h-8 w-2 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]" />
                  <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white md:text-3xl">
                    Explore Campuses
                  </h2>
                </div>
                <p className="mb-8 font-medium text-slate-500 dark:text-slate-400">
                  Browse specialized schools and campus locations.
                </p>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {campuses.length === 0 && (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      No campus listings available yet.
                    </p>
                  )}
                  {campuses.map((campus) => (
                    <div
                      key={campus._id}
                      className="group flex cursor-pointer flex-col rounded-[2rem] border border-slate-200/80 bg-white p-2 transition-all duration-300 hover:border-brand-blue/30 hover:shadow-xl hover:shadow-brand-blue/5 dark:border-white/5 dark:bg-zinc-900/80"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-slate-100 dark:bg-zinc-800">
                        <img
                          src={
                            campus.coverImage ||
                            campus.images?.[0] ||
                            universityCover(uni)
                          }
                          alt={campus.name}
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </div>

                      <div className="flex flex-grow flex-col p-4 pt-3">
                        <h3 className="mb-2 line-clamp-1 text-lg font-black text-slate-900 transition-colors group-hover:text-brand-blue dark:text-white">
                          {campus.name}
                        </h3>
                        <div className="mt-auto flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                          <MapPin className="h-3.5 w-3.5 text-brand-blue" />
                          <span>
                            {campus.address?.fullAddress ||
                              campus.address?.city ||
                              "—"}
                          </span>
                          {campus.ratingsAverage != null && (
                            <>
                              <span className="mx-1 text-slate-300 dark:text-zinc-700">
                                •
                              </span>
                              <Star className="h-3.5 w-3.5 fill-current text-brand-yellow" />
                              <span className="text-slate-700 dark:text-slate-300">
                                {campus.ratingsAverage.toFixed(1)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="lg:col-span-1">
              <div className="sticky top-28 rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-xl shadow-slate-200/40 backdrop-blur-xl transition-colors duration-300 dark:border-white/5 dark:bg-zinc-900/90 dark:shadow-none">
                <div className="mb-6 flex items-center gap-3">
                  <div className="h-6 w-1.5 rounded-full bg-brand-yellow shadow-[0_0_10px_#facc15]" />
                  <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                    Key Facts
                  </h3>
                </div>

                <div className="mb-8 grid grid-cols-2 gap-3">
                  {facts.map((fact, index) => {
                    const Icon = fact.icon;
                    return (
                      <div
                        key={index}
                        className="flex flex-col gap-1.5 rounded-[1.25rem] border border-slate-100 bg-slate-50 p-3 dark:border-white/5 dark:bg-zinc-800/50"
                      >
                        <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                          <Icon
                            size={14}
                            className="text-brand-blue dark:text-blue-400"
                          />
                          <span className="text-[10px] font-bold uppercase tracking-widest">
                            {fact.label}
                          </span>
                        </div>
                        <span className="line-clamp-2 text-sm font-black leading-tight text-slate-800 dark:text-slate-200">
                          {fact.value}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-3 border-t border-slate-100 pt-6 dark:border-zinc-800">
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-[1.5rem] bg-brand-blue py-4 font-black text-white shadow-lg shadow-brand-blue/30 transition-all hover:-translate-y-0.5 hover:bg-blue-700 active:scale-95"
                  >
                    Start Application
                  </button>
                  <button
                    type="button"
                    className="w-full rounded-[1.5rem] border-2 border-slate-200 bg-white py-3.5 font-bold text-slate-700 transition-colors hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
                  >
                    Compare University
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default UniversityPage;
