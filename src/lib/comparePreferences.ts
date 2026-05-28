/** Preferences sent with POST /universities/compare for personalized AI output. */
export type ComparePreferences = {
  programIds?: string[];
  interestNames?: string[];
  priorities?: string[];
  chatNotes?: string;
  freeText?: string;
  learningMode?: CompareLearningMode;
  campusSetting?: CompareCampusSetting;
  needsAirport?: boolean;
};

/** Backend-aligned preference shape (comparisonController.js). */
export type CompareApiPreferences = {
  interestedDepartment?: string;
  priority?:
    | "Academic Reputation"
    | "Industry Employment"
    | "Campus Life"
    | "Affordability";
  learningMode?: CompareLearningMode;
  campusSetting?: CompareCampusSetting;
  mustHaveAmenities?: string[];
};

export const COMPARE_PRIORITY_OPTIONS = [
  "Reputation",
  "Program fit",
  "Location",
  "Campus life",
  "Affordability",
] as const;

export type ComparePriority = (typeof COMPARE_PRIORITY_OPTIONS)[number];

export const COMPARE_LEARNING_MODE_OPTIONS = [
  "Regular",
  "Extension",
  "Distance",
  "Weekend",
] as const;

export type CompareLearningMode = (typeof COMPARE_LEARNING_MODE_OPTIONS)[number];

export const COMPARE_CAMPUS_SETTING_OPTIONS = [
  "Metropolitan",
  "Regional Town",
  "Quiet/Suburban",
] as const;

export type CompareCampusSetting =
  (typeof COMPARE_CAMPUS_SETTING_OPTIONS)[number];

const PRIORITY_TO_API: Partial<
  Record<ComparePriority, CompareApiPreferences["priority"]>
> = {
  Reputation: "Academic Reputation",
  "Campus life": "Campus Life",
  Affordability: "Affordability",
};

const MAX_DEPARTMENT_LEN = 500;

function mentionsAirport(...parts: (string | undefined)[]): boolean {
  const re = /\bairport\b/i;
  return parts.some((p) => p && re.test(p));
}

/** Stable string for React Query cache keys. */
export function compareApiPreferencesKey(
  prefs: CompareApiPreferences | null | undefined
): string {
  if (!prefs) return "none";
  return JSON.stringify(prefs);
}

export function comparePreferencesKey(
  prefs: ComparePreferences | null | undefined
): string {
  if (!prefs) return "none";
  const sorted = {
    programIds: [...(prefs.programIds ?? [])].sort(),
    interestNames: [...(prefs.interestNames ?? [])].sort(),
    priorities: [...(prefs.priorities ?? [])].sort(),
    chatNotes: prefs.chatNotes?.trim() ?? "",
    freeText: prefs.freeText?.trim() ?? "",
    learningMode: prefs.learningMode ?? "",
    campusSetting: prefs.campusSetting ?? "",
    needsAirport: prefs.needsAirport ?? false,
  };
  return JSON.stringify(sorted);
}

export function hasComparePreferences(
  prefs: ComparePreferences | null | undefined
): boolean {
  if (!prefs) return false;
  return Boolean(
    (prefs.programIds?.length ?? 0) > 0 ||
      (prefs.interestNames?.length ?? 0) > 0 ||
      (prefs.priorities?.length ?? 0) > 0 ||
      prefs.chatNotes?.trim() ||
      prefs.freeText?.trim() ||
      prefs.learningMode ||
      prefs.campusSetting ||
      prefs.needsAirport
  );
}

export function canSubmitComparePreferences(
  prefs: Pick<
    ComparePreferences,
    | "programIds"
    | "priorities"
    | "freeText"
    | "interestNames"
    | "chatNotes"
    | "learningMode"
    | "campusSetting"
    | "needsAirport"
  >
): boolean {
  return Boolean(
    (prefs.programIds?.length ?? 0) > 0 ||
      (prefs.priorities?.length ?? 0) > 0 ||
      prefs.freeText?.trim() ||
      (prefs.interestNames?.length ?? 0) > 0 ||
      prefs.chatNotes?.trim() ||
      prefs.learningMode ||
      prefs.campusSetting ||
      prefs.needsAirport
  );
}

/** Map UI preferences to backend `preferences` object. */
export function mapComparePreferencesToApi(
  prefs: ComparePreferences | null | undefined,
  programNames: string[] = []
): CompareApiPreferences | undefined {
  if (!prefs || !hasComparePreferences(prefs)) return undefined;

  const api: CompareApiPreferences = {};

  const deptParts: string[] = [];
  if (programNames.length) deptParts.push(programNames.join(", "));
  if (prefs.interestNames?.length) {
    deptParts.push(`Interests: ${prefs.interestNames.join(", ")}`);
  }
  if (prefs.priorities?.includes("Program fit")) {
    deptParts.push("Priority: strong program fit");
  }
  if (prefs.freeText?.trim()) deptParts.push(prefs.freeText.trim());
  if (prefs.chatNotes?.trim()) deptParts.push(prefs.chatNotes.trim());

  const department = deptParts.join(". ").trim().slice(0, MAX_DEPARTMENT_LEN);
  if (department) api.interestedDepartment = department;

  const firstPriority = prefs.priorities?.find(
    (p) => PRIORITY_TO_API[p as ComparePriority]
  ) as ComparePriority | undefined;
  if (firstPriority && PRIORITY_TO_API[firstPriority]) {
    api.priority = PRIORITY_TO_API[firstPriority];
  }

  if (prefs.learningMode) api.learningMode = prefs.learningMode;
  if (prefs.campusSetting) api.campusSetting = prefs.campusSetting;

  const amenities: string[] = [];
  if (
    prefs.needsAirport ||
    mentionsAirport(prefs.freeText, prefs.chatNotes, deptParts.join(" "))
  ) {
    amenities.push("Airport");
  }
  if (amenities.length) api.mustHaveAmenities = amenities;

  return Object.keys(api).length ? api : undefined;
}
