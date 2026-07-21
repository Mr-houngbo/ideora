import { describe, expect, it } from "vitest";
import { toProject } from "@/lib/project-mapper";
import type { ProjectRow } from "@/db/schema";

function makeRow(overrides: Partial<ProjectRow> = {}): ProjectRow {
  return {
    id: "11111111-1111-1111-1111-111111111111",
    titre: "Mon projet",
    categorie: "Tech",
    descriptionCourte: "Une courte description",
    descriptionDetaillee: "Une description détaillée",
    statut: "en_cours",
    horizonTemps: "moyen_terme",
    tags: ["ia", "web"],
    motivation: "Parce que",
    ressources: "https://example.com",
    dateCreation: new Date("2025-06-15T10:00:00.000Z"),
    estPublic: true,
    imageData: "base64abc",
    imageMimeType: "image/jpeg",
    ...overrides,
  };
}

describe("toProject", () => {
  it("maps a full drizzle row to the french Project shape", () => {
    const project = toProject(makeRow());

    expect(project).toEqual({
      id: "11111111-1111-1111-1111-111111111111",
      titre: "Mon projet",
      categorie: "Tech",
      description_courte: "Une courte description",
      description_detaillee: "Une description détaillée",
      statut: "en_cours",
      horizon_temps: "moyen_terme",
      tags: ["ia", "web"],
      motivation: "Parce que",
      ressources: "https://example.com",
      date_creation: "2025-06-15T10:00:00.000Z",
      est_public: true,
      image_url: "data:image/jpeg;base64,base64abc",
    });
  });

  it("falls back to empty strings for nullable text columns", () => {
    const project = toProject(
      makeRow({
        categorie: null,
        descriptionCourte: null,
        descriptionDetaillee: null,
        motivation: null,
        ressources: null,
        imageData: null,
      })
    );

    expect(project.categorie).toBe("");
    expect(project.description_courte).toBe("");
    expect(project.description_detaillee).toBe("");
    expect(project.motivation).toBe("");
    expect(project.ressources).toBe("");
    expect(project.image_url).toBeNull();
  });

  it("defaults tags to an empty array when the column is empty", () => {
    const project = toProject(makeRow({ tags: [] }));

    expect(project.tags).toEqual([]);
  });
});
