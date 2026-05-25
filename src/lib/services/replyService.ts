import { apiDelete, apiGet, apiPatch, apiPost } from "../api";
import type { ParentEntityType } from "../apiPaths";
import {
  repliesPath,
  replyLikePath,
  replyPath,
} from "../apiPaths";
import type { Reply } from "../../types";

type RepliesListResponse = {
  status: string;
  results?: number;
  data?: { replies?: Reply[] };
};

export async function listReplies(
  parentType: ParentEntityType,
  parentId: string,
  questionId: string
): Promise<Reply[]> {
  const res = await apiGet<RepliesListResponse>(
    repliesPath(parentType, parentId, questionId)
  );
  return res.data?.replies ?? [];
}

export async function createReply(
  parentType: ParentEntityType,
  parentId: string,
  questionId: string,
  body: { reply: string }
) {
  return apiPost(repliesPath(parentType, parentId, questionId), body);
}

export async function updateReply(
  parentType: ParentEntityType,
  parentId: string,
  questionId: string,
  replyId: string,
  body: { reply: string }
) {
  return apiPatch(replyPath(parentType, parentId, questionId, replyId), body);
}

export async function deleteReply(
  parentType: ParentEntityType,
  parentId: string,
  questionId: string,
  replyId: string
) {
  return apiDelete(replyPath(parentType, parentId, questionId, replyId));
}

export async function toggleReplyLike(
  parentType: ParentEntityType,
  parentId: string,
  questionId: string,
  replyId: string
) {
  return apiPatch(replyLikePath(parentType, parentId, questionId, replyId), {});
}
