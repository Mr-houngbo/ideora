import { verifySession } from "@/lib/dal";
import { getAllProjects } from "@/lib/projects";
import AcademicProjectsView from "@/components/pages/AcademicProjectsView";

export default async function EducationPage() {
  await verifySession();
  const projects = await getAllProjects();

  return <AcademicProjectsView projects={projects} />;
}
