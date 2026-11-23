import type { Metadata } from "next";
import { loadSharedProject } from "@/lib/share";
import SharedProjectView from "@/components/share/SharedProjectView";
import ShareUnavailable from "@/components/share/ShareUnavailable";

export const metadata: Metadata = {
  title: "Ideora · lecture seule",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

/** A project of a shared portfolio. Only projects the link covers open. */
export default async function SharedPortfolioProjectPage({
  params,
}: {
  params: Promise<{ token: string; projectId: string }>;
}) {
  const { token, projectId } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(projectId)) return <ShareUnavailable />;
  const shared = await loadSharedProject(token, projectId, false);
  if (!shared) return <ShareUnavailable />;
  return (
    <SharedProjectView
      project={shared.project}
      milestones={shared.milestones}
      backHref={shared.share.project_id ? undefined : `/partage/${token}`}
    />
  );
}
