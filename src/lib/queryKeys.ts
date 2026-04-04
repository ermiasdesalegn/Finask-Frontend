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
    ] as const,

  citiesList: () => ["cities", "list"] as const,

  programsList: (filters: ProgramsListFilters) =>
    [
      "programs",
      "list",
      filters.limit ?? 500,
      filters.sort ?? "name",
      filters.field?.trim() || "all",
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
