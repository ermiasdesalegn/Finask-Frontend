export type ParentEntityType =
  | "university"
  | "program"
  | "city"
  | "campus"
  | "celebrity";

const SEGMENT: Record<ParentEntityType, string> = {
  university: "universities",
  program: "programs",
  city: "cities",
  campus: "campuses",
  celebrity: "celebrities",
};

const PARAM: Record<ParentEntityType, string> = {
  university: "universityId",
  program: "programId",
  city: "cityId",
  campus: "campusId",
  celebrity: "celebrityId",
};

export function parentBase(type: ParentEntityType, parentId: string): string {
  const seg = SEGMENT[type];
  return `/${seg}/${encodeURIComponent(parentId)}`;
}

export function reviewsPath(type: ParentEntityType, parentId: string): string {
  return `${parentBase(type, parentId)}/reviews`;
}

export function reviewPath(
  type: ParentEntityType,
  parentId: string,
  reviewId: string
): string {
  return `${reviewsPath(type, parentId)}/${encodeURIComponent(reviewId)}`;
}

export function reviewLikePath(
  type: ParentEntityType,
  parentId: string,
  reviewId: string
): string {
  return `${reviewPath(type, parentId, reviewId)}/like`;
}

export function questionsPath(type: ParentEntityType, parentId: string): string {
  return `${parentBase(type, parentId)}/questions`;
}

export function questionPath(
  type: ParentEntityType,
  parentId: string,
  questionId: string
): string {
  return `${questionsPath(type, parentId)}/${encodeURIComponent(questionId)}`;
}

export function questionLikePath(
  type: ParentEntityType,
  parentId: string,
  questionId: string
): string {
  return `${questionPath(type, parentId, questionId)}/like`;
}

export function repliesPath(
  type: ParentEntityType,
  parentId: string,
  questionId: string
): string {
  return `${questionPath(type, parentId, questionId)}/replies`;
}

export function replyPath(
  type: ParentEntityType,
  parentId: string,
  questionId: string,
  replyId: string
): string {
  return `${repliesPath(type, parentId, questionId)}/${encodeURIComponent(replyId)}`;
}

export function replyLikePath(
  type: ParentEntityType,
  parentId: string,
  questionId: string,
  replyId: string
): string {
  return `${replyPath(type, parentId, questionId, replyId)}/like`;
}
