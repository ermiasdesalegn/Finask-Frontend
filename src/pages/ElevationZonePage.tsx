import { useQuery } from "@tanstack/react-query";
import { CloudSun, Loader2, Mountain } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import SubpageLayout, { SubpageCard } from "../components/layout/SubpageLayout";
import {
  fetchElevationZoneBySlug,
  type ElevationZone,
} from "../lib/services/elevationZoneService";
import { UNIVERSITY_IMAGE_FALLBACK } from "../constants/defaultMediaFallbacks";

function zoneDisplayName(z: ElevationZone): string {
  const d = (z as ElevationZone & { displayName?: string }).displayName;
  return d || z.name;
}

export default function ElevationZonePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["elevation-zone", slug],
    queryFn: () => fetchElevationZoneBySlug(slug!),
    enabled: Boolean(slug),
  });
  const zone = data?.zone;
  const universities = data?.universities ?? [];

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 pt-20 dark:bg-[#05060c]">
        <Loader2 className="animate-spin text-brand-blue" size={36} />
      </div>
    );
  }

  if (isError || !zone) {
    return (
      <SubpageLayout
        title="Zone not found"
        back={{ label: "All zones", to: "/elevation-zones" }}
        maxWidth="lg"
      >
        <SubpageCard className="py-12 text-center text-slate-500">
          This elevation zone could not be loaded.
        </SubpageCard>
      </SubpageLayout>
    );
  }

  const subtitle = (zone as ElevationZone & { subtitle?: string }).subtitle;
  const filterSlug = zone.slug || zone.name;

  return (
    <SubpageLayout
      badge={
        <>
          <Mountain size={12} />
          Climate zone
        </>
      }
      title={zoneDisplayName(zone)}
      subtitle={subtitle || zone.overview}
      back={{ label: "All zones", to: "/elevation-zones" }}
      maxWidth="lg"
    >
      {zone.coverImage && (
        <div className="mb-8 overflow-hidden rounded-[1.5rem] border border-slate-200/80 shadow-lg dark:border-white/10">
          <img
            src={zone.coverImage}
            alt=""
            className="h-56 w-full object-cover md:h-72"
          />
        </div>
      )}

      {zone.overview && (
        <SubpageCard className="mb-6">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-black text-slate-900 dark:text-white">
            <CloudSun size={20} className="text-emerald-600 dark:text-emerald-400" />
            Overview
          </h2>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {zone.overview}
          </p>
        </SubpageCard>
      )}

      <SubpageCard>
        <h2 className="mb-3 text-lg font-black text-slate-900 dark:text-white">
          Universities in this zone
        </h2>
        {universities.length > 0 ? (
          <ul className="mb-4 grid gap-3 sm:grid-cols-2">
            {universities.map((u) => (
              <li key={u._id}>
                <Link
                  to={
                    u.slug || u._id
                      ? `/universities/${encodeURIComponent(u.slug || u._id)}`
                      : "/universities"
                  }
                  className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-3 transition-colors hover:border-brand-blue/30 hover:text-brand-blue dark:border-white/10 dark:bg-zinc-800/50"
                >
                  <img
                    src={u.coverImage?.trim() || UNIVERSITY_IMAGE_FALLBACK}
                    alt=""
                    className="h-12 w-12 shrink-0 rounded-xl object-cover"
                  />
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {u.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
            No universities are linked to this zone yet.
          </p>
        )}
        <Link
          to={`/universities?view=climate&zone=${encodeURIComponent(filterSlug)}`}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:border-brand-blue/40 hover:text-brand-blue dark:border-white/10 dark:text-slate-200"
        >
          Browse all universities (climate filter)
        </Link>
      </SubpageCard>
    </SubpageLayout>
  );
}
