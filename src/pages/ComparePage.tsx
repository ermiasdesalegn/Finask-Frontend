import { ArrowLeft, Loader2, MapPin, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { UNIVERSITY_IMAGE_FALLBACK } from "../constants/defaultMediaFallbacks";
import { useCompare } from "../context/CompareContext";
import { ApiError, showApiToast } from "../lib/api";
import {
  comparePathFromUniversityIds,
  parseValidUniversityIdsParam,
} from "../lib/compareQueue";
import {
  clearCompareUserCoords,
  loadCompareUserCoords,
  saveCompareUserCoords,
} from "../lib/compareUserCoords";
import { useUniversitiesCompareQuery } from "../lib/queries/compare";
import { blurReveal } from "../lib/motion/pageMotion";
import { cn } from "../lib/utils";

export default function ComparePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { ids: queueIds, remove, clear } = useCompare();
  const [coords, setCoords] = useState(() => loadCompareUserCoords());
  const [geoPending, setGeoPending] = useState(false);

  const urlIds = useMemo(
    () => parseValidUniversityIdsParam(searchParams.get("ids")),
    [searchParams]
  );

  const effectiveIds = useMemo(() => {
    const fromUrl = urlIds.slice(0, 3);
    if (fromUrl.length >= 2) return fromUrl;
    return queueIds.slice(0, 3);
  }, [urlIds, queueIds]);

  const usingQueue = urlIds.length < 2 && effectiveIds.length >= 2;

  const compareQuery = useUniversitiesCompareQuery({
    universityIds: effectiveIds,
    userCoordinates: coords,
    enabled: effectiveIds.length >= 2 && effectiveIds.length <= 3,
  });

  const data = compareQuery.data?.data;
  const cols = data?.universities ?? [];
  const facts = data?.comparisonFacts ?? [];
  const summary = data?.aiSummary;

  const requestLocation = () => {
    if (!navigator.geolocation) {
      showApiToast("Location is not supported in this browser.");
      return;
    }
    setGeoPending(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        saveCompareUserCoords(c);
        setCoords(c);
        setGeoPending(false);
        showApiToast(
          "Saved. Distance may appear in the table when we can match your area to campus locations."
        );
      },
      () => {
        setGeoPending(false);
        showApiToast("Could not read your location. Check browser permissions.");
      },
      { enableHighAccuracy: false, timeout: 12_000, maximumAge: 300_000 }
    );
  };

  const dropCoords = () => {
    clearCompareUserCoords();
    setCoords(null);
    void compareQuery.refetch();
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 pt-24 transition-colors dark:bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="show"
          variants={blurReveal}
          className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mt-1 rounded-full bg-slate-200/80 p-2.5 transition-colors hover:bg-slate-300 dark:bg-zinc-800 dark:hover:bg-zinc-700"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-slate-700 dark:text-slate-200" />
            </button>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-4xl">
                Comparison Engine
              </h1>
              <p className="mt-1 max-w-xl text-sm text-slate-600 dark:text-slate-400">
                Rankings, climate, programs, and more in one view—everything
                below is what you need to weigh your options. Location is
                optional: it can add distance when we can match it to these
                campuses.
              </p>
              {usingQueue ? (
                <p className="mt-2 text-xs font-medium text-brand-blue">
                  Using your compare list (
                  <Link
                    to={comparePathFromUniversityIds(effectiveIds)}
                    className="underline"
                  >
                    share this link
                  </Link>
                  ).
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={geoPending || compareQuery.isFetching}
              onClick={requestLocation}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-60 dark:border-white/10 dark:bg-zinc-900 dark:text-slate-100 dark:hover:bg-zinc-800"
              )}
            >
              {geoPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MapPin className="h-4 w-4 text-brand-blue" />
              )}
              {coords ? "Update my location" : "Use my location"}
            </button>
            {coords ? (
              <button
                type="button"
                onClick={dropCoords}
                className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                Clear location
              </button>
            ) : null}
          </div>
        </motion.div>

        {effectiveIds.length < 2 ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-[#141414]"
          >
            <h2 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
              Pick 2–3 universities
            </h2>
            <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
              Use{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Add to compare
              </span>{" "}
              on a university page, add schools from the directory, or open a
              link from the home comparison preview.
            </p>

            {queueIds.length > 0 ? (
              <div className="mb-6">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Your compare list
                </p>
                <ul className="flex flex-wrap gap-2">
                  {queueIds.map((id) => (
                    <li
                      key={id}
                      className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-mono text-slate-700 dark:bg-zinc-800 dark:text-slate-300"
                    >
                      {id.slice(0, 8)}…
                      <button
                        type="button"
                        onClick={() => remove(id)}
                        className="ml-1 font-sans text-slate-500 hover:text-red-600"
                        aria-label="Remove"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => clear()}
                  className="mt-3 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                >
                  Clear list
                </button>
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <Link
                to="/universities"
                className="rounded-full bg-brand-blue px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700"
              >
                Browse universities
              </Link>
              <Link
                to="/"
                className="rounded-full border border-slate-200 px-6 py-2.5 text-sm font-bold text-slate-800 dark:border-white/15 dark:text-white"
              >
                Back to home
              </Link>
            </div>
          </motion.div>
        ) : compareQuery.isPending ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-[2rem] border border-slate-200 bg-white py-24 dark:border-white/10 dark:bg-[#141414]">
            <Loader2 className="h-10 w-10 animate-spin text-brand-blue" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Building comparison…
            </p>
          </div>
        ) : compareQuery.isError ? (
          <div className="rounded-[2rem] border border-red-200 bg-red-50 p-8 dark:border-red-900/40 dark:bg-red-950/30">
            <p className="font-bold text-red-800 dark:text-red-200">
              {compareQuery.error instanceof ApiError
                ? compareQuery.error.message
                : "Could not load comparison."}
            </p>
            <button
              type="button"
              onClick={() => void compareQuery.refetch()}
              className="mt-4 rounded-full bg-red-700 px-5 py-2 text-sm font-bold text-white hover:bg-red-800"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            {summary ? (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#141414]"
              >
                <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-brand-blue">
                  <Sparkles className="h-4 w-4" aria-hidden />
                  At a glance
                </div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {summary}
                </p>
                <p className="mt-4 border-t border-slate-100 pt-4 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
                  This is a quick narrative to complement the table—not a
                  single “right answer.” Your priorities still decide the best fit.
                </p>
              </motion.div>
            ) : null}

            {!summary ? (
              <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
                You&apos;re all set—everything you need to compare these schools
                is in the table below.
              </p>
            ) : null}

            <div className="overflow-x-auto rounded-[2rem] border border-slate-200 shadow-lg dark:border-white/10">
              <table className="w-full min-w-[640px] border-collapse bg-white text-left dark:bg-[#1e1e1e]">
                <thead>
                  <tr className="bg-slate-50 dark:bg-white/5">
                    <th className="p-5 text-left text-xs font-bold uppercase tracking-widest text-slate-400">
                      Criteria
                    </th>
                    {cols.map((u) => (
                      <th key={String(u.id)} className="p-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              u.coverImage?.trim() || UNIVERSITY_IMAGE_FALLBACK
                            }
                            alt=""
                            className="h-11 w-11 shrink-0 rounded-lg object-cover"
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 dark:text-white">
                              {u.name}
                            </div>
                            {u.city ? (
                              <div className="truncate text-xs text-slate-500 dark:text-slate-400">
                                {u.city}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {facts.map((row) => (
                    <tr
                      key={row.label}
                      className="transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
                    >
                      <td className="whitespace-nowrap p-5 text-sm font-bold text-slate-600 dark:text-slate-400">
                        {row.label}
                      </td>
                      {cols.map((u) => (
                        <td
                          key={`${row.label}-${String(u.id)}`}
                          className="p-5 text-sm text-slate-900 dark:text-slate-100"
                        >
                          {row.values[u.abbreviation] ?? "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
