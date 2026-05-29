import { ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import CompareAiVerdict from "../components/compare/CompareAiVerdict";
import CompareFactsTable from "../components/compare/CompareFactsTable";
import ComparePageHero from "../components/compare/ComparePageHero";
import ComparePreferencesPanel from "../components/compare/ComparePreferencesPanel";
import CompareShortlistBar, {
  CompareLocationControls,
} from "../components/compare/CompareShortlistBar";
import { SuggestedUniversitiesRow } from "../components/shared/SuggestedRow";
import { FlickeringGrid } from "../components/ui/flickering-grid";
import { useAuth } from "../context/AuthContext";
import { useCompare } from "../context/CompareContext";
import { ApiError, showApiToast } from "../lib/api";
import {
  comparePathFromUniversityIds,
  parseValidUniversityIdsParam,
} from "../lib/compareQueue";
import {
  hasComparePreferences,
  mapComparePreferencesToApi,
  type ComparePreferences,
} from "../lib/comparePreferences";
import {
  clearCompareUserCoords,
  loadCompareUserCoords,
  saveCompareUserCoords,
} from "../lib/compareUserCoords";
import { useUniversitiesCompareQuery } from "../lib/queries/compare";
import { useSuggestedByLocationQuery } from "../lib/queries/universities";
import { blurReveal } from "../lib/motion/pageMotion";
import { cn } from "../lib/utils";

export default function ComparePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { ids: queueIds, remove, clear } = useCompare();
  const [coords, setCoords] = useState(() => loadCompareUserCoords());
  const [geoPending, setGeoPending] = useState(false);
  const [submittedPrefs, setSubmittedPrefs] =
    useState<ComparePreferences | null>(null);
  const [programNames, setProgramNames] = useState<string[]>([]);
  const [prefsExpanded, setPrefsExpanded] = useState(true);

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

  const apiPreferences = useMemo(
    () => mapComparePreferencesToApi(submittedPrefs, programNames),
    [submittedPrefs, programNames]
  );

  const compareQuery = useUniversitiesCompareQuery({
    universityIds: effectiveIds,
    userCoordinates: coords,
    preferences: apiPreferences,
    enabled: effectiveIds.length >= 2 && effectiveIds.length <= 3,
  });

  const suggestedQuery = useSuggestedByLocationQuery(
    isAuthenticated && effectiveIds.length >= 2
  );

  const suggestedUniversities = useMemo(() => {
    const list = suggestedQuery.data?.data?.universities ?? [];
    const compared = new Set(effectiveIds);
    return list
      .filter((u) => {
        const id = u._id ?? u.id;
        return id && !compared.has(String(id));
      })
      .slice(0, 6);
  }, [suggestedQuery.data, effectiveIds]);

  const data = compareQuery.data?.data;
  const cols = data?.universities ?? [];
  const facts = data?.comparisonFacts ?? [];
  const aiSummary = data?.aiSummary ?? null;
  const personalized = hasComparePreferences(submittedPrefs);

  const handlePreferencesSubmit = useCallback(
    (prefs: ComparePreferences, names: string[]) => {
      setSubmittedPrefs(prefs);
      setProgramNames(names);
      setPrefsExpanded(false);
    },
    []
  );

  const prefsCollapsed = submittedPrefs != null && !prefsExpanded;

  const handleRemoveUniversity = useCallback(
    (id: string) => {
      remove(id);
      const nextIds = effectiveIds.filter((x) => x !== id);
      setSubmittedPrefs(null);
      setProgramNames([]);
      if (nextIds.length >= 2) {
        navigate(comparePathFromUniversityIds(nextIds), { replace: true });
      } else {
        navigate("/compare", { replace: true });
      }
    },
    [remove, effectiveIds, navigate]
  );

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

  const locationControls = (
    <CompareLocationControls
      hasCoords={Boolean(coords)}
      geoPending={geoPending}
      fetching={compareQuery.isFetching}
      onRequestLocation={requestLocation}
      onClearLocation={dropCoords}
    />
  );

  return (
    <div className="relative min-h-screen overflow-hidden pb-24 pt-16 transition-colors dark:bg-[#0a0a0a] md:pt-20">
      <FlickeringGrid
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.12] dark:opacity-[0.08]"
        color="#60A5FA"
        maxOpacity={0.15}
        squareSize={4}
        gridGap={8}
        flickerChance={0.12}
      />
      <div
        className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-brand-blue/20 blur-[120px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 top-1/3 h-80 w-80 rounded-full bg-brand-yellow/15 blur-[100px]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <motion.header
          initial="hidden"
          animate="show"
          variants={blurReveal}
          className={cn(
            "-mx-2 mb-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/60 bg-white/75 px-4 py-2.5 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/75 md:mb-12",
            effectiveIds.length >= 2 &&
              "sticky top-16 z-20 mb-8 md:top-20 md:mb-10"
          )}
        >
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-full bg-slate-100 p-2.5 transition-colors hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-slate-700 dark:text-slate-200" />
          </button>
          {effectiveIds.length >= 2 ? (
            <span className="rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-black text-brand-blue">
              {effectiveIds.length} schools selected
            </span>
          ) : null}
          {effectiveIds.length >= 2 ? locationControls : null}
        </motion.header>

        <ComparePageHero
          subtitle={
            effectiveIds.length >= 2
              ? "Side-by-side facts for your selected schools. Personalize below for a tailored AI verdict."
              : "Add up to 3 schools from any university page, then compare rank, climate, generation, and excellence."
          }
        >
          {usingQueue && effectiveIds.length >= 2 ? (
            <p className="mt-3 text-xs font-medium text-brand-blue">
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
        </ComparePageHero>

        {effectiveIds.length < 2 ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-8 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/80"
          >
            <h2 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
              Pick 2–3 universities
            </h2>
            <ol className="mb-6 list-decimal space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-400">
              <li>Browse the university directory or open a school profile.</li>
              <li>Tap the compare icon in the header to add it (max 3).</li>
              <li>Return here or use the navbar compare button to view results.</li>
            </ol>

            {queueIds.length > 0 ? (
              <div className="mb-6">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Your compare list ({queueIds.length}/3)
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
                {queueIds.length === 1 ? (
                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                    Add one more school to open the comparison table.
                  </p>
                ) : null}
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
          <div className="flex flex-col items-center justify-center gap-3 rounded-[2rem] border border-slate-200/80 bg-white/90 py-24 backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/80">
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
            <CompareShortlistBar
              universities={cols}
              onRemove={handleRemoveUniversity}
            />

            <ComparePreferencesPanel
              onSubmit={handlePreferencesSubmit}
              pending={compareQuery.isFetching && personalized}
              collapsed={prefsCollapsed}
              onExpand={() => setPrefsExpanded(true)}
              programNamesPreview={programNames}
            />

            <CompareAiVerdict
              summary={aiSummary}
              personalized={personalized}
            />

            <CompareFactsTable universities={cols} facts={facts} />

            {isAuthenticated ? (
              <SuggestedUniversitiesRow
                title="You might also like"
                subtitle="Other schools students explore"
                universities={suggestedUniversities}
                loading={suggestedQuery.isPending}
                viewAllHref="/universities"
              />
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
