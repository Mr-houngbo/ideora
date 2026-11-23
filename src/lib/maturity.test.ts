import { describe, expect, it } from "vitest";
import { getMaturity } from "@/lib/maturity";
import type { Project } from "@/types/project";

const base: Project = {
  id: "1", titre: "T", categorie: "Tech", description_courte: "", description_detaillee: "",
  statut: "idee", horizon_temps: "long_terme", tags: [], motivation: "", ressources: "",
  date_creation: "2025-12-16T12:00:00Z", image_url: null, contenu_riche: "", accent_theme: null,
  est_espace_travail: false, workspace_data: null, custom_template: null,
};

describe("getMaturity", () => {
  it("rates a one-line idea as a sketch", () => {
    const m = getMaturity({ ...base, description_courte: "Reseaux complet" });
    expect(m.score).toBe(0);
    expect(m.level).toBe("Esquisse");
  });

  it("rates a fully documented idea", () => {
    const m = getMaturity({
      ...base,
      description_courte: "Une agence qui digitalise les PME béninoises",
      description_detaillee: "x".repeat(250),
      motivation: "Ce projet me tient à cœur car il répond à deux problèmes.",
      ressources: "Mentors",
      tags: ["a", "b", "c"],
      image_url: "/api/images/1?v=1",
    });
    expect(m.score).toBe(6);
    expect(m.level).toBe("Documentée");
  });
});
