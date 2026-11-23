import Link from "next/link";
import { MailOpen } from "lucide-react";
import { formatIdeaDate } from "@/lib/idea-dates";
import type { JournalEntry } from "@/types/project";

export type DuePromise = JournalEntry & { projet_titre: string };

/** Promises to the future self whose day has come: shown at the top of the home page until read again. */
export default function DuePromises({ promises }: { promises: DuePromise[] }) {
  if (promises.length === 0) return null;
  return (
    <section
      aria-labelledby="promises-title"
      className="mb-10 rounded-3xl border border-accent/30 bg-accent/5 p-5 backdrop-blur-sm sm:p-6"
    >
      <h2 id="promises-title" className="mb-3 flex items-center gap-2 font-semibold">
        <MailOpen className="h-5 w-5 text-accent" />
        {promises.length > 1 ? `${promises.length} promesses du passé t’attendent` : "Une promesse du passé t’attend"}
      </h2>
      <ul className="space-y-2">
        {promises.map((p) => (
          <li key={p.id}>
            <Link
              href={`/projet/${p.project_id}#evolution`}
              className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-2xl bg-card/80 px-4 py-3 text-sm transition hover:bg-card"
            >
              <span>
                <strong>{p.titre}</strong>
                <span className="text-muted-foreground"> · {p.projet_titre}</span>
              </span>
              <span className="text-xs text-muted-foreground">Écrite le {formatIdeaDate(p.ecrit_le)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
