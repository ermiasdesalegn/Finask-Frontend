import { Check, ChevronDown, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { cn } from "../../lib/utils";

export type MultiSelectOption = {
  value: string;
  label: string;
  group?: string;
};

type MultiSelectDropdownProps = {
  label: string;
  description?: string;
  placeholder?: string;
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  loading?: boolean;
  error?: string | null;
  disabled?: boolean;
  maxSelections?: number;
};

export default function MultiSelectDropdown({
  label,
  description,
  placeholder = "Select options…",
  options,
  selected,
  onChange,
  loading = false,
  error = null,
  disabled = false,
  maxSelections,
}: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const selectedSet = useMemo(() => new Set(selected), [selected]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        o.group?.toLowerCase().includes(q)
    );
  }, [options, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, MultiSelectOption[]>();
    for (const opt of filtered) {
      const key = opt.group ?? "";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(opt);
    }
    return [...map.entries()];
  }, [filtered]);

  const toggle = (value: string) => {
    if (selectedSet.has(value)) {
      onChange(selected.filter((v) => v !== value));
      return;
    }
    if (maxSelections != null && selected.length >= maxSelections) return;
    onChange([...selected, value]);
  };

  const removeOne = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter((v) => v !== value));
  };

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </span>
      {description ? (
        <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
          {description}
        </p>
      ) : null}

      <button
        type="button"
        disabled={disabled || loading}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex min-h-[3rem] w-full items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-left text-sm transition-all",
          "hover:border-brand-blue/40 focus:outline-none focus:ring-2 focus:ring-brand-blue/20",
          "disabled:cursor-not-allowed disabled:opacity-60",
          open && "border-brand-blue ring-2 ring-brand-blue/20",
          "dark:border-white/10 dark:bg-zinc-800/80"
        )}
      >
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
          {loading ? (
            <span className="text-slate-500">Loading…</span>
          ) : selected.length === 0 ? (
            <span className="text-slate-400">{placeholder}</span>
          ) : (
            selected.map((value) => {
              const name =
                options.find((o) => o.value === value)?.label ?? value;
              return (
                <span
                  key={value}
                  className="inline-flex max-w-full items-center gap-1 rounded-full bg-brand-blue/10 px-2.5 py-0.5 text-xs font-bold text-brand-blue dark:bg-brand-blue/20 dark:text-blue-300"
                >
                  <span className="truncate">{name}</span>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => removeOne(value, e)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        removeOne(value, e as unknown as React.MouseEvent);
                      }
                    }}
                    className="rounded-full p-0.5 hover:bg-brand-blue/20"
                    aria-label={`Remove ${name}`}
                  >
                    <X className="size-3" />
                  </span>
                </span>
              );
            })
          )}
        </div>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-slate-400 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {error ? (
        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : null}

      <AnimatePresence>
        {open && (
          <motion.div
            id={listId}
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50 dark:border-white/10 dark:bg-zinc-900 dark:shadow-black/40"
          >
            <div className="border-b border-slate-100 p-2 dark:border-white/10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search…"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 dark:border-white/10 dark:bg-zinc-800 dark:text-white"
                  autoFocus
                />
              </div>
            </div>

            <div className="max-h-56 overflow-y-auto overscroll-y-contain p-2">
              {filtered.length === 0 ? (
                <p className="px-3 py-4 text-center text-sm text-slate-500">
                  No matches
                </p>
              ) : (
                grouped.map(([group, items]) => (
                  <div key={group || "__flat"} className="mb-1 last:mb-0">
                    {group ? (
                      <p className="px-2 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                        {group}
                      </p>
                    ) : null}
                    <ul className="space-y-0.5">
                      {items.map((opt) => {
                        const checked = selectedSet.has(opt.value);
                        const atMax =
                          maxSelections != null &&
                          !checked &&
                          selected.length >= maxSelections;
                        return (
                          <li key={opt.value}>
                            <button
                              type="button"
                              role="option"
                              aria-selected={checked}
                              disabled={atMax}
                              onClick={() => toggle(opt.value)}
                              className={cn(
                                "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors",
                                checked
                                  ? "bg-brand-blue/10 text-brand-blue dark:bg-brand-blue/20 dark:text-blue-300"
                                  : "text-slate-800 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-zinc-800",
                                atMax && "cursor-not-allowed opacity-40"
                              )}
                            >
                              <span
                                className={cn(
                                  "flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                                  checked
                                    ? "border-brand-blue bg-brand-blue text-white"
                                    : "border-slate-300 dark:border-white/20"
                                )}
                              >
                                {checked ? <Check className="size-3" /> : null}
                              </span>
                              <span className="min-w-0 flex-1 truncate">
                                {opt.label}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))
              )}
            </div>

            {selected.length > 0 ? (
              <div className="flex items-center justify-between border-t border-slate-100 px-3 py-2 dark:border-white/10">
                <span className="text-xs text-slate-500">
                  {selected.length} selected
                </span>
                <button
                  type="button"
                  onClick={() => onChange([])}
                  className="text-xs font-bold text-slate-600 hover:text-brand-blue dark:text-slate-400"
                >
                  Clear all
                </button>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
