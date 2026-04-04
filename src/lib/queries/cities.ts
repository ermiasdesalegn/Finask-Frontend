import { queryOptions, useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { fetchCitiesList, fetchCityDetail, fetchCityDetailBySlug } from "../services/cityService";
import { STALE_MS } from "./staleTimes";

export type CitiesListQueryOpts = {
  limit?: number;
  sort?: string;
  fields?: string;
};

export function citiesListQueryOptions(opts?: CitiesListQueryOpts) {
  return queryOptions({
    queryKey: queryKeys.citiesList(opts),
    queryFn: () =>
      fetchCitiesList({
        limit: opts?.limit,
        sort: opts?.sort,
        fields: opts?.fields,
      }),
    staleTime: STALE_MS.cities,
  });
}

export function useCitiesListQuery(opts?: CitiesListQueryOpts) {
  return useQuery(citiesListQueryOptions(opts));
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
