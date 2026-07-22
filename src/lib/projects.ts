import "server-only";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { toProject } from "@/lib/project-mapper";
import type { Project } from "@/types/project";

export { toProject };

export async function getAllProjects(): Promise<Project[]> {
  const rows = await db.select().from(projects).orderBy(desc(projects.dateCreation));
  return rows.map(toProject);
}

export async function getProjectById(id: string): Promise<Project | null> {
  const [row] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return row ? toProject(row) : null;
}
