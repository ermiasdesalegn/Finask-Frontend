import { ChevronDown, Loader2, MessageCircle, ThumbsUp, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLoginModal } from "../../context/LoginModalContext";
import { ApiError, showApiToast } from "../../lib/api";
import type { ParentEntityType } from "../../lib/apiPaths";
import {
  createQuestion,
  deleteQuestion,
  listQuestions,
  toggleQuestionLike,
  updateQuestion,
} from "../../lib/services/questionService";
import {
  createReply,
  deleteReply,
  listReplies,
  toggleReplyLike,
  updateReply,
} from "../../lib/services/replyService";
import type { Question, Reply } from "../../types";

const QUESTION_PREVIEW_LIMIT = 5;
const REPLY_PREVIEW_LIMIT = 3;

type Props = {
  parentType: ParentEntityType;
  parentId: string;
  initialQuestions?: Question[];
  title?: string;
};

export default function QuestionsSection({
  parentType,
  parentId,
  initialQuestions,
  title = "Questions & answers",
}: Props) {
  const { user, isAuthenticated, sessionStatus } = useAuth();
  const { openLogin } = useLoginModal();
  const qc = useQueryClient();
  const qk = ["questions", parentType, parentId] as const;

  const seededQuestions =
    initialQuestions && initialQuestions.length > 0 ? initialQuestions : undefined;

  const {
    data: questions = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: qk,
    queryFn: () => listQuestions(parentType, parentId),
    enabled: Boolean(parentId) && sessionStatus === "ready",
    placeholderData: seededQuestions,
    staleTime: 0,
  });

  const [newQ, setNewQ] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState<Record<string, string>>({});
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const [showAskForm, setShowAskForm] = useState(false);

  const invalidate = () => void qc.invalidateQueries({ queryKey: qk });

  const createQMut = useMutation({
    mutationFn: () => createQuestion(parentType, parentId, { question: newQ.trim() }),
    onSuccess: (res) => {
      setNewQ("");
      const created = res.data?.question;
      if (created?._id) {
        qc.setQueryData<Question[]>(qk, (prev) => {
          const list = prev ?? [];
          if (list.some((q) => q._id === created._id)) return list;
          return [created, ...list];
        });
      }
      invalidate();
    },
    onError: (e) =>
      showApiToast(e instanceof ApiError ? e.message : "Could not post question"),
  });

  const questionTooShort = newQ.trim().length > 0 && newQ.trim().length < 10;

  const canPost = isAuthenticated && user?.role === "user";
  const visibleQuestions = showAllQuestions
    ? questions
    : questions.slice(0, QUESTION_PREVIEW_LIMIT);
  const hasMoreQuestions = questions.length > QUESTION_PREVIEW_LIMIT;

  return (
    <section className="mt-12">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
        {canPost && !showAskForm && (
          <button
            type="button"
            onClick={() => setShowAskForm(true)}
            className="rounded-xl bg-brand-blue px-4 py-2 text-sm font-semibold text-white"
          >
            Ask a question
          </button>
        )}
      </div>

      {canPost && showAskForm && (
        <form
          className="mb-6 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const text = newQ.trim();
            if (!text) return;
            if (text.length < 10) {
              showApiToast("Questions must be at least 10 characters.");
              return;
            }
            createQMut.mutate();
          }}
        >
          <input
            value={newQ}
            onChange={(e) => setNewQ(e.target.value)}
            placeholder="Ask a question… (min. 10 characters)"
            minLength={10}
            className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-white/10 dark:bg-zinc-950"
          />
          <button
            type="submit"
            disabled={createQMut.isPending || questionTooShort}
            className="rounded-xl bg-brand-blue px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            Post
          </button>
          <button
            type="button"
            onClick={() => setShowAskForm(false)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-white/10"
          >
            Cancel
          </button>
        </form>
      )}
      {canPost && questionTooShort && (
        <p className="mb-4 text-xs text-amber-600 dark:text-amber-400">
          Write at least 10 characters before posting.
        </p>
      )}

      {!isAuthenticated && (
        <p className="mb-4 text-sm text-slate-500">
          <button type="button" className="font-semibold text-brand-blue" onClick={openLogin}>
            Sign in
          </button>{" "}
          to post.
        </p>
      )}

      {isLoading && (
        <div className="flex justify-center py-6">
          <Loader2 className="animate-spin text-brand-blue" />
        </div>
      )}

      {isError && (
        <p className="text-sm text-rose-500">Could not load questions. Try refreshing.</p>
      )}

      {!isLoading && !isError && questions.length === 0 && (
        <p className="text-sm text-slate-500">No questions yet.</p>
      )}

      <ul className="space-y-3">
        {visibleQuestions.map((q) => (
          <QuestionThread
            key={q._id}
            q={q}
            parentType={parentType}
            parentId={parentId}
            expanded={expanded === q._id}
            onToggle={() => setExpanded(expanded === q._id ? null : q._id)}
            replyDraft={replyDraft[q._id] ?? ""}
            onReplyDraft={(v) => setReplyDraft((d) => ({ ...d, [q._id]: v }))}
            userId={user?._id}
            isAuthenticated={isAuthenticated}
            openLogin={openLogin}
            onInvalidate={invalidate}
          />
        ))}
      </ul>

      {hasMoreQuestions && !showAllQuestions && (
        <button
          type="button"
          onClick={() => setShowAllQuestions(true)}
          className="mt-4 text-sm font-bold text-brand-blue hover:underline"
        >
          See all questions ({questions.length})
        </button>
      )}
      {showAllQuestions && hasMoreQuestions && (
        <button
          type="button"
          onClick={() => setShowAllQuestions(false)}
          className="mt-4 text-sm font-bold text-slate-500 hover:underline"
        >
          Show fewer questions
        </button>
      )}
    </section>
  );
}

