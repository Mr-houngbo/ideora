import type { ProjectRow } from "@/db/schema";
import type { Project } from "@/types/project";

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
    est_public: row.estPublic,
    // Embedded as a data URI so the image travels with the page's own query
    // instead of triggering a separate database round-trip per <img> tag.
    image_url: row.imageData ? `data:${row.imageMimeType || "application/octet-stream"};base64,${row.imageData}` : null,
  };
}
