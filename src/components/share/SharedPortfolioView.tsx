"use client";

import ProjectCard from "@/components/projects/ProjectCard";
import SharedFrame from "@/components/share/SharedFrame";
import type { Project } from "@/types/project";

/** The portfolio opened by a share link: the ideas picked for it, each leading to its read-only page. */
export default function SharedPortfolioView({ projects, token }: { projects: Project[]; token: string }) {
  return (
    <SharedFrame>
      <div className="container py-12">
        <header className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-balance sm:text-5xl">
            Un <span className="gradient-text">portfolio</span> d’idées
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            {projects.length} {projects.length > 1 ? "idées choisies" : "idée choisie"}, chacune datée du jour où elle est née.
          </p>
        </header>
        {projects.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">Ce portfolio est vide pour l’instant.</p>
        ) : (
          <div className="grid grid-flow-dense grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {projects.map((p, i) => (
              <ProjectCard
                key={p.id}
                project={p}
                index={i}
                variant={p.custom_template ? "wide" : "default"}
                href={`/partage/${token}/${p.id}`}
              />
            ))}
          </div>
        )}
      </div>
    </SharedFrame>
  );
}
