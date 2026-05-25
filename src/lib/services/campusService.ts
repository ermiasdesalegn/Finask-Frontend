import type { CampusesListResponse, Campus, Program } from "../../types";
import { apiGet } from "../api";

type CampusDetailResponse = {
  status: string;
  data?: { campus?: Campus; data?: Campus };
};

type CampusProgramsResponse = {
  status: string;
  data?: { programs?: Program[] };
};

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

const MONGO_ID = /^[a-f0-9]{24}$/i;

export async function fetchCampusDetail(slugOrId: string): Promise<Campus> {
  const key = slugOrId.trim();
  const res = MONGO_ID.test(key)
    ? await apiGet<CampusDetailResponse>(`/campuses/${encodeURIComponent(key)}`)
    : await apiGet<CampusDetailResponse>(
        `/campuses/slug/${encodeURIComponent(key)}`
      );
  const c = res.data?.campus ?? res.data?.data;
  if (!c) throw new Error("Campus not found");
  return c;
}

export async function fetchCampusPrograms(campusId: string): Promise<Program[]> {
  const res = await apiGet<CampusProgramsResponse>(
    `/campuses/${encodeURIComponent(campusId)}/programs?limit=120`
  );
  return res.data?.programs ?? [];
}
