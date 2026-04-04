import { queryOptions, useQuery } from "@tanstack/react-query";
import type { CampusesListOptions } from "../services/campusService";
import { fetchCampusesList } from "../services/campusService";
import { queryKeys } from "../queryKeys";
import { STALE_MS } from "./staleTimes";

export function campusesListQueryOptions(opts?: CampusesListOptions) {
  return queryOptions({
    queryKey: queryKeys.campusesList(opts),
    queryFn: () =>
      fetchCampusesList({
        limit: opts?.limit,
        sort: opts?.sort,
      }),
    staleTime: STALE_MS.campusesList,
  });
}

export function useCampusesListQuery(opts?: CampusesListOptions) {
  return useQuery(campusesListQueryOptions(opts));
}
