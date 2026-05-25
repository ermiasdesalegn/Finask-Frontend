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
} from "../../lib/services/questionService";
import {
  createReply,
  deleteReply,
  listReplies,
  toggleReplyLike,
} from "../../lib/services/replyService";
import type { Question } from "../../types";

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
  title = "Community questions",
}: Props) {
  const { user, isAuthenticated } = useAuth();
  const { openLogin } = useLoginModal();
  const qc = useQueryClient();
  const qk = ["questions", parentType, parentId] as const;

  const { data: questions = initialQuestions ?? [], isLoading } = useQuery({
    queryKey: qk,
    queryFn: () => listQuestions(parentType, parentId),
    enabled: Boolean(parentId),
    initialData: initialQuestions,
  });

  const [newQ, setNewQ] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState<Record<string, string>>({});

  const invalidate = () => void qc.invalidateQueries({ queryKey: qk });

  const createQMut = useMutation({
    mutationFn: () => createQuestion(parentType, parentId, { question: newQ }),
    onSuccess: () => {
      setNewQ("");
      invalidate();
    },
    onError: (e) =>
      showApiToast(e instanceof ApiError ? e.message : "Could not post question"),
  });

  const canPost = isAuthenticated && user?.role === "user";

  return (
    <section className="mt-12">
      <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">{title}</h2>

      {canPost && (
        <form
          className="mb-6 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!newQ.trim()) return;
            createQMut.mutate();
          }}
        >
          <input
            value={newQ}
            onChange={(e) => setNewQ(e.target.value)}
            placeholder="Ask a question…"
            className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-white/10 dark:bg-zinc-950"
          />
          <button
            type="submit"
            disabled={createQMut.isPending}
            className="rounded-xl bg-brand-blue px-4 py-2 text-sm font-semibold text-white"
          >
            Ask
          </button>
        </form>
      )}

      {!isAuthenticated && (
        <p className="mb-4 text-sm text-slate-500">
          <button type="button" className="font-semibold text-brand-blue" onClick={openLogin}>
            Sign in
          </button>{" "}
          to join the discussion.
        </p>
      )}

      {isLoading && (
        <div className="flex justify-center py-6">
          <Loader2 className="animate-spin text-brand-blue" />
        </div>
      )}

      {!isLoading && questions.length === 0 && (
        <p className="text-sm text-slate-500">No questions yet.</p>
      )}

      <ul className="space-y-3">
        {questions.map((q) => (
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
  });

  const deleteQMut = useMutation({
    mutationFn: () => deleteQuestion(parentType, parentId, q._id),
    onSuccess: onInvalidate,
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
          <p className="mt-1 text-sm text-slate-800 dark:text-slate-200">{q.question}</p>
          <button
            type="button"
            onClick={onToggle}
            className="mt-2 flex items-center gap-1 text-xs font-medium text-brand-blue"
          >
            <MessageCircle size={14} />
            {q.replyCount ?? 0} replies
            <ChevronDown size={14} className={expanded ? "rotate-180" : ""} />
          </button>
        </div>
        <div className="flex gap-2">
          {isAuthenticated && (
            <button type="button" onClick={() => likeQMut.mutate()} className="text-slate-400">
              <ThumbsUp size={14} />
            </button>
          )}
          {isOwner && (
            <button type="button" onClick={() => deleteQMut.mutate()} className="text-rose-500">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {expanded && (
        <div className="mt-4 border-t border-slate-200/60 pt-4 dark:border-white/10">
          {isLoading && <Loader2 size={18} className="animate-spin" />}
          <ul className="mb-3 space-y-2">
            {replies.map((r) => (
              <li key={r._id} className="rounded-lg bg-slate-50 px-3 py-2 text-sm dark:bg-zinc-800/80">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {[r.user?.firstName, r.user?.lastName].filter(Boolean).join(" ") || "User"}:{" "}
                </span>
                {r.reply}
              </li>
            ))}
          </ul>
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
