import { Heart, Loader2 } from "lucide-react";
import { useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLoginModal } from "../../context/LoginModalContext";
import {
  useCreateFavoriteMutation,
  useFavoritesQuery,
  useRemoveFavoriteMutation,
} from "../../lib/queries/favorites";
import type { FavoriteOnModel } from "../../types";
import { cn } from "../../lib/utils";

type Props = {
  itemId: string;
  onModel: FavoriteOnModel;
  className?: string;
  size?: number;
};

function favoriteMatches(
  f: { item: unknown; onModel: string },
  itemId: string,
  onModel: string
): boolean {
  const m = String(f.onModel).toLowerCase();
  const want = onModel.toLowerCase();
  if (m !== want) return false;
  const item = f.item;
  if (typeof item === "string") return item === itemId;
  if (typeof item === "object" && item !== null && "_id" in item) {
    return String((item as { _id: string })._id) === itemId;
  }
  return false;
}

export default function FavoriteButton({
  itemId,
  onModel,
  className,
  size = 20,
}: Props) {
  const { isAuthenticated } = useAuth();
  const { openLogin } = useLoginModal();
  const enabled = isAuthenticated && Boolean(itemId);
  const { data: favorites = [], isLoading } = useFavoritesQuery(enabled);
  const createMut = useCreateFavoriteMutation();
  const removeMut = useRemoveFavoriteMutation();

  const existing = useMemo(
    () => favorites.find((f) => favoriteMatches(f, itemId, onModel)),
    [favorites, itemId, onModel]
  );

  const pending = createMut.isPending || removeMut.isPending;
  const active = Boolean(existing);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      openLogin();
      return;
    }
    if (!itemId) return;
    if (existing?._id) {
      removeMut.mutate(existing._id);
    } else {
      createMut.mutate({ item: itemId, onModel });
    }
  };

  return (
    <button
      type="button"
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
      title={active ? "Remove from favorites" : "Save to favorites"}
      disabled={pending || isLoading}
      onClick={handleClick}
      className={cn(
        "inline-flex items-center justify-center rounded-full p-2 transition-colors",
        active
          ? "bg-rose-500/15 text-rose-500 hover:bg-rose-500/25"
          : "bg-black/5 text-slate-600 hover:bg-black/10 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/15",
        className
      )}
    >
      {pending ? (
        <Loader2 size={size} className="animate-spin" />
      ) : (
        <Heart
          size={size}
          className={cn(active && "fill-current")}
        />
      )}
    </button>
  );
}
