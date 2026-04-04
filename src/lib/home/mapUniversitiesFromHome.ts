import type { HomePagePayload, University } from "../../types";

/** Dedupe universities from home payload for map / discovery previews */
export function pickUniversitiesForMap(
  home: HomePagePayload | null
): University[] {
  if (!home) return [];
  const lists = [
    ...(home.topRated ?? []),
    ...(home.topRanked ?? []),
    ...(home.featured ?? []),
    ...(home.trending ?? []),
    ...(home.nearBy ?? []),
  ];
  const bySlug = new Map<string, University>();
  for (const u of lists) {
    const k = u.slug || u._id || "";
    if (k && !bySlug.has(k)) bySlug.set(k, u);
  }
  return [...bySlug.values()];
}
