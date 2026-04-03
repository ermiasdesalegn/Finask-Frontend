import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchCitiesList } from "../services/cityService";
import { queryKeys } from "../queryKeys";
import { STALE_MS } from "./staleTimes";

export function citiesListQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.citiesList(),
    queryFn: () => fetchCitiesList(),
    staleTime: STALE_MS.cities,
  });
}

export function useCitiesListQuery() {
  return useQuery(citiesListQueryOptions());
}
