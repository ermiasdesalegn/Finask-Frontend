import { Loader2 } from "lucide-react";

export default function AuthLoadingGate({
  message = "Loading…",
}: {
  message?: string;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-6 pt-24">
      <Loader2 className="h-9 w-9 animate-spin text-brand-blue" aria-hidden />
      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
        {message}
      </p>
    </div>
  );
}
