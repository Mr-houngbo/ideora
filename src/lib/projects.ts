import "server-only";
import { and, asc, desc, eq, gt, isNull, lte, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { journal, liens, partages, projects } from "@/db/schema";
import { buildImageUrl, toJournalEntry, toProject, toProjectSummary, toShareLink } from "@/lib/project-mapper";
import { toDayString } from "@/lib/idea-dates";
import type { JournalEntry, LinkType, Project, ProjectLink, ShareLink } from "@/types/project";

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
      dansPortfolio: projects.dansPortfolio,
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

/** Every idea's id and title, for the "Lier une idée" picker. */
export async function getProjectOptions(): Promise<{ id: string; titre: string }[]> {
  return db.select({ id: projects.id, titre: projects.titre }).from(projects).orderBy(asc(projects.titre));
}

/** Links starting from or pointing to a project, with the idea at the other end. */
export async function getLinks(projectId: string): Promise<ProjectLink[]> {
  const other = {
    id: projects.id,
    titre: projects.titre,
    categorie: projects.categorie,
    statut: projects.statut,
    accentTheme: projects.accentTheme,
    imageVersion: sql<string | null>`left(md5(${projects.imageData}), 10)`,
  };
  const [outgoing, incoming] = await Promise.all([
    db
      .select({ lien: liens, other })
      .from(liens)
      .innerJoin(projects, eq(liens.cibleId, projects.id))
      .where(eq(liens.sourceId, projectId)),
    db
      .select({ lien: liens, other })
      .from(liens)
      .innerJoin(projects, eq(liens.sourceId, projects.id))
      .where(eq(liens.cibleId, projectId)),
  ]);
  const map = (direction: "out" | "in") => (r: (typeof outgoing)[number]): ProjectLink => ({
    id: r.lien.id,
    type: r.lien.type as LinkType,
    note: r.lien.note ?? "",
    direction,
    other: {
      id: r.other.id,
      titre: r.other.titre,
      categorie: r.other.categorie ?? "",
      statut: r.other.statut as Project["statut"],
      accent_theme: r.other.accentTheme ?? null,
      image_url: buildImageUrl(r.other.id, r.other.imageVersion),
    },
  });
  return [...outgoing.map(map("out")), ...incoming.map(map("in"))];
}

/** Share links of one project, or of the portfolio when projectId is null, newest first. */
export async function getShares(projectId: string | null): Promise<ShareLink[]> {
  const rows = await db
    .select()
    .from(partages)
    .where(projectId ? eq(partages.projectId, projectId) : isNull(partages.projectId))
    .orderBy(desc(partages.creeLe));
  return rows.map(toShareLink);
}

/**
 * Public side: the share behind a token, if it is still valid (not revoked,
 * not expired). Counts a view when asked to.
 */
export async function getValidShare(token: string, countView = false): Promise<ShareLink | null> {
  if (!/^[A-Za-z0-9_-]{20,64}$/.test(token)) return null;
  const valid = and(
    eq(partages.token, token),
    isNull(partages.revoqueLe),
    or(isNull(partages.expireLe), gt(partages.expireLe, new Date())),
  );
  const rows = countView
    ? await db.update(partages).set({ vues: sql`${partages.vues} + 1` }).where(valid).returning()
    : await db.select().from(partages).where(valid).limit(1);
  return rows[0] ? toShareLink(rows[0]) : null;
}

/** Projects picked for the portfolio, newest first. */
export async function getPortfolioProjects(): Promise<Project[]> {
  const all = await getAllProjects();
  return all.filter((p) => p.dans_portfolio);
}
