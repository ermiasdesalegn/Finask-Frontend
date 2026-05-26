import { apiDelete, apiGet, apiPost } from "../api";
import { unwrapMarkdownLink } from "../unwrapMarkdownLink";
import { fetchCampusDetail } from "./campusService";
import { fetchCelebrityDetail } from "./celebrityService";
import { fetchCityDetail } from "./cityService";
import { fetchProgramDetail } from "./programService";
import { fetchUniversityDetail } from "./universityService";
import type {
  Campus,
  City,
  Favorite,
  FavoritesListResponse,
  Program,
  University,
} from "../../types";

function pickFavoritesArray(raw: FavoritesListResponse): Favorite[] {
  const d = raw.data;
  if (!d) return [];
  return d.favorites ?? d.docs ?? d.data ?? [];
}

function normalizeUniversity(u: University): University {
  const coverImage = unwrapMarkdownLink(u.coverImage) || u.coverImage;
  const images = u.images?.map((x) => unwrapMarkdownLink(x) || x).filter(Boolean);
  return {
    ...u,
    ...(coverImage ? { coverImage } : {}),
    ...(images?.length ? { images } : {}),
  };
}

function normalizeProgram(p: Program): Program {
  const coverImage = unwrapMarkdownLink(p.coverImage) || p.coverImage;
  return { ...p, ...(coverImage ? { coverImage } : {}) };
}

function normalizeCity(c: City): City {
  const coverImage = unwrapMarkdownLink(c.coverImage) || c.coverImage;
  return { ...c, ...(coverImage ? { coverImage } : {}) };
}

function normalizeCampus(c: Campus): Campus {
  const coverImage = unwrapMarkdownLink(c.coverImage) || c.coverImage;
  return { ...c, ...(coverImage ? { coverImage } : {}) };
}

function normalizeFavoriteItem(f: Favorite): Favorite {
  if (typeof f.item !== "object" || f.item == null) return f;
  const m = String(f.onModel || "").toLowerCase();
  if (m === "university")
    return { ...f, item: normalizeUniversity(f.item as University) };
  if (m === "program") return { ...f, item: normalizeProgram(f.item as Program) };
  if (m === "city") return { ...f, item: normalizeCity(f.item as City) };
  if (m === "campus") return { ...f, item: normalizeCampus(f.item as Campus) };
  return f;
}

function itemIdFromFavorite(f: Favorite): string | null {
  const item = f.item;
  if (typeof item === "string" && item.trim()) return item.trim();
  if (typeof item === "object" && item !== null && "_id" in item) {
    return String((item as { _id: string })._id);
  }
  return null;
}

/** When GET /favorites returns an unpopulated `item` id, load the document for display. */
async function hydrateFavoriteItem(f: Favorite): Promise<Favorite> {
  if (typeof f.item === "object" && f.item !== null) {
    return normalizeFavoriteItem(f);
  }
  const id = itemIdFromFavorite(f);
  if (!id) return f;
  const m = String(f.onModel || "").toLowerCase();
  try {
    if (m === "university") {
      const item = await fetchUniversityDetail(id);
      return normalizeFavoriteItem({ ...f, item });
    }
    if (m === "program") {
      const item = await fetchProgramDetail(id);
      return normalizeFavoriteItem({ ...f, item });
    }
    if (m === "city") {
      const item = await fetchCityDetail(id);
      return normalizeFavoriteItem({ ...f, item });
    }
    if (m === "campus") {
      const item = await fetchCampusDetail(id);
      return normalizeFavoriteItem({ ...f, item });
    }
    if (m === "celebrity") {
      const res = await fetchCelebrityDetail(id);
      const item = res.data?.celebrity;
      if (item) return { ...f, item };
    }
  } catch {
    // Keep row visible with id-only fallback if detail fetch fails.
  }
  return f;
}

/** GET /favorites — Bearer required */
export async function fetchFavorites(): Promise<Favorite[]> {
  const raw = await apiGet<FavoritesListResponse>("/favorites");
  const list = pickFavoritesArray(raw);
  return Promise.all(list.map(hydrateFavoriteItem));
}

export type CreateFavoriteBody = {
  item: string;
  onModel: string;
};

/** POST /favorites */
export async function createFavorite(
  body: CreateFavoriteBody
): Promise<unknown> {
  return apiPost("/favorites", body);
}

/** DELETE /favorites/:favoriteId */
export async function deleteFavorite(favoriteId: string): Promise<unknown> {
  const id = favoriteId.trim();
  if (!id) throw new Error("Missing favorite id");
  return apiDelete(`/favorites/${encodeURIComponent(id)}`);
}
