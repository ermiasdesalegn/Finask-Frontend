import React, { useCallback, useEffect, useRef } from "react";

const LENGTH = 6;

const emptyCells = () => Array.from({ length: LENGTH }, () => "");

function rowFrom(c: string[]) {
  return Array.from({ length: LENGTH }, (_, i) =>
    (c[i] ?? "").replace(/\D/g, "").slice(0, 1)
  );
}

type Props = {
  cells: string[];
  onCellsChange: (next: string[]) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  idPrefix?: string;
};

/**
 * Six separate digit boxes: paste, auto-advance, backspace to previous cell.
 */
export function VerificationOtpInput({
  cells,
  onCellsChange,
  disabled,
  autoFocus,
  idPrefix = "otp",
}: Props) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const row = rowFrom(cells);

  const focusAt = useCallback((index: number) => {
    const i = Math.max(0, Math.min(LENGTH - 1, index));
    const el = refs.current[i];
    if (el) {
      el.focus();
      el.select();
    }
  }, []);

  useEffect(() => {
    if (autoFocus) {
      const t = window.setTimeout(() => focusAt(0), 50);
      return () => window.clearTimeout(t);
    }
  }, [autoFocus, focusAt]);

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const digits = e.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, LENGTH)
        .split("");
      const next = emptyCells();
      for (let i = 0; i < LENGTH; i++) next[i] = digits[i] ?? "";
      onCellsChange(next);
      focusAt(Math.min(digits.length, LENGTH - 1));
    },
    [onCellsChange, focusAt]
  );

  const handleChange = useCallback(
    (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
      const base = rowFrom(cells);
      const raw = e.target.value.replace(/\D/g, "");
      if (raw.length > 1) {
        const next = [...base];
        let write = index;
        for (const ch of raw) {
          if (write < LENGTH) next[write++] = ch;
        }
        onCellsChange(next);
        focusAt(Math.min(write, LENGTH - 1));
        return;
      }
      const digit = raw.slice(-1);
      const next = [...base];
      next[index] = digit;
      onCellsChange(next);
      if (digit) focusAt(index + 1);
    },
    [cells, onCellsChange, focusAt]
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      const base = rowFrom(cells);
      if (e.key === "Backspace") {
        if (base[index]) {
          const next = [...base];
          next[index] = "";
          onCellsChange(next);
        } else if (index > 0) {
          const next = [...base];
          next[index - 1] = "";
          onCellsChange(next);
          focusAt(index - 1);
        }
        e.preventDefault();
        return;
      }
      if (e.key === "ArrowLeft" && index > 0) {
        focusAt(index - 1);
        e.preventDefault();
      }
      if (e.key === "ArrowRight" && index < LENGTH - 1) {
        focusAt(index + 1);
        e.preventDefault();
      }
    },
    [cells, onCellsChange, focusAt]
  );

  const boxClass =
    "size-11 rounded-xl border border-slate-200 bg-slate-50 text-center font-mono text-lg font-bold text-slate-900 outline-none transition-all focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/25 disabled:opacity-50 dark:border-white/10 dark:bg-zinc-800 dark:text-white dark:focus:bg-zinc-700 sm:size-12 sm:text-xl";

  return (
    <div
      className="flex flex-wrap justify-center gap-2 sm:gap-2.5"
      onPaste={handlePaste}
    >
      {Array.from({ length: LENGTH }, (_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          id={`${idPrefix}-${i}`}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={LENGTH}
          disabled={disabled}
          value={row[i] ?? ""}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onFocus={(e) => e.target.select()}
          aria-label={`Digit ${i + 1} of ${LENGTH}`}
          className={boxClass}
        />
      ))}
    </div>
  );
}

export { LENGTH as VERIFICATION_OTP_LENGTH, emptyCells as emptyOtpCells };
