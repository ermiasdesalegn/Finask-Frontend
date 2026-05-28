import { useQuery } from "@tanstack/react-query";
import { Loader2, MessageCircle, Send, Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import FieldsOfStudyPicker from "../layout/FieldsOfStudyPicker";
import PersonalInterestsPicker from "../layout/PersonalInterestsPicker";
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
import { fetchProgramsList } from "../../lib/services/programService";
import {
  fieldsOfInterestIds,
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

  useEffect(() => {
    if (!user || profileInitialized.current) return;
    profileInitialized.current = true;
    const fromProfilePrograms = fieldsOfInterestIds(user);
    const fromProfileInterests = userInterestNames(user);
    if (fromProfilePrograms.length) setProgramIds(fromProfilePrograms);
    if (fromProfileInterests.length) setInterestNames(fromProfileInterests);
  }, [user]);

  const toggleProgram = useCallback((id: string) => {
    setProgramIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const toggleInterest = useCallback((name: string) => {
    const key = name.toLowerCase();
    setInterestNames((prev) =>
      prev.some((n) => n.toLowerCase() === key)
        ? prev.filter((n) => n.toLowerCase() !== key)
        : [...prev, key]
    );
  }, []);

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
        const p = programs.find(
          (prog) => String(prog._id ?? prog.id) === id
        );
        return p?.name;
      })
      .filter((n): n is string => Boolean(n));

    onSubmit(draftPrefs, programNames);
  };

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
        <FieldsOfStudyPicker
          selectedIds={programIds}
          onToggle={toggleProgram}
        />

        <PersonalInterestsPicker
          selectedNames={interestNames}
          onToggle={toggleInterest}
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
          onChange={setLearningMode}
        />

        <ChipGroup
          label="Campus setting (optional)"
          options={COMPARE_CAMPUS_SETTING_OPTIONS}
          value={campusSetting}
          onChange={setCampusSetting}
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
            <span className="text-xs font-medium text-slate-500">
              {chatOpen ? "Hide" : "Show"}
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
