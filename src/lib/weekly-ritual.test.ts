import { describe, expect, it } from "vitest";
import { weekOf, weeklyRitual } from "./weekly-ritual";

const at = (iso: string) => Date.parse(iso);

describe("weekOf", () => {
  it("returns the Monday of the week, in Paris time", () => {
    expect(weekOf(at("2026-11-24T14:00:00Z"))).toBe("2026-11-23"); // Tuesday
    expect(weekOf(at("2026-11-23T00:30:00+01:00"))).toBe("2026-11-23"); // Monday just after midnight in Paris
    expect(weekOf(at("2026-11-29T22:30:00Z"))).toBe("2026-11-23"); // Sunday 23:30 in Paris
    expect(weekOf(at("2026-11-29T23:30:00Z"))).toBe("2026-11-30"); // already Monday in Paris
  });
});

describe("weeklyRitual", () => {
  const now = at("2026-11-24T14:00:00Z");

  it("starts empty", () => {
    const r = weeklyRitual([], now);
    expect(r.weeks).toHaveLength(12);
    expect(r.weeks.at(-1)).toEqual({ start: "2026-11-23", done: false, current: true });
    expect(r.weeks[0]!.start).toBe("2026-09-07");
    expect(r).toMatchObject({ doneThisWeek: false, streak: 0, doneCount: 0 });
  });

  it("counts a streak ending this week", () => {
    const r = weeklyRitual([at("2026-11-24T09:00:00Z"), at("2026-11-17T09:00:00Z"), at("2026-11-18T09:00:00Z"), at("2026-11-02T09:00:00Z")], now);
    expect(r).toMatchObject({ doneThisWeek: true, streak: 2, doneCount: 3 });
  });

  it("keeps last week's streak alive while this week is still open", () => {
    const r = weeklyRitual([at("2026-11-17T09:00:00Z"), at("2026-11-10T09:00:00Z")], now);
    expect(r).toMatchObject({ doneThisWeek: false, streak: 2, doneCount: 2 });
  });
});
