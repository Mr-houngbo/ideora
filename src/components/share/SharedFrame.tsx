import Link from "next/link";
import { Eye, Sparkles } from "lucide-react";

/** Minimal chrome for pages opened by a share link: no navigation into the private app. */
export default function SharedFrame({ children, backHref }: { children: React.ReactNode; backHref?: string }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header data-print="hide" className="sticky top-0 z-50 w-full glass-strong">
        <div className="container flex h-14 items-center justify-between">
          {backHref ? (
            <Link href={backHref} className="flex items-center gap-2.5 text-sm font-semibold">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "var(--gradient-primary)" }}>
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </span>
              <span className="gradient-text">Ideora</span>
            </Link>
          ) : (
            <span className="flex items-center gap-2.5 text-sm font-semibold">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "var(--gradient-primary)" }}>
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </span>
              <span className="gradient-text">Ideora</span>
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/80 px-3 py-1 text-xs text-muted-foreground">
            <Eye className="h-3.5 w-3.5" />
            Lecture seule
          </span>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        Partagé depuis Ideora, un répertoire d’idées datées.
      </footer>
    </div>
  );
}
