import type { ProjectRow } from "@/db/schema";
import type { Project } from "@/types/project";

function buildImageUrl(imageData: string | null, imageMimeType: string | null): string | null {
  // Embedded as a data URI so the image travels with the page's own query
  // instead of triggering a separate database round-trip per <img> tag.
  return imageData ? `data:${imageMimeType || "application/octet-stream"};base64,${imageData}` : null;
}

export function toProject(row: ProjectRow): Project {
  return {
    id: row.id,
    titre: row.titre,
    categorie: row.categorie ?? "",
    description_courte: row.descriptionCourte ?? "",
    description_detaillee: row.descriptionDetaillee ?? "",
    statut: row.statut as Project["statut"],
    horizon_temps: row.horizonTemps as Project["horizon_temps"],
    tags: row.tags ?? [],
    motivation: row.motivation ?? "",
    ressources: row.ressources ?? "",
    date_creation: row.dateCreation.toISOString(),
    image_url: buildImageUrl(row.imageData, row.imageMimeType),
    contenu_riche: row.contenuRiche ?? "",
    accent_theme: row.accentTheme ?? null,
    est_espace_travail: row.estEspaceTravail,
    workspace_data: row.workspaceData ?? null,
    custom_template: row.customTemplate ?? null,
  };
}

export interface ProjectSummaryRow {
  id: string;
  titre: string;
  categorie: string | null;
  descriptionCourte: string | null;
  statut: string;
  horizonTemps: string;
  tags: string[];
  dateCreation: Date;
  imageData: string | null;
  imageMimeType: string | null;
  estEspaceTravail: boolean;
}

/**
 * Maps the lean column set used for list/grid views (ProjectCard). Omits
 * contenu_riche and workspace_data — they can be several KB to MB per row
 * and are never rendered outside the project detail page, so fetching them
 * for every card on every list load was pure wasted bandwidth.
 */
export function toProjectSummary(row: ProjectSummaryRow): Project {
  return {
    id: row.id,
    titre: row.titre,
    categorie: row.categorie ?? "",
    description_courte: row.descriptionCourte ?? "",
    description_detaillee: "",
    statut: row.statut as Project["statut"],
    horizon_temps: row.horizonTemps as Project["horizon_temps"],
    tags: row.tags ?? [],
    motivation: "",
    ressources: "",
    date_creation: row.dateCreation.toISOString(),
    image_url: buildImageUrl(row.imageData, row.imageMimeType),
    contenu_riche: "",
    accent_theme: null,
    est_espace_travail: row.estEspaceTravail,
    workspace_data: null,
    custom_template: null,
  };
}
