import { cn } from "../../lib/utils";

export default function CampusGallerySectionTitle({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-6 flex items-center gap-3", className)}>
      <span
        className="h-6 w-1 shrink-0 rounded-full bg-brand-yellow"
        aria-hidden
      />
      <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white md:text-2xl">
        {title}
      </h2>
    </div>
  );
}
