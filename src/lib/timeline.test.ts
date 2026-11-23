import { describe, expect, it } from "vitest";
import { groupByBirth } from "./timeline";

const ideas = [
  { id: "a", date_creation: "2025-12-11T09:00:00Z" },
  { id: "b", date_creation: "2026-02-01T10:00:00Z" },
  { id: "c", date_creation: "2026-02-22T10:00:00Z" },
  // 31 Jan 23:30 UTC is already 1 Feb in Paris.
  { id: "d", date_creation: "2026-01-31T23:30:00Z" },
];

describe("groupByBirth", () => {
  it("groups by year and month, newest first", () => {
    const years = groupByBirth(ideas);
    expect(years.map((y) => [y.year, y.count])).toEqual([
      ["2026", 3],
      ["2025", 1],
    ]);
    expect(years[0]!.months.map((m) => [m.label, m.items.map((i) => i.id)])).toEqual([["février", ["c", "b", "d"]]]);
  });
  it("can read from the first idea", () => {
    const years = groupByBirth(ideas, "oldest");
    expect(years[0]!.year).toBe("2025");
    expect(years[1]!.months[0]!.items.map((i) => i.id)).toEqual(["d", "b", "c"]);
  });
});
