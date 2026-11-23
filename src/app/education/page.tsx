import { verifySession } from "@/lib/dal";
import { getAllProjects } from "@/lib/projects";
import { featuredIdFor } from "@/lib/home";
import ProjectsHome from "@/components/home/ProjectsHome";

export default async function EducationPage() {
  await verifySession();
  const projects = await getAllProjects();

  return <ProjectsHome projects={projects} kind="education" featuredId={featuredIdFor(projects, true)} />;
}
