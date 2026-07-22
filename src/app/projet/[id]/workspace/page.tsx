import { notFound } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { getProjectById } from "@/lib/projects";
import MonPaysPlusWorkspace from "@/components/workspace/MonPaysPlusWorkspace";
import { emptyWorkspaceStore } from "@/types/workspace";

export default async function ProjectWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  await verifySession();
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project || !project.est_espace_travail) {
    notFound();
  }

  return <MonPaysPlusWorkspace projectId={project.id} initialStore={project.workspace_data ?? emptyWorkspaceStore} />;
}
