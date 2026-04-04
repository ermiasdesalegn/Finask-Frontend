import {
  Building2,
  GraduationCap,
  Heart,
  MapPin,
  Star,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FlickeringHeartsBackground } from "../components/ui/flickering-hearts-background";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../lib/api";
import {
  useFavoritesQuery,
  useRemoveFavoriteMutation,
} from "../lib/queries/favorites";
import {
  displayRating,
  formatRatingsQuantityCompact,
  universityCity,
  universityCover,
  universityPath,
} from "../lib/universityUi";
import { blurReveal, springPop } from "../lib/motion/pageMotion";
import { cn } from "../lib/utils";
import type { Campus, City, Favorite, Program, University } from "../types";

type Tab = "universities" | "programs" | "cities" | "campuses";

const TABS: { id: Tab; label: string; icon: typeof Building2 }[] = [
  { id: "universities", label: "Universities", icon: Building2 },
  { id: "programs", label: "Programs", icon: GraduationCap },
  { id: "cities", label: "Cities", icon: MapPin },
  { id: "campuses", label: "Campuses", icon: Users },
];

const IMG_FALLBACK =
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600";

function modelMatches(f: Favorite, tab: Tab): boolean {
  const m = String(f.onModel || "").toLowerCase();
  if (tab === "universities") return m === "university";
  if (tab === "programs") return m === "program";
  if (tab === "cities") return m === "city";
  if (tab === "campuses") return m === "campus";
  return false;
}

function isPopulatedItem(f: Favorite): boolean {
  const item = f.item;
  return (
    typeof item === "object" &&
    item !== null &&
    typeof (item as { name?: string }).name === "string" &&
    Boolean((item as { name?: string }).name)
  );
}

function favoritesForTab(favorites: Favorite[], tab: Tab): Favorite[] {
  return favorites.filter((f) => modelMatches(f, tab) && isPopulatedItem(f));
}

function cityPath(city: City): string {
  const key = city.slug?.trim() || city._id;
  return `/cities/${encodeURIComponent(key)}`;
}

function cityCover(city: City): string {
  return city.coverImage?.trim() || IMG_FALLBACK;
}

function campusCover(campus: Campus): string {
  return (
    campus.coverImage?.trim() ||
    campus.images?.[0]?.trim() ||
    IMG_FALLBACK
  );
}

function campusNavigatePath(campus: Campus): string {
  const u = campus.university;
  if (typeof u === "object" && u != null) {
    const slug = "slug" in u && u.slug ? String(u.slug) : "";
    if (slug) return `/universities/${encodeURIComponent(slug)}`;
    const id = "_id" in u && u._id ? String(u._id) : "";
    if (id) return `/universities/${encodeURIComponent(id)}`;
  }
  return "/campuses";
}

function programPath(p: Program): string {
  const s = p.slug?.trim() || p._id?.trim() || p.id?.trim();
  return s ? `/programs/${encodeURIComponent(s)}` : "/programs";
}

