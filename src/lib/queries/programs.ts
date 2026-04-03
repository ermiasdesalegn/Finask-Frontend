import { queryOptions, useQuery } from "@tanstack/react-query";
import {
  fetchProgramsList,
  fetchUniversitiesForProgram,
} from "../services/programService";
import { queryKeys } from "../queryKeys";
import { STALE_MS } from "./staleTimes";

export function programsListQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.programsList(),
    queryFn: () => fetchProgramsList(),
    staleTime: STALE_MS.programs,
  });
}

export function useProgramsListQuery() {
  return useQuery(programsListQueryOptions());
}

const PENDING_PROGRAM = "__pending__";

export function programUniversitiesQueryOptions(programId: string) {
  const keyId = programId || PENDING_PROGRAM;
  return queryOptions({
    queryKey: queryKeys.programUniversities(keyId),
    queryFn: () => fetchUniversitiesForProgram(programId),
    enabled: Boolean(programId),
    staleTime: STALE_MS.programUniversities,
  });
}

export function useProgramUniversitiesQuery(programId: string) {
  return useQuery(programUniversitiesQueryOptions(programId));
}
