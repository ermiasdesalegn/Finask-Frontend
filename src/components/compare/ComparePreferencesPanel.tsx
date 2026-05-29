import { useQuery } from "@tanstack/react-query";
import {
  ChevronDown,
  Loader2,
  MessageCircle,
  Pencil,
  Send,
  Sparkles,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import MultiSelectDropdown from "../ui/MultiSelectDropdown";
import { useAuth } from "../../context/AuthContext";
import {
  canSubmitComparePreferences,
  COMPARE_CAMPUS_SETTING_OPTIONS,
  COMPARE_LEARNING_MODE_OPTIONS,
  COMPARE_PRIORITY_OPTIONS,
  type CompareCampusSetting,
  type CompareLearningMode,
  type ComparePreferences,
  type ComparePriority,
} from "../../lib/comparePreferences";
import { queryKeys } from "../../lib/queryKeys";
import { fetchInterestCatalog } from "../../lib/services/interestService";
import { fetchProgramsList } from "../../lib/services/programService";
import {
  fieldsOfInterestIds,
  formatInterestLabel,
  userInterestNames,
} from "../../lib/userProfile";
import { cn } from "../../lib/utils";

type ChatMessage = { role: "user" | "assistant"; text: string };

const programsFilters = {
  limit: 300,
  sort: "name" as const,
  fields: "_id,name",
} as const;

type ComparePreferencesPanelProps = {
  onSubmit: (prefs: ComparePreferences, programNames: string[]) => void;
  pending?: boolean;
  collapsed?: boolean;
  onExpand?: () => void;
  programNamesPreview?: string[];
};

function chatToNotes(messages: ChatMessage[]): string {
  return messages
    .filter((m) => m.text.trim())
    .map((m) => `${m.role === "user" ? "Student" : "Note"}: ${m.text.trim()}`)
    .join("\n")
    .slice(0, 800);
}

function ChipGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T | undefined;
  onChange: (v: T | undefined) => void;
}) {
  return (
    <div>
      <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(active ? undefined : opt)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-bold transition",
                active
                  ? "bg-brand-blue text-white shadow-md shadow-brand-blue/25"
                  : "border border-slate-200 bg-slate-50 text-slate-700 hover:border-brand-blue/30 dark:border-white/10 dark:bg-zinc-800 dark:text-slate-200"
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ComparePreferencesPanel({
  onSubmit,
  pending = false,
  collapsed = false,
  onExpand,
  programNamesPreview = [],
}: ComparePreferencesPanelProps) {
  const { user } = useAuth();
  const profileInitialized = useRef(false);

  const [programIds, setProgramIds] = useState<string[]>([]);
  const [interestNames, setInterestNames] = useState<string[]>([]);
  const [priorities, setPriorities] = useState<ComparePriority[]>([]);
  const [freeText, setFreeText] = useState("");
  const [learningMode, setLearningMode] = useState<
    CompareLearningMode | undefined
  >();
  const [campusSetting, setCampusSetting] = useState<
    CompareCampusSetting | undefined
  >();
  const [needsAirport, setNeedsAirport] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const programsQuery = useQuery({
    queryKey: queryKeys.programsList(programsFilters),
    queryFn: () => fetchProgramsList(programsFilters),
  });
  const programs = programsQuery.data?.data.programs ?? [];

  const catalogQuery = useQuery({
    queryKey: queryKeys.interestsCatalog(),
    queryFn: fetchInterestCatalog,
    staleTime: 10 * 60_000,
  });
  const catalog = catalogQuery.data ?? {};

  const programOptions = useMemo(
    () =>
      programs
        .map((p) => {
          const id = p._id || p.id;
          if (!id) return null;
          return { value: id, label: p.name };
        })
        .filter((o): o is { value: string; label: string } => o != null),
    [programs]
  );

  const interestOptions = useMemo(() => {
    const out: { value: string; label: string; group?: string }[] = [];
    for (const category of Object.keys(catalog)) {
      for (const name of catalog[category] ?? []) {
        out.push({
          value: name.toLowerCase(),
          label: formatInterestLabel(name),
          group: category,
        });
      }
    }
    return out;
  }, [catalog]);

  useEffect(() => {
    if (!user || profileInitialized.current) return;
    profileInitialized.current = true;
    const fromProfilePrograms = fieldsOfInterestIds(user);
    const fromProfileInterests = userInterestNames(user);
    if (fromProfilePrograms.length) setProgramIds(fromProfilePrograms);
    if (fromProfileInterests.length) setInterestNames(fromProfileInterests);
  }, [user]);

  const togglePriority = useCallback((p: ComparePriority) => {
    setPriorities((prev) => {
      if (prev.includes(p)) return prev.filter((x) => x !== p);
      if (prev.length >= 3) return prev;
      return [...prev, p];
    });
  }, []);

  const sendChat = () => {
    const text = chatInput.trim();
    if (!text) return;
    setChatMessages((prev) => [...prev, { role: "user", text }]);
    setChatInput("");
  };

  const draftPrefs: ComparePreferences = {
    programIds,
    interestNames,
    ...(priorities.length ? { priorities } : {}),
    ...(freeText.trim() ? { freeText: freeText.trim() } : {}),
    ...(chatMessages.length ? { chatNotes: chatToNotes(chatMessages) } : {}),
    ...(learningMode ? { learningMode } : {}),
    ...(campusSetting ? { campusSetting } : {}),
    ...(needsAirport ? { needsAirport } : {}),
  };

  const canSubmit = canSubmitComparePreferences(draftPrefs);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    const programNames = programIds
      .map((id) => {
        const p = programs.find((prog) => String(prog._id ?? prog.id) === id);
        return p?.name;
      })
      .filter((n): n is string => Boolean(n));

    onSubmit(draftPrefs, programNames);
  };

  const collapsedSummary = useMemo(() => {
    const parts: string[] = [];
    const programs =
      programNamesPreview.length > 0
        ? programNamesPreview
        : programIds
            .map((id) => programOptions.find((o) => o.value === id)?.label)
            .filter(Boolean) as string[];
    if (programs.length) {
      parts.push(
        programs.length <= 2
          ? programs.join(", ")
          : `${programs.slice(0, 2).join(", ")} +${programs.length - 2} more`
      );
    }
    if (priorities.length) parts.push(priorities.join(" · "));
    if (learningMode) parts.push(learningMode);
    if (campusSetting) parts.push(campusSetting);
    return parts.length ? parts.join(" · ") : "Preferences saved";
  }, [
    programNamesPreview,
    programIds,
    programOptions,
    priorities,
    learningMode,
    campusSetting,
  ]);

  if (collapsed) {
    return (
      <section
        id="compare-preferences"
        className="mb-6 overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/90 px-5 py-4 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/80"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-blue">
              Your preferences
            </p>
            <p className="mt-1 truncate text-sm font-medium text-slate-700 dark:text-slate-300">
              {collapsedSummary}
            </p>
          </div>
          <button
            type="button"
            onClick={onExpand}
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-800 transition hover:border-brand-blue/40 hover:text-brand-blue dark:border-white/10 dark:bg-zinc-800 dark:text-slate-100"
          >
            <Pencil className="size-4" />
            Edit & recompare
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      id="compare-preferences"
      className="mb-6 overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/80"
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-brand-blue">
            Your preferences
          </p>
          <h2 className="mt-1 text-lg font-black text-slate-900 dark:text-white">
            Personalize this comparison
          </h2>
          <p className="mt-1 max-w-xl text-sm text-slate-600 dark:text-slate-400">
            {user
              ? "We pre-filled from your profile. Change anything here — your selections take priority."
              : "Tell us what matters so AI can recommend the best fit."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <MultiSelectDropdown
          label="Fields of study"
          description="Pick at least one program you care about."
          placeholder="Select programs…"
          options={programOptions}
          selected={programIds}
          onChange={setProgramIds}
          loading={programsQuery.isPending}
          error={
            programsQuery.isError
              ? "Could not load programs. Check your connection."
              : null
          }
        />

        <MultiSelectDropdown
          label="Personal interests"
          description="Optional — hobbies and activities that matter to you."
          placeholder="Select interests…"
          options={interestOptions}
          selected={interestNames}
          onChange={setInterestNames}
          loading={catalogQuery.isPending}
          error={
            catalogQuery.isError
              ? "Could not load interests."
              : null
          }
        />

        <div>
          <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
            Top priorities (pick up to 3)
          </span>
          <div className="flex flex-wrap gap-2">
            {COMPARE_PRIORITY_OPTIONS.map((p) => {
              const active = priorities.includes(p);
              const disabled = !active && priorities.length >= 3;
              return (
                <button
                  key={p}
                  type="button"
                  disabled={disabled}
                  onClick={() => togglePriority(p)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-bold transition",
                    active
                      ? "bg-brand-blue text-white shadow-md shadow-brand-blue/25"
                      : "border border-slate-200 bg-slate-50 text-slate-700 hover:border-brand-blue/30 disabled:opacity-40 dark:border-white/10 dark:bg-zinc-800 dark:text-slate-200"
                  )}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        <ChipGroup
          label="Learning mode (optional)"
          options={COMPARE_LEARNING_MODE_OPTIONS}
          value={learningMode}
          onChange={(v) => setLearningMode(v as CompareLearningMode | undefined)}
        />

        <ChipGroup
          label="Campus setting (optional)"
          options={COMPARE_CAMPUS_SETTING_OPTIONS}
          value={campusSetting}
          onChange={(v) => setCampusSetting(v as CompareCampusSetting | undefined)}
        />

        <div>
          <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
            Must-have amenities
          </span>
          <button
            type="button"
            onClick={() => setNeedsAirport((v) => !v)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-bold transition",
              needsAirport
                ? "bg-brand-blue text-white shadow-md shadow-brand-blue/25"
                : "border border-slate-200 bg-slate-50 text-slate-700 hover:border-brand-blue/30 dark:border-white/10 dark:bg-zinc-800 dark:text-slate-200"
            )}
          >
            Airport access
          </button>
        </div>

        <div>
          <label
            htmlFor="compare-free-text"
            className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400"
          >
            Anything else important?
          </label>
          <textarea
            id="compare-free-text"
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            rows={2}
            placeholder="e.g. I prefer a quieter campus, close to family in Addis…"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 dark:border-white/10 dark:bg-zinc-800 dark:text-white"
          />
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 dark:border-white/10 dark:bg-zinc-900/50">
          <button
            type="button"
            onClick={() => setChatOpen((o) => !o)}
            className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-bold text-slate-800 dark:text-slate-200"
          >
            <span className="inline-flex items-center gap-2">
              <MessageCircle size={16} className="text-brand-blue" />
              Notes for AI (optional)
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
              {chatOpen ? "Hide" : "Show"}
              <ChevronDown
                className={cn(
                  "size-3.5 transition-transform",
                  chatOpen && "rotate-180"
                )}
              />
            </span>
          </button>

          {chatOpen && (
            <div className="border-t border-slate-200/80 px-4 py-3 dark:border-white/10">
              <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
                These notes are sent to the AI — not a live chat.
              </p>
              <div className="mb-3 max-h-40 space-y-2 overflow-y-auto">
                {chatMessages.length === 0 ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    e.g. &quot;I care most about engineering labs and internship
                    access.&quot;
                  </p>
                ) : (
                  chatMessages.map((m, i) => (
                    <p
                      key={i}
                      className="ml-2 rounded-xl bg-brand-blue/10 px-3 py-2 text-xs leading-relaxed text-slate-800 dark:text-slate-200"
                    >
                      {m.text}
                    </p>
                  ))
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      sendChat();
                    }
                  }}
                  placeholder="Add a note for the AI…"
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-zinc-800 dark:text-white"
                />
                <button
                  type="button"
                  onClick={sendChat}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-blue text-white"
                  aria-label="Add note"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={pending || !canSubmit}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-blue px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-brand-blue/25 transition hover:bg-blue-700 disabled:opacity-60 sm:w-auto"
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          Get AI recommendation
        </button>
        {!canSubmit && (
          <p className="text-xs text-amber-700 dark:text-amber-400">
            Select a program, priority, campus setting, or add notes to
            personalize.
          </p>
        )}
      </form>
    </section>
  );
}
