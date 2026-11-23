import { toDayString } from "@/lib/idea-dates";
import type { JournalEntry } from "@/types/project";

/** Whole days from today (in IDEA_TIME_ZONE) to a YYYY-MM-DD day: negative when past. */
export function daysUntil(day: string, now: Date = new Date()): number {
  const today = Date.parse(`${toDayString(now)}T00:00:00Z`);
  return Math.round((Date.parse(`${day}T00:00:00Z`) - today) / 86_400_000);
}

/** "5 décembre 2026" for a YYYY-MM-DD day. */
export function formatDay(day: string, opts: { short?: boolean } = {}): string {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: "UTC",
    day: "numeric",
    month: opts.short ? "short" : "long",
    year: "numeric",
  }).format(new Date(`${day}T12:00:00Z`));
}

export type DueState = "late" | "today" | "soon" | "later";

export function dueState(day: string, now: Date = new Date()): DueState {
  const d = daysUntil(day, now);
  if (d < 0) return "late";
  if (d === 0) return "today";
  if (d <= 7) return "soon";
  return "later";
}

/** "en retard de 3 jours", "aujourd’hui", "demain", "dans 12 jours" */
export function formatDue(day: string, now: Date = new Date()): string {
  const d = daysUntil(day, now);
  if (d === 0) return "aujourd’hui";
  if (d === 1) return "demain";
  if (d === -1) return "en retard d’un jour";
  if (d < 0) return `en retard de ${-d} jours`;
  return `dans ${d} jours`;
}

/** A promise stays sealed, its text hidden, until the day it was meant to be read again. */
export function isSealed(entry: Pick<JournalEntry, "type" | "date_prevue">, now: Date = new Date()): boolean {
  return entry.type === "promesse" && entry.date_prevue !== null && daysUntil(entry.date_prevue, now) > 0;
}

