import { notFound } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { getProjectById } from "@/lib/projects";
import EditProjectView from "@/components/pages/EditProjectView";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  await verifySession();
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return <EditProjectView project={project} />;
}
