import { useRef } from "react";
import { UploadCloud, X } from "lucide-react";
import { cn } from "../../lib/utils";

interface ImageDropzoneProps {
  label: string;
  maxFiles?: number;
  className?: string;
  onChange?: (files: File[]) => void;
  files?: File[];
}

export function ImageDropzone({
  label,
  maxFiles,
  className,
  onChange,
  files = [],
}: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const displayText =
    maxFiles && maxFiles > 1 ? `${label} — up to ${maxFiles} images` : label;

  return (
    <div className={cn("space-y-2", className)}>
      <div
        role={onChange ? "button" : undefined}
        tabIndex={onChange ? 0 : undefined}
        onClick={() => onChange && inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && onChange && inputRef.current?.click()}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center dark:border-white/10 dark:bg-zinc-900/50",
          onChange && "cursor-pointer hover:border-brand-blue/40"
        )}
      >
        <UploadCloud className="size-8 text-slate-400" />
        <p className="text-sm text-slate-600 dark:text-slate-400">{displayText}</p>
        <p className="text-xs text-slate-400">PNG, JPG, WEBP</p>
      </div>
      {onChange && (
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={!maxFiles || maxFiles > 1}
          className="hidden"
          onChange={(e) => {
            onChange(Array.from(e.target.files ?? []));
            e.target.value = "";
          }}
        />
      )}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((file, i) => (
            <div
              key={i}
              className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs dark:border-white/10 dark:bg-zinc-900"
            >
              <span className="max-w-[140px] truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => onChange?.(files.filter((_, j) => j !== i))}
                className="text-slate-400 hover:text-slate-700"
                aria-label={`Remove ${file.name}`}
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
