import type { ProgramsListFilters } from "./services/programService";
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
      filters.tags ?? null,
      filters.elevationName ?? null,
    ] as const,

  universitiesTrending: () => ["universities", "trending"] as const,
  universitiesFeatured: () => ["universities", "featured"] as const,
  universitiesTopRanked: (n: number) =>
    ["universities", "top-ranked", n] as const,
  universitiesTopRated: (n: number) =>
    ["universities", "top-rated", n] as const,

  campusesList: (opts?: { limit?: number; sort?: string }) =>
    [
      "campuses",
      "list",
      opts?.limit ?? 250,
      opts?.sort ?? "default",
    ] as const,

  citiesList: (opts?: { limit?: number; sort?: string; fields?: string }) =>
    [
      "cities",
      "list",
      opts?.limit ?? 40,
      opts?.sort ?? "default",
      opts?.fields ?? "all",
    ] as const,

  programsList: (filters: ProgramsListFilters) =>
    [
      "programs",
      "list",
      filters.limit ?? 500,
      filters.sort ?? "name",
      filters.field?.trim() || "all",
      filters.fields?.trim() || "all",
    ] as const,

  programsRare: (limit: number) => ["programs", "rare", limit] as const,

  programDetail: (slugOrId: string) =>
    ["programs", "detail", slugOrId] as const,

  programUniversities: (programId: string) =>
    ["programs", programId, "universities"] as const,

  universityBySlug: (slug: string) => ["universities", "slug", slug] as const,

  universityCampuses: (universityId: string) =>
    ["universities", universityId, "campuses"] as const,

  search: (q: string, limit?: number) =>
    ["search", q, limit ?? "default"] as const,
};
