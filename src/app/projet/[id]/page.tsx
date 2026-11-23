import { notFound } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { getJournal, getLinks, getProjectById, getProjectOptions, getShares } from "@/lib/projects";
import ProjectDetailView from "@/components/pages/ProjectDetailView";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await verifySession();
  const { id } = await params;
  if (!UUID_RE.test(id)) notFound();

  const [project, journal, links, options, shares] = await Promise.all([
    getProjectById(id),
    getJournal(id),
    getLinks(id),
    getProjectOptions(),
    getShares(id),
  ]);

  if (!project) {
    notFound();
  }

  return <ProjectDetailView project={project} journal={journal} links={links} linkOptions={options} shares={shares} />;
}
