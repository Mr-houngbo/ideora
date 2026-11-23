import { describe, expect, it } from "vitest";
import { daysUntil, dueState, formatDay, formatDue, isSealed } from "./journal";

// 23 Nov 2026, 23:30 UTC is already 24 Nov in Paris.
const now = new Date("2026-11-23T23:30:00Z");

describe("journal dates", () => {
  it("counts days from today in Paris", () => {
    expect(daysUntil("2026-11-24", now)).toBe(0);
    expect(daysUntil("2026-11-30", now)).toBe(6);
    expect(daysUntil("2026-11-20", now)).toBe(-4);
  });
  it("describes how far a day is", () => {
    expect(dueState("2026-11-20", now)).toBe("late");
    expect(dueState("2026-11-24", now)).toBe("today");
    expect(dueState("2026-11-30", now)).toBe("soon");
    expect(dueState("2027-01-30", now)).toBe("later");
    expect(formatDue("2026-11-25", now)).toBe("demain");
    expect(formatDue("2026-11-21", now)).toBe("en retard de 3 jours");
  });
  it("formats a stored day without shifting it", () => {
    expect(formatDay("2026-12-05")).toBe("5 décembre 2026");
  });
  it("keeps a promise sealed until its day", () => {
    expect(isSealed({ type: "promesse", date_prevue: "2027-01-01" }, now)).toBe(true);
    expect(isSealed({ type: "promesse", date_prevue: "2026-11-24" }, now)).toBe(false);
    expect(isSealed({ type: "note", date_prevue: null }, now)).toBe(false);
  });
});
