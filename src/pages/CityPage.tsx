import {
  ArrowLeft,
  Bus,
  Calendar,
  ChevronRight,
  CloudSun,
  Compass,
  ExternalLink,
  Languages,
  MapPin,
  Plane,
  Sparkles,
  Star,
  Thermometer,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { staggerBlurContainer, staggerBlurItem } from "../lib/motion/pageMotion";
import { useCityByIdQuery } from "../lib/queries/cities";
import { fetchSuggestedCities } from "../lib/services/cityService";
import { useAuth } from "../context/AuthContext";
import EntityMap from "../components/shared/EntityMap";
import GalleryModal from "../components/shared/GalleryModal";
import { SuggestedCitiesRow } from "../components/shared/SuggestedRow";
import { CITY_HERO_IMAGE_FALLBACK } from "../constants/defaultMediaFallbacks";
import { universityPath } from "../lib/universityUi";
import FavoriteButton from "../components/favorites/FavoriteButton";
import ReviewsSection from "../components/community/ReviewsSection";
import QuestionsSection from "../components/community/QuestionsSection";
import type { University } from "../types";

const containerVariants = staggerBlurContainer;
const itemVariants = staggerBlurItem;

function formatCityTagLabel(raw: string) {
  return raw
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(/[\s_]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function SectionTitle({
  accentClass,
  children,
}: {
  accentClass: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <div className={`h-7 w-1.5 rounded-full shadow-lg ${accentClass}`} />
      <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white md:text-2xl">
        {children}
      </h2>
    </div>
  );
}

const CityPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [galleryOpen, setGalleryOpen] = useState(false);
  const { data: city, isPending, isError, error } = useCityByIdQuery(id);
  const suggestedQ = useQuery({
    queryKey: ["cities", "suggested"],
    queryFn: () => fetchSuggestedCities(6),
    enabled: isAuthenticated,
  });

  if (isPending) {
    return (
      <div className="min-h-screen pb-20 pt-8 dark:bg-[#0a0a0a]">
        <div className="mx-auto max-w-7xl animate-pulse space-y-6 px-6 lg:px-8">
          <div className="h-10 w-2/3 rounded-xl bg-slate-200 dark:bg-zinc-800" />
          <div className="h-[min(50vh,420px)] rounded-[2rem] bg-slate-200 dark:bg-zinc-800" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 rounded-2xl bg-slate-200 dark:bg-zinc-800" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !city) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 dark:bg-[#0a0a0a]">
        <p className="font-bold text-slate-700 dark:text-slate-300">
          {error instanceof Error ? error.message : "City not found."}
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

  const universities = (city.universities ?? []) as Partial<University>[];
  const reviews = city.reviews ?? [];
  const climate = city.climate ?? {};
  const profile = city.cityProfile ?? {};
  const elevationZone =
    climate.elevationZone &&
    typeof climate.elevationZone === "object"
      ? (climate.elevationZone as { slug?: string; name?: string })
      : null;
  const hasClimateContent = Boolean(
    climate.summary || climate.detail || climate.climateTag
  );
  const annualRain =
    climate.annualPrecipitation ?? climate.annualPercipitation ?? null;

  const tagChips: string[] =
    city.tagsDisplayNames?.length
      ? city.tagsDisplayNames
      : (city.tags ?? []).map(formatCityTagLabel);

  const stats = [
    { icon: Users, label: "Population", value: profile.population ? profile.population.toLocaleString() : "—", tone: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" },
    { icon: MapPin, label: "Distance from AA", value: profile.distanceFromCapital != null ? `${profile.distanceFromCapital} km` : "—", tone: "text-brand-blue", bg: "bg-brand-blue/10" },
    { icon: Plane, label: "Airport", value: profile.hasAirport ? "Yes" : "No", tone: "text-sky-600 dark:text-sky-400", bg: "bg-sky-500/10" },
    { icon: Thermometer, label: "Climate", value: climate.climateTag ?? "—", tone: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" },
    { icon: Compass, label: "Region", value: city.regionDisplayName ?? city.region ?? "—", tone: "text-violet-600 dark:text-violet-400", bg: "bg-violet-500/10" },
    { icon: Calendar, label: "Elevation", value: profile.elevation != null ? `${profile.elevation} m` : "—", tone: "text-slate-600 dark:text-slate-300", bg: "bg-slate-500/10" },
    { icon: Star, label: "Rating", value: city.ratingsAverage != null ? `${city.ratingsAverage.toFixed(1)} (${city.ratingsQuantity ?? 0})` : "—", tone: "text-brand-yellow", bg: "bg-brand-yellow/15" },
    { icon: CloudSun, label: "Summary", value: climate.summary ?? "—", tone: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-500/10" },
    ...(profile.language
      ? [{ icon: Languages, label: "Language", value: profile.language, tone: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-500/10" }]
      : []),
    ...(profile.transportOptions?.length
      ? [{ icon: Bus, label: "Transport", value: profile.transportOptions.join(", "), tone: "text-orange-600 dark:text-orange-400", bg: "bg-orange-500/10" }]
      : []),
    ...(profile.area != null
      ? [{ icon: MapPin, label: "Area", value: `${profile.area} km²`, tone: "text-teal-600 dark:text-teal-400", bg: "bg-teal-500/10" }]
      : []),
    ...(profile.postCode
      ? [{ icon: MapPin, label: "Post code", value: profile.postCode, tone: "text-slate-600 dark:text-slate-300", bg: "bg-slate-500/10" }]
      : []),
  ] as const;

  const heroSrc = city.coverImage || CITY_HERO_IMAGE_FALLBACK;
  const galleryImages = [
    ...(city.coverImage ? [city.coverImage] : []),
    ...(city.images ?? []),
  ].filter(Boolean) as string[];
  type FlyFromEntry = { name: string; airportCode?: string; distanceKm?: number };
  const flyFrom: FlyFromEntry[] = city.flyFromCities?.length
    ? city.flyFromCities
    : (city.flightOrigins ?? []).map((name) => ({ name }));

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 transition-colors dark:bg-[#0a0a0a]">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute right-0 top-0 h-[40%] w-[40%] -translate-y-1/2 translate-x-1/4 rounded-full bg-emerald-500/5 blur-[120px] dark:bg-emerald-500/10" />
        <div className="absolute left-0 top-1/2 h-[50%] w-[50%] -translate-x-1/4 rounded-full bg-brand-blue/5 blur-[120px] dark:bg-brand-blue/10" />
        <div className="absolute bottom-0 right-1/4 h-[35%] w-[40%] rounded-full bg-brand-yellow/5 blur-[100px] dark:bg-brand-yellow/10" />
      </div>

      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 px-6 py-4 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/80">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="group rounded-full bg-slate-100 p-2.5 transition-all hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
          >
            <ArrowLeft className="h-5 w-5 text-slate-700 transition-transform group-hover:-translate-x-0.5 dark:text-slate-300" />
          </button>
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="h-6 w-1.5 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.45)]" />
            <div className="min-w-0">
              <h1 className="truncate text-xl font-black tracking-tight text-slate-900 dark:text-white md:text-2xl">
                {city.name}
              </h1>
              <p className="truncate text-sm font-medium text-slate-500 dark:text-slate-400">
                {[city.regionDisplayName ?? city.region, profile.population != null ? `${profile.population.toLocaleString()} pop.` : null, profile.elevation != null ? `${profile.elevation}m` : null]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
          </div>
          {city._id && <FavoriteButton itemId={city._id} onModel="City" />}
          <div className="hidden shrink-0 items-center gap-1 rounded-full border border-slate-200/80 bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-600 backdrop-blur dark:border-white/10 dark:bg-zinc-800/90 dark:text-slate-300 sm:flex">
            <MapPin size={14} className="text-emerald-500" />
            City
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto mt-8 max-w-7xl px-6 lg:px-8">
        <motion.div variants={containerVariants} initial="hidden" animate="show">
          {/* Hero */}
          <motion.div variants={itemVariants} className="relative mb-10 overflow-hidden rounded-[2rem] border-4 border-white shadow-xl dark:border-zinc-800/50">
            <div className="relative h-[min(52vh,440px)] min-h-[280px] w-full">
              <img
                src={heroSrc}
                alt={city.name}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/25 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
                  Explore Ethiopia
                </p>
                <h2 className="text-3xl font-black tracking-tighter text-white md:text-5xl">
                  {city.name}
                </h2>
                {climate.climateTag && (
                  <p className="mt-2 max-w-xl text-sm font-medium text-white/85 md:text-base">
                    {climate.climateTag}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setGalleryOpen(true)}
                  className="mt-4 rounded-full bg-white/90 px-4 py-2 text-xs font-black text-slate-900"
                >
                  View gallery
                  {galleryImages.length > 1 ? ` (${galleryImages.length})` : ""}
                </button>
              </div>
            </div>
          </motion.div>
          <GalleryModal
            images={galleryImages.length ? galleryImages : [heroSrc]}
            title={city.name}
            open={galleryOpen}
            onClose={() => setGalleryOpen(false)}
          />

          {/* Tags */}
          {tagChips.length > 0 && (
            <motion.div variants={itemVariants} className="mb-10 flex flex-wrap gap-2">
              {tagChips.map((tag) => (
                <span
                  key={tag}
                  className="rounded-xl border border-slate-200/80 bg-white/90 px-3.5 py-1.5 text-xs font-bold text-slate-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-zinc-900/90 dark:text-slate-200"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          )}

          {/* About */}
          {city.overview && (
            <motion.div
              variants={itemVariants}
              className="relative mb-10 overflow-hidden rounded-[2rem] border border-white/60 bg-gradient-to-br from-emerald-50/90 via-white/80 to-brand-blue/5 p-6 shadow-sm dark:border-white/5 dark:from-emerald-950/20 dark:via-zinc-900/80 dark:to-brand-blue/10 md:p-8"
            >
              <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-emerald-400/15 blur-3xl dark:bg-emerald-500/10" />
              <h3 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-900 dark:text-white md:text-xl">
                <div className="rounded-xl bg-white p-2 shadow-sm dark:bg-zinc-800">
                  <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                About {city.name}
              </h3>
              <p className="relative z-10 max-w-3xl text-base font-medium leading-relaxed text-slate-700 dark:text-slate-300">
                {city.overview}
              </p>
              {city.wikipediaLink && (
                <a
                  href={city.wikipediaLink}
                  target="_blank"
                  rel="noreferrer"
                  className="relative z-10 mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-blue px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-brand-blue/25 transition-colors hover:bg-blue-700"
                >
                  Wikipedia <ExternalLink size={14} />
                </a>
              )}
            </motion.div>
          )}

          {/* Stats */}
          <motion.div variants={itemVariants} className="mb-10">
            <SectionTitle accentClass="bg-emerald-500 shadow-emerald-500/30">
              At a glance
            </SectionTitle>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {stats.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.label}
                    className="rounded-2xl border border-slate-200/60 bg-white/90 p-4 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md dark:border-white/5 dark:bg-zinc-900/80"
                  >
                    <div
                      className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${s.bg}`}
                    >
                      <Icon size={18} className={s.tone} />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {s.label}
                    </p>
                    <p className="mt-1 line-clamp-3 text-sm font-black text-slate-900 dark:text-white">
                      {s.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Climate */}
          {hasClimateContent && (
            <motion.div
              variants={itemVariants}
              className="mb-10 rounded-[2rem] border border-slate-200/60 bg-white/90 p-6 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-zinc-900/80 md:p-8"
            >
              <SectionTitle accentClass="bg-brand-blue shadow-brand-blue/30">
                <span className="flex items-center gap-2">
                  <CloudSun size={22} className="text-brand-blue" />
                  Climate
                </span>
              </SectionTitle>
              {climate.climateTag && (
                <p className="mb-2 text-sm font-bold text-brand-blue">{climate.climateTag}</p>
              )}
              <p className="mb-6 max-w-3xl leading-relaxed text-slate-600 dark:text-slate-400">
                {climate.detail || climate.summary}
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                {climate.hottestMonth && (
                  <div className="rounded-xl border border-orange-100 bg-orange-50/80 p-3 dark:border-orange-900/30 dark:bg-orange-900/20">
                    <p className="text-[10px] font-black uppercase tracking-widest text-orange-500">
                      Hottest
                    </p>
                    <p className="font-black text-orange-800 dark:text-orange-200">
                      {climate.hottestMonth.month} · {climate.hottestMonth.value}°C
                    </p>
                  </div>
                )}
                {climate.coldestMonth && (
                  <div className="rounded-xl border border-blue-100 bg-blue-50/80 p-3 dark:border-blue-900/30 dark:bg-blue-900/20">
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">
                      Coldest
                    </p>
                    <p className="font-black text-blue-800 dark:text-blue-200">
                      {climate.coldestMonth.month} · {climate.coldestMonth.value}°C
                    </p>
                  </div>
                )}
                {climate.wettestMonth && (
                  <div className="rounded-xl border border-teal-100 bg-teal-50/80 p-3 dark:border-teal-900/30 dark:bg-teal-900/20">
                    <p className="text-[10px] font-black uppercase tracking-widest text-teal-600">
                      Wettest
                    </p>
                    <p className="font-black text-teal-800 dark:text-teal-200">
                      {climate.wettestMonth.month} · {climate.wettestMonth.value}mm
                    </p>
                  </div>
                )}
                {climate.windiestMonth && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-zinc-800">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Windiest
                    </p>
                    <p className="font-black text-slate-800 dark:text-slate-200">
                      {climate.windiestMonth.month} · {climate.windiestMonth.value} km/h
                    </p>
                  </div>
                )}
                {annualRain != null && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-zinc-800">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Annual rain
                    </p>
                    <p className="font-black text-slate-800 dark:text-slate-200">{annualRain} mm</p>
                  </div>
                )}
                {climate.minTemperature != null && climate.maxTemperature != null && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 sm:col-span-2 dark:border-white/10 dark:bg-zinc-800">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Typical range
                    </p>
                    <p className="font-black text-slate-800 dark:text-slate-200">
                      {climate.minTemperature}°C – {climate.maxTemperature}°C
                    </p>
                  </div>
                )}
              </div>
              {climate.climateWebLinks && climate.climateWebLinks.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {climate.climateWebLinks.map((link) =>
                    link.url ? (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-full border border-slate-200/80 px-3 py-1.5 text-xs font-bold text-brand-blue transition-colors hover:bg-slate-50 dark:border-white/10 dark:hover:bg-zinc-800"
                      >
                        {link.name ?? "Climate source"} <ExternalLink size={12} />
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
                  View elevation zone ({elevationZone.name ?? elevationZone.slug}) →
                </Link>
              )}
            </motion.div>
          )}

          {/* Universities */}
          {universities.length > 0 && (
            <motion.div variants={itemVariants} className="mb-10">
              <SectionTitle accentClass="bg-brand-yellow shadow-amber-400/40">
                Universities in {city.name}
              </SectionTitle>
              <div className="grid gap-4 sm:grid-cols-2">
                {universities.map((u) => (
                  <Link
                    key={(u.slug ?? u._id) as string}
                    to={universityPath(u as University)}
                    className="group flex items-center gap-4 rounded-2xl border border-slate-200/60 bg-white/90 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-blue/35 hover:shadow-lg hover:shadow-brand-blue/10 dark:border-white/5 dark:bg-zinc-900/80"
                  >
                    {u.coverImage ? (
                      <img
                        src={u.coverImage}
                        alt={u.name}
                        className="h-14 w-14 shrink-0 rounded-xl object-cover ring-2 ring-white dark:ring-zinc-800"
                      />
                    ) : (
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue dark:bg-brand-blue/20">
                        <MapPin size={22} />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-black text-slate-900 transition-colors group-hover:text-brand-blue dark:text-white">
                        {u.name}
                      </p>
                      {u.ratingsAverage != null && (
                        <p className="mt-0.5 flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400">
                          <Star size={11} className="text-brand-yellow" fill="currentColor" />
                          {u.ratingsAverage.toFixed(1)}
                        </p>
                      )}
                    </div>
                    <ChevronRight
                      size={18}
                      className="shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-blue"
                    />
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div variants={itemVariants} className="mb-10">
            <SectionTitle accentClass="bg-brand-blue shadow-brand-blue/30">
              View on map
            </SectionTitle>
            <EntityMap coordinates={city.location?.coordinates} label={city.name} />
          </motion.div>

          <motion.div variants={itemVariants} className="mb-10">
            <SectionTitle accentClass="bg-sky-500 shadow-sky-500/30">
              Fly from these cities
            </SectionTitle>
            {flyFrom.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {flyFrom.map((f, i) => (
                  <div
                    key={f.name + i}
                    className="rounded-2xl border border-slate-200/80 bg-white px-4 py-3 dark:border-white/10 dark:bg-zinc-900"
                  >
                    <p className="font-bold text-slate-900 dark:text-white">{f.name}</p>
                    {f.airportCode ? (
                      <p className="text-xs text-slate-500">{f.airportCode}</p>
                    ) : null}
                    {f.distanceKm != null ? (
                      <p className="text-xs text-slate-500">{f.distanceKm} km</p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No flight origin data yet for this city.
              </p>
            )}
          </motion.div>

          {isAuthenticated ? (
            <motion.div variants={itemVariants}>
              <SuggestedCitiesRow
                title="Suggested cities"
                cities={suggestedQ.data ?? []}
                loading={suggestedQ.isPending}
              />
            </motion.div>
          ) : (
            <motion.div
              variants={itemVariants}
              className="mb-10 rounded-2xl border border-dashed border-emerald-500/30 bg-emerald-500/5 p-6 text-center dark:bg-emerald-500/10"
            >
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Sign in to see cities suggested based on your location.
              </p>
              <Link
                to="/account"
                className="mt-3 inline-block rounded-xl bg-brand-blue px-5 py-2.5 text-sm font-black text-white"
              >
                Sign in
              </Link>
            </motion.div>
          )}

          {/* Attractions */}
          {city.touristAttractions?.length ? (
            <motion.div variants={itemVariants} className="mb-10">
              <SectionTitle accentClass="bg-emerald-600 shadow-emerald-600/30">
                Tourist attractions
              </SectionTitle>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {city.touristAttractions.map((a, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white/90 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-white/5 dark:bg-zinc-900/80"
                  >
                    <div className="h-40 w-full bg-slate-100 dark:bg-zinc-800">
                      {a.image ? (
                        <img src={a.image} alt={a.name} className="h-40 w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm font-bold text-slate-400">
                          {a.name}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="font-black text-slate-900 dark:text-white">{a.name}</p>
                      {a.detail && (
                        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                          {a.detail}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : null}

          {city._id && (
            <motion.div variants={itemVariants}>
              <ReviewsSection
                parentType="city"
                parentId={city._id}
                initialReviews={reviews}
              />
              <QuestionsSection
                parentType="city"
                parentId={city._id}
              />
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default CityPage;
