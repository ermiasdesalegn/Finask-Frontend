import type { CitiesListResponse, City, CityDetailResponse } from "../../types";
import { apiGet } from "../api";

export async function fetchCitiesList(options?: {
  limit?: number;
  sort?: string;
  /** Comma-separated projection, e.g. `name` — matches API `fields` query */
  fields?: string;
}): Promise<CitiesListResponse> {
  const params = new URLSearchParams();
  params.set("limit", String(options?.limit ?? 40));
  if (options?.sort) params.set("sort", options.sort);
  if (options?.fields) params.set("fields", options.fields);
  return apiGet<CitiesListResponse>(`/cities?${params.toString()}`);
}

function cityFromDetailResponse(res: CityDetailResponse): City {
  const c = res.data.city ?? res.data.data;
  if (!c) throw new Error("City not found.");
  return c;
}

export async function fetchCityDetail(id: string): Promise<City> {
  const res = await apiGet<CityDetailResponse>(
    `/cities/${encodeURIComponent(id)}`
  );
  return cityFromDetailResponse(res);
}

export async function fetchCityDetailBySlug(slug: string): Promise<City> {
  const res = await apiGet<CityDetailResponse>(
    `/cities/slug/${encodeURIComponent(slug)}`
  );
  return cityFromDetailResponse(res);
}
