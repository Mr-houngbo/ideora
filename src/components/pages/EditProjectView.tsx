"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout/Layout";
import ProjectForm from "@/components/projects/ProjectForm";
import { toast } from "sonner";
import { ProjectFormData, Project } from "@/types/project";
import { updateProject } from "@/actions/projects";

interface EditProjectViewProps {
  project: Project;
}

const EditProjectView = ({ project }: EditProjectViewProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: ProjectFormData, imageFile?: File) => {
    setIsLoading(true);

    try {
      await updateProject(project.id, data, imageFile);

      toast.success("Projet mis à jour!", {
        description: "Les modifications ont été enregistrées.",
      });

      router.push(`/projet/${project.id}`);
    } catch (error) {
      toast.error("Erreur", {
        description: "Impossible de mettre à jour le projet.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-3xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Modifier le projet</h1>
          <p className="text-muted-foreground">Mettez à jour les informations de votre projet.</p>
        </div>

        <ProjectForm initialData={project} onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </Layout>
  );
};

export default EditProjectView;
