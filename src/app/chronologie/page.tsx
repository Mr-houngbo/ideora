import { verifySession } from "@/lib/dal";
import { getAllProjects } from "@/lib/projects";
import TimelineView from "@/components/timeline/TimelineView";

export default async function ChronologiePage() {
  await verifySession();
  const projects = await getAllProjects();
  return <TimelineView projects={projects} />;
}
