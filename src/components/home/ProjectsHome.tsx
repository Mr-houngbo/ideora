"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Briefcase, CalendarHeart, FolderOpen, GraduationCap, Lightbulb, TrendingUp } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectFilters from "@/components/projects/ProjectFilters";
import FloatingAddButton from "@/components/projects/FloatingAddButton";
import FeaturedProject from "@/components/home/FeaturedProject";
import IdeaThread from "@/components/home/IdeaThread";
import { useProjectStore } from "@/store/projectStore";
import { effectiveCategory, filterProjects } from "@/lib/filter-projects";
import { ideaThread, sortProjects } from "@/lib/home";
import { CATEGORIES_EDUCATION, CATEGORIES_ENTREPRISE, isEducationCategory, type Project } from "@/types/project";
import { cn } from "@/lib/utils";

export type HomeKind = "entreprise" | "education";

const COPY: Record<HomeKind, { badge: string; before: string; highlight: string; after: string; lead: string }> = {
  entreprise: {
    badge: "Idées Business",
    before: "Vos",
    highlight: "ambitions",
    after: "entrepreneuriales",
    lead: "Chaque idée datée, du jour où elle est née. Une promesse du moi présent au moi futur.",
  },
  education: {
    badge: "Parcours Académique",
    before: "Vos",
    highlight: "objectifs",
    after: "académiques",
    lead: "Les savoirs à conquérir, datés du jour où l’envie est née. Une promesse du moi présent au moi futur.",
  },
};

interface ProjectsHomeProps {
  projects: Project[];
  kind: HomeKind;
  /** Picked on the server so the server and browser renders agree. */
  featuredId: string | null;
}

/** The Entreprise and Académique home pages: manifesto, "À la une", line of thought, then every idea. */
export default function ProjectsHome({ projects, kind, featuredId }: ProjectsHomeProps) {
  const { filters, sort } = useProjectStore();
  const academic = kind === "education";
  const categories = academic ? CATEGORIES_EDUCATION : CATEGORIES_ENTREPRISE;
  const copy = COPY[kind];

  const own = useMemo(
    () => projects.filter((p) => isEducationCategory(p.categorie) === academic),
    [projects, academic],
  );
  const shown = useMemo(() => sortProjects(filterProjects(own, filters, categories), sort), [own, filters, categories, sort]);
  const thread = useMemo(() => ideaThread(own), [own]);
  const featured = own.find((p) => p.id === featuredId) ?? null;

  const filtering =
    filters.search !== "" ||
    filters.status !== "all" ||
    filters.horizon !== "all" ||
    effectiveCategory(filters.category, categories) !== "all";
  const enCours = own.filter((p) => p.statut === "en_cours").length;

  const stats = [
    { icon: Lightbulb, value: String(own.length), label: own.length > 1 ? "Idées consignées" : "Idée consignée" },
    { icon: TrendingUp, value: String(enCours), label: "En cours" },
    ...(thread.length > 0 ? [{ icon: CalendarHeart, value: thread[0]!.label, label: "Première idée" }] : []),
  ];

  return (
    <Layout>
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {academic ? (
          <>
            <div className="orb orb-3" style={{ top: "-10%", left: "20%" }} />
            <div
              className="orb"
              style={{
                width: "20rem",
                height: "20rem",
                bottom: "10%",
                right: "-5%",
                background: "hsl(var(--academic) / 0.3)",
                filter: "blur(60px)",
                animation: "float 10s ease-in-out infinite",
                animationDelay: "-3s",
              }}
            />
          </>
        ) : (
          <>
            <div className="orb orb-1" />
            <div className="orb orb-2" />
          </>
        )}
      </div>

      <div className="container relative z-10 py-8">
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="hero-premium mb-10 py-6 text-center"
        >
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
            style={{ background: academic ? "var(--gradient-academic)" : "var(--gradient-primary)" }}
          >
            {academic ? (
              <GraduationCap className="h-4 w-4 text-academic-foreground" />
            ) : (
              <Briefcase className="h-4 w-4 text-primary-foreground" />
            )}
            <span className={academic ? "text-academic-foreground" : "text-primary-foreground"}>{copy.badge}</span>
          </div>

          <h1 className="mb-5 break-words text-4xl font-bold text-balance hyphens-auto sm:text-5xl md:text-6xl lg:text-7xl">
            {copy.before} <span className={academic ? "gradient-text-academic" : "gradient-text"}>{copy.highlight}</span>
            <br />
            {copy.after}
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground text-balance md:text-xl">{copy.lead}</p>

          <dl className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.08 }}
                className="flex items-center gap-3 rounded-2xl border border-border/50 bg-card/80 px-4 py-2.5 text-left shadow-sm backdrop-blur-sm"
              >
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-xl",
                    academic ? "bg-academic/10 text-academic" : "bg-primary/10 text-primary",
                  )}
                >
                  <s.icon className="h-4 w-4" />
                </span>
                <div className="flex flex-col-reverse">
                  <dt className="text-xs text-muted-foreground">{s.label}</dt>
                  <dd className="text-xl font-bold capitalize leading-tight">{s.value}</dd>
                </div>
              </motion.div>
            ))}
          </dl>
        </motion.header>

        {!filtering && (featured || thread.length > 1) && (
          <div className="mb-14 space-y-6">
            {featured && <FeaturedProject project={featured} />}
            <IdeaThread months={thread} academic={academic} />
          </div>
        )}

        <section aria-labelledby="all-title">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 id="all-title" className="text-2xl font-bold sm:text-3xl">
              Toutes les idées
            </h2>
          </div>
          <div className="mb-8">
            <ProjectFilters filterType={kind} resultCount={shown.length} />
          </div>

          {shown.length > 0 ? (
            <div className="grid grid-flow-dense grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {shown.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  variant={project.custom_template ? "wide" : "default"}
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-24"
            >
              <div
                className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl"
                style={{ background: academic ? "var(--gradient-academic)" : "var(--gradient-primary)" }}
              >
                <FolderOpen className="h-12 w-12 text-primary-foreground" />
              </div>
              <h3 className="mb-3 text-2xl font-bold">{academic ? "Aucun objectif académique" : "Aucun projet trouvé"}</h3>
              <p className="max-w-md text-center text-muted-foreground">
                {own.length === 0
                  ? academic
                    ? "Commencez par planifier votre premier objectif académique !"
                    : "Lancez-vous ! Créez votre première idée d'entreprise."
                  : "Aucun projet ne correspond à vos filtres actuels."}
              </p>
            </motion.div>
          )}
        </section>
      </div>

      <FloatingAddButton />
    </Layout>
  );
}
