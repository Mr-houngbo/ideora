"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout/Layout";
import ProjectForm from "@/components/projects/ProjectForm";
import { toast } from "sonner";
import { ProjectFormData, isEducationCategory } from "@/types/project";
import { createProject } from "@/actions/projects";

interface AddProjectViewProps {
  defaultCategory?: string;
}

const AddProjectView = ({ defaultCategory }: AddProjectViewProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: ProjectFormData, imageFile?: File) => {
    setIsLoading(true);

    try {
      await createProject(data, imageFile);

      toast.success("Projet créé!", {
        description: "Votre projet a été ajouté avec succès.",
      });

      router.push(isEducationCategory(data.categorie) ? "/education" : "/");
    } catch (error) {
      toast.error("Erreur", {
        description: "Impossible de créer le projet.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-3xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Nouveau projet</h1>
          <p className="text-muted-foreground">Décrivez votre nouvelle ambition avec tous les détails.</p>
        </div>

        <ProjectForm onSubmit={handleSubmit} isLoading={isLoading} defaultCategory={defaultCategory} />
      </div>
    </Layout>
  );
};

export default AddProjectView;
