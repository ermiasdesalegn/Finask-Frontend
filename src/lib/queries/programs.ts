import { queryOptions, useQuery } from "@tanstack/react-query";
import type { ProgramsListFilters } from "../services/programService";
import {
  fetchProgramDetail,
  fetchProgramsList,
  fetchRarePrograms,
  fetchUniversitiesForProgram,
} from "../services/programService";
import { queryKeys } from "../queryKeys";
import { STALE_MS } from "./staleTimes";

export function programsListQueryOptions(filters: ProgramsListFilters = {}) {
  return queryOptions({
    queryKey: queryKeys.programsList(filters),
    queryFn: () => fetchProgramsList(filters),
    staleTime: STALE_MS.programs,
  });
}

export function useProgramsListQuery(
  filters: ProgramsListFilters = {},
  options?: { enabled?: boolean }
) {
  return useQuery({
    ...programsListQueryOptions(filters),
    enabled: options?.enabled ?? true,
  });
}

export function rareProgramsQueryOptions(limit = 80) {
  return queryOptions({
    queryKey: queryKeys.programsRare(limit),
    queryFn: () => fetchRarePrograms({ limit }),
    staleTime: STALE_MS.programsRare,
  });
}

export function useRareProgramsQuery(options?: {
  limit?: number;
  enabled?: boolean;
}) {
  const limit = options?.limit ?? 80;
  return useQuery({
    ...rareProgramsQueryOptions(limit),
    enabled: options?.enabled ?? true,
  });
}

const PENDING_PROGRAM = "__pending__";

export function programDetailQueryOptions(slugOrId: string) {
  const key = slugOrId.trim() || PENDING_PROGRAM;
  return queryOptions({
    queryKey: queryKeys.programDetail(key),
    queryFn: () => fetchProgramDetail(slugOrId.trim()),
    enabled: Boolean(slugOrId?.trim()),
    staleTime: STALE_MS.programDetail,
  });
}

export function useProgramDetailQuery(slugOrId: string | undefined) {
  const p = slugOrId?.trim() ?? "";
  return useQuery(programDetailQueryOptions(p));
}

export function programUniversitiesQueryOptions(programId: string) {
  const keyId = programId || PENDING_PROGRAM;
  return queryOptions({
    queryKey: queryKeys.programUniversities(keyId),
    queryFn: () => fetchUniversitiesForProgram(programId),
    enabled: Boolean(programId),
    staleTime: STALE_MS.programUniversities,
    /** N× programs on one page — never double-fire on failure */
    retry: false,
  });
}

export function useProgramUniversitiesQuery(programId: string) {
  return useQuery(programUniversitiesQueryOptions(programId));
}
