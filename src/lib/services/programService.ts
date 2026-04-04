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
  /**
   * Optional field projection, e.g. `name,slug,field,duration,ratingsAverage`
   * (see GET /programs docs). Omit for full documents.
   */
  fields?: string | null;
};

type LooseProgramsList = {
  status: string;
  results?: number;
  data?: { programs?: Program[]; docs?: Program[] };
};

function normalizeProgramsListResponse(
  res: LooseProgramsList
): ProgramsListResponse {
  const programs =
    res.data?.programs ??
    (Array.isArray(res.data?.docs) ? res.data!.docs! : []);
  return {
    status: res.status,
    results: res.results ?? programs.length,
    data: { programs },
  };
}

export async function fetchProgramsList(
  filters: ProgramsListFilters = {}
): Promise<ProgramsListResponse> {
  const params = new URLSearchParams();
  params.set("limit", String(filters.limit ?? 500));
  params.set("sort", filters.sort ?? "name");
  if (filters.field?.trim()) {
    params.set("field", filters.field.trim());
  }
  if (filters.fields?.trim()) {
    params.set("fields", filters.fields.trim());
  }
  const res = await apiGet<LooseProgramsList>(
    `/programs?${params.toString()}`
  );
  return normalizeProgramsListResponse(res);
}

/** GET /api/v1/programs/rare — backend returns `data.docs` (optional `?limit=`). */
export async function fetchRarePrograms(options?: {
  limit?: number;
}): Promise<Program[]> {
  const params = new URLSearchParams();
  params.set("limit", String(options?.limit ?? 80));
  const res = await apiGet<
    RareProgramsResponse & { data?: { docs?: Program[]; data?: Program[] } }
  >(`/programs/rare?${params.toString()}`);
  const d = res.data;
  if (!d) return [];
  if (Array.isArray(d.docs)) return d.docs;
  if (Array.isArray(d.data)) return d.data;
  return [];
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
