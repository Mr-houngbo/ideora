import { verifySession } from "@/lib/dal";
import { getAllProjects, getShares } from "@/lib/projects";
import PortfolioManager from "@/components/share/PortfolioManager";

export default async function PortfolioPage() {
  await verifySession();
  const [projects, shares] = await Promise.all([getAllProjects(), getShares(null)]);
  return <PortfolioManager projects={projects} shares={shares} />;
}
