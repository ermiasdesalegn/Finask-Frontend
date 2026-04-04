import { apiGet } from "../api";
import type {
  Program,
  ProgramDetailResponse,
  ProgramsListResponse,
  RareProgramsResponse,
  UniversityProgramsForProgramResponse,
} from "../../types";

const MONGO_OBJECT_ID_RE = /^[a-f0-9]{24}$/i;

export type ProgramsListFilters = {
  limit?: number;
  sort?: string;
  /** Backend query filter: `?field=technologyit` */
  field?: string | null;
};

export async function fetchProgramsList(
  filters: ProgramsListFilters = {}
): Promise<ProgramsListResponse> {
  const params = new URLSearchParams();
  params.set("limit", String(filters.limit ?? 500));
  params.set("sort", filters.sort ?? "name");
  if (filters.field?.trim()) {
    params.set("field", filters.field.trim());
  }
  return apiGet<ProgramsListResponse>(`/programs?${params.toString()}`);
}

/** GET /api/v1/programs/rare — returns `data.docs` */
export async function fetchRarePrograms(options?: {
  limit?: number;
}): Promise<Program[]> {
  const params = new URLSearchParams();
  params.set("limit", String(options?.limit ?? 80));
  const res = await apiGet<RareProgramsResponse>(
    `/programs/rare?${params.toString()}`
  );
  return res.data.docs ?? [];
}

function programFromDetailResponse(res: ProgramDetailResponse): Program {
  const p = res.data.program;
  if (!p) throw new Error("Program not found.");
  return p;
}

/**
 * Slug: GET /programs/slug/:slug
 * Mongo id: GET /programs/:id
 */
export async function fetchProgramDetail(slugOrId: string): Promise<Program> {
  const param = slugOrId.trim();
  if (MONGO_OBJECT_ID_RE.test(param)) {
    const res = await apiGet<ProgramDetailResponse>(
      `/programs/${encodeURIComponent(param)}`
    );
    return programFromDetailResponse(res);
  }
  const res = await apiGet<ProgramDetailResponse>(
    `/programs/slug/${encodeURIComponent(param)}`
  );
  return programFromDetailResponse(res);
}

/** GET /api/v1/programs/:programId/universities */
export async function fetchUniversitiesForProgram(
  programId: string,
  options?: { limit?: number }
): Promise<UniversityProgramsForProgramResponse> {
  const params = new URLSearchParams();
  params.set("limit", String(options?.limit ?? 50));
  return apiGet<UniversityProgramsForProgramResponse>(
    `/programs/${encodeURIComponent(programId)}/universities?${params.toString()}`
  );
}
