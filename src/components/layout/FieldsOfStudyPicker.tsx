import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../lib/queryKeys";
import { fetchProgramsList } from "../../lib/services/programService";

const programsFilters = {
  limit: 300,
  sort: "name" as const,
  fields: "_id,name",
} as const;

type FieldsOfStudyPickerProps = {
  selectedIds: string[];
  onToggle: (id: string) => void;
  enabled?: boolean;
};

export default function FieldsOfStudyPicker({
  selectedIds,
  onToggle,
  enabled = true,
}: FieldsOfStudyPickerProps) {
  const programsQuery = useQuery({
    queryKey: queryKeys.programsList(programsFilters),
    queryFn: () => fetchProgramsList(programsFilters),
    enabled,
  });

  const programs = programsQuery.data?.data.programs ?? [];

  return (
    <div>
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
        Fields of study
      </span>
      <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
        Pick at least one program you care about (required).
      </p>
      {programsQuery.isPending && (
        <p className="text-sm text-slate-500">Loading programs…</p>
      )}
      {programsQuery.isError && (
        <p className="text-sm text-red-600 dark:text-red-400">
          Could not load programs. Check your connection and try again.
        </p>
      )}
      {!programsQuery.isPending && !programsQuery.isError && programs.length === 0 && (
        <p className="text-sm text-slate-500">No programs available.</p>
      )}
      {programs.length > 0 && (
        <div
          className="max-h-44 space-y-2 overflow-y-auto overscroll-y-contain rounded-2xl border border-slate-200 bg-slate-50/80 p-3 dark:border-white/10 dark:bg-zinc-800/80"
          role="group"
          aria-label="Fields of study"
        >
          {programs.map((p) => {
            const id = p._id || p.id;
            if (!id) return null;
            const checked = selectedIds.includes(id);
            return (
              <label
                key={id}
                className="flex cursor-pointer items-start gap-3 rounded-xl px-2 py-1.5 text-sm text-slate-800 hover:bg-white dark:text-slate-200 dark:hover:bg-zinc-700"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(id)}
                  className="mt-0.5 size-4 shrink-0 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
                />
                <span>{p.name}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
