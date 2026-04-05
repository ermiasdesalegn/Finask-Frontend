export const MAX_COMPARE_UNIVERSITIES = 3;

const STORAGE_KEY = "finask_compare_university_ids";

export function getCompareQueue(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === "string" && x.length > 0);
  } catch {
    return [];
  }
}

export function setCompareQueue(ids: string[]): void {
  const unique: string[] = [];
  for (const id of ids) {
    if (id && !unique.includes(id)) unique.push(id);
    if (unique.length >= MAX_COMPARE_UNIVERSITIES) break;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(unique));
}

export function comparePathFromUniversityIds(ids: string[]): string {
  const clean = [...new Set(ids.filter(Boolean))].slice(0, MAX_COMPARE_UNIVERSITIES);
  if (clean.length < 2) return "/compare";
  return `/compare?${new URLSearchParams({ ids: clean.join(",") }).toString()}`;
}

const OBJECT_ID_RE = /^[a-f\d]{24}$/i;
const MOCK_UNIVERSITY_ID_RE = /^mock-[a-z0-9-]+$/i;

function isAllowedCompareId(id: string): boolean {
  if (OBJECT_ID_RE.test(id)) return true;
  if (
    import.meta.env.VITE_USE_MOCK === "true" &&
    MOCK_UNIVERSITY_ID_RE.test(id)
  ) {
    return true;
  }
  return false;
}

export function parseValidUniversityIdsParam(raw: string | null): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((id) => isAllowedCompareId(id));
}
