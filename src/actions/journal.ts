"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { verifySession } from "@/lib/dal";
import { db } from "@/db";
import { journal, projects } from "@/db/schema";
import { toJournalEntry } from "@/lib/project-mapper";
import { isDayString } from "@/lib/idea-dates";
import type { JournalEntry } from "@/types/project";

const entrySchema = z
  .object({
    type: z.enum(["note", "jalon", "promesse"]),
    titre: z.string().trim().min(1, "Un titre est requis").max(200),
    contenu: z.string().trim().max(20_000).default(""),
    date_prevue: z.string().refine(isDayString, "Date invalide").nullable().default(null),
  })
  .refine((e) => e.type !== "promesse" || e.date_prevue, {
    message: "Choisis le jour où relire cette promesse",
    path: ["date_prevue"],
  });

export type JournalInput = z.input<typeof entrySchema>;

function touch(projectId: string) {
  revalidatePath(`/projet/${projectId}`);
  revalidatePath("/");
  revalidatePath("/education");
}

export async function addJournalEntry(projectId: string, input: JournalInput): Promise<JournalEntry> {
  await verifySession();
  const data = entrySchema.parse(input);
  const [row] = await db
    .insert(journal)
    .values({
      projectId,
      type: data.type,
      titre: data.titre,
      contenu: data.contenu || null,
      datePrevue: data.type === "note" ? null : data.date_prevue,
    })
    .returning();
  await db.update(projects).set({ misAJourLe: new Date() }).where(eq(projects.id, projectId));
  touch(projectId);
  return toJournalEntry(row);
}

/** Marks a milestone reached / a promise read again, or undoes it. */
export async function setJournalEntryDone(id: string, done: boolean): Promise<JournalEntry | null> {
  await verifySession();
  const [row] = await db
    .update(journal)
    .set({ faitLe: done ? new Date() : null })
    .where(eq(journal.id, id))
    .returning();
  if (row) touch(row.projectId);
  return row ? toJournalEntry(row) : null;
}

export async function deleteJournalEntry(id: string): Promise<void> {
  await verifySession();
  const [row] = await db.delete(journal).where(eq(journal.id, id)).returning({ projectId: journal.projectId });
  if (row) touch(row.projectId);
}
