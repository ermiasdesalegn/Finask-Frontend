import type { ReactNode } from "react";

function formatInline(text: string): ReactNode[] {
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
    return <span key={i}>{part}</span>;
  });
}

/** Renders Gemini comparison text with **bold** segments and paragraph breaks. */
export function formatAiSummary(text: string): ReactNode {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  const paragraphs = normalized
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length <= 1) {
    const single = paragraphs[0] ?? normalized;
    const lines = single.split(/\n/).filter(Boolean);
    if (lines.length <= 1) {
      return (
        <span className="whitespace-pre-wrap break-words">{formatInline(single)}</span>
      );
    }
    return (
      <div className="space-y-2">
        {lines.map((line, i) => (
          <p key={i} className="whitespace-pre-wrap break-words">
            {formatInline(line)}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {paragraphs.map((para, i) => (
        <p key={i} className="whitespace-pre-wrap break-words">
          {formatInline(para)}
        </p>
      ))}
    </div>
  );
}
