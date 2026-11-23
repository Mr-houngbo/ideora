import { describe, expect, it } from "vitest";
import { ideaThread, pickFeatured, sortProjects } from "./home";

const p = (id: string, titre: string, date: string, extra: Record<string, unknown> = {}) => ({
  id,
  titre,
  date_creation: date,
  statut: "idee" as const,
  custom_template: null as string | null,
  a_la_une: false,
  image_url: null as string | null,
  ...extra,
});

describe("sortProjects", () => {
  const list = [p("a", "Zèbre", "2025-12-01T12:00:00Z"), p("b", "avion", "2026-03-01T12:00:00Z")];
  it("sorts by date both ways and by title", () => {
    expect(sortProjects(list, "recent").map((x) => x.id)).toEqual(["b", "a"]);
    expect(sortProjects(list, "oldest").map((x) => x.id)).toEqual(["a", "b"]);
    expect(sortProjects(list, "title").map((x) => x.id)).toEqual(["b", "a"]);
  });
});

describe("pickFeatured", () => {
  it("prefers showcases and is stable within a day", () => {
    const list = [p("a", "A", "2025-12-01"), p("b", "B", "2025-12-02", { custom_template: "x" }), p("c", "C", "2025-12-03", { custom_template: "y" })];
    const day = new Date("2026-11-23T08:00:00Z");
    const first = pickFeatured(list, day);
    expect(["b", "c"]).toContain(first?.id);
    expect(pickFeatured(list, new Date("2026-11-23T20:00:00Z"))?.id).toBe(first?.id);
  });
  it("puts the hand-picked project first", () => {
    const list = [p("b", "B", "2025-12-02", { custom_template: "x" }), p("a", "A", "2025-12-01", { a_la_une: true })];
    expect(pickFeatured(list)?.id).toBe("a");
  });
  it("falls back to the latest idea", () => {
    expect(pickFeatured([p("a", "A", "2025-12-01"), p("b", "B", "2026-01-01")])?.id).toBe("b");
    expect(pickFeatured([])).toBeNull();
  });
});

describe("ideaThread", () => {
  it("lists every month from the first idea to now, including empty ones", () => {
    const months = ideaThread(
      [p("a", "A", "2025-11-30T23:30:00Z"), p("b", "B", "2026-01-10T12:00:00Z"), p("c", "C", "2026-01-20T12:00:00Z")],
      new Date("2026-02-05T12:00:00Z"),
    );
    // 23:30 UTC on 30 Nov is already 1 Dec in Paris.
    expect(months.map((m) => [m.key, m.count])).toEqual([
      ["2025-12", 1],
      ["2026-01", 2],
      ["2026-02", 0],
    ]);
    expect(months[1]!.titles).toEqual(["B", "C"]);
  });
});
