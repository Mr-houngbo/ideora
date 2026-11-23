"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import ProjectCover from "@/components/projects/ProjectCover";
import { STATUS_LABELS, isEducationCategory, type Project } from "@/types/project";
import { formatIdeaAge, formatIdeaDate } from "@/lib/idea-dates";
import { cn } from "@/lib/utils";

/** The large "À la une" card at the top of a home page. */
export default function FeaturedProject({ project }: { project: Project }) {
  const isAcademic = isEducationCategory(project.categorie);
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      aria-labelledby="featured-title"
    >
      <Link
        href={`/projet/${project.id}`}
        className="group relative block overflow-hidden rounded-3xl shadow-[var(--shadow-card)] ring-1 ring-border/50 transition-shadow duration-500 hover:shadow-[var(--shadow-card-hover)]"
      >
        <ProjectCover
          project={project}
          eager
          className="h-[22rem] w-full sm:h-[26rem]"
          imgClassName="transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/5" />

        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-bold uppercase tracking-wider text-neutral-900 shadow">
              <Sparkles className={cn("h-3.5 w-3.5", isAcademic ? "text-academic" : "text-primary")} />
              À la une
            </span>
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {project.categorie}
            </span>
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {project.custom_template ? "Vitrine" : STATUS_LABELS[project.statut]}
            </span>
          </div>
          <h2
            id="featured-title"
            className="max-w-3xl break-words text-3xl font-bold leading-tight text-white hyphens-auto sm:text-5xl"
          >
            {project.titre}
          </h2>
          {project.description_courte && (
            <p className="mt-3 line-clamp-2 max-w-2xl text-base text-white/80 sm:text-lg">{project.description_courte}</p>
          )}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <time dateTime={project.date_creation} className="text-sm text-white/70">
              Idée née le {formatIdeaDate(project.date_creation)} · {formatIdeaAge(project.date_creation)}
            </time>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 shadow-lg transition-transform duration-300 group-hover:translate-x-1">
              Découvrir
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.section>
  );
}
