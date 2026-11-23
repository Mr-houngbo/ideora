import { createHash } from "node:crypto";
import type { JournalRow, ProjectRow } from "@/db/schema";
import type { JournalEntry, Project } from "@/types/project";

/** Short content fingerprint of the stored base64 image, used to bust the HTTP cache when it changes. */
export function imageVersionOf(imageData: string): string {
  return createHash("md5").update(imageData).digest("hex").slice(0, 10);
}

/**
 * Images are served by /api/images/[id] rather than inlined as data URIs, so
 * list pages no longer ship every project's full image in the HTML payload
 * and the browser can cache each image independently. The version query
 * string changes whenever the image does.
 */
export function buildImageUrl(id: string, imageVersion: string | null): string | null {
  return imageVersion ? `/api/images/${id}?v=${imageVersion}` : null;
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
    image_url: buildImageUrl(row.id, row.imageData ? imageVersionOf(row.imageData) : null),
    contenu_riche: row.contenuRiche ?? "",
    accent_theme: row.accentTheme ?? null,
    est_espace_travail: row.estEspaceTravail,
    workspace_data: row.workspaceData ?? null,
    custom_template: row.customTemplate ?? null,
    prochaine_etape: row.prochaineEtape ?? "",
    prochaine_etape_date: row.prochaineEtapeDate ?? null,
    a_la_une: row.aLaUne,
    mis_a_jour_le: row.misAJourLe.toISOString(),
  };
}

export function toJournalEntry(row: JournalRow): JournalEntry {
  return {
    id: row.id,
    project_id: row.projectId,
    type: row.type as JournalEntry["type"],
    titre: row.titre,
    contenu: row.contenu ?? "",
    date_prevue: row.datePrevue ?? null,
    fait_le: row.faitLe ? row.faitLe.toISOString() : null,
    ecrit_le: row.ecritLe.toISOString(),
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
  imageVersion: string | null; // computed in SQL so the image bytes never leave the database
  estEspaceTravail: boolean;
  accentTheme: string | null; // tiny; colours the generated cover of projects without an image
  customTemplate: string | null; // marks showcases (bento layout, "À la une")
  prochaineEtape: string | null;
  prochaineEtapeDate: string | null;
  aLaUne: boolean;
  misAJourLe: Date;
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
    image_url: buildImageUrl(row.id, row.imageVersion),
    contenu_riche: "",
    accent_theme: row.accentTheme ?? null,
    est_espace_travail: row.estEspaceTravail,
    workspace_data: null,
    custom_template: row.customTemplate ?? null,
    prochaine_etape: row.prochaineEtape ?? "",
    prochaine_etape_date: row.prochaineEtapeDate ?? null,
    a_la_une: row.aLaUne,
    mis_a_jour_le: row.misAJourLe.toISOString(),
  };
}
