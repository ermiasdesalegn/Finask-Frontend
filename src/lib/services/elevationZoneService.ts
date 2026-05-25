import { apiGet } from "../api";

export interface ElevationZone {
  _id: string;
  name: string;
  slug?: string;
  overview?: string;
  coverImage?: string;
}

type ListResponse = {
  status: string;
  data?: { elevationzones?: ElevationZone[]; data?: ElevationZone[] };
};

type DetailResponse = {
  status: string;
  data?: { elevationzone?: ElevationZone; data?: ElevationZone };
};

export async function fetchElevationZones(): Promise<ElevationZone[]> {
  const res = await apiGet<ListResponse>("/elevation-zones?limit=50");
  return res.data?.elevationzones ?? res.data?.data ?? [];
}

export async function fetchElevationZoneBySlug(
  slug: string
): Promise<ElevationZone> {
  const res = await apiGet<DetailResponse>(
    `/elevation-zones/slug/${encodeURIComponent(slug)}`
  );
  const z = res.data?.elevationzone ?? res.data?.data;
  if (!z) throw new Error("Elevation zone not found");
  return z;
}
