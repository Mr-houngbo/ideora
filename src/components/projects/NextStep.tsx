import { Footprints } from "lucide-react";
import { dueState, formatDay, formatDue } from "@/lib/journal";
import { cn } from "@/lib/utils";

const DUE_TONE = {
  late: "text-destructive",
  today: "text-warning",
  soon: "text-warning",
  later: "text-muted-foreground",
} as const;

/** The next concrete action of a project, with how close its target day is. */
export default function NextStep({
  step,
  day,
  compact = false,
  className,
}: {
  step: string;
  day: string | null;
  compact?: boolean;
  className?: string;
}) {
  if (!step) return null;
  const state = day ? dueState(day) : null;

  if (compact) {
    return (
      <p className={cn("flex items-start gap-1.5 text-xs", className)}>
        <Footprints className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
        <span className="line-clamp-1 font-medium text-foreground/80">{step}</span>
        {day && state && (
          <span className={cn("ml-auto shrink-0", DUE_TONE[state])} suppressHydrationWarning>
            {formatDay(day, { short: true })}
          </span>
        )}
      </p>
    );
  }

  return (
    <div className={cn("rounded-2xl border border-primary/20 bg-primary/5 p-4", className)}>
      <p className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.15em] text-primary">
        <Footprints className="h-3.5 w-3.5" />
        Prochaine étape
      </p>
      <p className="font-semibold leading-snug text-foreground">{step}</p>
      {day && state && (
        <p className="mt-1.5 text-xs text-muted-foreground" suppressHydrationWarning>
          {formatDay(day)} · <span className={cn("font-medium", DUE_TONE[state])}>{formatDue(day)}</span>
        </p>
      )}
    </div>
  );
}
