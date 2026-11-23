import { verifySession } from "@/lib/dal";
import { getAllProjects } from "@/lib/projects";
import { featuredIdFor } from "@/lib/home";
import ProjectsHome from "@/components/home/ProjectsHome";

export default async function HomePage() {
  await verifySession();
  const projects = await getAllProjects();

  return <ProjectsHome projects={projects} kind="entreprise" featuredId={featuredIdFor(projects, false)} />;
}
