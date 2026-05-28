import { MapPin, X } from "lucide-react";
import { Link } from "react-router-dom";
import { UNIVERSITY_IMAGE_FALLBACK } from "../../constants/defaultMediaFallbacks";
import { universityPath } from "../../lib/universityUi";
import { cn } from "../../lib/utils";
import type { CompareUniversityColumn } from "../../types";

type CompareShortlistBarProps = {
  universities: CompareUniversityColumn[];
  onRemove: (id: string) => void;
  locationSlot?: React.ReactNode;
};

export default function CompareShortlistBar({
  universities,
  onRemove,
  locationSlot,
}: CompareShortlistBarProps) {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-6 w-1.5 rounded-full bg-brand-yellow shadow-[0_0_12px_rgba(250,204,21,0.5)]" />
          <h2 className="text-lg font-black text-slate-900 dark:text-white">
            Your shortlist ({universities.length}/3)
          </h2>
        </div>
        {locationSlot}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {universities.map((u) => (
          <article
            key={String(u.id)}
            className="group relative overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-md transition hover:border-brand-blue/30 hover:shadow-xl dark:border-white/10 dark:bg-zinc-900/60"
          >
            <button
              type="button"
              onClick={() => onRemove(String(u.id))}
              className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-1.5 text-slate-500 shadow-sm transition hover:bg-red-50 hover:text-red-600 dark:bg-zinc-800 dark:hover:bg-red-950/50 dark:hover:text-red-400"
              aria-label={`Remove ${u.name} from comparison`}
            >
              <X className="h-4 w-4" />
            </button>
            <Link
              to={u.slug ? universityPath(u.slug) : "#"}
              className="flex gap-4"
            >
              <img
                src={u.coverImage?.trim() || UNIVERSITY_IMAGE_FALLBACK}
                alt=""
                className="h-16 w-16 shrink-0 rounded-xl object-cover ring-2 ring-white dark:ring-zinc-800"
              />
              <div className="min-w-0 pr-8">
                <h3 className="truncate font-black text-slate-900 dark:text-white">
                  {u.name}
                </h3>
                {u.city ? (
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <MapPin className="h-3 w-3 shrink-0 text-brand-blue" />
                    {u.city}
                  </p>
                ) : null}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {u.ratingsAverage != null && u.ratingsAverage > 0 ? (
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-black text-brand-blue dark:bg-brand-blue/15">
                      ★ {u.ratingsAverage.toFixed(1)}
                    </span>
                  ) : null}
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:bg-zinc-800 dark:text-slate-400">
                    {u.abbreviation}
                  </span>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

/** Location controls for the shortlist header row. */
export function CompareLocationControls({
  hasCoords,
  geoPending,
  fetching,
  onRequestLocation,
  onClearLocation,
}: {
  hasCoords: boolean;
  geoPending: boolean;
  fetching: boolean;
  onRequestLocation: () => void;
  onClearLocation: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        disabled={geoPending || fetching}
        onClick={onRequestLocation}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur-md transition hover:bg-slate-50 disabled:opacity-60 dark:border-white/10 dark:bg-zinc-900/80 dark:text-slate-100 dark:hover:bg-zinc-800"
        )}
      >
        <MapPin className="h-4 w-4 text-brand-blue" />
        {hasCoords ? "Update location" : "Use my location"}
      </button>
      {hasCoords ? (
        <button
          type="button"
          onClick={onClearLocation}
          className="rounded-full px-3 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          Clear
        </button>
      ) : null}
    </div>
  );
}
