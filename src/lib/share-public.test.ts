import { describe, expect, it } from "vitest";
import { publicMilestones, toPublicProject } from "./share-public";
import type { JournalEntry, Project } from "@/types/project";

const project = {
  id: "p1",
  image_url: "/api/images/p1?v=abc",
  workspace_data: { initiatives: [] },
  est_espace_travail: true,
  prochaine_etape: "Appeler la banque",
  prochaine_etape_date: "2026-12-01",
  a_la_une: true,
  motivation: "Pourquoi",
} as unknown as Project;

describe("toPublicProject", () => {
  it("drops the private side and routes the image through the share", () => {
    const p = toPublicProject(project, "TOKEN123");
    expect(p.image_url).toBe("/partage/TOKEN123/image/p1?v=abc");
    expect(p.workspace_data).toBeNull();
    expect(p.est_espace_travail).toBe(false);
    expect(p.prochaine_etape).toBe("");
    expect(p.prochaine_etape_date).toBeNull();
    expect(p.motivation).toBe("Pourquoi");
  });
});

describe("publicMilestones", () => {
  it("shares milestones only, never notes, promises or status changes", () => {
    const e = (type: JournalEntry["type"]) => ({ id: type, type }) as JournalEntry;
    expect(publicMilestones([e("note"), e("jalon"), e("promesse"), e("statut")]).map((x) => x.type)).toEqual(["jalon"]);
  });
});
