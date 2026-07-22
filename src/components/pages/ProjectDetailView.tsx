"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Calendar, Edit2, Trash2, Target, Lightbulb, Link as LinkIcon, LayoutDashboard, BookText } from "lucide-react";
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

interface ProjectDetailViewProps {
  project: Project;
}

const ProjectDetailView = ({ project }: ProjectDetailViewProps) => {
  const router = useRouter();

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

  return (
    <Layout>
      <div className="min-h-screen">
        <div className="relative h-64 md:h-80 lg:h-96 bg-gradient-to-br from-primary/10 to-accent/10">
          {project.image_url ? (
            <img src={project.image_url} alt={project.titre} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
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

        <div className="container max-w-4xl py-8 -mt-16 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="p-8 mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge className={STATUS_COLORS[project.statut]}>{STATUS_LABELS[project.statut]}</Badge>
                <Badge variant="secondary" className={HORIZON_COLORS[project.horizon_temps]}>
                  {HORIZON_LABELS[project.horizon_temps]}
                </Badge>
                <span className="text-sm font-medium text-primary uppercase tracking-wider">{project.categorie}</span>
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
              <Card className="p-8 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <BookText className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">Contenu détaillé</h2>
                </div>
                <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-primary">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.contenu_riche}</ReactMarkdown>
                </div>
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
