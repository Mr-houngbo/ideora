import type { JournalEntry, Project } from "@/types/project";

/**
 * What a share link may show of a project: the idea itself, never the private
 * side (workspace, next step, notes, promises, home-page settings). Images go
 * through the share's own image route, since the app's route needs a login.
 */
export function toPublicProject(project: Project, token: string): Project {
  return {
    ...project,
    image_url: project.image_url ? project.image_url.replace(/^\/api\/images\//, `/partage/${token}/image/`) : null,
    workspace_data: null,
    est_espace_travail: false,
    prochaine_etape: "",
    prochaine_etape_date: null,
    a_la_une: false,
  };
}

/** Only milestones are shared from the journal. */
export function publicMilestones(entries: JournalEntry[]): JournalEntry[] {
  return entries.filter((e) => e.type === "jalon");
}

