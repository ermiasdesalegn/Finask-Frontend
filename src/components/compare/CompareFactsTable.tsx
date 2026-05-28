import { motion } from "motion/react";
import { UNIVERSITY_IMAGE_FALLBACK } from "../../constants/defaultMediaFallbacks";
import { staggerBlurContainer, staggerBlurItem } from "../../lib/motion/pageMotion";
import { universityPath } from "../../lib/universityUi";
import { cn } from "../../lib/utils";
import type {
  CompareUniversityColumn,
  ComparisonFactRow,
} from "../../types";
import { Link } from "react-router-dom";

type CompareFactsTableProps = {
  universities: CompareUniversityColumn[];
  facts: ComparisonFactRow[];
};

/** Highlight cells that look like a top rank (#1). */
function isHighlightValue(value: string | number | undefined): boolean {
  if (value == null) return false;
  const s = String(value);
  return /#\s*1\b/i.test(s) || /^1\s*(st|\/)/i.test(s);
}

export default function CompareFactsTable({
  universities,
  facts,
}: CompareFactsTableProps) {
  return (
    <section>
      <div className="mb-4 flex items-center gap-3">
        <div className="h-6 w-1.5 rounded-full bg-brand-blue shadow-[0_0_12px_rgba(37,99,235,0.45)]" />
        <h2 className="text-xl font-black text-slate-900 dark:text-white">
          Fact matrix
        </h2>
      </div>

      <div className="overflow-x-auto rounded-[2rem] border border-slate-100 shadow-xl dark:border-white/10">
        <table className="w-full min-w-[640px] border-collapse bg-white text-left dark:bg-[#1e1e1e]">
          <thead>
            <tr className="bg-slate-50 dark:bg-white/5">
              <th className="p-6 text-left text-xs font-bold uppercase tracking-widest text-slate-400">
                Criteria
              </th>
              {universities.map((u) => (
                <th key={String(u.id)} className="p-6">
                  <Link
                    to={u.slug ? universityPath(u.slug) : "#"}
                    className="flex items-center gap-3 transition hover:opacity-90"
                  >
                    <img
                      src={u.coverImage?.trim() || UNIVERSITY_IMAGE_FALLBACK}
                      alt=""
                      className="h-11 w-11 shrink-0 rounded-lg object-cover ring-1 ring-slate-200/80 dark:ring-white/10"
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
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <motion.tbody
            variants={staggerBlurContainer}
            initial="hidden"
            animate="show"
            className="divide-y divide-slate-50 dark:divide-white/5"
          >
            {facts.map((row) => (
              <motion.tr
                key={row.label}
                variants={staggerBlurItem}
                className="transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
              >
                <td className="whitespace-nowrap p-6 text-sm font-bold text-slate-600 dark:text-slate-400">
                  {row.label}
                </td>
                {universities.map((u) => {
                  const val = row.values[u.abbreviation];
                  const highlight = isHighlightValue(val);
                  return (
                    <td
                      key={`${row.label}-${String(u.id)}`}
                      className={cn(
                        "p-6 text-sm text-slate-900 dark:text-slate-100",
                        highlight && "bg-brand-blue/5 font-semibold dark:bg-brand-blue/10"
                      )}
                    >
                      {val ?? "—"}
                    </td>
                  );
                })}
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>
    </section>
  );
}
