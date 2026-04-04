import {
  ArrowLeft,
  Building2,
  Calendar,
  ChevronRight,
  CloudSun,
  Compass,
  ExternalLink,
  MapPin,
  Plane,
  Star,
  Thermometer,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCityByIdQuery } from "../lib/queries/cities";
import { universityPath } from "../lib/universityUi";

const CityPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isPending, isError, error } = useCityByIdQuery(id);
  const city = data?.data?.data ?? null;

  if (isPending) {
    return (
      <div className="mx-auto max-w-5xl animate-pulse space-y-6 px-6 py-8">
        <div className="h-10 w-1/2 rounded-xl bg-slate-200 dark:bg-zinc-800" />
        <div className="h-72 rounded-3xl bg-slate-200 dark:bg-zinc-800" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[1,2,3,4].map(i => <div key={i} className="h-24 rounded-2xl bg-slate-200 dark:bg-zinc-800" />)}
        </div>
      </div>
    );
  }

  if (isError || !city) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6">
        <p className="font-bold text-slate-700 dark:text-slate-300">
          {error instanceof Error ? error.message : "City not found."}
        </p>
        <button type="button" onClick={() => navigate(-1)}
          className="rounded-full bg-brand-blue px-6 py-2 font-bold text-white">
          Go back
        </button>
      </div>
    );
  }

  const universities = city.universities ?? [];
  const reviews = city.reviews ?? [];
  const climate = city.climate ?? {};
  const profile = city.cityProfile ?? {};

  const stats = [
    { icon: <Users size={16} />, label: "Population", value: profile.population ? profile.population.toLocaleString() : "—" },
    { icon: <MapPin size={16} />, label: "Distance from AA", value: profile.distanceFromCapital ? `${profile.distanceFromCapital} km` : "—" },
    { icon: <Plane size={16} />, label: "Airport", value: profile.hasAirport ? "Yes" : "No" },
    { icon: <Thermometer size={16} />, label: "Climate", value: climate.climateTag ?? "—" },
    { icon: <Compass size={16} />, label: "Region", value: city.regionDisplayName ?? city.region ?? "—" },
    { icon: <Calendar size={16} />, label: "Elevation", value: profile.elevation ? `${profile.elevation} m` : "—" },
    { icon: <Star size={16} />, label: "Rating", value: city.ratingsAverage ? `${city.ratingsAverage.toFixed(1)} (${city.ratingsQuantity} reviews)` : "—" },
    { icon: <CloudSun size={16} />, label: "Summary", value: climate.summary ?? "—" },
  ];

  return (
    <div className="min-h-screen pb-20 dark:bg-[#0a0a0a]">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center gap-4 border-b border-slate-200/80 bg-white/80 px-6 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/80">
        <button type="button" onClick={() => navigate(-1)}
          className="rounded-full bg-slate-100 p-2.5 transition-all hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700">
          <ArrowLeft size={18} className="text-slate-700 dark:text-slate-300" />
        </button>
        <div className="flex items-center gap-2">
          <div className="h-6 w-1.5 rounded-full bg-brand-blue" />
          <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">{city.name}</h1>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

          {/* Cover */}
          {city.coverImage && (
            <div className="mb-8 h-64 overflow-hidden rounded-3xl md:h-80">
              <img src={city.coverImage} alt={city.name}
                className="h-full w-full object-cover" />
            </div>
          )}

          {/* Tags */}
          {city.tagsDisplayNames?.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {city.tagsDisplayNames.map((tag: string) => (
                <span key={tag} className="rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 text-xs font-bold text-slate-600 dark:border-white/10 dark:bg-zinc-800 dark:text-slate-300">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Overview */}
          {city.overview && (
            <div className="mb-8 rounded-3xl border border-slate-200/60 bg-white/80 p-6 dark:border-white/5 dark:bg-zinc-900/80">
              <h2 className="mb-3 text-lg font-black text-slate-900 dark:text-white">About {city.name}</h2>
              <p className="leading-relaxed text-slate-600 dark:text-slate-400">{city.overview}</p>
              {city.wikipediaLink && (
                <a href={city.wikipediaLink} target="_blank" rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-blue hover:underline">
                  Wikipedia <ExternalLink size={13} />
                </a>
              )}
            </div>
          )}

          {/* Stats grid */}
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-slate-200/60 bg-white/80 p-4 dark:border-white/5 dark:bg-zinc-900/80">
                <div className="mb-1.5 flex items-center gap-1.5 text-brand-blue">{s.icon}</div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{s.label}</p>
                <p className="mt-0.5 text-sm font-black text-slate-900 dark:text-white">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Climate detail */}
          {climate.detail && (
            <div className="mb-8 rounded-3xl border border-slate-200/60 bg-white/80 p-6 dark:border-white/5 dark:bg-zinc-900/80">
              <h2 className="mb-3 flex items-center gap-2 text-lg font-black text-slate-900 dark:text-white">
                <CloudSun size={18} className="text-brand-blue" /> Climate
              </h2>
              <p className="leading-relaxed text-slate-600 dark:text-slate-400">{climate.detail}</p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                {climate.hottestMonth && (
                  <div className="rounded-xl bg-orange-50 p-3 dark:bg-orange-900/20">
                    <p className="text-[10px] font-black uppercase tracking-widest text-orange-400">Hottest</p>
                    <p className="font-black text-orange-700 dark:text-orange-300">{climate.hottestMonth.month} · {climate.hottestMonth.value}°C</p>
                  </div>
                )}
                {climate.coldestMonth && (
                  <div className="rounded-xl bg-blue-50 p-3 dark:bg-blue-900/20">
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Coldest</p>
                    <p className="font-black text-blue-700 dark:text-blue-300">{climate.coldestMonth.month} · {climate.coldestMonth.value}°C</p>
                  </div>
                )}
                {climate.wettestMonth && (
                  <div className="rounded-xl bg-teal-50 p-3 dark:bg-teal-900/20">
                    <p className="text-[10px] font-black uppercase tracking-widest text-teal-400">Wettest</p>
                    <p className="font-black text-teal-700 dark:text-teal-300">{climate.wettestMonth.month} · {climate.wettestMonth.value}mm</p>
                  </div>
                )}
                {climate.annualPrecipitation != null && (
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-zinc-800">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Annual Rain</p>
                    <p className="font-black text-slate-700 dark:text-slate-300">{climate.annualPrecipitation} mm</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Universities in this city */}
          {universities.length > 0 && (
            <div className="mb-8">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-5 w-1 rounded-full bg-brand-yellow" />
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Universities in {city.name}</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {universities.map((u: any) => (
                  <Link key={u.slug ?? u._id} to={universityPath(u)}
                    className="group flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-white/80 p-3 transition-all hover:border-brand-blue/30 hover:shadow-md dark:border-white/5 dark:bg-zinc-900/80">
                    {u.coverImage && (
                      <img src={u.coverImage} alt={u.name} className="h-12 w-12 shrink-0 rounded-xl object-cover" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-black text-slate-900 group-hover:text-brand-blue dark:text-white">{u.name}</p>
                      {u.ratingsAverage && (
                        <p className="flex items-center gap-1 text-xs text-slate-400">
                          <Star size={10} className="text-brand-yellow" fill="currentColor" />
                          {u.ratingsAverage.toFixed(1)}
                        </p>
                      )}
                    </div>
                    <ChevronRight size={16} className="shrink-0 text-slate-400 group-hover:text-brand-blue" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Tourist attractions */}
          {city.touristAttractions?.length > 0 && (
            <div className="mb-8">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-5 w-1 rounded-full bg-green-500" />
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Tourist Attractions</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {city.touristAttractions.map((a: any, i: number) => (
                  <div key={i} className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 dark:border-white/5 dark:bg-zinc-900/80">
                    {a.image && <img src={a.image} alt={a.name} className="h-36 w-full object-cover" />}
                    <div className="p-3">
                      <p className="font-black text-slate-900 dark:text-white">{a.name}</p>
                      {a.detail && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{a.detail}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          {reviews.length > 0 && (
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="h-5 w-1 rounded-full bg-brand-blue" />
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Student Reviews</h2>
              </div>
              <div className="space-y-3">
                {reviews.slice(0, 5).map((r: any) => (
                  <div key={r._id} className="rounded-2xl border border-slate-200/60 bg-white/80 p-4 dark:border-white/5 dark:bg-zinc-900/80">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-blue/10 text-xs font-black text-brand-blue">
                        {r.user?.firstName?.[0] ?? "U"}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 dark:text-white">{r.user?.firstName ?? "Student"}</p>
                        <div className="flex items-center gap-0.5">
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} size={10} className={s <= r.rating ? "text-brand-yellow fill-current" : "text-slate-300"} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{r.review}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </motion.div>
      </main>
    </div>
  );
};

export default CityPage;
