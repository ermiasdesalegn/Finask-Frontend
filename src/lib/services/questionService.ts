import { apiDelete, apiGet, apiPatch, apiPost } from "../api";
import type { ParentEntityType } from "../apiPaths";
import {
  questionLikePath,
  questionPath,
  questionsPath,
} from "../apiPaths";
import type { Question } from "../../types";

type QuestionsListResponse = {
  status: string;
  results?: number;
  data?: { questions?: Question[] };
};

type QuestionOneResponse = {
  status: string;
  data?: { question?: Question };
};

export async function listQuestions(
  parentType: ParentEntityType,
  parentId: string
): Promise<Question[]> {
  const res = await apiGet<QuestionsListResponse>(
    questionsPath(parentType, parentId)
  );
  return res.data?.questions ?? [];
}

export async function createQuestion(
  parentType: ParentEntityType,
  parentId: string,
  body: { question: string }
) {
  return apiPost<QuestionOneResponse>(questionsPath(parentType, parentId), body);
}

export async function updateQuestion(
  parentType: ParentEntityType,
  parentId: string,
  questionId: string,
  body: { question: string }
) {
  return apiPatch<QuestionOneResponse>(
    questionPath(parentType, parentId, questionId),
    body
  );
}

export async function deleteQuestion(
  parentType: ParentEntityType,
  parentId: string,
  questionId: string
) {
  return apiDelete(questionPath(parentType, parentId, questionId));
}

export async function toggleQuestionLike(
  parentType: ParentEntityType,
  parentId: string,
  questionId: string
) {
  return apiPatch(questionLikePath(parentType, parentId, questionId), {});
}
