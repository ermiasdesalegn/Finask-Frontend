import { apiGet } from "../api";

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
    /** GET /elevation-zones/slug/:slug — custom controller */
    zone?: ElevationZone;
    universities?: ZoneUniversity[];
    /** GET /elevation-zones/:id — handlerFactory */
    elevationzone?: ElevationZone;
    data?: ElevationZone;
  };
};

export type ElevationZoneDetail = {
  zone: ElevationZone;
  universities: ZoneUniversity[];
};

export async function fetchElevationZones(): Promise<ElevationZone[]> {
  const res = await apiGet<ListResponse>("/elevation-zones?limit=50");
  return res.data?.elevationzones ?? res.data?.data ?? [];
}

export async function fetchElevationZoneBySlug(
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
  };
}
