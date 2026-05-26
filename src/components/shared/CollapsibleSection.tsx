import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "../../lib/utils";

type Props<T> = {
  items: T[];
  limit: number;
  renderItem: (item: T, index: number) => ReactNode;
  seeMoreLabel?: string;
  seeLessLabel?: string;
  className?: string;
  gridClassName?: string;
};

export default function CollapsibleSection<T>({
  items,
  limit,
  renderItem,
  seeMoreLabel,
  seeLessLabel = "Show less",
  className,
  gridClassName = "grid gap-3 sm:grid-cols-2",
}: Props<T>) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = items.length > limit;
  const visible = expanded ? items : items.slice(0, limit);
  const remaining = items.length - limit;

  if (items.length === 0) return null;

  return (
    <div className={className}>
      <div className={gridClassName}>{visible.map(renderItem)}</div>
      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="mt-4 flex items-center gap-1 text-sm font-bold text-brand-blue hover:underline"
        >
          {expanded
            ? seeLessLabel
            : seeMoreLabel ?? `See more (${remaining} more)`}
          <ChevronDown
            size={16}
            className={cn("transition-transform", expanded && "rotate-180")}
          />
        </button>
      )}
    </div>
  );
}
