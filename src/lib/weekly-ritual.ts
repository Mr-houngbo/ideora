import { toDayString } from "@/lib/idea-dates";

const DAY = 86_400_000;

/** The Monday (YYYY-MM-DD, Paris time) of the week a moment falls in. */
export function weekOf(moment: number | Date): string {
  const [y, m, d] = toDayString(new Date(moment)).split("-").map(Number) as [number, number, number];
  const utc = Date.UTC(y, m - 1, d);
  const weekday = (new Date(utc).getUTCDay() + 6) % 7; // Monday = 0
  return new Date(utc - weekday * DAY).toISOString().slice(0, 10);
}

export interface RitualWeek {
  /** Monday of the week, YYYY-MM-DD. */
  start: string;
  done: boolean;
  current: boolean;
}

export interface WeeklyRitual {
  /** The challenge weeks, oldest first; the last one is the current week. */
  weeks: RitualWeek[];
  doneThisWeek: boolean;
  /** Weeks in a row with at least one entry, ending this week (or last week while this one is still open). */
  streak: number;
  /** Weeks of the challenge with at least one entry. */
  doneCount: number;
}

/**
 * The "one entry a week" ritual: which of the last `span` weeks got at least
 * one entry, and the current streak.
 */
export function weeklyRitual(createdAt: number[], now: number | Date = Date.now(), span = 12): WeeklyRitual {
  const done = new Set(createdAt.map((t) => weekOf(t)));
  const thisWeek = weekOf(now);
  const monday = Date.parse(`${thisWeek}T00:00:00Z`);
  const weeks: RitualWeek[] = [];
  for (let i = span - 1; i >= 0; i--) {
    const start = new Date(monday - i * 7 * DAY).toISOString().slice(0, 10);
    weeks.push({ start, done: done.has(start), current: i === 0 });
  }
  const doneThisWeek = done.has(thisWeek);
  let streak = 0;
  for (let i = doneThisWeek ? 0 : 1; ; i++) {
    const start = new Date(monday - i * 7 * DAY).toISOString().slice(0, 10);
    if (!done.has(start)) break;
    streak++;
  }
  return { weeks, doneThisWeek, streak, doneCount: weeks.filter((w) => w.done).length };
}
