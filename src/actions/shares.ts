"use server";

import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { verifySession } from "@/lib/dal";
import { db } from "@/db";
import { partages, projects } from "@/db/schema";
import { toShareLink } from "@/lib/project-mapper";
import type { ShareLink } from "@/types/project";

const shareSchema = z.object({
  projectId: z.uuid().nullable(),
  libelle: z.string().trim().max(120).default(""),
  /** Days before the link stops working; null for never. */
  expireDays: z.number().int().min(1).max(365).nullable().default(null),
});

function paths(projectId: string | null) {
  revalidatePath(projectId ? `/projet/${projectId}` : "/portfolio");
}

/** A new private link: a 32-character random token, impossible to guess. */
export async function createShare(input: z.input<typeof shareSchema>): Promise<ShareLink> {
  await verifySession();
  const data = shareSchema.parse(input);
  if (data.projectId) {
    const [exists] = await db.select({ id: projects.id }).from(projects).where(eq(projects.id, data.projectId)).limit(1);
    if (!exists) throw new Error("Projet introuvable");
  }
  const [row] = await db
    .insert(partages)
    .values({
      token: randomBytes(24).toString("base64url"),
      projectId: data.projectId,
      libelle: data.libelle || null,
      expireLe: data.expireDays ? new Date(Date.now() + data.expireDays * 86_400_000) : null,
    })
    .returning();
  paths(data.projectId);
  return toShareLink(row);
}

/** Cuts a link at once; it can't be reopened (create a new one instead). */
export async function revokeShare(id: string): Promise<ShareLink | null> {
  await verifySession();
  const [row] = await db.update(partages).set({ revoqueLe: new Date() }).where(eq(partages.id, id)).returning();
  if (row) paths(row.projectId);
  return row ? toShareLink(row) : null;
}

/** Adds or removes a project from the shared portfolio. */
export async function setInPortfolio(projectId: string, inPortfolio: boolean): Promise<void> {
  await verifySession();
  await db.update(projects).set({ dansPortfolio: inPortfolio }).where(eq(projects.id, projectId));
  revalidatePath("/portfolio");
  revalidatePath(`/projet/${projectId}`);
}
