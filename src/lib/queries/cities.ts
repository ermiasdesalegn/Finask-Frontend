import { queryOptions, useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { fetchCitiesList, fetchCityDetail, fetchCityDetailBySlug } from "../services/cityService";
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

export function useCityByIdQuery(id: string | undefined) {
  return useQuery({
    queryKey: ["city", "id", id ?? ""],
    queryFn: () => fetchCityDetail(id!),
    enabled: Boolean(id?.trim()),
    staleTime: STALE_MS.list,
  });
}

export function useCityBySlugQuery(slug: string | undefined) {
  return useQuery({
    queryKey: ["city", "slug", slug ?? ""],
    queryFn: () => fetchCityDetailBySlug(slug!),
    enabled: Boolean(slug?.trim()),
    staleTime: STALE_MS.list,
  });
}
