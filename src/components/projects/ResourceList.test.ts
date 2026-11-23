import { describe, expect, it } from "vitest";
import { parseResources } from "@/components/projects/ResourceList";

describe("parseResources", () => {
  it("splits lines and turns URLs into links", () => {
    expect(parseResources("- Mentors expérimentés\nAIMS : https://www.aims.ac.za/apply\n\nhttps://example.com")).toEqual([
      { label: "Mentors expérimentés", url: null },
      { label: "AIMS", url: "https://www.aims.ac.za/apply" },
      { label: "example.com", url: "https://example.com" },
    ]);
  });
});
