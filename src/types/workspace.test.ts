import { describe, expect, it } from "vitest";
import { emptyWorkspaceStore, refreshDomainColors } from "./workspace";

describe("refreshDomainColors", () => {
  it("maps the old brown palette to the current one and keeps custom colours", () => {
    const store = {
      ...emptyWorkspaceStore,
      domains: [
        { ...emptyWorkspaceStore.domains[0]!, color: "#6b3a2a" },
        { ...emptyWorkspaceStore.domains[1]!, color: "#123456" },
      ],
    };
    expect(refreshDomainColors(store).domains.map((d) => d.color)).toEqual(["#7C3AED", "#123456"]);
  });
  it("returns the same store when nothing needs a change", () => {
    expect(refreshDomainColors(emptyWorkspaceStore)).toBe(emptyWorkspaceStore);
  });
});
