import { ExternalLink, Link2 } from "lucide-react";

const URL_RE = /(https?:\/\/[^\s)]+)/g;

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/** Splits the free-text "Ressources" field into lines; any URL becomes a link card. */
export function parseResources(text: string): { label: string; url: string | null }[] {
  return text
    .split(/\n+/)
    .map((line) => line.replace(/^\s*[-*•]\s*/, "").trim())
    .filter(Boolean)
    .map((line) => {
      const url = line.match(URL_RE)?.[0] ?? null;
      const label = url ? line.replace(url, "").replace(/[\s:–—-]+$/, "").trim() : line;
      return { label: label || (url ? hostOf(url) : line), url };
    });
}

export default function ResourceList({ text }: { text: string }) {
  const items = parseResources(text);
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((item, i) => {
        const content = (
          <>
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-info/10 text-info">
              {item.url ? <ExternalLink className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium text-foreground">{item.label}</span>
              {item.url && <span className="block truncate text-xs text-muted-foreground">{hostOf(item.url)}</span>}
            </span>
          </>
        );
        return (
          <li key={i}>
            {item.url ? (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/70 p-3 transition-colors hover:border-info/40 hover:bg-info/5"
              >
                {content}
              </a>
            ) : (
              <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/70 p-3">{content}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
