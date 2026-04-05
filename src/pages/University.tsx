import {
  ArrowLeft,
  Award,
  BookOpen,
  Building2,
  Calendar,
  ExternalLink,
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
import {
  PROGRAM_FIELD_LABELS,
} from "../constants/programFieldStyles";
import { staggerBlurContainer, staggerBlurItem } from "../lib/motion/pageMotion";
import {
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
import { PROGRAM_IMAGE_FALLBACK } from "../constants/defaultMediaFallbacks";
import type { Program, University } from "../types";

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
  const [isFavorite, setIsFavorite] = useState(false);

  const universityQuery = useUniversityBySlugQuery(slug);
  const uni = (universityQuery.data as University | undefined) ?? null;
  const uniId = uni?._id ?? "";

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

  const gallery = useMemo(() => {
    if (!uni) return [];
    const imgs = [uni.coverImage, ...(uni.images ?? [])].filter(Boolean) as string[];
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
            <h1 className="line-clamp-1 text-xl font-black tracking-tight text-slate-900 dark:text-white md:text-2xl">{uni.name}</h1>
          </div>
          <button type="button" onClick={() => setIsFavorite(!isFavorite)}
            className="rounded-full bg-slate-100 p-2.5 transition-all hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700">
            <Heart
              className={`h-5 w-5 transition-colors ${
                isFavorite
                  ? "fill-brand-blue text-brand-blue"
                  : "fill-none text-slate-700 dark:text-slate-300"
              }`}
            />
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto mt-8 max-w-7xl px-6 lg:px-8">
        <motion.div variants={containerVariants} initial="hidden" animate="show">

          {/* Gallery */}
          <motion.div variants={itemVariants}
            className="mb-10 grid h-[50vh] min-h-[360px] grid-cols-1 gap-3 md:grid-cols-4 md:grid-rows-2 md:gap-4">
            <div className="relative overflow-hidden rounded-[2rem] border-4 border-white shadow-md dark:border-zinc-800/50 md:col-span-2 md:row-span-2">
              <img src={gallery[0]} alt={uni.name} className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
              {uni.isFeatured && (
                <div className="absolute left-4 top-4 rounded-full bg-brand-yellow px-3 py-1 text-[10px] font-black uppercase tracking-widest text-black">Featured</div>
              )}
            </div>
            {gallery[1] && (
              <div className="relative hidden overflow-hidden rounded-[1.5rem] border-2 border-white shadow-sm dark:border-zinc-800/50 md:block">
                <img src={gallery[1]} alt="" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
              </div>
            )}
            {gallery[2] && (
              <div className="relative hidden overflow-hidden rounded-[1.5rem] border-2 border-white shadow-sm dark:border-zinc-800/50 md:block">
                <img src={gallery[2]} alt="" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
              </div>
            )}
            {/* Fallback placeholder tiles */}
            {!gallery[1] && (
              <div className="hidden rounded-[1.5rem] bg-slate-100 dark:bg-zinc-800 md:block" />
            )}
            {!gallery[2] && (
              <div className="hidden rounded-[1.5rem] bg-slate-100 dark:bg-zinc-800 md:block" />
            )}
          </motion.div>

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
                  <div className="grid gap-3 sm:grid-cols-2">
                    {programCards.map((row) => {
                      const prog = row.program as Program;
                      const slug = prog.slug?.trim() || prog._id?.trim() || prog.id?.trim();
                      const href = slug
                        ? `/programs/${encodeURIComponent(slug)}`
                        : "/programs";
                      const fieldLabel =
                        PROGRAM_FIELD_LABELS[prog.field] ?? prog.fieldDisplayName ?? prog.field;
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
                            {row.yearOffered != null ? (
                              <p className="mt-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                Since {row.yearOffered}
                                {row.graduatesCount != null
                                  ? ` · ${row.graduatesCount.toLocaleString()} grads`
                                  : ""}
                              </p>
                            ) : null}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
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

              {/* Rankings */}
              {(eduRank || uniRank) && (
                <motion.div variants={itemVariants}>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-6 w-1.5 rounded-full bg-brand-blue" />
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">Rankings</h2>
                  </div>
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
                </motion.div>
              )}

              {/* Campuses */}
              <motion.div variants={itemVariants}>
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-6 w-1.5 rounded-full bg-green-500" />
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">Campuses</h2>
                </div>
                {campuses.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">No campus listings available yet.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {campuses.map((campus: any) => (
                      <div key={campus._id}
                        className="group flex cursor-pointer flex-col rounded-[2rem] border border-slate-200/80 bg-white p-2 transition-all hover:border-brand-blue/30 hover:shadow-xl dark:border-white/5 dark:bg-zinc-900/80">
                        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-slate-100 dark:bg-zinc-800">
                          <img src={campus.coverImage || campus.images?.[0] || universityCover(uni as University)} alt={campus.name}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        </div>
                        <div className="p-4 pt-3">
                          <h3 className="mb-1 font-black text-slate-900 group-hover:text-brand-blue dark:text-white">{campus.name}</h3>
                          <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                            <MapPin size={11} className="text-brand-blue" />
                            {campus.address?.fullAddress || campus.address?.city || "—"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Reviews */}
              {reviews.length > 0 && (
                <motion.div variants={itemVariants}>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-1.5 rounded-full bg-brand-yellow" />
                      <h2 className="text-xl font-black text-slate-900 dark:text-white">Student Reviews</h2>
                    </div>
                    <span className="rounded-xl bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-zinc-800 dark:text-slate-300">
                      {uni.ratingsAverage?.toFixed(1)} avg · {uni.ratingsQuantity} total
                    </span>
                  </div>
                  <div className="space-y-4">
                    {reviews.map((r: any) => (
                      <div key={r._id} className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 dark:border-white/5 dark:bg-zinc-900/80">
                        <div className="mb-3 flex items-start gap-3">
                          <img src={r.user?.profileImage} alt={r.user?.firstName}
                            className="h-10 w-10 shrink-0 rounded-full object-cover" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-black text-slate-900 dark:text-white">{r.user?.fullName ?? r.user?.firstName}</p>
                              <StarRow rating={r.rating} />
                            </div>
                            {r.user?.headline && <p className="text-xs text-slate-400">{r.user.headline}</p>}
                          </div>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{r.review}</p>
                        <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-slate-400">
                          <ThumbsUp size={12} /> {r.likesCount} likes
                        </div>
                      </div>
                    ))}
                  </div>
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
