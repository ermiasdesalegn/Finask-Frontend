/** Build label + path from question/review `onModelType` + `onModelId` (me/* responses). */

const LABELS: Record<string, string> = {
  university: "University",
  program: "Program",
  city: "City",
  campus: "Campus",
  celebrity: "Great Mind",
};

export function parentEntityLabel(onModelType?: string): string {
  if (!onModelType) return "Listing";
  const key = onModelType.toLowerCase();
  return LABELS[key] ?? onModelType;
}

export function parentEntityPath(
  onModelType?: string,
  onModelId?: string
): string | null {
  if (!onModelType || !onModelId) return null;
  const id = encodeURIComponent(onModelId);
  switch (onModelType.toLowerCase()) {
    case "university":
      return `/universities/${id}`;
    case "program":
      return `/programs/${id}`;
    case "city":
      return `/cities/${id}`;
    case "campus":
      return `/campuses/${id}`;
    case "celebrity":
      return `/celebrities/${id}`;
    default:
      return null;
  }
}
