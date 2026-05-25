import { API_BASE, apiGet, apiPatch, getToken } from "../api";
import type { AuthUser } from "../../context/AuthContext";
import type { Review, Question } from "../../types";

type MeResponse = { status: string; data?: { user: AuthUser } };
type ProfileResponse = { status: string; data?: { user: AuthUser } };

type ListResponse<T> = {
  status: string;
  results?: number;
  data?: Record<string, T[] | undefined>;
};

export async function fetchMyReviews(): Promise<Review[]> {
  const res = await apiGet<ListResponse<Review>>("/users/me/reviews");
  return res.data?.reviews ?? res.data?.data ?? [];
}

export async function fetchMyQuestions(): Promise<Question[]> {
  const res = await apiGet<ListResponse<Question>>("/users/me/questions");
  return res.data?.questions ?? res.data?.data ?? [];
}

export async function fetchMyAnsweredQuestions(): Promise<Question[]> {
  const res = await apiGet<ListResponse<Question>>(
    "/users/me/answeredQuestions"
  );
  return res.data?.questions ?? res.data?.data ?? [];
}

export async function fetchUserProfile(userId: string): Promise<AuthUser> {
  const res = await apiGet<ProfileResponse>(
    `/users/profile/${encodeURIComponent(userId)}`
  );
  const u = res.data?.user;
  if (!u) throw new Error("Profile not found");
  return u;
}

export async function updateMePhoto(file: File) {
  const form = new FormData();
  form.append("photo", file);
  const token = getToken();
  const base = API_BASE;
  const res = await fetch(`${base}/users/updateMe/photo`, {
    method: "PATCH",
    credentials: "include",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      typeof body === "object" && body && "message" in body
        ? String((body as { message: string }).message)
        : res.statusText;
    throw new Error(msg || "Upload failed");
  }
  return body as MeResponse;
}

export async function updateMe(body: Record<string, unknown>) {
  return apiPatch<MeResponse>("/users/updateMe", body);
}
