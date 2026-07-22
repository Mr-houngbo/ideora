"use server";

import { eq } from "drizzle-orm";
import { verifySession } from "@/lib/dal";
import { db } from "@/db";
import { projects } from "@/db/schema";
import type { WorkspaceStore } from "@/types/workspace";

export async function updateProjectWorkspace(projectId: string, data: WorkspaceStore): Promise<void> {
  await verifySession();

  await db.update(projects).set({ workspaceData: data }).where(eq(projects.id, projectId));
}
