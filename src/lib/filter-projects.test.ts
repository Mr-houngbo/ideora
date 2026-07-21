import { describe, expect, it } from "vitest";
import { filterProjects } from "@/lib/filter-projects";
import type { Project } from "@/types/project";

function makeProject(overrides: Partial<Project> = {}): Project {
  return {
    id: "1",
    titre: "Projet Alpha",
    categorie: "Tech",
    description_courte: "",
    description_detaillee: "",
    statut: "idee",
    horizon_temps: "moyen_terme",
    tags: [],
    motivation: "",
    ressources: "",
    date_creation: "2025-01-01T00:00:00.000Z",
    est_public: false,
    image_url: null,
    ...overrides,
  };
}

const baseFilters = { search: "", status: "all" as const, category: "all" as const, horizon: "all" as const };

describe("filterProjects", () => {
  it("returns everything when no filter is active", () => {
    const projects = [makeProject({ id: "1" }), makeProject({ id: "2" })];
    expect(filterProjects(projects, baseFilters)).toHaveLength(2);
  });

  it("filters by search on titre (case-insensitive)", () => {
    const projects = [makeProject({ titre: "Ideora" }), makeProject({ titre: "Autre chose" })];
    const result = filterProjects(projects, { ...baseFilters, search: "ideo" });
    expect(result).toHaveLength(1);
    expect(result[0].titre).toBe("Ideora");
  });

  it("filters by search on tags", () => {
    const projects = [makeProject({ tags: ["intelligence-artificielle"] }), makeProject({ tags: ["web"] })];
    const result = filterProjects(projects, { ...baseFilters, search: "intelligence" });
    expect(result).toHaveLength(1);
  });

  it("filters by status", () => {
    const projects = [makeProject({ statut: "en_cours" }), makeProject({ statut: "termine" })];
    const result = filterProjects(projects, { ...baseFilters, status: "en_cours" });
    expect(result).toHaveLength(1);
    expect(result[0].statut).toBe("en_cours");
  });

  it("filters by category", () => {
    const projects = [makeProject({ categorie: "Tech" }), makeProject({ categorie: "Business" })];
    const result = filterProjects(projects, { ...baseFilters, category: "Business" });
    expect(result).toHaveLength(1);
    expect(result[0].categorie).toBe("Business");
  });

  it("filters by horizon", () => {
    const projects = [makeProject({ horizon_temps: "court_terme" }), makeProject({ horizon_temps: "long_terme" })];
    const result = filterProjects(projects, { ...baseFilters, horizon: "long_terme" });
    expect(result).toHaveLength(1);
    expect(result[0].horizon_temps).toBe("long_terme");
  });

  it("combines multiple filters", () => {
    const projects = [
      makeProject({ titre: "Match", statut: "en_cours", categorie: "Tech" }),
      makeProject({ titre: "Match", statut: "termine", categorie: "Tech" }),
    ];
    const result = filterProjects(projects, { ...baseFilters, search: "match", status: "en_cours" });
    expect(result).toHaveLength(1);
    expect(result[0].statut).toBe("en_cours");
  });
});
