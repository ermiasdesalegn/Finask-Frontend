import { useQuery } from "@tanstack/react-query";
import { CloudSun, Loader2, Mountain } from "lucide-react";
import { Link } from "react-router-dom";
import SubpageLayout, { SubpageCard } from "../components/layout/SubpageLayout";
import { fetchElevationZones } from "../lib/services/elevationZoneService";

export default function ElevationZonesPage() {
  const { data: zones = [], isLoading } = useQuery({
    queryKey: ["elevation-zones"],
    queryFn: fetchElevationZones,
  });

  return (
    <SubpageLayout
      badge={
        <>
          <Mountain size={12} />
          Climate
        </>
      }
      title={
        <>
          Elevation &{" "}
          <span className="bg-gradient-to-r from-emerald-600 to-brand-blue bg-clip-text text-transparent dark:from-emerald-400 dark:to-sky-300">
            climate zones
          </span>
        </>
      }
      subtitle="Explore Ethiopian universities grouped by elevation and Köppen-style climate buckets."
      back={{ label: "Universities", to: "/universities" }}
      maxWidth="xl"
    >
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-brand-blue" size={32} />
        </div>
      ) : zones.length === 0 ? (
        <SubpageCard className="py-12 text-center text-slate-500">
          No elevation zones returned from the API.
        </SubpageCard>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {zones.map((z) => (
            <li key={z._id}>
              <Link
                to={`/universities?view=climate&zone=${encodeURIComponent(z.slug || z.name)}`}
                className="group block overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white/80 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-blue/30 hover:shadow-lg dark:border-white/10 dark:bg-zinc-900/60"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 transition-colors group-hover:bg-brand-blue/10 group-hover:text-brand-blue dark:text-emerald-400">
                  <CloudSun size={24} />
                </div>
                <h3 className="text-lg font-black text-slate-900 transition-colors group-hover:text-brand-blue dark:text-white">
                  {z.name}
                </h3>
                {z.overview && (
                  <p className="mt-2 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                    {z.overview}
                  </p>
                )}
                <span className="mt-4 inline-block text-xs font-bold uppercase tracking-wider text-brand-blue">
                  View universities →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </SubpageLayout>
  );
}
