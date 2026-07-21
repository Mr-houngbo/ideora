import { verifySession } from "@/lib/dal";
import { getAllProjects } from "@/lib/projects";
import BusinessProjectsView from "@/components/pages/BusinessProjectsView";

export default async function HomePage() {
  await verifySession();
  const projects = await getAllProjects();

  return <BusinessProjectsView projects={projects} />;
}
