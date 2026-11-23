import { notFound } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { getJournal, getProjectById } from "@/lib/projects";
import ProjectDetailView from "@/components/pages/ProjectDetailView";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await verifySession();
  const { id } = await params;
  const [project, journal] = await Promise.all([getProjectById(id), getJournal(id)]);

  if (!project) {
    notFound();
  }

  return <ProjectDetailView project={project} journal={journal} />;
}
