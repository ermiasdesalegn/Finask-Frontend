import { Loader2, Star, ThumbsUp, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLoginModal } from "../../context/LoginModalContext";
import { ApiError, showApiToast } from "../../lib/api";
import type { ParentEntityType } from "../../lib/apiPaths";
import {
  createReview,
  deleteReview,
  listReviews,
  toggleReviewLike,
  updateReview,
} from "../../lib/services/reviewService";
import type { Review } from "../../types";
import { cn } from "../../lib/utils";

const PREVIEW_LIMIT = 3;

type Props = {
  parentType: ParentEntityType;
  parentId: string;
  initialReviews?: Review[];
};

export default function ReviewsSection({
  parentType,
  parentId,
  initialReviews,
}: Props) {
  const { user, isAuthenticated, sessionStatus } = useAuth();
  const { openLogin } = useLoginModal();
  const qc = useQueryClient();
  const qk = ["reviews", parentType, parentId] as const;

  const seededReviews =
    initialReviews && initialReviews.length > 0 ? initialReviews : undefined;

  const {
    data: reviews = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: qk,
    queryFn: () => listReviews(parentType, parentId),
    enabled: Boolean(parentId) && sessionStatus === "ready",
    placeholderData: seededReviews,
    staleTime: 0,
  });

  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(5);
  const [showAll, setShowAll] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const invalidate = () => void qc.invalidateQueries({ queryKey: qk });

  const createMut = useMutation({
    mutationFn: () => createReview(parentType, parentId, { review: text, rating }),
    onSuccess: () => {
      setText("");
      invalidate();
    },
    onError: (e) =>
      showApiToast(e instanceof ApiError ? e.message : "Could not post review"),
  });

  const updateMut = useMutation({
    mutationFn: (id: string) =>
      updateReview(parentType, parentId, id, {
        review: editText,
        rating: editRating,
      }),
    onSuccess: () => {
      setEditingId(null);
      invalidate();
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteReview(parentType, parentId, id),
    onSuccess: invalidate,
  });

  const likeMut = useMutation({
    mutationFn: (id: string) => toggleReviewLike(parentType, parentId, id),
    onSuccess: invalidate,
  });

  const canPost = isAuthenticated && user?.role === "user";
  const visibleReviews = showAll ? reviews : reviews.slice(0, PREVIEW_LIMIT);
  const hasMore = reviews.length > PREVIEW_LIMIT;

  return (
    <section className="mt-12">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Student reviews
        </h2>
        {canPost && !showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="rounded-xl bg-brand-blue px-4 py-2 text-sm font-semibold text-white"
          >
            Add review
          </button>
        )}
      </div>

      {canPost && showForm && (
        <form
          className="mb-6 rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-zinc-900/80"
          onSubmit={(e) => {
            e.preventDefault();
            if (!text.trim()) return;
            createMut.mutate();
          }}
        >
          <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-400">
            Your rating
          </label>
          <div className="mb-3 flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setRating(s)}
                className="p-0.5"
              >
                <Star
                  size={22}
                  className={cn(
                    s <= rating
                      ? "fill-brand-yellow text-brand-yellow"
                      : "text-slate-300"
                  )}
                />
              </button>
            ))}
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your experience…"
            rows={3}
            className="mb-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-zinc-950"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={createMut.isPending}
              className="rounded-xl bg-brand-blue px-4 py-2 text-sm font-semibold text-white"
            >
              {createMut.isPending ? "Posting…" : "Post review"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium dark:border-white/10"
            >
              Cancel
            </button>
          </div>
        </form>
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
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin text-brand-blue" />
        </div>
      )}

      {isError && (
        <p className="text-sm text-rose-500">Could not load reviews. Try refreshing.</p>
      )}

      {!isLoading && !isError && reviews.length === 0 && (
        <p className="text-sm text-slate-500">No reviews yet. Be the first!</p>
      )}

      <ul className="space-y-4">
        {visibleReviews.map((r) => {
          const isOwner = user?._id && r.user?._id === user._id;
          const authorName =
            r.user?.fullName ||
            [r.user?.firstName, r.user?.lastName].filter(Boolean).join(" ") ||
            "Student";
          return (
            <li
              key={r._id}
              className="rounded-2xl border border-slate-200/80 bg-white/60 p-4 dark:border-white/10 dark:bg-zinc-900/60"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div>
                  {r.user?._id ? (
                    <Link
                      to={`/users/${r.user._id}`}
                      className="font-semibold text-slate-900 hover:text-brand-blue dark:text-white"
                    >
                      {authorName}
                    </Link>
                  ) : (
                    <span className="font-semibold">{authorName}</span>
                  )}
                  <div className="mt-1 flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={12}
                        className={
                          s <= Math.round(r.rating)
                            ? "fill-brand-yellow text-brand-yellow"
                            : "text-slate-300"
                        }
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isAuthenticated && (
                    <button
                      type="button"
                      onClick={() => likeMut.mutate(r._id)}
                      className="flex items-center gap-1 text-xs text-slate-500"
                    >
                      <ThumbsUp size={14} />
                      {r.likesCount ?? 0}
                    </button>
                  )}
                  {isOwner && (
                    <>
                      <button
                        type="button"
                        className="text-xs text-brand-blue"
                        onClick={() => {
                          setEditingId(r._id);
                          setEditText(r.review);
                          setEditRating(r.rating);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteMut.mutate(r._id)}
                        className="text-rose-500"
                      >
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>
              {editingId === r._id ? (
                <div className="space-y-2">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full rounded-lg border px-2 py-1 text-sm dark:border-white/10 dark:bg-zinc-950"
                  />
                  <button
                    type="button"
                    className="text-sm font-semibold text-brand-blue"
                    onClick={() => updateMut.mutate(r._id)}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-300">{r.review}</p>
              )}
            </li>
          );
        })}
      </ul>

      {hasMore && !showAll && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="mt-4 text-sm font-bold text-brand-blue hover:underline"
        >
          See all reviews ({reviews.length})
        </button>
      )}
      {showAll && hasMore && (
        <button
          type="button"
          onClick={() => setShowAll(false)}
          className="mt-4 text-sm font-bold text-slate-500 hover:underline"
        >
          Show fewer reviews
        </button>
      )}
    </section>
  );
}
