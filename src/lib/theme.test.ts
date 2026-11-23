import { describe, expect, it } from "vitest";
import { LIGHT_ONLY_PATH, THEME_SCRIPT } from "./theme";

describe("theme", () => {
  it("keeps only workspace pages in light mode", () => {
    expect(LIGHT_ONLY_PATH.test("/projet/68f5bad1/workspace")).toBe(true);
    expect(LIGHT_ONLY_PATH.test("/projet/68f5bad1")).toBe(false);
    expect(LIGHT_ONLY_PATH.test("/")).toBe(false);
  });
  it("embeds the light-only rule in the head script", () => {
    expect(THEME_SCRIPT).toContain(String(LIGHT_ONLY_PATH));
  });
});
