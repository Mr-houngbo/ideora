"use server";

import { and, eq, inArray, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { verifySession } from "@/lib/dal";
import { db } from "@/db";
import { journal, projects } from "@/db/schema";
import { toProject } from "@/lib/projects";
import { projectFormSchema, type ProjectFormValues } from "@/lib/validations/project";
import { dayToTimestamp, toDayString } from "@/lib/idea-dates";
import { STATUS_LABELS, isEducationCategory, type Project } from "@/types/project";

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
    accentTheme: data.accent_theme,
    estEspaceTravail: data.est_espace_travail,
    prochaineEtape: data.prochaine_etape || null,
    prochaineEtapeDate: data.prochaine_etape ? data.prochaine_etape_date : null,
    aLaUne: data.a_la_une,
    dansPortfolio: data.dans_portfolio,
    misAJourLe: new Date(),
  };
}

/** Only one project is "À la une" at a time, per home page. */
async function clearOtherFeatured(id: string, categorie: string) {
  const academic = isEducationCategory(categorie);
  const others = await db
    .select({ id: projects.id, categorie: projects.categorie })
    .from(projects)
    .where(and(eq(projects.aLaUne, true), ne(projects.id, id)));
  const sameHome = others.filter((o) => isEducationCategory(o.categorie ?? "") === academic).map((o) => o.id);
  if (sameHome.length > 0) await db.update(projects).set({ aLaUne: false }).where(inArray(projects.id, sameHome));
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

  // Today keeps the real creation time; an earlier day records when the idea
  // actually came (e.g. back-filling an idea noted on paper).
  const dateColumns =
    data.date_idee && data.date_idee !== toDayString(new Date())
      ? { dateCreation: dayToTimestamp(data.date_idee) }
      : {};

  const [row] = await db
    .insert(projects)
    .values({ ...toRow(data), ...imageColumns, ...dateColumns })
    .returning();
  if (data.a_la_une) await clearOtherFeatured(row.id, data.categorie);

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

  const [current] = await db
    .select({ dateCreation: projects.dateCreation, statut: projects.statut })
    .from(projects)
    .where(eq(projects.id, id))
    .limit(1);
  const dateColumns =
    data.date_idee && current ? { dateCreation: dayToTimestamp(data.date_idee, current.dateCreation) } : {};

  const [row] = await db
    .update(projects)
    .set({ ...toRow(data), ...imageColumns, ...dateColumns })
    .where(eq(projects.id, id))
    .returning();
  if (data.a_la_une) await clearOtherFeatured(id, data.categorie);

  // A status change is a dated step in the idea's life: keep it in the journal.
  if (current && current.statut !== data.statut) {
    const from = STATUS_LABELS[current.statut as Project["statut"]] ?? current.statut;
    await db.insert(journal).values({ projectId: id, type: "statut", titre: `${from} → ${STATUS_LABELS[data.statut]}` });
  }

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

const quickSchema = z.object({
  titre: z.string().trim().min(1, "Le titre est requis").max(200),
  phrase: z.string().trim().max(500).default(""),
  academic: z.boolean().default(false),
});

/**
 * "Capture rapide": an idea noted in seconds, dated now. Everything else can
 * be filled in later from the project page.
 */
export async function captureIdea(input: z.input<typeof quickSchema>): Promise<{ id: string }> {
  await verifySession();
  const data = quickSchema.parse(input);
  const [row] = await db
    .insert(projects)
    .values({
      titre: data.titre,
      descriptionCourte: data.phrase || null,
      categorie: data.academic ? "Formation" : "Autre",
      statut: "idee",
      horizonTemps: "moyen_terme",
    })
    .returning({ id: projects.id });

  revalidatePath("/");
  revalidatePath("/education");
  return { id: row.id };
}