const EmptyState = ({ label }: { label: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="col-span-full flex flex-col items-center justify-center py-32 text-center"
  >
    <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-[2rem] border border-slate-600/30 bg-black/40 shadow-xl backdrop-blur-md">
      <Heart size={32} className="text-slate-500/90" />
    </div>
    <h3 className="mb-2 text-xl font-black text-white">
      No favorite {label} yet
    </h3>
    <p className="text-sm text-slate-400">
      Heart items while browsing and they&apos;ll appear here.
    </p>
  </motion.div>
);

export default function FavoritesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("universities");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: favoritesRaw = [], isPending, isError, error } =
    useFavoritesQuery(true);
  const removeMutation = useRemoveFavoriteMutation();

  const isUnauthorized =
    isError && error instanceof ApiError && error.status === 401;
  const favorites = isError ? [] : favoritesRaw;
  const showFetchError = isError && !isUnauthorized;

  const tabItems = useMemo(
    () => favoritesForTab(favorites, activeTab),
    [favorites, activeTab]
  );

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#05060c] pb-24">
      <div className="pointer-events-none fixed inset-0 z-0">
        <FlickeringHeartsBackground className="h-full w-full" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-10 lg:px-8">
        <motion.div
          initial="hidden"
          animate="show"
          variants={springPop}
          className="mb-10"
        >
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-slate-600/35 bg-black/40 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-300 shadow-sm backdrop-blur-md">
            <Heart size={12} className="fill-slate-500 text-slate-400" />
            Your Collection
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">
            Your{" "}
            <span className="bg-gradient-to-r from-slate-200 to-sky-200/90 bg-clip-text text-transparent">
              Favorites
            </span>
          </h1>
          {user?.firstName && (
            <p className="mt-2 text-slate-400">
              Welcome back, {user.firstName}. Here&apos;s everything you&apos;ve
              saved.
            </p>
          )}
        </motion.div>

        {showFetchError && (
          <p className="mb-6 rounded-2xl border border-red-900/50 bg-red-950/50 px-4 py-3 text-sm font-medium text-red-200">
            {error instanceof Error ? error.message : "Could not load favorites."}
          </p>
        )}

        <motion.div
          initial="hidden"
          animate="show"
          variants={blurReveal}
          transition={{ delay: 0.06 }}
          className="mb-8 flex flex-wrap gap-2"
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold transition-all duration-200",
                  active
                    ? "border border-sky-900/50 bg-slate-800/90 text-slate-100 shadow-md shadow-black/40"
                    : "border border-white/10 bg-white/5 text-slate-400 backdrop-blur-md hover:bg-white/10 hover:text-slate-200"
                )}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={blurReveal}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {isPending ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-[1.5rem] border border-white/10 bg-white/5 p-2"
                  >
                    <div className="mb-3 h-44 rounded-xl bg-white/10" />
                    <div className="space-y-2 px-3 pb-3">
                      <div className="h-4 w-3/4 rounded-lg bg-white/10" />
                      <div className="h-3 w-1/2 rounded bg-white/5" />
                    </div>
                  </div>
                ))}
              </>
            ) : activeTab === "universities" ? (
              tabItems.length === 0 ? (
                <EmptyState label="universities" />
              ) : (
                tabItems.map((fav) => {
                  const uni = fav.item as University;
                  const removing =
                    removeMutation.isPending &&
                    removeMutation.variables === fav._id;
                  return (
                    <motion.div
                      key={fav._id}
                      whileHover={{ y: -4 }}
                      onClick={() => navigate(universityPath(uni))}
                      className="group cursor-pointer rounded-[1.5rem] border border-white/10 bg-black/35 p-2 backdrop-blur-md transition-all hover:border-slate-500/30 hover:shadow-lg hover:shadow-black/20"
                    >
                      <div className="relative mb-3 h-44 overflow-hidden rounded-xl bg-zinc-900">
                        <img
                          src={universityCover(uni)}
                          alt={uni.name}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <button
                          type="button"
                          disabled={removing}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeMutation.mutate(fav._id);
                          }}
                          className="absolute right-3 top-3 rounded-full bg-black/50 p-1.5 text-slate-400 backdrop-blur-md transition-all hover:scale-110 disabled:opacity-50"
                          title="Remove from favorites"
                        >
                          <Heart size={14} className="fill-slate-500" />
                        </button>
                      </div>
                      <div className="px-3 pb-3">
                        <h3 className="mb-1 truncate font-black text-white transition-colors group-hover:text-sky-200/90">
                          {uni.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                          <MapPin size={11} className="text-slate-500" />
                          {universityCity(uni) || "—"}
                          <span className="mx-1 text-slate-600">
                            •
                          </span>
                          <Star
                            size={11}
                            className="text-brand-yellow"
                            fill="currentColor"
                          />
                          {displayRating(uni)}
                          <span className="text-slate-400">
                            (
                            {formatRatingsQuantityCompact(
                              uni.ratingsQuantity
                            )}
                            )
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )
            ) : activeTab === "programs" ? (
              tabItems.length === 0 ? (
                <EmptyState label="programs" />
              ) : (
                tabItems.map((fav) => {
                  const prog = fav.item as Program;
                  const removing =
                    removeMutation.isPending &&
                    removeMutation.variables === fav._id;
                  return (
                    <motion.div
                      key={fav._id}
                      whileHover={{ y: -4 }}
                      onClick={() => navigate(programPath(prog))}
                      className="group cursor-pointer rounded-[1.5rem] border border-white/10 bg-black/35 p-5 backdrop-blur-md transition-all hover:border-slate-500/30 hover:shadow-lg hover:shadow-black/20"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="rounded-full bg-slate-800/80 px-3 py-1 text-xs font-black text-slate-300">
                          {prog.fieldDisplayName ?? prog.field}
                        </span>
                        <button
                          type="button"
                          disabled={removing}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeMutation.mutate(fav._id);
                          }}
                          className="rounded-full p-1.5 text-slate-500 transition-all hover:scale-110 disabled:opacity-50"
                          title="Remove from favorites"
                        >
                          <Heart size={14} className="fill-slate-500" />
                        </button>
                      </div>
                      <h3 className="mb-1 font-black text-white transition-colors group-hover:text-sky-200/90">
                        {prog.name}
                      </h3>
                      {prog.overview ? (
                        <p className="line-clamp-2 text-xs text-slate-400">
                          {prog.overview}
                        </p>
                      ) : null}
                      <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-slate-400">
                        <GraduationCap size={11} />
                        {prog.duration != null ? `${prog.duration} yrs` : "—"}
                      </div>
                    </motion.div>
                  );
                })
              )
            ) : activeTab === "cities" ? (
              tabItems.length === 0 ? (
                <EmptyState label="cities" />
              ) : (
                tabItems.map((fav) => {
                  const city = fav.item as City;
                  const removing =
                    removeMutation.isPending &&
                    removeMutation.variables === fav._id;
                  return (
                    <motion.div
                      key={fav._id}
                      whileHover={{ y: -4 }}
                      onClick={() => navigate(cityPath(city))}
                      className="group cursor-pointer rounded-[1.5rem] border border-white/10 bg-black/35 p-2 backdrop-blur-md transition-all hover:border-slate-500/30 hover:shadow-lg hover:shadow-black/20"
                    >
                      <div className="relative mb-3 h-44 overflow-hidden rounded-xl bg-zinc-900">
                        <img
                          src={cityCover(city)}
                          alt={city.name}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <button
                          type="button"
                          disabled={removing}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeMutation.mutate(fav._id);
                          }}
                          className="absolute right-3 top-3 rounded-full bg-black/50 p-1.5 text-slate-400 backdrop-blur-md transition-all hover:scale-110 disabled:opacity-50"
                          title="Remove from favorites"
                        >
                          <Heart size={14} className="fill-slate-500" />
                        </button>
                      </div>
                      <div className="px-3 pb-3">
                        <h3 className="mb-1 truncate font-black text-white transition-colors group-hover:text-sky-200/90">
                          {city.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                          <MapPin size={11} className="text-slate-500" />
                          {city.regionDisplayName || city.region || "Ethiopia"}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )
            ) : activeTab === "campuses" ? (
              tabItems.length === 0 ? (
                <EmptyState label="campuses" />
              ) : (
                tabItems.map((fav) => {
                  const campus = fav.item as Campus;
                  const removing =
                    removeMutation.isPending &&
                    removeMutation.variables === fav._id;
                  return (
                    <motion.div
                      key={fav._id}
                      whileHover={{ y: -4 }}
                      onClick={() => navigate(campusNavigatePath(campus))}
                      className="group cursor-pointer rounded-[1.5rem] border border-white/10 bg-black/35 p-2 backdrop-blur-md transition-all hover:border-slate-500/30 hover:shadow-lg hover:shadow-black/20"
                    >
                      <div className="relative mb-3 h-44 overflow-hidden rounded-xl bg-zinc-900">
                        <img
                          src={campusCover(campus)}
                          alt={campus.name}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <button
                          type="button"
                          disabled={removing}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeMutation.mutate(fav._id);
                          }}
                          className="absolute right-3 top-3 rounded-full bg-black/50 p-1.5 text-slate-400 backdrop-blur-md transition-all hover:scale-110 disabled:opacity-50"
                          title="Remove from favorites"
                        >
                          <Heart size={14} className="fill-slate-500" />
                        </button>
                      </div>
                      <div className="px-3 pb-3">
                        <h3 className="mb-1 truncate font-black text-white transition-colors group-hover:text-sky-200/90">
                          {campus.name}
                        </h3>
                        <p className="text-xs text-slate-400">
                          {typeof campus.university === "object" &&
                          campus.university &&
                          "name" in campus.university
                            ? String(
                                (campus.university as { name?: string }).name ??
                                  ""
                              )
                            : "Campus"}
                        </p>
                      </div>
                    </motion.div>
                  );
                })
              )
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
