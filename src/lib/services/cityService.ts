import type { CitiesListResponse } from "../../types";
import { apiGet } from "../api";

export type CityDetailResponse = {
  status: string;
  data: { data: any };
};

export async function fetchCitiesList(options?: {
  limit?: number;
  sort?: string;
}): Promise<CitiesListResponse> {
  const params = new URLSearchParams();
  params.set("limit", String(options?.limit ?? 40));
  if (options?.sort) params.set("sort", options.sort);
  return apiGet<CitiesListResponse>(`/cities?${params.toString()}`);
}

export async function fetchCityById(id: string): Promise<CityDetailResponse> {
  return apiGet<CityDetailResponse>(`/cities/${encodeURIComponent(id)}`);
}

export async function fetchCityBySlug(slug: string): Promise<CityDetailResponse> {
  return apiGet<CityDetailResponse>(`/cities/slug/${encodeURIComponent(slug)}`);
}
