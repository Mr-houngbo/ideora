"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/dal";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { toProject } from "@/lib/projects";
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
    contenuRiche: data.contenu_riche || null,
    estEspaceTravail: data.est_espace_travail,
  };
}

async function fileToBase64(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  return buffer.toString("base64");
}

export async function createProject(formData: ProjectFormValues, imageFile?: File): Promise<Project> {
  await verifySession();
  const data = projectFormSchema.parse(formData);

  const imageColumns =
    imageFile && imageFile.size > 0
      ? { imageData: await fileToBase64(imageFile), imageMimeType: imageFile.type || "application/octet-stream" }
      : {};

  const [row] = await db
    .insert(projects)
    .values({ ...toRow(data), ...imageColumns })
    .returning();

  revalidatePath("/");
  revalidatePath("/education");

  return toProject(row);
}

export async function updateProject(id: string, formData: ProjectFormValues, imageFile?: File): Promise<Project> {
  await verifySession();
  const data = projectFormSchema.parse(formData);

  let imageColumns: { imageData?: string | null; imageMimeType?: string | null } = {};
  if (imageFile && imageFile.size > 0) {
    imageColumns = { imageData: await fileToBase64(imageFile), imageMimeType: imageFile.type || "application/octet-stream" };
  } else if (data.image_url === null) {
    // User explicitly removed the image in the form.
    imageColumns = { imageData: null, imageMimeType: null };
  }

  const [row] = await db
    .update(projects)
    .set({ ...toRow(data), ...imageColumns })
    .where(eq(projects.id, id))
    .returning();

  revalidatePath("/");
  revalidatePath("/education");
  revalidatePath(`/projet/${id}`);

  return toProject(row);
}

export async function deleteProject(id: string): Promise<void> {
  await verifySession();

  await db.delete(projects).where(eq(projects.id, id));

  revalidatePath("/");
  revalidatePath("/education");
}
