import { apiDelete, apiGet, apiPatch, apiPost } from "../api";
import type { ParentEntityType } from "../apiPaths";
import {
  reviewLikePath,
  reviewPath,
  reviewsPath,
} from "../apiPaths";
import type { Review } from "../../types";

type ReviewsListResponse = {
  status: string;
  results?: number;
  data?: { reviews?: Review[] };
};

type ReviewOneResponse = {
  status: string;
  data?: { review?: Review };
};

export async function listReviews(
  parentType: ParentEntityType,
  parentId: string
): Promise<Review[]> {
  const res = await apiGet<ReviewsListResponse>(reviewsPath(parentType, parentId));
  return res.data?.reviews ?? [];
}

export async function createReview(
  parentType: ParentEntityType,
  parentId: string,
  body: { review: string; rating: number }
) {
  return apiPost<ReviewOneResponse>(reviewsPath(parentType, parentId), body);
}

export async function updateReview(
  parentType: ParentEntityType,
  parentId: string,
  reviewId: string,
  body: { review?: string; rating?: number }
) {
  return apiPatch<ReviewOneResponse>(
    reviewPath(parentType, parentId, reviewId),
    body
  );
}

export async function deleteReview(
  parentType: ParentEntityType,
  parentId: string,
  reviewId: string
) {
  return apiDelete(reviewPath(parentType, parentId, reviewId));
}

export async function toggleReviewLike(
  parentType: ParentEntityType,
  parentId: string,
  reviewId: string
) {
  return apiPatch(reviewLikePath(parentType, parentId, reviewId), {});
}
