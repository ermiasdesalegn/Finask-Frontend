/** Preferences sent with POST /universities/compare for personalized AI output. */
export type ComparePreferences = {
  programIds?: string[];
  interestNames?: string[];
  priorities?: string[];
  chatNotes?: string;
  freeText?: string;
};

export const COMPARE_PRIORITY_OPTIONS = [
  "Reputation",
  "Program fit",
  "Location",
  "Campus life",
  "Affordability",
] as const;

export type ComparePriority = (typeof COMPARE_PRIORITY_OPTIONS)[number];

/** Stable string for React Query cache keys. */
export function comparePreferencesKey(prefs: ComparePreferences | null | undefined): string {
  if (!prefs) return "none";
  const sorted = {
    programIds: [...(prefs.programIds ?? [])].sort(),
    interestNames: [...(prefs.interestNames ?? [])].sort(),
    priorities: [...(prefs.priorities ?? [])].sort(),
    chatNotes: prefs.chatNotes?.trim() ?? "",
    freeText: prefs.freeText?.trim() ?? "",
  };
  return JSON.stringify(sorted);
}

export function hasComparePreferences(prefs: ComparePreferences | null | undefined): boolean {
  if (!prefs) return false;
  return Boolean(
    (prefs.programIds?.length ?? 0) > 0 ||
      (prefs.interestNames?.length ?? 0) > 0 ||
      (prefs.priorities?.length ?? 0) > 0 ||
      prefs.chatNotes?.trim() ||
      prefs.freeText?.trim()
  );
}
