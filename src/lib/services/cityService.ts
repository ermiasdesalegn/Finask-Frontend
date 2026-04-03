import { apiGet } from "../api";
import type { CitiesListResponse } from "../../types";

export async function fetchCitiesList(options?: {
  limit?: number;
  sort?: string;
}): Promise<CitiesListResponse> {
  const params = new URLSearchParams();
  params.set("limit", String(options?.limit ?? 40));
  if (options?.sort) params.set("sort", options.sort);
  return apiGet<CitiesListResponse>(`/cities?${params.toString()}`);
}
