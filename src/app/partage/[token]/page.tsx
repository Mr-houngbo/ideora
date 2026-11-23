import type { Metadata } from "next";
import { getPortfolioProjects } from "@/lib/projects";
import { getValidShare, loadSharedProject, toPublicProject } from "@/lib/share";
import SharedProjectView from "@/components/share/SharedProjectView";
import SharedPortfolioView from "@/components/share/SharedPortfolioView";
import ShareUnavailable from "@/components/share/ShareUnavailable";

export const metadata: Metadata = {
  title: "Ideora · lecture seule",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

/** Public, read-only: the token is the only key. A valid token opens a project or the portfolio. */
export default async function SharePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const share = await getValidShare(token, true);
  if (!share) return <ShareUnavailable />;

  if (share.project_id) {
    const shared = await loadSharedProject(token, share.project_id, false);
    if (!shared) return <ShareUnavailable />;
    return <SharedProjectView project={shared.project} milestones={shared.milestones} />;
  }

  const projects = (await getPortfolioProjects()).map((p) => toPublicProject(p, token));
  return <SharedPortfolioView projects={projects} token={token} />;
}
