import { apiGet } from "../api";
import type {
  CelebritiesListResponse,
  Celebrity,
  CelebrityDetailResponse,
} from "../../types";

const MONGO_OBJECT_ID_RE = /^[a-f0-9]{24}$/i;

export type CelebritiesListFilters = {
  limit?: number;
  sort?: string;
};

export async function fetchCelebritiesList(
  filters: CelebritiesListFilters = {}
): Promise<CelebritiesListResponse> {
  const params = new URLSearchParams();
  params.set("limit", String(filters.limit ?? 200));
  params.set("sort", filters.sort ?? "name");
  return apiGet<CelebritiesListResponse>(
    `/celebrities?${params.toString()}`
  );
}

export async function fetchCelebrityDetail(
  slugOrId: string
): Promise<CelebrityDetailResponse> {
  const key = slugOrId.trim();
  if (!key) {
    throw new Error("Missing celebrity identifier");
  }
  if (MONGO_OBJECT_ID_RE.test(key)) {
    return apiGet<CelebrityDetailResponse>(
      `/celebrities/${encodeURIComponent(key)}`
    );
  }
  return apiGet<CelebrityDetailResponse>(
    `/celebrities/slug/${encodeURIComponent(key)}`
  );
}

export function celebrityPath(c: Pick<Celebrity, "slug" | "_id">): string {
  const s = c.slug?.trim();
  if (s) return `/celebrities/${encodeURIComponent(s)}`;
  const id = c._id?.trim();
  if (id) return `/celebrities/${encodeURIComponent(id)}`;
  return "/celebrities";
}
