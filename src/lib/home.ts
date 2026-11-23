import { isEducationCategory, type Project } from "@/types/project";
import { toDayString } from "@/lib/idea-dates";

export type ProjectSort = "recent" | "oldest" | "title";

export const SORT_LABELS: Record<ProjectSort, string> = {
  recent: "Plus récentes",
  oldest: "Plus anciennes",
  title: "Titre (A → Z)",
};

export function sortProjects<T extends Pick<Project, "titre" | "date_creation">>(projects: T[], sort: ProjectSort): T[] {
  const copy = [...projects];
  if (sort === "title") return copy.sort((a, b) => a.titre.localeCompare(b.titre, "fr", { sensitivity: "base" }));
  const dir = sort === "recent" ? -1 : 1;
  return copy.sort((a, b) => dir * (new Date(a.date_creation).getTime() - new Date(b.date_creation).getTime()));
}

/** Small stable hash, so the same day always picks the same project. */
function hash(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * The project shown "À la une": one of the showcases (the most worked-out
 * ideas), else a project in progress, else the latest idea. Among several
 * candidates it changes once a day: the home page shows a new face each day
 * but stays the same between reloads.
 */
export function pickFeatured<T extends Pick<Project, "id" | "titre" | "statut" | "custom_template" | "date_creation" | "image_url">>(
  projects: T[],
  now: Date = new Date(),
): T | null {
  if (projects.length === 0) return null;
  const pools = [
    projects.filter((p) => p.custom_template),
    projects.filter((p) => p.statut === "en_cours"),
    projects.filter((p) => p.image_url),
  ];
  const pool = pools.find((p) => p.length > 0);
  if (!pool) return sortProjects(projects, "recent")[0] ?? null;
  const ordered = [...pool].sort((a, b) => a.id.localeCompare(b.id));
  return ordered[hash(toDayString(now)) % ordered.length] ?? null;
}

export interface ThreadMonth {
  /** "2025-12" */
  key: string;
  /** "déc. 2025" */
  label: string;
  count: number;
  titles: string[];
}

const MONTH_LABEL = new Intl.DateTimeFormat("fr-FR", { month: "short", year: "numeric", timeZone: "UTC" });

/**
 * One entry per month from the first recorded idea to the current month,
 * with the ideas recorded in it: the "line of thought" shown on the home page.
 */
export function ideaThread(
  projects: Pick<Project, "titre" | "date_creation">[],
  now: Date = new Date(),
): ThreadMonth[] {
  if (projects.length === 0) return [];
  const byMonth = new Map<string, string[]>();
  for (const p of projects) {
    const key = toDayString(p.date_creation).slice(0, 7);
    byMonth.set(key, [...(byMonth.get(key) ?? []), p.titre]);
  }
  const keys = [...byMonth.keys()].sort();
  const last = [keys[keys.length - 1]!, toDayString(now).slice(0, 7)].sort()[1]!;
  let [y, m] = keys[0]!.split("-").map(Number) as [number, number];
  const months: ThreadMonth[] = [];
  // Cap at ten years of months, as a guard against a stray far-past date.
  for (let i = 0; i < 120; i++) {
    const key = `${y}-${String(m).padStart(2, "0")}`;
    const titles = byMonth.get(key) ?? [];
    months.push({ key, label: MONTH_LABEL.format(new Date(Date.UTC(y, m - 1, 15))), count: titles.length, titles });
    if (key >= last) break;
    m += 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
  }
  return months;
}

/** Server side: the "À la une" project of a home page, picked once per request. */
export function featuredIdFor(projects: Project[], academic: boolean): string | null {
  return pickFeatured(projects.filter((p) => isEducationCategory(p.categorie) === academic))?.id ?? null;
}
