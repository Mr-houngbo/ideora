import "server-only";
import { and, asc, desc, eq, isNull, lte, sql } from "drizzle-orm";
import { db } from "@/db";
import { journal, projects } from "@/db/schema";
import { toJournalEntry, toProject, toProjectSummary } from "@/lib/project-mapper";
import { toDayString } from "@/lib/idea-dates";
import type { JournalEntry, Project } from "@/types/project";

export { toProject };

export async function getAllProjects(): Promise<Project[]> {
  const rows = await db
    .select({
      id: projects.id,
      titre: projects.titre,
      categorie: projects.categorie,
      descriptionCourte: projects.descriptionCourte,
      statut: projects.statut,
      horizonTemps: projects.horizonTemps,
      tags: projects.tags,
      dateCreation: projects.dateCreation,
      // Only a fingerprint of the image, not the bytes: the cards load the
      // image itself from /api/images/[id], which the browser caches.
      imageVersion: sql<string | null>`left(md5(${projects.imageData}), 10)`,
      estEspaceTravail: projects.estEspaceTravail,
      accentTheme: projects.accentTheme,
      customTemplate: projects.customTemplate,
      prochaineEtape: projects.prochaineEtape,
      prochaineEtapeDate: projects.prochaineEtapeDate,
      aLaUne: projects.aLaUne,
      misAJourLe: projects.misAJourLe,
    })
    .from(projects)
    .orderBy(desc(projects.dateCreation));

  return rows.map(toProjectSummary);
}

export async function getProjectById(id: string): Promise<Project | null> {
  const [row] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return row ? toProject(row) : null;
}

export async function getProjectImage(id: string) {
  const [row] = await db
    .select({ imageData: projects.imageData, imageMimeType: projects.imageMimeType })
    .from(projects)
    .where(eq(projects.id, id))
    .limit(1);
  return row?.imageData ? { data: row.imageData, mimeType: row.imageMimeType } : null;
}

/** A project's journal, newest first. */
export async function getJournal(projectId: string): Promise<JournalEntry[]> {
  const rows = await db
    .select()
    .from(journal)
    .where(eq(journal.projectId, projectId))
    .orderBy(desc(journal.ecritLe));
  return rows.map(toJournalEntry);
}

/** Promises to the future self whose day has come and that were not read again yet. */
export async function getDuePromises(): Promise<(JournalEntry & { projet_titre: string })[]> {
  const rows = await db
    .select({ entry: journal, projetTitre: projects.titre })
    .from(journal)
    .innerJoin(projects, eq(journal.projectId, projects.id))
    .where(
      and(eq(journal.type, "promesse"), isNull(journal.faitLe), lte(journal.datePrevue, toDayString(new Date()))),
    )
    .orderBy(asc(journal.datePrevue));
  return rows.map((r) => ({ ...toJournalEntry(r.entry), projet_titre: r.projetTitre }));
}
