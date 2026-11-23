"use server";

import { and, eq, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { verifySession } from "@/lib/dal";
import { db } from "@/db";
import { liens } from "@/db/schema";

const linkSchema = z
  .object({
    sourceId: z.uuid(),
    cibleId: z.uuid(),
    type: z.enum(["inspire", "variante", "prolonge", "lie"]),
    note: z.string().trim().max(300).default(""),
  })
  .refine((l) => l.sourceId !== l.cibleId, { message: "Une idée ne peut pas être liée à elle-même" });

export async function addLink(input: z.input<typeof linkSchema>): Promise<void> {
  await verifySession();
  const data = linkSchema.parse(input);
  // One link per pair of ideas, whichever way round it was made.
  const existing = await db
    .select({ id: liens.id })
    .from(liens)
    .where(
      or(
        and(eq(liens.sourceId, data.sourceId), eq(liens.cibleId, data.cibleId)),
        and(eq(liens.sourceId, data.cibleId), eq(liens.cibleId, data.sourceId)),
      ),
    )
    .limit(1);
  if (existing.length > 0) throw new Error("Ces deux idées sont déjà liées");
  await db.insert(liens).values({ ...data, note: data.note || null });
  revalidatePath(`/projet/${data.sourceId}`);
  revalidatePath(`/projet/${data.cibleId}`);
}

export async function deleteLink(id: string): Promise<void> {
  await verifySession();
  const [row] = await db.delete(liens).where(eq(liens.id, id)).returning();
  if (row) {
    revalidatePath(`/projet/${row.sourceId}`);
    revalidatePath(`/projet/${row.cibleId}`);
  }
}