function QuestionThread({
  q,
  parentType,
  parentId,
  expanded,
  onToggle,
  replyDraft,
  onReplyDraft,
  userId,
  isAuthenticated,
  openLogin,
  onInvalidate,
}: {
  q: Question;
  parentType: ParentEntityType;
  parentId: string;
  expanded: boolean;
  onToggle: () => void;
  replyDraft: string;
  onReplyDraft: (v: string) => void;
  userId?: string;
  isAuthenticated: boolean;
  openLogin: () => void;
  onInvalidate: () => void;
}) {
  const [editingQ, setEditingQ] = useState(false);
  const [editQText, setEditQText] = useState(q.question);
  const [showAllReplies, setShowAllReplies] = useState(false);

  const rk = ["replies", parentType, parentId, q._id] as const;
  const { data: replies = [], isLoading } = useQuery({
    queryKey: rk,
    queryFn: () => listReplies(parentType, parentId, q._id),
    enabled: expanded,
  });

  const qc = useQueryClient();
  const invReplies = () => void qc.invalidateQueries({ queryKey: rk });

  const replyMut = useMutation({
    mutationFn: () =>
      createReply(parentType, parentId, q._id, { reply: replyDraft }),
    onSuccess: () => {
      onReplyDraft("");
      invReplies();
      onInvalidate();
    },
    onError: (e) =>
      showApiToast(e instanceof ApiError ? e.message : "Could not post reply"),
  });

  const deleteQMut = useMutation({
    mutationFn: () => deleteQuestion(parentType, parentId, q._id),
    onSuccess: onInvalidate,
    onError: (e) =>
      showApiToast(e instanceof ApiError ? e.message : "Could not delete question"),
  });

  const updateQMut = useMutation({
    mutationFn: () =>
      updateQuestion(parentType, parentId, q._id, { question: editQText }),
    onSuccess: () => {
      setEditingQ(false);
      onInvalidate();
    },
    onError: (e) =>
      showApiToast(e instanceof ApiError ? e.message : "Could not update question"),
  });

  const likeQMut = useMutation({
    mutationFn: () => toggleQuestionLike(parentType, parentId, q._id),
    onSuccess: onInvalidate,
  });

  const isOwner = userId && q.user?._id === userId;
  const author =
    [q.user?.firstName, q.user?.lastName].filter(Boolean).join(" ") || "Student";

  return (
    <li className="rounded-2xl border border-slate-200/80 bg-white/60 p-4 dark:border-white/10 dark:bg-zinc-900/60">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          {q.user?._id ? (
            <Link to={`/users/${q.user._id}`} className="text-xs font-semibold text-brand-blue">
              {author}
            </Link>
          ) : (
            <span className="text-xs font-semibold text-slate-500">{author}</span>
          )}
          {editingQ ? (
            <div className="mt-2 space-y-2">
              <textarea
                value={editQText}
                onChange={(e) => setEditQText(e.target.value)}
                rows={2}
                className="w-full rounded-lg border px-2 py-1 text-sm dark:border-white/10 dark:bg-zinc-950"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  className="text-sm font-semibold text-brand-blue"
                  onClick={() => updateQMut.mutate()}
                  disabled={updateQMut.isPending}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="text-sm text-slate-500"
                  onClick={() => {
                    setEditingQ(false);
                    setEditQText(q.question);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-1 text-sm text-slate-800 dark:text-slate-200">{q.question}</p>
          )}
          <button
            type="button"
            onClick={onToggle}
            className="mt-2 flex items-center gap-1 text-xs font-medium text-brand-blue"
          >
            <MessageCircle size={14} />
            {q.replyCount ?? replies.length} replies
            <ChevronDown size={14} className={expanded ? "rotate-180" : ""} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <button
              type="button"
              onClick={() => likeQMut.mutate()}
              className="flex items-center gap-1 text-xs text-slate-500"
            >
              <ThumbsUp size={14} />
              {q.likesCount ?? 0}
            </button>
          )}
          {isOwner && !editingQ && (
            <>
              <button
                type="button"
                className="text-xs text-brand-blue"
                onClick={() => {
                  setEditQText(q.question);
                  setEditingQ(true);
                }}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => deleteQMut.mutate()}
                className="text-rose-500"
              >
                <Trash2 size={14} />
              </button>
            </>
          )}
        </div>
      </div>

      {expanded && (
        <div className="mt-4 border-t border-slate-200/60 pt-4 dark:border-white/10">
          {isLoading && <Loader2 size={18} className="animate-spin" />}
          <ul className="mb-3 space-y-2">
            {(showAllReplies ? replies : replies.slice(0, REPLY_PREVIEW_LIMIT)).map(
              (r) => (
                <ReplyRow
                  key={r._id}
                  reply={r}
                  parentType={parentType}
                  parentId={parentId}
                  questionId={q._id}
                  userId={userId}
                  isAuthenticated={isAuthenticated}
                  onInvalidate={() => {
                    invReplies();
                    onInvalidate();
                  }}
                />
              )
            )}
          </ul>
          {replies.length > REPLY_PREVIEW_LIMIT && !showAllReplies && (
            <button
              type="button"
              onClick={() => setShowAllReplies(true)}
              className="mb-3 text-xs font-bold text-brand-blue hover:underline"
            >
              See more replies ({replies.length - REPLY_PREVIEW_LIMIT} more)
            </button>
          )}
          {isAuthenticated ? (
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!replyDraft.trim()) return;
                replyMut.mutate();
              }}
            >
              <input
                value={replyDraft}
                onChange={(e) => onReplyDraft(e.target.value)}
                placeholder="Write a reply…"
                className="flex-1 rounded-lg border px-2 py-1 text-sm dark:border-white/10 dark:bg-zinc-950"
              />
              <button type="submit" className="text-sm font-semibold text-brand-blue">
                Reply
              </button>
            </form>
          ) : (
            <button type="button" className="text-xs text-brand-blue" onClick={openLogin}>
              Sign in to reply
            </button>
          )}
        </div>
      )}
    </li>
  );
}

