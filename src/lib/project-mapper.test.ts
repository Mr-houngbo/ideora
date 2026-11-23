import { describe, expect, it } from "vitest";
import { imageVersionOf, toProject, toProjectSummary } from "@/lib/project-mapper";
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
    imageData: "base64abc",
    imageMimeType: "image/jpeg",
    contenuRiche: null,
    accentTheme: null,
    estEspaceTravail: false,
    workspaceData: null,
    customTemplate: null,
    prochaineEtape: null,
    prochaineEtapeDate: null,
    aLaUne: false,
    misAJourLe: new Date("2025-06-16T10:00:00.000Z"),
    dansPortfolio: false,
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
      image_url: `/api/images/11111111-1111-1111-1111-111111111111?v=${imageVersionOf("base64abc")}`,
      contenu_riche: "",
      accent_theme: null,
      est_espace_travail: false,
      workspace_data: null,
      custom_template: null,
      prochaine_etape: "",
      prochaine_etape_date: null,
      a_la_une: false,
      mis_a_jour_le: "2025-06-16T10:00:00.000Z",
      dans_portfolio: false,
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

describe("toProjectSummary", () => {
  it("maps the lean list-view row, blanking out heavy fields not selected", () => {
    const project = toProjectSummary({
      id: "1",
      titre: "Projet léger",
      categorie: "Tech",
      descriptionCourte: "Résumé",
      statut: "en_cours",
      horizonTemps: "moyen_terme",
      tags: ["ia"],
      dateCreation: new Date("2025-06-15T10:00:00.000Z"),
      imageVersion: "abc123",
      estEspaceTravail: false,
      accentTheme: null,
      customTemplate: "houefa",
      prochaineEtape: "Appeler la mairie",
      prochaineEtapeDate: "2026-12-01",
      aLaUne: true,
      misAJourLe: new Date("2025-06-16T10:00:00.000Z"),
      dansPortfolio: true,
    });

    expect(project.image_url).toBe("/api/images/1?v=abc123");
    expect(project.contenu_riche).toBe("");
    expect(project.accent_theme).toBeNull();
    expect(project.workspace_data).toBeNull();
    expect(project.description_detaillee).toBe("");
    expect(project.motivation).toBe("");
    expect(project.ressources).toBe("");
    // Small fields the home page needs are kept.
    expect(project.custom_template).toBe("houefa");
    expect(project.prochaine_etape).toBe("Appeler la mairie");
    expect(project.prochaine_etape_date).toBe("2026-12-01");
    expect(project.a_la_une).toBe(true);
  });
});
