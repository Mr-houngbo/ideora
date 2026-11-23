import { describe, expect, it } from "vitest";
import { dayToTimestamp, formatIdeaAge, formatIdeaDate, isDayString, toDayString } from "@/lib/idea-dates";

describe("idea dates", () => {
  it("reads the calendar day in the idea time zone", () => {
    // 23:30 UTC on Dec 15 is already Dec 16 in Paris.
    expect(toDayString("2025-12-15T23:30:00Z")).toBe("2025-12-16");
  });

  it("keeps the original timestamp when the day is unchanged", () => {
    const existing = new Date("2025-12-16T08:42:13Z");
    expect(dayToTimestamp("2025-12-16", existing)).toBe(existing);
  });

  it("stores a changed day at noon UTC", () => {
    const existing = new Date("2026-07-22T10:00:00Z");
    const ts = dayToTimestamp("2026-02-22", existing);
    expect(ts.toISOString()).toBe("2026-02-22T12:00:00.000Z");
    expect(toDayString(ts)).toBe("2026-02-22");
  });

  it("validates day strings", () => {
    expect(isDayString("2026-02-22")).toBe(true);
    expect(isDayString("2026-02-30")).toBe(false);
    expect(isDayString("22/02/2026")).toBe(false);
  });

  it("formats in French", () => {
    expect(formatIdeaDate("2025-12-16T12:00:00Z")).toBe("16 décembre 2025");
  });

  it("describes the age of an idea", () => {
    const now = new Date("2026-11-23T12:00:00Z");
    expect(formatIdeaAge("2026-11-23T08:00:00Z", now)).toBe("aujourd’hui");
    expect(formatIdeaAge("2026-11-13T12:00:00Z", now)).toBe("il y a 10 jours");
    expect(formatIdeaAge("2026-02-22T12:00:00Z", now)).toBe("il y a 9 mois");
    expect(formatIdeaAge("2025-11-20T12:00:00Z", now)).toBe("il y a 1 an");
    expect(formatIdeaAge("2024-05-01T12:00:00Z", now)).toBe("il y a 2 ans et 6 mois");
  });
});
