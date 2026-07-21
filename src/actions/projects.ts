"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/dal";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { toProject } from "@/lib/projects";
import { uploadImageToR2, deleteImageFromR2 } from "@/lib/r2";
import { projectFormSchema, type ProjectFormValues } from "@/lib/validations/project";
import type { Project } from "@/types/project";

function toRow(data: ProjectFormValues) {
  return {
    titre: data.titre,
    categorie: data.categorie,
    descriptionCourte: data.description_courte,
    descriptionDetaillee: data.description_detaillee,
    statut: data.statut,
    horizonTemps: data.horizon_temps,
    tags: data.tags,
    motivation: data.motivation,
    ressources: data.ressources,
    estPublic: data.est_public,
    imageUrl: data.image_url,
  };
}

export async function createProject(formData: ProjectFormValues, imageFile?: File): Promise<Project> {
  await verifySession();
  const data = projectFormSchema.parse(formData);

  if (imageFile && imageFile.size > 0) {
    data.image_url = await uploadImageToR2(imageFile);
  }

  const [row] = await db.insert(projects).values(toRow(data)).returning();

  revalidatePath("/");
  revalidatePath("/education");
  revalidatePath("/portfolio");

  return toProject(row);
}

export async function updateProject(
  id: string,
  formData: ProjectFormValues,
  imageFile?: File,
  previousImageUrl?: string | null
): Promise<Project> {
  await verifySession();
  const data = projectFormSchema.parse(formData);

  if (imageFile && imageFile.size > 0) {
    if (previousImageUrl) {
      await deleteImageFromR2(previousImageUrl);
    }
    data.image_url = await uploadImageToR2(imageFile);
  }

  const [row] = await db.update(projects).set(toRow(data)).where(eq(projects.id, id)).returning();

  revalidatePath("/");
  revalidatePath("/education");
  revalidatePath("/portfolio");
  revalidatePath(`/projet/${id}`);

  return toProject(row);
}

export async function toggleProjectVisibility(id: string, estPublic: boolean): Promise<Project> {
  await verifySession();
  const [row] = await db.update(projects).set({ estPublic }).where(eq(projects.id, id)).returning();

  revalidatePath("/portfolio");
  revalidatePath(`/projet/${id}`);

  return toProject(row);
}

export async function deleteProject(id: string, imageUrl?: string | null): Promise<void> {
  await verifySession();

  if (imageUrl) {
    await deleteImageFromR2(imageUrl);
  }

  await db.delete(projects).where(eq(projects.id, id));

  revalidatePath("/");
  revalidatePath("/education");
  revalidatePath("/portfolio");
}
