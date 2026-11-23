"use client";

import { Project, STATUS_LABELS, STATUS_COLORS, HORIZON_LABELS, HORIZON_COLORS, isEducationCategory } from "@/types/project";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Briefcase, GraduationCap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import ProjectCover from "@/components/projects/ProjectCover";
import { formatIdeaDate } from "@/lib/idea-dates";
import NextStep from "@/components/projects/NextStep";

interface ProjectCardProps {
  project: Project;
  index?: number;
  /** "wide" spans two grid columns, cover beside the text (bento layout). */
  variant?: "default" | "wide";
  /** Where the card leads; the project page by default. */
  href?: string;
}

const ProjectCard = ({ project, index = 0, variant = "default", href }: ProjectCardProps) => {
  const wide = variant === "wide";
  const isAcademic = isEducationCategory(project.categorie);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index, 8) * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className={cn("h-full", wide && "md:col-span-2")}
    >
      <Link href={href ?? `/projet/${project.id}`} className="block h-full">
        <Card
          hover
          className={cn(
            "group overflow-hidden h-full flex flex-col card-premium relative",
            wide && "md:flex-row",
            "before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-500",
            isAcademic
              ? "before:bg-gradient-to-br before:from-academic/5 before:to-transparent hover:before:opacity-100"
              : "before:bg-gradient-to-br before:from-primary/5 before:to-transparent hover:before:opacity-100"
          )}
        >
          <div className={cn("relative h-52 overflow-hidden", wide && "md:h-auto md:w-[55%] md:shrink-0")}>
            <ProjectCover
              project={project}
              watermark
              className="h-full w-full"
              imgClassName="transition-all duration-700 group-hover:scale-110"
            />
            {project.image_url && (
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60",
                  wide && "md:bg-gradient-to-l",
                )}
              />
            )}

            <div className="absolute top-4 left-4">
              <Badge className={cn(STATUS_COLORS[project.statut], "bg-white/95 shadow-md backdrop-blur-sm")}>
                {STATUS_LABELS[project.statut]}
              </Badge>
            </div>

            <div className="absolute top-4 right-4">
              <div
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center shadow-md backdrop-blur-sm",
                  isAcademic ? "bg-academic/90" : "bg-primary/90"
                )}
              >
                {isAcademic ? (
                  <GraduationCap className="w-4 h-4 text-academic-foreground" />
                ) : (
                  <Briefcase className="w-4 h-4 text-primary-foreground" />
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col flex-1 p-6 relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <span
                className={cn(
                  "text-xs font-semibold uppercase tracking-wider",
                  isAcademic ? "text-academic" : "text-primary"
                )}
              >
                {project.categorie}
              </span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
              <Badge variant="secondary" className={cn(HORIZON_COLORS[project.horizon_temps], "text-xs")}>
                {HORIZON_LABELS[project.horizon_temps]}
              </Badge>
            </div>

            <h3
              className={cn(
                "font-bold text-lg mb-2 line-clamp-2 transition-colors duration-300",
                wide && "md:text-2xl",
                isAcademic ? "group-hover:text-academic" : "group-hover:text-primary"
              )}
            >
              {project.titre}
            </h3>

            <p className={cn("text-sm text-muted-foreground mb-4 flex-1", wide ? "line-clamp-4" : "line-clamp-2")}>
              {project.description_courte}
            </p>

            <NextStep step={project.prochaine_etape} day={project.prochaine_etape_date} compact className="mb-3" />

            {project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="tag-chip">
                    {tag}
                  </span>
                ))}
                {project.tags.length > 3 && (
                  <span className="tag-chip bg-muted">+{project.tags.length - 3}</span>
                )}
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                <time dateTime={project.date_creation} title="Date de l’idée">
                  {formatIdeaDate(project.date_creation, { short: true })}
                </time>
              </div>

              <motion.span
                className={cn(
                  "flex items-center gap-1.5 text-xs font-semibold",
                  isAcademic ? "text-academic" : "text-primary"
                )}
                initial={{ opacity: 0, x: -10 }}
                whileHover={{ x: 5 }}
              >
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Voir plus
                </span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
              </motion.span>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;