function ReplyRow({
  reply,
  parentType,
  parentId,
  questionId,
  userId,
  isAuthenticated,
  onInvalidate,
}: {
  reply: Reply;
  parentType: ParentEntityType;
  parentId: string;
  questionId: string;
  userId?: string;
  isAuthenticated: boolean;
  onInvalidate: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(reply.reply);

  const isOwner = userId && reply.user?._id === userId;
  const author =
    [reply.user?.firstName, reply.user?.lastName].filter(Boolean).join(" ") || "User";

  const updateMut = useMutation({
    mutationFn: () =>
      updateReply(parentType, parentId, questionId, reply._id, { reply: editText }),
    onSuccess: () => {
      setEditing(false);
      onInvalidate();
    },
    onError: (e) =>
      showApiToast(e instanceof ApiError ? e.message : "Could not update reply"),
  });

  const deleteMut = useMutation({
    mutationFn: () => deleteReply(parentType, parentId, questionId, reply._id),
    onSuccess: onInvalidate,
    onError: (e) =>
      showApiToast(e instanceof ApiError ? e.message : "Could not delete reply"),
  });

  const likeMut = useMutation({
    mutationFn: () => toggleReplyLike(parentType, parentId, questionId, reply._id),
    onSuccess: onInvalidate,
  });

  return (
    <li className="rounded-lg bg-slate-50 px-3 py-2 text-sm dark:bg-zinc-800/80">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          {reply.user?._id ? (
            <Link
              to={`/users/${reply.user._id}`}
              className="font-medium text-brand-blue"
            >
              {author}
            </Link>
          ) : (
            <span className="font-medium text-slate-700 dark:text-slate-300">{author}</span>
          )}
          {editing ? (
            <div className="mt-2 space-y-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={2}
                className="w-full rounded border px-2 py-1 text-sm dark:border-white/10 dark:bg-zinc-950"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  className="text-xs font-semibold text-brand-blue"
                  onClick={() => updateMut.mutate()}
                  disabled={updateMut.isPending}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="text-xs text-slate-500"
                  onClick={() => {
                    setEditing(false);
                    setEditText(reply.reply);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-1 text-slate-700 dark:text-slate-300">{reply.reply}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {isAuthenticated && (
            <button
              type="button"
              onClick={() => likeMut.mutate()}
              className="flex items-center gap-1 text-slate-400"
            >
              <ThumbsUp size={12} />
              {reply.likesCount ?? 0}
            </button>
          )}
          {isOwner && !editing && (
            <>
              <button
                type="button"
                className="text-xs text-brand-blue"
                onClick={() => {
                  setEditText(reply.reply);
                  setEditing(true);
                }}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => deleteMut.mutate()}
                className="text-rose-500"
              >
                <Trash2 size={12} />
              </button>
            </>
          )}
        </div>
      </div>
    </li>
  );
}
