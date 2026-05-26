import { apiGet } from "../api";

const MONGO_OBJECT_ID_RE = /^[a-f0-9]{24}$/i;

export interface ElevationZone {
  _id: string;
  name: string;
  slug?: string;
  subtitle?: string;
  displayName?: string;
  overview?: string;
  coverImage?: string;
  images?: string[];
}

type ZoneCity = {
  _id: string;
  name: string;
  slug?: string;
  region?: string;
};

type ListResponse = {
  status: string;
  data?: { elevationzones?: ElevationZone[]; data?: ElevationZone[] };
};

type ZoneUniversity = {
  _id: string;
  name: string;
  slug?: string;
  coverImage?: string;
};

type DetailResponse = {
  status: string;
  data?: {
    zone?: ElevationZone;
    universities?: ZoneUniversity[];
    elevationzone?: ElevationZone & { cities?: ZoneCity[] };
    data?: ElevationZone;
  };
};

export type ElevationZoneDetail = {
  zone: ElevationZone;
  universities: ZoneUniversity[];
  cities: ZoneCity[];
};

export async function fetchElevationZones(): Promise<ElevationZone[]> {
  const res = await apiGet<ListResponse>("/elevation-zones?limit=50");
  return res.data?.elevationzones ?? res.data?.data ?? [];
}

/** GET /elevation-zones/slug/:slug — universities in zone */
async function fetchElevationZoneBySlug(
  slug: string
): Promise<ElevationZoneDetail> {
  const res = await apiGet<DetailResponse>(
    `/elevation-zones/slug/${encodeURIComponent(slug)}`
  );
  const z = res.data?.zone ?? res.data?.elevationzone ?? res.data?.data;
  if (!z) throw new Error("Elevation zone not found");
  return {
    zone: z,
    universities: res.data?.universities ?? [],
    cities: [],
  };
}

/** GET /elevation-zones/:id — zone with populated cities */
async function fetchElevationZoneById(id: string): Promise<ElevationZoneDetail> {
  const res = await apiGet<DetailResponse>(
    `/elevation-zones/${encodeURIComponent(id)}`
  );
  const z = res.data?.elevationzone ?? res.data?.zone ?? res.data?.data;
  if (!z) throw new Error("Elevation zone not found");
  const populated = z as ElevationZone & { cities?: ZoneCity[] };
  return {
    zone: populated,
    universities: [],
    cities: populated.cities ?? [],
  };
}

/** Slug → universities list; Mongo id → GET /elevation-zones/:id with cities */
export async function fetchElevationZoneDetail(
  slugOrId: string
): Promise<ElevationZoneDetail> {
  const key = slugOrId.trim();
  if (MONGO_OBJECT_ID_RE.test(key)) return fetchElevationZoneById(key);
  return fetchElevationZoneBySlug(key);
}
