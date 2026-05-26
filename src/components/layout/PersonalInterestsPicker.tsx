import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../lib/queryKeys";
import { formatInterestLabel } from "../../lib/userProfile";
import { fetchInterestCatalog } from "../../lib/services/interestService";

type PersonalInterestsPickerProps = {
  selectedNames: string[];
  onToggle: (name: string) => void;
  enabled?: boolean;
};

export default function PersonalInterestsPicker({
  selectedNames,
  onToggle,
  enabled = true,
}: PersonalInterestsPickerProps) {
  const catalogQuery = useQuery({
    queryKey: queryKeys.interestsCatalog(),
    queryFn: fetchInterestCatalog,
    enabled,
    staleTime: 10 * 60_000,
  });

  const catalog = catalogQuery.data ?? {};
  const categories = Object.keys(catalog);

  return (
    <div>
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
        Personal interests
      </span>
      <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
        Optional hobbies and activities shown on your public profile.
      </p>
      {catalogQuery.isPending && (
        <p className="text-sm text-slate-500">Loading interests…</p>
      )}
      {catalogQuery.isError && (
        <p className="text-sm text-red-600 dark:text-red-400">
          Could not load interests. Check your connection and try again.
        </p>
      )}
      {!catalogQuery.isPending &&
        !catalogQuery.isError &&
        categories.length === 0 && (
          <p className="text-sm text-slate-500">
            No interests available. Run backend seed for interests.
          </p>
        )}
      {categories.length > 0 && (
        <div
          className="max-h-56 space-y-4 overflow-y-auto overscroll-y-contain rounded-2xl border border-slate-200 bg-slate-50/80 p-3 dark:border-white/10 dark:bg-zinc-800/80"
          role="group"
          aria-label="Personal interests"
        >
          {categories.map((category) => (
            <div key={category}>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {category}
              </p>
              <ul className="space-y-1.5">
                {(catalog[category] ?? []).map((name) => {
                  const key = name.toLowerCase();
                  const checked = selectedNames.some(
                    (n) => n.toLowerCase() === key
                  );
                  return (
                    <li key={key}>
                      <label className="flex cursor-pointer items-start gap-3 rounded-xl px-2 py-1.5 text-sm text-slate-800 hover:bg-white dark:text-slate-200 dark:hover:bg-zinc-700">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => onToggle(key)}
                          className="mt-0.5 size-4 shrink-0 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
                        />
                        <span>{formatInterestLabel(name)}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
