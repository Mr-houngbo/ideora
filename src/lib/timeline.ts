import type { Project } from "@/types/project";
import { toDayString } from "@/lib/idea-dates";

export interface TimelineMonth<T> {
  key: string; // "2026-02"
  label: string; // "février"
  items: T[];
}

export interface TimelineYear<T> {
  year: string;
  count: number;
  months: TimelineMonth<T>[];
}

const MONTH = new Intl.DateTimeFormat("fr-FR", { month: "long", timeZone: "UTC" });

/**
 * Groups ideas by year then month of their birth (in the ideas' time zone),
 * newest first, or oldest first to read the line of thought from its start.
 */
export function groupByBirth<T extends Pick<Project, "date_creation">>(
  projects: T[],
  order: "newest" | "oldest" = "newest",
): TimelineYear<T>[] {
  const dir = order === "newest" ? -1 : 1;
  const sorted = [...projects].sort(
    (a, b) => dir * (new Date(a.date_creation).getTime() - new Date(b.date_creation).getTime()),
  );
  const years: TimelineYear<T>[] = [];
  for (const p of sorted) {
    const day = toDayString(p.date_creation);
    const year = day.slice(0, 4);
    const key = day.slice(0, 7);
    let y = years[years.length - 1];
    if (!y || y.year !== year) years.push((y = { year, count: 0, months: [] }));
    let m = y.months[y.months.length - 1];
    if (!m || m.key !== key) {
      m = { key, label: MONTH.format(new Date(`${key}-15T12:00:00Z`)), items: [] };
      y.months.push(m);
    }
    m.items.push(p);
    y.count += 1;
  }
  return years;
}
