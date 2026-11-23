"use client";

import { useState, useTransition } from "react";
import { FolderHeart } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";
import ProjectCover from "@/components/projects/ProjectCover";
import { ShareManager } from "@/components/projects/SharePanel";
import { setInPortfolio } from "@/actions/shares";
import { STATUS_LABELS, type Project, type ShareLink } from "@/types/project";
import { cn } from "@/lib/utils";

/** Choose the ideas of the shared portfolio and manage its private links. */
export default function PortfolioManager({ projects, shares }: { projects: Project[]; shares: ShareLink[] }) {
  const [picked, setPicked] = useState(() => new Set(projects.filter((p) => p.dans_portfolio).map((p) => p.id)));
  const [, startTransition] = useTransition();

  const toggle = (id: string) => {
    const next = !picked.has(id);
    setPicked((s) => {
      const copy = new Set(s);
      if (next) copy.add(id);
      else copy.delete(id);
      return copy;
    });
    startTransition(async () => {
      try {
        await setInPortfolio(id, next);
      } catch {
        toast.error("Impossible d’enregistrer ce choix.");
        setPicked((s) => {
          const copy = new Set(s);
          if (next) copy.delete(id);
          else copy.add(id);
          return copy;
        });
      }
    });
  };

  return (
    <Layout>
      <div className="container max-w-5xl py-10">
        <header className="mb-10">
          <div
            className="mb-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            style={{ background: "var(--gradient-primary)" }}
          >
            <FolderHeart className="h-4 w-4" />
            Portfolio
          </div>
          <h1 className="mb-3 text-4xl font-bold sm:text-5xl">
            Ce que tu choisis de <span className="gradient-text">montrer</span>
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Coche les idées à inclure, puis crée un lien privé. Ceux qui l’ouvrent voient ces idées en lecture seule, sans
            tes notes ni tes promesses.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section aria-labelledby="pick-title">
            <h2 id="pick-title" className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {picked.size} {picked.size > 1 ? "idées incluses" : "idée incluse"} sur {projects.length}
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {projects.map((p) => {
                const on = picked.has(p.id);
                return (
                  <li key={p.id}>
                    <label
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-2xl border bg-card/80 p-3 transition",
                        on ? "border-primary/50 ring-1 ring-primary/30" : "border-border hover:border-primary/30",
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => toggle(p.id)}
                        className="h-5 w-5 shrink-0 cursor-pointer rounded-md accent-[hsl(var(--primary))]"
                      />
                      <ProjectCover project={p} className="h-11 w-14 shrink-0 rounded-lg" />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold">{p.titre}</span>
                        <span className="block text-xs text-muted-foreground">
                          {p.categorie} · {STATUS_LABELS[p.statut]}
                        </span>
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
              <h2 className="mb-1 font-semibold">Liens du portfolio</h2>
              <p className="mb-4 text-sm text-muted-foreground">
                Chaque lien montre les idées cochées au moment où on l’ouvre.
              </p>
              <ShareManager projectId={null} shares={shares} />
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}
