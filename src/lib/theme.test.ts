import { describe, expect, it } from "vitest";
import { THEME_SCRIPT, THEME_STORAGE_KEY } from "./theme";

describe("theme", () => {
  it("reads the saved theme before the first paint", () => {
    expect(THEME_SCRIPT).toContain(THEME_STORAGE_KEY);
    expect(THEME_SCRIPT).toContain("prefers-color-scheme: dark");
  });
  it("no longer forces any page into light mode", () => {
    expect(THEME_SCRIPT).not.toContain("workspace");
  });
});
