import { verifySession } from "@/lib/dal";
import { getPublicProjects } from "@/lib/projects";
import PortfolioView from "@/components/pages/PortfolioView";

export default async function PortfolioPage() {
  await verifySession();
  const projects = await getPublicProjects();

  return <PortfolioView projects={projects} />;
}
