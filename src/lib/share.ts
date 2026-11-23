import "server-only";
import { getProjectById, getProjectImage, getValidShare, getJournal } from "@/lib/projects";
import type { Project, ShareLink } from "@/types/project";
import { publicMilestones, toPublicProject } from "@/lib/share-public";

/** Whether a valid share gives access to a given project. */
export async function shareCovers(share: ShareLink, projectId: string): Promise<Project | null> {
  if (share.project_id && share.project_id !== projectId) return null;
  const project = await getProjectById(projectId);
  if (!project) return null;
  if (!share.project_id && !project.dans_portfolio) return null;
  return project;
}

export async function loadSharedProject(token: string, projectId: string, countView: boolean) {
  const share = await getValidShare(token, countView);
  if (!share) return null;
  const project = await shareCovers(share, projectId);
  if (!project) return null;
  const milestones = publicMilestones(await getJournal(project.id));
  return { share, project: toPublicProject(project, token), milestones };
}

export { getProjectImage, getValidShare, publicMilestones, toPublicProject };
