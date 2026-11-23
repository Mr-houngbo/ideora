"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Link2, Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProjectCover from "@/components/projects/ProjectCover";
import { addLink, deleteLink } from "@/actions/links";
import { LINK_LABELS, type LinkType, type ProjectLink } from "@/types/project";

const selectClass =
  "h-9 w-full rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

/** "Idées liées": typed links to other ideas, shown on both ends. */
export default function ProjectLinks({
  projectId,
  links,
  options,
}: {
  projectId: string;
  links: ProjectLink[];
  options: { id: string; titre: string }[];
}) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [type, setType] = useState<LinkType>("lie");
  const [cible, setCible] = useState("");
  const [note, setNote] = useState("");
  const [pending, startTransition] = useTransition();

  const available = useMemo(() => {
    const linked = new Set(links.map((l) => l.other.id));
    return options.filter((o) => o.id !== projectId && !linked.has(o.id));
  }, [options, links, projectId]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cible) return;
    startTransition(async () => {
      try {
        await addLink({ sourceId: projectId, cibleId: cible, type, note });
        setCible("");
        setNote("");
        setAdding(false);
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Impossible de lier ces idées.");
      }
    });
  };

  const remove = (id: string) =>
    startTransition(async () => {
      try {
        await deleteLink(id);
        router.refresh();
      } catch {
        toast.error("Impossible de retirer ce lien.");
      }
    });

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">Idées liées</span>
        {!adding && available.length > 0 && (
          <button
            type="button"
            data-print="hide"
            onClick={() => setAdding(true)}
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            <Plus className="h-3.5 w-3.5" />
            Lier
          </button>
        )}
      </div>

      {links.length === 0 && !adding && (
        <p className="text-xs text-muted-foreground">Aucune pour l’instant. Relie cette idée à celles qui l’ont inspirée ou prolongée.</p>
      )}

      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.id} className="group flex items-center gap-3">
            <ProjectCover project={{ ...l.other }} className="h-9 w-9 shrink-0 rounded-lg" />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium text-muted-foreground">{LINK_LABELS[l.type][l.direction]}</p>
              <Link href={`/projet/${l.other.id}`} className="block truncate text-sm font-semibold hover:text-primary">
                {l.other.titre}
              </Link>
              {l.note && <p className="truncate text-xs text-muted-foreground">{l.note}</p>}
            </div>
            <button
              type="button"
              data-print="hide"
              onClick={() => remove(l.id)}
              disabled={pending}
              className="shrink-0 rounded-md p-1 text-muted-foreground opacity-0 transition hover:text-destructive focus-visible:opacity-100 group-hover:opacity-100"
              title="Retirer le lien"
              aria-label={`Retirer le lien avec ${l.other.titre}`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </li>
        ))}
      </ul>

      {adding && (
        <form onSubmit={submit} data-print="hide" className="mt-3 space-y-2 rounded-2xl border border-border bg-background/60 p-3">
          <select value={type} onChange={(e) => setType(e.target.value as LinkType)} className={selectClass} aria-label="Nature du lien">
            {(Object.keys(LINK_LABELS) as LinkType[]).map((t) => (
              <option key={t} value={t}>
                Cette idée : {LINK_LABELS[t].out.toLowerCase()}…
              </option>
            ))}
          </select>
          <select value={cible} onChange={(e) => setCible(e.target.value)} className={selectClass} aria-label="Idée à lier" required>
            <option value="">Choisir une idée</option>
            {available.map((o) => (
              <option key={o.id} value={o.id}>
                {o.titre}
              </option>
            ))}
          </select>
          <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Une note (facultatif)" className="h-9" maxLength={300} />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setAdding(false)}>
              Annuler
            </Button>
            <Button type="submit" size="sm" variant="gradient" disabled={pending || !cible}>
              {pending ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Link2 className="mr-1.5 h-4 w-4" />}
              Lier
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
