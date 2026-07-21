import { describe, expect, it } from "vitest";
import { projectFormSchema } from "@/lib/validations/project";

function makeInput(overrides: Record<string, unknown> = {}) {
  return {
    titre: "Mon projet",
    categorie: "Tech",
    description_courte: "Courte description",
    description_detaillee: "Description détaillée",
    statut: "en_cours",
    horizon_temps: "moyen_terme",
    tags: ["ia"],
    motivation: "Motivation",
    ressources: "https://example.com",
    est_public: true,
    image_url: null,
    ...overrides,
  };
}

describe("projectFormSchema", () => {
  it("accepts a fully populated project", () => {
    const result = projectFormSchema.safeParse(makeInput());
    expect(result.success).toBe(true);
  });

  it("rejects an empty title", () => {
    const result = projectFormSchema.safeParse(makeInput({ titre: "  " }));
    expect(result.success).toBe(false);
  });

  it("trims the title", () => {
    const result = projectFormSchema.parse(makeInput({ titre: "  Mon projet  " }));
    expect(result.titre).toBe("Mon projet");
  });

  it("rejects an invalid statut", () => {
    const result = projectFormSchema.safeParse(makeInput({ statut: "annule" }));
    expect(result.success).toBe(false);
  });

  it("rejects an invalid horizon_temps", () => {
    const result = projectFormSchema.safeParse(makeInput({ horizon_temps: "demain" }));
    expect(result.success).toBe(false);
  });

  it("defaults tags to an empty array when omitted", () => {
    const { tags, ...rest } = makeInput();
    const result = projectFormSchema.parse(rest);
    expect(result.tags).toEqual([]);
  });
});
