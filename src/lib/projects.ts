import "server-only";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { toProject, toProjectSummary } from "@/lib/project-mapper";
import type { Project } from "@/types/project";

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
