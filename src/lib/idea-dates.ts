/**
 * The date an idea was first recorded is the backbone of Ideora: it traces a
 * line of thought over the years. All formatting goes through one fixed time
 * zone so the server render and the browser always agree on the day.
 */
export const IDEA_TIME_ZONE = "Europe/Paris";

const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

/** "2025-12-16" for an ISO timestamp, as seen in IDEA_TIME_ZONE (for <input type="date">). */
export function toDayString(iso: string | Date): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: IDEA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
}

export function isDayString(value: string): boolean {
  if (!DAY_RE.test(value)) return false;
  const d = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().startsWith(value);
}

/**
 * Turns a picked day into the timestamp to store. Keeps the existing
 * timestamp (and its original time of day) when the day did not change;
 * otherwise uses noon UTC, which falls on the same calendar day in every
 * time zone from UTC-11 to UTC+11.
 */
export function dayToTimestamp(day: string, existing?: Date): Date {
  if (existing && toDayString(existing) === day) return existing;
  return new Date(`${day}T12:00:00Z`);
}

/** "16 décembre 2025" */
export function formatIdeaDate(iso: string, opts: { short?: boolean } = {}): string {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: IDEA_TIME_ZONE,
    day: "numeric",
    month: opts.short ? "short" : "long",
    year: "numeric",
  }).format(new Date(iso));
}

/** "il y a 11 mois", "il y a 2 ans", "aujourd’hui" */
export function formatIdeaAge(iso: string, now: Date = new Date()): string {
  const days = Math.floor((now.getTime() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return "aujourd’hui";
  const rtf = new Intl.RelativeTimeFormat("fr", { numeric: "always" });
  if (days < 31) return rtf.format(-days, "day");
  const months = Math.floor(days / 30.44);
  if (months < 12) return rtf.format(-months, "month");
  const years = Math.floor(days / 365.25);
  const rest = Math.floor((days - years * 365.25) / 30.44);
  const y = rtf.format(-years, "year");
  return rest > 0 ? `${y} et ${rest} mois` : y;
}
