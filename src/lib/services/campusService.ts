import type { CampusesListResponse } from "../../types";
import { apiGet } from "../api";

export type CampusesListOptions = {
  limit?: number;
  sort?: string;
};

/** GET /api/v1/campuses — global list (same shape as nested university campuses). */
export async function fetchCampusesList(
  options?: CampusesListOptions
): Promise<CampusesListResponse> {
  const params = new URLSearchParams();
  params.set("limit", String(options?.limit ?? 250));
  if (options?.sort) params.set("sort", options.sort);
  return apiGet<CampusesListResponse>(`/campuses?${params.toString()}`);
}
