import { ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { comparePathFromUniversityIds } from "../../lib/compareQueue";
import {
  displayRating,
  universityCity,
  universityClimateFocus,
  universityCover,
  universityRank,
} from "../../lib/universityUi";
import type { University } from "../../types";

const ComparisonEngine = ({
  universities,
  loading,
}: {
  universities: University[];
  loading: boolean;
}) => {
  const slice = universities.slice(0, 3);

  if (loading && slice.length === 0) {
    return (
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <div className="mx-auto mb-4 h-10 w-64 animate-pulse rounded-lg bg-slate-100 dark:bg-zinc-800" />
            <div className="mx-auto h-4 w-96 max-w-full animate-pulse rounded bg-slate-100 dark:bg-zinc-800" />
          </div>
          <div className="h-64 animate-pulse rounded-[2rem] bg-slate-100 dark:bg-zinc-800" />
        </div>
      </section>
    );
  }

  if (slice.length === 0) {
    return null;
  }

  const compareIds = slice
    .map((u) => u._id)
    .filter((id): id is string => typeof id === "string" && Boolean(id));
  const compareHref = comparePathFromUniversityIds(compareIds);

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <h2 className="mb-4 text-4xl font-bold dark:text-white">
            Comparison Engine
          </h2>
          <p className="mx-auto mb-6 max-w-xl text-slate-600 dark:text-slate-400">
            Make data-driven decisions with side-by-side analysis
          </p>
          <Link
            to={compareHref}
            className="inline-flex items-center gap-2 rounded-full bg-brand-blue px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700"
          >
            Open full comparison
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="overflow-x-auto rounded-[2rem] border border-slate-100 shadow-xl dark:border-white/10">
          <table className="w-full border-collapse bg-white text-left dark:bg-[#1e1e1e]">
            <thead>
              <tr className="bg-slate-50 dark:bg-white/5">
                <th className="p-6 text-sm font-bold uppercase tracking-widest text-slate-400">
                  Criteria
                </th>
                {slice.map((uni) => (
                  <th key={uni.slug || uni._id} className="p-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={universityCover(uni)}
                        className="h-10 w-10 rounded-lg object-cover"
                        alt=""
                      />
                      <span className="font-bold dark:text-white">
                        {uni.name}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-white/5">
              {[
                { label: "National Ranking", key: "ranking" as const },
                { label: "Student Rating", key: "rating" as const },
                { label: "Climate / focus", key: "climate" as const },
                { label: "City", key: "region" as const },
              ].map((row, i) => (
                <tr
                  key={i}
                  className="transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
                >
                  <td className="p-6 font-bold text-slate-600 dark:text-slate-400">
                    {row.label}
                  </td>
                  {slice.map((uni) => (
                    <td
                      key={uni.slug || uni._id}
                      className="p-6 dark:text-white"
                    >
                      {row.key === "rating" ? (
                        <div className="flex items-center gap-1 font-bold">
                          <Star
                            size={14}
                            className="text-brand-yellow"
                            fill="currentColor"
                          />
                          {displayRating(uni)}
                        </div>
                      ) : row.key === "ranking" ? (
                        universityRank(uni)
                      ) : row.key === "climate" ? (
                        universityClimateFocus(uni)
                      ) : (
                        universityCity(uni) || "—"
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          <Link
            to={compareHref}
            className="font-semibold text-brand-blue underline-offset-4 hover:underline"
          >
            Detailed compare page
          </Link>{" "}
          — full API rows, your location for distance, AI summary.
        </p>
      </div>
    </section>
  );
};

export default ComparisonEngine;
