import type { ComponentType } from "react";
import PerseusShowcase from "./PerseusShowcase";
import DahoShowcase from "./DahoShowcase";
import HouefaShowcase from "./HouefaShowcase";
import VisionEducationShowcase from "./VisionEducationShowcase";
import type { ShowcaseComponentProps } from "./shared";

export const SHOWCASE_TEMPLATES: Record<string, ComponentType<ShowcaseComponentProps>> = {
  perseus: PerseusShowcase,
  daho: DahoShowcase,
  houefa: HouefaShowcase,
  "vision-education": VisionEducationShowcase,
};
