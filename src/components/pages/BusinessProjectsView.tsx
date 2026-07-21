"use client";

import { motion } from "framer-motion";
import { Briefcase, FolderOpen, Sparkles, TrendingUp } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectFilters from "@/components/projects/ProjectFilters";
import FloatingAddButton from "@/components/projects/FloatingAddButton";
import { useProjectStore } from "@/store/projectStore";
import { filterProjects } from "@/lib/filter-projects";
import { isEducationCategory, type Project } from "@/types/project";

interface BusinessProjectsViewProps {
  projects: Project[];
}

const BusinessProjectsView = ({ projects }: BusinessProjectsViewProps) => {
  const { filters } = useProjectStore();

  const enterpriseProjects = projects.filter((p) => !isEducationCategory(p.categorie));
  const filteredProjects = filterProjects(enterpriseProjects, filters);

  const totalEntreprise = enterpriseProjects.length;
  const enCours = enterpriseProjects.filter((p) => p.statut === "en_cours").length;

  return (
    <Layout>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
      </div>

      <div className="container py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 hero-premium py-8"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold mb-8"
            style={{ background: "var(--gradient-primary)" }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Briefcase className="w-4 h-4 text-primary-foreground" />
            <span className="text-primary-foreground">Idées Business</span>
          </motion.div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance">
            Vos <span className="gradient-text">ambitions</span>
            <br />
            entrepreneuriales
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Donnez vie à vos idées business. Planifiez, organisez et concrétisez vos projets d&apos;entreprise.
          </p>

          <div className="flex items-center justify-center gap-8">
            <motion.div
              className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold">{totalEntreprise}</p>
                <p className="text-xs text-muted-foreground">Projets</p>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold">{enCours}</p>
                <p className="text-xs text-muted-foreground">En cours</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-10"
        >
          <ProjectFilters filterType="entreprise" />
        </motion.div>

        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24"
          >
            <motion.div
              className="w-24 h-24 rounded-3xl flex items-center justify-center mb-8"
              style={{ background: "var(--gradient-primary)" }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FolderOpen className="w-12 h-12 text-primary-foreground" />
            </motion.div>
            <h3 className="text-2xl font-bold mb-3">Aucun projet trouvé</h3>
            <p className="text-muted-foreground text-center max-w-md">
              {enterpriseProjects.length === 0
                ? "Lancez-vous ! Créez votre première idée d'entreprise."
                : "Aucun projet ne correspond à vos filtres actuels."}
            </p>
          </motion.div>
        )}
      </div>

      <FloatingAddButton />
    </Layout>
  );
};

export default BusinessProjectsView;
