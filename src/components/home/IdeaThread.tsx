"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { ThreadMonth } from "@/lib/home";
import { cn } from "@/lib/utils";

/**
 * "Le fil de la pensée": one column per month since the first recorded idea,
 * its height the number of ideas noted that month. Pointing at (or tapping) a
 * month lists the ideas born then, under the chart.
 */
export default function IdeaThread({ months, academic = false }: { months: ThreadMonth[]; academic?: boolean }) {
  const lastActive = months.reduce((found, m, i) => (m.count > 0 ? i : found), 0);
  const [selected, setSelected] = useState(lastActive);
  if (months.length < 2) return null;

  const max = Math.max(...months.map((m) => m.count), 1);
  const total = months.reduce((n, m) => n + m.count, 0);
  const active = months.filter((m) => m.count > 0).length;
  const current = months[selected] ?? months[lastActive]!;
  const gradient = academic ? "var(--gradient-academic)" : "var(--gradient-primary)";
  const minWidth = `${months.length * 1.25}rem`;

  return (
    <section aria-labelledby="thread-title" className="rounded-3xl border border-border/60 bg-card/70 p-5 backdrop-blur-sm sm:p-6">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="thread-title" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Le fil de la pensée
        </h2>
        <p className="text-sm text-muted-foreground">
          {total} {total > 1 ? "idées" : "idée"} sur {months.length} mois, dont {active} {active > 1 ? "mois féconds" : "mois fécond"}
        </p>
      </div>

      <div className="overflow-x-auto pb-1">
        <ol className="flex h-24 items-end gap-1.5" style={{ minWidth }}>
          {months.map((m, i) => (
            <li key={m.key} className="flex h-full flex-1 items-end justify-center">
              <button
                type="button"
                onMouseEnter={() => setSelected(i)}
                onFocus={() => setSelected(i)}
                onClick={() => setSelected(i)}
                aria-pressed={i === selected}
                aria-label={`${m.label} : ${m.count} ${m.count > 1 ? "idées" : "idée"}`}
                className="flex h-full w-full max-w-8 items-end rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <motion.span
                  initial={{ height: 0 }}
                  animate={{ height: m.count > 0 ? `${Math.max(14, (m.count / max) * 100)}%` : "4px" }}
                  transition={{ duration: 0.6, delay: 0.3 + Math.min(i, 24) * 0.03, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    "block w-full rounded-md transition-opacity",
                    m.count === 0 && "bg-border",
                    i !== selected && m.count > 0 && "opacity-55",
                  )}
                  style={m.count > 0 ? { background: gradient } : undefined}
                />
              </button>
            </li>
          ))}
        </ol>
        <div className="mt-2 flex justify-between text-xs capitalize text-muted-foreground" style={{ minWidth }}>
          <span>{months[0]!.label}</span>
          <span>{months[months.length - 1]!.label}</span>
        </div>
      </div>

      <p className="mt-4 min-h-10 border-t border-border/60 pt-3 text-sm" aria-live="polite">
        <span className={cn("font-semibold capitalize", academic ? "text-academic" : "text-primary")}>{current.label}</span>
        <span className="text-muted-foreground">
          {" · "}
          {current.count === 0 ? "aucune idée consignée" : current.titles.join(" · ")}
        </span>
      </p>
    </section>
  );
}
