import {
  ArrowLeft,
  Award,
  BookOpen,
  Building2,
  Calendar,
  ExternalLink,
  GitCompare,
  Globe,
  Heart,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Star,
  ThumbsUp,
  Trophy,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import React, { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import QuestionsSection from "../components/community/QuestionsSection";
import ReviewsSection from "../components/community/ReviewsSection";
import FavoriteButton from "../components/favorites/FavoriteButton";
import CollapsibleSection from "../components/shared/CollapsibleSection";
import EntityMap from "../components/shared/EntityMap";
import GalleryModal from "../components/shared/GalleryModal";
import { SuggestedUniversitiesRow } from "../components/shared/SuggestedRow";
import { PROGRAM_IMAGE_FALLBACK } from "../constants/defaultMediaFallbacks";
import {
  PROGRAM_FIELD_LABELS,
} from "../constants/programFieldStyles";
import { useAuth } from "../context/AuthContext";
import { useCompare } from "../context/CompareContext";
import { showApiToast } from "../lib/api";
import { staggerBlurContainer, staggerBlurItem } from "../lib/motion/pageMotion";
import {
  useSuggestedByLocationQuery,
  useSuggestedByProgramQuery,
  useUniversityBySlugQuery,
  useUniversityCampusesQuery,
  useUniversityProgramsQuery,
} from "../lib/queries/universities";
import { trackUniversityClick } from "../lib/services/interactionService";
import {
  displayRating,
  formatRatingsQuantityCompact,
  universityCity,
  universityCityId,
  universityCover,
} from "../lib/universityUi";
import type { City, Program, University } from "../types";

const containerVariants = staggerBlurContainer;
const itemVariants = staggerBlurItem;

const StarRow = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} size={12} className={s <= Math.round(rating) ? "fill-brand-yellow text-brand-yellow" : "text-slate-300 dark:text-zinc-600"} />
    ))}
  </div>
);

const UniversityPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { add, remove, contains } = useCompare();
  const { isAuthenticated } = useAuth();

  const universityQuery = useUniversityBySlugQuery(slug);
  const uni = (universityQuery.data as University | undefined) ?? null;
  const uniId = uni?._id ?? "";
  const inCompareList = uniId ? contains(uniId) : false;

  const campusesQuery = useUniversityCampusesQuery(uniId || undefined);
  const campuses = campusesQuery.data?.data?.campuses ?? [];

  const programsQuery = useUniversityProgramsQuery(uniId || undefined);
  const programRows = programsQuery.data?.data?.universityprograms ?? [];
  const programCards = useMemo(
    () =>
      programRows.filter(
        (row) =>
          typeof row.program === "object" &&
          row.program != null &&
          typeof (row.program as Program).name === "string"
      ),
    [programRows]
  );

  const loading = universityQuery.isPending;
  const error = universityQuery.isError
    ? universityQuery.error instanceof Error ? universityQuery.error.message : "Failed to load"
    : null;

  const suggestedLocQ = useSuggestedByLocationQuery(
    isAuthenticated && Boolean(uniId)
  );
  const suggestedProgQ = useSuggestedByProgramQuery(
    isAuthenticated && Boolean(uniId)
  );
  const [galleryOpen, setGalleryOpen] = useState(false);

  const suggestedUnis = useMemo(() => {
    const a = suggestedLocQ.data?.data?.universities ?? [];
    const b = suggestedProgQ.data?.data?.universities ?? [];
    const seen = new Set<string>();
    return [...a, ...b].filter((u) => {
      const id = u._id ?? u.slug;
      if (!id || id === uniId || seen.has(id)) return false;
      seen.add(id);
      return true;
    }).slice(0, 8);
  }, [suggestedLocQ.data, suggestedProgQ.data, uniId]);

  const gallery = useMemo(() => {
    if (!uni) return [];
    const seen = new Set<string>();
    const imgs: string[] = [];
    for (const src of [uni.coverImage, ...(uni.images ?? [])]) {
      const s = src?.trim();
      if (s && !seen.has(s)) { seen.add(s); imgs.push(s); }
    }
    return imgs.length ? imgs : [universityCover(uni as University)];
  }, [uni]);

  const reviews: any[] = uni?.reviews ?? [];
  const eduRank = uni?.rank?.eduRank;
  const uniRank = uni?.rank?.uniRank;
  const contacts = uni?.contacts ?? {};
  const address = uni?.address ?? {};
  const tags: string[] = uni?.tagsDisplayNames ?? uni?.tags ?? [];
  const bestKnownFor: string[] = uni?.bestKnownFor ?? [];

  if (loading) {
    return (
      <div className="min-h-screen pb-20 pt-8 dark:bg-[#0a0a0a]">
        <div className="mx-auto max-w-7xl animate-pulse space-y-6 px-6">
          <div className="h-10 w-2/3 rounded-xl bg-slate-200 dark:bg-zinc-800" />
          <div className="h-[50vh] rounded-3xl bg-slate-200 dark:bg-zinc-800" />
          <div className="grid grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="h-32 rounded-2xl bg-slate-200 dark:bg-zinc-800" />)}
          </div>
        </div>
      </div>
    );
  }

  if (error || !uni) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 dark:bg-[#0a0a0a]">
        <p className="font-bold text-slate-700 dark:text-slate-300">{error || "University not found."}</p>
        <button type="button" onClick={() => navigate(-1)} className="rounded-full bg-brand-blue px-6 py-2 font-bold text-white">Go back</button>
      </div>
    );
  }

  const cityNavId = universityCityId(uni);
  const cityDoc =
    typeof uni.city === "object" && uni.city != null ? (uni.city as City) : null;
  const elevationZone =
    cityDoc?.climate?.elevationZone &&
    typeof cityDoc.climate.elevationZone === "object"
      ? (cityDoc.climate.elevationZone as { slug?: string; name?: string })
      : null;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 transition-colors dark:bg-[#0a0a0a]">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute right-0 top-0 h-[40%] w-[40%] -translate-y-1/2 translate-x-1/4 rounded-full bg-brand-blue/5 blur-[120px] dark:bg-brand-blue/10" />
        <div className="absolute left-0 top-1/2 h-[50%] w-[50%] -translate-x-1/4 rounded-full bg-brand-yellow/5 blur-[120px] dark:bg-brand-yellow/10" />
      </div>

      {/* Sticky header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 px-6 py-4 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/80">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-4">
          <button type="button" onClick={() => navigate(-1)}
            className="group rounded-full bg-slate-100 p-2.5 transition-all hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700">
            <ArrowLeft className="h-5 w-5 text-slate-700 transition-transform group-hover:-translate-x-0.5 dark:text-slate-300" />
          </button>
          <div className="flex flex-grow items-center gap-3">
            <div className="h-6 w-1.5 rounded-full bg-brand-yellow shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
            <div className="min-w-0 flex-1">
              <h1 className="line-clamp-1 text-xl font-black tracking-tight text-slate-900 dark:text-white md:text-2xl">
                {uni.name}
              </h1>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold text-slate-500 dark:text-slate-400">
                {eduRank?.ethiopiaRank != null && (
                  <span>ET Rank #{eduRank.ethiopiaRank}</span>
                )}
                <span>{displayRating(uni as University)} rating</span>
                {tags[0] && <span>{tags[0]}</span>}
                {uni.academicProfile?.abbreviation && (
                  <span>{uni.academicProfile.abbreviation}</span>
                )}
                {uni.academicProfile?.yearFounded != null && (
                  <span>Est. {uni.academicProfile.yearFounded}</span>
                )}
                {uni.academicProfile?.numberOfCampuses != null && (
                  <span>{uni.academicProfile.numberOfCampuses} campuses</span>
                )}
                {cityDoc?.name && <span>{cityDoc.name}</span>}
                {cityDoc?.climate?.climateTag && (
                  <span className="text-brand-blue">{cityDoc.climate.climateTag}</span>
                )}
              </div>
            </div>
          </div>
          <button
            type="button"
            title={inCompareList ? "Remove from compare" : "Add to compare"}
            onClick={() => {
              if (!uniId) return;
              if (inCompareList) {
                remove(uniId);
                return;
              }
              const r = add(uniId);
              if (r === "max") {
                showApiToast(
                  "Compare list is full (max 3). Remove one from the list first."
                );
              }
            }}
            className="rounded-full bg-slate-100 p-2.5 transition-all hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
          >
            <GitCompare
              className={`h-5 w-5 transition-colors ${
                inCompareList
                  ? "text-brand-blue"
                  : "text-slate-700 dark:text-slate-300"
              }`}
            />
          </button>
          {uniId && (
            <FavoriteButton itemId={uniId} onModel="University" className="!bg-slate-100 dark:!bg-zinc-800" />
          )}
        </div>
      </header>

      <main className="relative z-10 mx-auto mt-8 max-w-7xl px-6 lg:px-8">
        <motion.div variants={containerVariants} initial="hidden" animate="show">

          {/* Gallery */}
          <motion.div variants={itemVariants}
            className="relative mb-10 grid min-h-[360px] grid-cols-1 gap-3 md:grid-cols-2 md:gap-3" style={{ height: 'clamp(360px, 55vh, 520px)' }}>

            {/* Big left image */}
            <button
              type="button"
              onClick={() => setGalleryOpen(true)}
              className="relative overflow-hidden rounded-[2rem] border-4 border-white shadow-md dark:border-zinc-800/50"
            >
              <img src={gallery[0]} alt={uni.name} className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
              {uni.isFeatured && (
                <div className="absolute left-4 top-4 rounded-full bg-brand-yellow px-3 py-1 text-[10px] font-black uppercase tracking-widest text-black">Featured</div>
              )}
            </button>

            {/* Right 2×2 grid */}
            <div className="hidden grid-cols-2 grid-rows-2 gap-3 md:grid">
              {[1, 2, 3, 4].map((i) =>
                gallery[i] ? (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setGalleryOpen(true)}
                    className="relative overflow-hidden rounded-[1.2rem] border-2 border-white shadow-sm dark:border-zinc-800/50"
                  >
                    <img src={gallery[i]} alt="" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
                    {i === 4 && gallery.length > 5 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <span className="text-lg font-black text-white">+{gallery.length - 5} more</span>
                      </div>
                    )}
                  </button>
                ) : (
                  <div key={i} className="rounded-[1.2rem] bg-slate-100 dark:bg-zinc-800" />
                )
              )}
            </div>

            <button
              type="button"
              onClick={() => setGalleryOpen(true)}
              className="absolute bottom-4 right-4 z-10 rounded-full bg-white/90 px-4 py-2 text-xs font-black text-slate-900 shadow-lg backdrop-blur hover:bg-white dark:bg-zinc-900/90 dark:text-white"
            >
              View gallery
            </button>
          </motion.div>
          <GalleryModal
            images={gallery}
            title={uni.name}
            open={galleryOpen}
            onClose={() => setGalleryOpen(false)}
          />

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            {/* Left column */}
            <div className="space-y-10 lg:col-span-2">

              {/* Meta chips */}
              <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-sm font-bold text-brand-blue dark:bg-zinc-800 dark:text-blue-400">
                  <MapPin size={14} /> {address.fullAddress || universityCity(uni as University) || "Ethiopia"}
                </span>
                <span className="flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                  <Star size={14} className="fill-current" /> {displayRating(uni as University)}
                  <span className="opacity-70">({formatRatingsQuantityCompact(uni.ratingsQuantity)} reviews)</span>
                </span>
                {tags.map((t: string) => (
                  <span key={t} className="rounded-xl border border-slate-200/80 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 dark:border-white/10 dark:bg-zinc-800 dark:text-slate-300">{t}</span>
                ))}
              </motion.div>

              {/* Overview */}
              <motion.div variants={itemVariants}
                className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-gradient-to-br from-blue-50/80 to-amber-50/80 p-6 shadow-sm dark:border-white/5 dark:from-blue-900/10 dark:to-amber-900/10 md:p-8">
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-yellow/10 blur-2xl" />
                <h3 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-900 dark:text-white">
                  <div className="rounded-xl bg-white p-2 shadow-sm dark:bg-zinc-800"><Sparkles className="h-5 w-5 text-brand-blue" /></div>
                  Overview
                </h3>
                <p className="relative z-10 text-base font-medium leading-relaxed text-slate-700 dark:text-slate-300">{uni.overview}</p>

                {bestKnownFor.length > 0 && (
                  <div className="mt-5">
                    <p className="mb-2 text-xs font-black uppercase tracking-widest text-slate-400">Best known for</p>
                    <div className="flex flex-wrap gap-2">
                      {bestKnownFor.map((b: string) => (
                        <span key={b} className="rounded-lg bg-brand-blue/10 px-3 py-1 text-xs font-bold text-brand-blue dark:bg-brand-blue/20">{b}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex flex-wrap gap-3">
                  {contacts.websiteUrl && (
                    <a href={contacts.websiteUrl} target="_blank" rel="noreferrer"
                      onClick={() => uniId && trackUniversityClick(uniId, "clickOfficialWebsite")}
                      className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-5 py-2.5 text-sm font-black text-white transition-colors hover:bg-blue-700">
                      Official website <ExternalLink size={14} />
                    </a>
                  )}
                  {uni.wikipediaLink && (
                    <a href={uni.wikipediaLink} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5">
                      Wikipedia <ExternalLink size={14} />
                    </a>
                  )}
                </div>

                {uni.socialLinks && Object.keys(uni.socialLinks).length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {Object.entries(uni.socialLinks).map(([key, url]) =>
                      url ? (
                        <a key={key} href={url as string} target="_blank" rel="noreferrer"
                          onClick={() => uniId && trackUniversityClick(uniId, "clickSocialLink")}
                          className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-bold capitalize text-brand-blue hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5">
                          {key}
                        </a>
                      ) : null
                    )}
                  </div>
                )}
              </motion.div>

              {/* Programs offered at this university */}
              <motion.div variants={itemVariants}>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-1.5 rounded-full bg-violet-500" />
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">
                      Programs offered
                    </h2>
                  </div>
                  {!programsQuery.isPending && programCards.length > 0 ? (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-zinc-800 dark:text-slate-400">
                      {programCards.length}{" "}
                      {programCards.length === 1 ? "program" : "programs"}
                    </span>
                  ) : null}
                </div>
                {programsQuery.isPending ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-24 animate-pulse rounded-2xl bg-slate-100 dark:bg-zinc-800"
                      />
                    ))}
                  </div>
                ) : programsQuery.isError ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Could not load programs. Try again later.
                  </p>
                ) : programCards.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    No programs are linked to this university in the directory yet.
                  </p>
                ) : (
                  <CollapsibleSection
                    items={programCards}
                    limit={6}
                    renderItem={(row) => {
                      const prog = row.program as Program;
                      const progSlug =
                        prog.slug?.trim() || prog._id?.trim() || prog.id?.trim();
                      const href = progSlug
                        ? `/programs/${encodeURIComponent(progSlug)}`
                        : "/programs";
                      const fieldLabel =
                        PROGRAM_FIELD_LABELS[prog.field] ??
                        prog.fieldDisplayName ??
                        prog.field;
                      const thumb =
                        prog.coverImage?.trim() || PROGRAM_IMAGE_FALLBACK;
                      return (
                        <Link
                          key={row._id}
                          to={href}
                          className="group flex gap-3 rounded-2xl border border-slate-200/70 bg-white/90 p-3 transition-all hover:border-brand-blue/35 hover:shadow-md dark:border-white/10 dark:bg-zinc-900/80"
                        >
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-zinc-800">
                            <img
                              src={thumb}
                              alt=""
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 font-black text-slate-900 transition-colors group-hover:text-brand-blue dark:text-white">
                              {prog.name}
                            </p>
                            <p className="mt-0.5 line-clamp-1 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                              {fieldLabel}
                            </p>
                          </div>
                        </Link>
                      );
                    }}
                  />
                )}
                <div className="mt-4">
                  <Link
                    to="/programs"
                    className="text-sm font-bold text-brand-blue hover:underline"
                  >
                    Browse all programs →
                  </Link>
                </div>
              </motion.div>

              {cityDoc && (
                <motion.div variants={itemVariants}>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-6 w-1.5 rounded-full bg-emerald-500" />
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">City</h2>
                  </div>
                  <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 dark:border-white/5 dark:bg-zinc-900/80">
                    <Link
                      to={`/cities/${cityDoc._id ?? cityNavId}`}
                      className="text-lg font-black text-brand-blue hover:underline"
                    >
                      {cityDoc.name}
                    </Link>
                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300">
                      {cityDoc.cityProfile?.population != null && (
                        <span>
                          <span className="font-bold text-slate-400">Population:</span>{" "}
                          {cityDoc.cityProfile.population.toLocaleString()}
                        </span>
                      )}
                      {(cityDoc.regionDisplayName ?? cityDoc.region) && (
                        <span>
                          <span className="font-bold text-slate-400">Region:</span>{" "}
                          {cityDoc.regionDisplayName ?? cityDoc.region}
                        </span>
                      )}
                      {cityDoc.cityProfile?.elevation != null && (
                        <span>
                          <span className="font-bold text-slate-400">Elevation:</span>{" "}
                          {cityDoc.cityProfile.elevation} m
                        </span>
                      )}
                    </div>
                    {cityNavId && (
                      <button
                        type="button"
                        onClick={() => navigate(`/cities/${cityNavId}`)}
                        className="mt-4 text-sm font-bold text-brand-blue hover:underline"
                      >
                        Explore {cityDoc.name} →
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Rankings */}
              <motion.div variants={itemVariants}>
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-6 w-1.5 rounded-full bg-brand-blue" />
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">Rankings</h2>
                </div>
                {!eduRank && !uniRank ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Ranking data not available for this university yet.
                  </p>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {eduRank && (
                      <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 dark:border-white/5 dark:bg-zinc-900/80">
                        <div className="mb-3 flex items-center gap-2">
                          <Trophy size={16} className="text-brand-yellow" />
                          <p className="text-xs font-black uppercase tracking-widest text-slate-400">EduRank {eduRank.year}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div><p className="text-xl font-black text-brand-blue">#{eduRank.ethiopiaRank}</p><p className="text-[10px] text-slate-400">Ethiopia<br/>/{eduRank.ethiopiaTotal}</p></div>
                          <div><p className="text-xl font-black text-slate-700 dark:text-slate-200">#{eduRank.africaRank}</p><p className="text-[10px] text-slate-400">Africa<br/>/{eduRank.africaTotal}</p></div>
                          <div><p className="text-xl font-black text-slate-500">#{eduRank.worldRank}</p><p className="text-[10px] text-slate-400">World<br/>/{eduRank.worldTotal}</p></div>
                        </div>
                        {eduRank.sourceUrl && (
                          <a href={eduRank.sourceUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-brand-blue hover:underline">Source <ExternalLink size={10} /></a>
                        )}
                      </div>
                    )}
                    {uniRank && (
                      <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 dark:border-white/5 dark:bg-zinc-900/80">
                        <div className="mb-3 flex items-center gap-2">
                          <Award size={16} className="text-brand-blue" />
                          <p className="text-xs font-black uppercase tracking-widest text-slate-400">4ICU UniRank {uniRank.year}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div><p className="text-xl font-black text-brand-blue">#{uniRank.ethiopiaRank}</p><p className="text-[10px] text-slate-400">Ethiopia<br/>/{uniRank.ethiopiaTotal}</p></div>
                          <div><p className="text-xl font-black text-slate-700 dark:text-slate-200">#{uniRank.africaRank}</p><p className="text-[10px] text-slate-400">Africa<br/>/{uniRank.africaTotal}</p></div>
                          <div><p className="text-xl font-black text-slate-500">#{uniRank.worldRank}</p><p className="text-[10px] text-slate-400">World<br/>/{uniRank.worldTotal}</p></div>
                        </div>
                        {uniRank.sourceUrl && (
                          <a href={uniRank.sourceUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-brand-blue hover:underline">Source <ExternalLink size={10} /></a>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>

              {/* Campuses */}
              <motion.div variants={itemVariants}>
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-6 w-1.5 rounded-full bg-green-500" />
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">Campuses</h2>
                </div>
                {campuses.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">No campus listings available yet.</p>
                ) : (
                  <CollapsibleSection
                    items={campuses}
                    limit={4}
                    gridClassName="grid grid-cols-2 gap-3 md:grid-cols-3"
                    renderItem={(campus: {
                      _id: string;
                      name: string;
                      slug?: string;
                      coverImage?: string;
                      images?: string[];
                      address?: { fullAddress?: string; city?: string };
                    }) => {
                      const campusHref = campus._id
                        ? `/campuses/${encodeURIComponent(campus._id)}`
                        : "/campuses";
                      return (
                        <Link
                          key={campus._id}
                          to={campusHref}
                          className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all hover:border-brand-blue/30 hover:shadow-md dark:border-white/5 dark:bg-zinc-900/80"
                        >
                          <div className="relative aspect-[3/2] overflow-hidden bg-slate-100 dark:bg-zinc-800">
                            <img
                              src={
                                campus.coverImage ||
                                campus.images?.[0] ||
                                universityCover(uni as University)
                              }
                              alt={campus.name}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <div className="p-3">
                            <h3 className="line-clamp-1 text-sm font-black text-slate-900 group-hover:text-brand-blue dark:text-white">
                              {campus.name}
                            </h3>
                          </div>
                        </Link>
                      );
                    }}
                  />
                )}
              </motion.div>

              {cityDoc?.climate &&
                (cityDoc.climate.summary ||
                  cityDoc.climate.detail ||
                  cityDoc.climate.climateTag) && (
                <motion.div variants={itemVariants}>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-6 w-1.5 rounded-full bg-teal-500" />
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">Climate</h2>
                  </div>
                  <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 dark:border-white/5 dark:bg-zinc-900/80">
                    {cityDoc.climate.climateTag && (
                      <p className="text-sm font-bold text-brand-blue">
                        {cityDoc.climate.climateTag}
                      </p>
                    )}
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      {cityDoc.climate.detail || cityDoc.climate.summary}
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                      {cityDoc.climate.hottestMonth && (
                        <div className="rounded-xl border border-orange-100 bg-orange-50/80 p-3 dark:border-orange-900/30 dark:bg-orange-900/20">
                          <p className="text-[10px] font-black uppercase tracking-widest text-orange-500">
                            Hottest
                          </p>
                          <p className="font-black text-orange-800 dark:text-orange-200">
                            {cityDoc.climate.hottestMonth.month} ·{" "}
                            {cityDoc.climate.hottestMonth.value}°C
                          </p>
                        </div>
                      )}
                      {cityDoc.climate.coldestMonth && (
                        <div className="rounded-xl border border-blue-100 bg-blue-50/80 p-3 dark:border-blue-900/30 dark:bg-blue-900/20">
                          <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">
                            Coldest
                          </p>
                          <p className="font-black text-blue-800 dark:text-blue-200">
                            {cityDoc.climate.coldestMonth.month} ·{" "}
                            {cityDoc.climate.coldestMonth.value}°C
                          </p>
                        </div>
                      )}
                      {cityDoc.climate.minTemperature != null &&
                        cityDoc.climate.maxTemperature != null && (
                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 sm:col-span-2 dark:border-white/10 dark:bg-zinc-800">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                              Typical range
                            </p>
                            <p className="font-black text-slate-800 dark:text-slate-200">
                              {cityDoc.climate.minTemperature}°C –{" "}
                              {cityDoc.climate.maxTemperature}°C
                            </p>
                          </div>
                        )}
                    </div>
                    {cityDoc.climate.climateWebLinks &&
                      cityDoc.climate.climateWebLinks.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {cityDoc.climate.climateWebLinks.map((link) =>
                            link.url ? (
                              <a
                                key={link.url}
                                href={link.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 rounded-full border border-slate-200/80 px-3 py-1.5 text-xs font-bold text-brand-blue dark:border-white/10"
                              >
                                {link.name ?? "Climate source"}{" "}
                                <ExternalLink size={12} />
                              </a>
                            ) : null
                          )}
                        </div>
                      )}
                    {elevationZone?.slug && (
                      <Link
                        to={`/elevation-zones/${elevationZone.slug}`}
                        className="mt-4 inline-block text-sm font-bold text-brand-blue hover:underline"
                      >
                        View elevation zone →
                      </Link>
                    )}
                  </div>
                </motion.div>
              )}

              <motion.div variants={itemVariants}>
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-6 w-1.5 rounded-full bg-emerald-500" />
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">View on map</h2>
                </div>
                <EntityMap
                  coordinates={uni.location?.coordinates}
                  label={uni.name}
                />
              </motion.div>

              {isAuthenticated ? (
                <SuggestedUniversitiesRow
                  title="Suggested for you"
                  subtitle="Based on your interests and location"
                  universities={suggestedUnis}
                  loading={suggestedLocQ.isPending || suggestedProgQ.isPending}
                  viewAllHref="/discover/for-you"
                />
              ) : (
                <motion.div
                  variants={itemVariants}
                  className="rounded-2xl border border-dashed border-brand-blue/30 bg-brand-blue/5 p-6 text-center dark:bg-brand-blue/10"
                >
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    Sign in for personalized university picks matched to your profile.
                  </p>
                  <Link
                    to="/discover/for-you"
                    className="mt-3 inline-block rounded-xl bg-brand-blue px-5 py-2.5 text-sm font-black text-white"
                  >
                    Explore personalized picks
                  </Link>
                </motion.div>
              )}

              {uniId && (
                <motion.div variants={itemVariants}>
                  <ReviewsSection
                    parentType="university"
                    parentId={uniId}
                    initialReviews={reviews}
                  />
                  <QuestionsSection
                    parentType="university"
                    parentId={uniId}
                    initialQuestions={uni.questions}
                  />
                </motion.div>
              )}
            </div>

            {/* Right sidebar */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <div className="sticky top-28 space-y-4 rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-xl shadow-slate-200/40 backdrop-blur-xl dark:border-white/5 dark:bg-zinc-900/90 dark:shadow-none">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-1.5 rounded-full bg-brand-yellow shadow-[0_0_10px_#facc15]" />
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Key Facts</h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Award, label: "ET Rank", value: eduRank?.ethiopiaRank ? `#${eduRank.ethiopiaRank} / ${eduRank.ethiopiaTotal}` : "—" },
                    { icon: Star, label: "Rating", value: `${displayRating(uni as University)} (${formatRatingsQuantityCompact(uni.ratingsQuantity)})` },
                    { icon: Building2, label: "UG Programs", value: uni.academicProfile?.undergraduateProgramsCount ?? "—" },
                    { icon: Calendar, label: "Founded", value: uni.academicProfile?.yearFounded ?? "—" },
                    { icon: Building2, label: "Campuses", value: uni.academicProfile?.numberOfCampuses ?? "—" },
                    { icon: Users, label: "Graduates", value: uni.academicProfile?.graduatesCount ? formatRatingsQuantityCompact(uni.academicProfile.graduatesCount) : "—" },
                    { icon: BookOpen, label: "Questions", value: uni.questionCount ?? 0 },
                    { icon: Globe, label: "Abbrev.", value: uni.academicProfile?.abbreviation ?? "—" },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex flex-col gap-1 rounded-[1.25rem] border border-slate-100 bg-slate-50 p-3 dark:border-white/5 dark:bg-zinc-800/50">
                      <div className="flex items-center gap-1 text-slate-400">
                        <Icon size={12} className="text-brand-blue" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
                      </div>
                      <span className="text-sm font-black text-slate-800 dark:text-slate-200">{String(value)}</span>
                    </div>
                  ))}
                </div>

                {/* Contact */}
                {(contacts.emails?.length > 0 || contacts.phoneNumbers?.length > 0) && (
                  <div className="space-y-2 border-t border-slate-100 pt-4 dark:border-zinc-800">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Contact</p>
                    {contacts.emails?.slice(0, 2).map((e: string) => (
                      <a key={e} href={`mailto:${e}`} className="flex items-center gap-2 text-xs font-medium text-brand-blue hover:underline">
                        <Mail size={12} /> {e}
                      </a>
                    ))}
                    {contacts.phoneNumbers?.slice(0, 2).map((p: string) => (
                      <a key={p} href={`tel:${p}`} className="flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-brand-blue dark:text-slate-400">
                        <Phone size={12} /> {p}
                      </a>
                    ))}
                  </div>
                )}

                {/* Address */}
                {address.fullAddress && (
                  <div className="flex items-start gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500 dark:border-zinc-800 dark:text-slate-400">
                    <MapPin size={12} className="mt-0.5 shrink-0 text-brand-blue" />
                    <span>{address.fullAddress}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-3 border-t border-slate-100 pt-4 dark:border-zinc-800">
                  {cityNavId && (
                    <button type="button" onClick={() => navigate(`/cities/${cityNavId}`)}
                      className="flex w-full items-center justify-center gap-2 rounded-[1.5rem] border-2 border-brand-blue bg-white py-3 font-bold text-brand-blue transition-colors hover:bg-brand-blue hover:text-white dark:bg-transparent dark:hover:bg-brand-blue">
                      <MapPin size={15} /> View City
                    </button>
                  )}
                  {contacts.websiteUrl && (
                    <a href={contacts.websiteUrl} target="_blank" rel="noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-[1.5rem] bg-brand-blue py-3.5 font-black text-white shadow-lg shadow-brand-blue/30 transition-all hover:-translate-y-0.5 hover:bg-blue-700">
                      Official Website <ExternalLink size={15} />
                    </a>
                  )}
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
