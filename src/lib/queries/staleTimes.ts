/** Shared React Query stale times (ms) */
export const STALE_MS = {
  home: 60_000,
  list: 60_000,
  cities: 5 * 60_000,
  programs: 5 * 60_000,
  programsRare: 5 * 60_000,
  programDetail: 5 * 60_000,
  programUniversities: 5 * 60_000,
  universityDetail: 60_000,
  universityCampuses: 5 * 60_000,
  universityPrograms: 5 * 60_000,
  campusesList: 5 * 60_000,
  favorites: 30_000,
} as const;
