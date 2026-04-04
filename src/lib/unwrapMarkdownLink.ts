/**
 * API sometimes stores URLs as markdown links, e.g.
 * `[https://example.com/x](https://example.com/x)` — browsers need the bare URL.
 */
const MD_LINK_RE = /^\s*\[([^\]]*)\]\(([^)]+)\)\s*$/;

export function unwrapMarkdownLink(raw: string | undefined | null): string {
  if (raw == null) return "";
  const s = String(raw).trim();
  if (!s) return "";
  const m = s.match(MD_LINK_RE);
  if (m) {
    const href = (m[2] ?? "").trim();
    if (href) return href;
    return (m[1] ?? "").trim();
  }
  return s;
}
