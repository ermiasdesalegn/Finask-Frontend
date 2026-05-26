import { ChevronRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { universityCover, universityPath } from "../../lib/universityUi";
import type { City, University } from "../../types";

type UniversityRowProps = {
  title: string;
  subtitle?: string;
  universities: University[];
  loading?: boolean;
  viewAllHref?: string;
};

export function SuggestedUniversitiesRow({
  title,
  subtitle,
  universities,
  loading,
  viewAllHref,
}: UniversityRowProps) {
  if (loading) {
    return (
      <section className="mt-10">
        <h2 className="mb-4 text-xl font-black text-slate-900 dark:text-white">
          {title}
        </h2>
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin text-brand-blue" size={28} />
        </div>
      </section>
    );
  }

  if (!universities.length) return null;

  return (
    <section className="mt-10">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          ) : null}
        </div>
        {viewAllHref ? (
          <Link
            to={viewAllHref}
            className="flex items-center gap-1 text-sm font-bold text-brand-blue hover:underline"
          >
            View all <ChevronRight size={16} />
          </Link>
        ) : null}
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
        {universities.map((u) => (
          <Link
            key={u._id ?? u.slug}
            to={universityPath(u)}
            className="group w-56 shrink-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all hover:border-brand-blue/30 hover:shadow-md dark:border-white/10 dark:bg-zinc-900"
          >
            <div className="relative h-32 overflow-hidden bg-slate-100 dark:bg-zinc-800">
              <img
                src={universityCover(u)}
                alt=""
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-3">
              <p className="line-clamp-2 font-bold text-slate-900 group-hover:text-brand-blue dark:text-white">
                {u.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

type CityRowProps = {
  title: string;
  cities: City[];
  loading?: boolean;
};

export function SuggestedCitiesRow({ title, cities, loading }: CityRowProps) {
  if (loading) {
    return (
      <section className="mt-10">
        <h2 className="mb-4 text-xl font-black text-slate-900 dark:text-white">
          {title}
        </h2>
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin text-brand-blue" size={28} />
        </div>
      </section>
    );
  }

  if (!cities.length) return null;

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-xl font-black text-slate-900 dark:text-white">
        {title}
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {cities.map((c) => (
          <Link
            key={c._id}
            to={`/cities/${c.slug ?? c._id}`}
            className="group w-48 shrink-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all hover:border-brand-blue/30 dark:border-white/10 dark:bg-zinc-900"
          >
            <div className="relative h-28 bg-slate-100 dark:bg-zinc-800">
              {c.coverImage ? (
                <img
                  src={c.coverImage}
                  alt=""
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">
                  {c.name}
                </div>
              )}
            </div>
            <p className="p-3 font-bold text-slate-900 group-hover:text-brand-blue dark:text-white">
              {c.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
