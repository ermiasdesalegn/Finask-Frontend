import type { ReactNode } from "react";

/** Renders Gemini comparison text with **bold** segments highlighted. */
export function formatAiSummary(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    const bold = /^\*\*([^*]+)\*\*$/.exec(part);
    if (bold) {
      return (
        <strong
          key={i}
          className="font-black text-brand-blue dark:text-blue-400"
        >
          {bold[1]}
        </strong>
      );
    }
    return part;
  });
}
