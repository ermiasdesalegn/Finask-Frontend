import { apiDelete, apiGet, apiPatch, apiPatchForm, apiPost } from "../api";
import type { University } from "../../types";

type UniversityResponse = {
  status: string;
  data: { university: University };
};

type CampusesResponse = {
  status: string;
  data: { campuses: ManagedCampus[] };
};

export interface ManagedCampus {
  _id?: string;
  id?: string;
  name: string;
  slug?: string;
  overview?: string;
  wikipediaLink?: string;
  coverImage?: string;
  images?: string[];
  distanceFromMainCampus?: number | null;
  ratingsAverage?: number;
  programs?: { _id?: string; id?: string; name?: string }[];
  address?: { street?: string; city?: string; poBox?: string };
  contacts?: {
    websiteUrl?: string;
    emails?: string[];
    phoneNumbers?: string[];
    faxes?: string[];
  };
  location?: { type?: string; coordinates?: [number, number] };
}

export async function updateUniversity(
  id: string,
  payload: Record<string, unknown>
): Promise<University> {
  const res = await apiPatch<UniversityResponse>(`/universities/${id}`, payload);
  return res.data.university;
}

export async function uploadUniversityGallery(
  id: string,
  files: { cover?: File; gallery?: File[] }
): Promise<void> {
  const fd = new FormData();
  if (files.cover) fd.append("coverImage", files.cover);
  files.gallery?.forEach((f) => fd.append("imageGallery", f));
  if (!fd.has("coverImage") && !fd.has("imageGallery")) return;
  await apiPatchForm(`/universities/${id}/gallery`, fd);
}

export async function deleteUniversityGalleryImages(
  id: string,
  imagesToDelete: string[]
): Promise<void> {
  await apiDelete(`/universities/${id}/gallery`, { imagesToDelete });
}

export async function fetchUniversityCampuses(
  universityId: string
): Promise<ManagedCampus[]> {
  const res = await apiGet<CampusesResponse>(
    `/universities/${universityId}/campuses`
  );
  return res.data?.campuses ?? [];
}

export async function createCampus(
  universityId: string,
  payload: Record<string, unknown>
): Promise<ManagedCampus> {
  const res = await apiPost<{ data: { campus: ManagedCampus } }>(
    `/universities/${universityId}/campuses`,
    payload
  );
  return res.data.campus;
}

export async function updateCampus(
  universityId: string,
  campusId: string,
  payload: Record<string, unknown>
): Promise<ManagedCampus> {
  const res = await apiPatch<{ data: { campus: ManagedCampus } }>(
    `/universities/${universityId}/campuses/${campusId}`,
    payload
  );
  return res.data.campus;
}

export async function deleteCampus(
  universityId: string,
  campusId: string
): Promise<void> {
  await apiDelete(`/universities/${universityId}/campuses/${campusId}`);
}

export async function uploadCampusGallery(
  universityId: string,
  campusId: string,
  files: { cover?: File; gallery?: File[] }
): Promise<void> {
  const fd = new FormData();
  if (files.cover) fd.append("coverImage", files.cover);
  files.gallery?.forEach((f) => fd.append("imageGallery", f));
  if (!fd.has("coverImage") && !fd.has("imageGallery")) return;
  await apiPatchForm(
    `/universities/${universityId}/campuses/${campusId}/gallery`,
    fd
  );
}
