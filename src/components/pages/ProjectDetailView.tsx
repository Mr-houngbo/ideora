"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Edit2, Trash2, Target, Lightbulb, Link as LinkIcon, LayoutDashboard } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { deleteProject } from "@/actions/projects";
import { STATUS_LABELS, STATUS_COLORS, HORIZON_LABELS, HORIZON_COLORS, Project } from "@/types/project";
import { getAccentTheme } from "@/lib/accent-themes";
import RichMarkdown from "@/components/projects/RichMarkdown";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/Header";
import { SHOWCASE_TEMPLATES } from "@/components/showcase";

interface ProjectDetailViewProps {
  project: Project;
}

const ProjectDetailView = ({ project }: ProjectDetailViewProps) => {
  const router = useRouter();
  const isRich = Boolean(project.contenu_riche);
  const theme = getAccentTheme(project.accent_theme);
  const CustomShowcase = project.custom_template ? SHOWCASE_TEMPLATES[project.custom_template] : null;

  const handleDelete = async () => {
    try {
      await deleteProject(project.id);
      toast.success("Projet supprimé", {
        description: "Le projet a été supprimé définitivement.",
      });
      router.push("/");
    } catch (error) {
      toast.error("Erreur", {
        description: "Impossible de supprimer le projet.",
      });
    }
  };

  const managementControls = (
    <AlertDialog>
      <div className="fixed top-24 left-4 z-40">
        <Button variant="glass" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
      </div>
      <div className="fixed top-24 right-4 z-40 flex gap-2">
        <Link href={`/edit/${project.id}`}>
          <Button variant="glass" size="icon-sm">
            <Edit2 className="w-4 h-4" />
          </Button>
        </Link>
        <AlertDialogTrigger asChild>
          <Button variant="glass" size="icon-sm">
            <Trash2 className="w-4 h-4" />
          </Button>
        </AlertDialogTrigger>
      </div>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer ce projet?</AlertDialogTitle>
          <AlertDialogDescription>Cette action est irréversible. Le projet sera définitivement supprimé.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Supprimer</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  if (CustomShowcase) {
    return (
      <>
        <Header />
        {managementControls}
        <CustomShowcase />
      </>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen">
        <div
          className="relative h-64 md:h-80 lg:h-96"
          style={!project.image_url && isRich ? { background: `linear-gradient(135deg, ${theme.from}, ${theme.via}, ${theme.to})` } : undefined}
        >
          {project.image_url ? (
            <img src={project.image_url} alt={project.titre} className="w-full h-full object-cover" />
          ) : isRich ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-center px-6">
              <p className="text-xs uppercase tracking-[0.3em] text-white/70 mb-3">{project.categorie}</p>
              <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-sm">{project.titre}</h1>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <span className="text-5xl font-bold gradient-text">{project.titre.charAt(0).toUpperCase()}</span>
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

          <div className="absolute top-4 left-4">
            <Button variant="glass" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </div>

          <div className="absolute top-4 right-4 flex gap-2">
            <Link href={`/edit/${project.id}`}>
              <Button variant="glass" size="icon-sm">
                <Edit2 className="w-4 h-4" />
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="glass" size="icon-sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Supprimer ce projet?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. Le projet sera définitivement supprimé.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Supprimer</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className={cn("container py-8 -mt-16 relative z-10", isRich ? "max-w-5xl" : "max-w-4xl")}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="p-8 mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge className={STATUS_COLORS[project.statut]}>{STATUS_LABELS[project.statut]}</Badge>
                <Badge variant="secondary" className={HORIZON_COLORS[project.horizon_temps]}>
                  {HORIZON_LABELS[project.horizon_temps]}
                </Badge>
                <span
                  className="text-sm font-medium text-primary uppercase tracking-wider"
                  style={isRich ? { color: theme.solid } : undefined}
                >
                  {project.categorie}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4">{project.titre}</h1>

              <p className="text-lg text-muted-foreground mb-6">{project.description_courte}</p>

              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag) => (
                    <span key={tag} className="tag-chip">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between gap-4 flex-wrap pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Créé le{" "}
                    {new Date(project.date_creation).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {project.est_espace_travail && (
                  <Link href={`/projet/${project.id}/workspace`}>
                    <Button variant="gradient" size="sm">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Ouvrir l&apos;espace de travail
                    </Button>
                  </Link>
                )}
              </div>
            </Card>

            {project.description_detaillee && (
              <Card className="p-8 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">Description détaillée</h2>
                </div>
                <p className="text-muted-foreground whitespace-pre-line">{project.description_detaillee}</p>
              </Card>
            )}

            {project.contenu_riche && (
              <div className="mb-6 overflow-hidden rounded-3xl relative">
                <div
                  className="absolute inset-0"
                  style={{ background: `linear-gradient(135deg, ${theme.from}, ${theme.via}, ${theme.to})` }}
                />
                <div className="absolute inset-0 bg-black/10" />
                <div className="relative z-10 px-8 py-14 md:py-20 text-center">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/70 mb-4">{project.horizon_temps && HORIZON_LABELS[project.horizon_temps]}</p>
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{project.titre}</h2>
                  {project.description_courte && (
                    <p className="text-white/90 text-base md:text-lg max-w-2xl mx-auto italic">{project.description_courte}</p>
                  )}
                </div>
              </div>
            )}

            {project.contenu_riche && (
              <Card className="p-8 md:p-12 mb-6" style={{ borderTop: `3px solid ${theme.solid}` }}>
                <RichMarkdown content={project.contenu_riche} theme={theme} />
              </Card>
            )}

            {project.motivation && (
              <Card className="p-8 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-accent" />
                  </div>
                  <h2 className="text-xl font-semibold">Motivation</h2>
                </div>
                <p className="text-muted-foreground whitespace-pre-line">{project.motivation}</p>
              </Card>
            )}

            {project.ressources && (
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
                    <LinkIcon className="w-5 h-5 text-info" />
                  </div>
                  <h2 className="text-xl font-semibold">Ressources</h2>
                </div>
                <p className="text-muted-foreground whitespace-pre-line">{project.ressources}</p>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetailView;
