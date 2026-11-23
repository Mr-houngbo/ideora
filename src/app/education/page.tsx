import { verifySession } from "@/lib/dal";
import { getAllProjects, getDuePromises } from "@/lib/projects";
import { featuredIdFor } from "@/lib/home";
import ProjectsHome from "@/components/home/ProjectsHome";

export default async function EducationPage() {
  await verifySession();
  const [projects, duePromises] = await Promise.all([getAllProjects(), getDuePromises()]);

  return <ProjectsHome projects={projects} kind="education" featuredId={featuredIdFor(projects, true)} duePromises={duePromises} />;
}
