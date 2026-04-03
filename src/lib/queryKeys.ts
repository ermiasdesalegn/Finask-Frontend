import type { UniversitiesListFilters } from "./services/universityService";

export const queryKeys = {
  homeRoot: ["home"] as const,
  home: (tokenFingerprint: string) => ["home", tokenFingerprint] as const,

  universitiesList: (filters: UniversitiesListFilters) =>
    [
      "universities",
      "list",
      filters.cityRegion ?? "all",
      filters.limit ?? 250,
      filters.sort ?? "-ratingsAverage",
      filters.ratingsAverageGte ?? null,
      filters.isFeatured ?? null,
    ] as const,

  citiesList: () => ["cities", "list"] as const,

  programsList: () => ["programs", "list"] as const,

  programUniversities: (programId: string) =>
    ["programs", programId, "universities"] as const,

  universityBySlug: (slug: string) => ["universities", "slug", slug] as const,

  universityCampuses: (universityId: string) =>
    ["universities", universityId, "campuses"] as const,

  search: (q: string, limit?: number) =>
    ["search", q, limit ?? "default"] as const,
};
