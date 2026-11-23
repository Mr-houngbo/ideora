"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, Briefcase, History } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ProjectCover from "@/components/projects/ProjectCover";
import { groupByBirth } from "@/lib/timeline";
import { IDEA_TIME_ZONE } from "@/lib/idea-dates";
import { STATUS_LABELS, STATUS_COLORS, isEducationCategory, type Project } from "@/types/project";
import { cn } from "@/lib/utils";

type Kind = "all" | "entreprise" | "education";
type Order = "newest" | "oldest";

const DAY = new Intl.DateTimeFormat("fr-FR", { day: "numeric", timeZone: IDEA_TIME_ZONE });

function Toggle<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: [T, string][];
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="inline-flex rounded-full border border-border bg-card/70 p-1 backdrop-blur-sm">
      {options.map(([v, text]) => (
        <button
          key={v}
          type="button"
          aria-pressed={value === v}
          onClick={() => onChange(v)}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
            value === v ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {text}
        </button>
      ))}
    </div>
  );
}

/** Every idea on one line of time, grouped by the year and month it was born. */
export default function TimelineView({ projects }: { projects: Project[] }) {
  const [kind, setKind] = useState<Kind>("all");
  const [order, setOrder] = useState<Order>("newest");

  const years = useMemo(() => {
    const shown =
      kind === "all" ? projects : projects.filter((p) => isEducationCategory(p.categorie) === (kind === "education"));
    return groupByBirth(shown, order);
  }, [projects, kind, order]);

  return (
    <Layout>
      <div className="container max-w-4xl py-10">
        <header className="mb-10 text-center">
          <div
            className="mb-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            style={{ background: "var(--gradient-primary)" }}
          >
            <History className="h-4 w-4" />
            Chronologie
          </div>
          <h1 className="mb-4 text-4xl font-bold text-balance sm:text-5xl">
            Le fil de ta <span className="gradient-text">pensée</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            Chaque idée à sa place dans le temps, du jour où elle est née.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Toggle
              label="Type d’idées"
              value={kind}
              onChange={setKind}
              options={[
                ["all", "Toutes"],
                ["entreprise", "Entreprise"],
                ["education", "Académique"],
              ]}
            />
            <Toggle
              label="Ordre"
              value={order}
              onChange={setOrder}
              options={[
                ["newest", "Les plus récentes"],
                ["oldest", "Depuis le début"],
              ]}
            />
          </div>
        </header>

        {years.length === 0 && <p className="py-20 text-center text-muted-foreground">Aucune idée pour l’instant.</p>}

        <div className="space-y-14">
          {years.map((y) => (
            <section key={y.year} aria-labelledby={`y-${y.year}`}>
              <div className="sticky top-20 z-10 -mx-2 mb-6 flex items-baseline gap-3 rounded-2xl bg-background/85 px-2 py-2 backdrop-blur-md">
                <h2 id={`y-${y.year}`} className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                  <span className="gradient-text">{y.year}</span>
                </h2>
                <span className="text-sm text-muted-foreground">
                  {y.count} {y.count > 1 ? "idées" : "idée"}
                </span>
              </div>

              <div className="space-y-8">
                {y.months.map((m) => (
                  <div key={m.key}>
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">{m.label}</h3>
                    <ol className="relative space-y-3 before:absolute before:bottom-4 before:left-[19px] before:top-4 before:w-px before:bg-border">
                      {m.items.map((p, i) => {
                        const academic = isEducationCategory(p.categorie);
                        return (
                          <motion.li
                            key={p.id}
                            initial={{ opacity: 0, x: -12 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.4, delay: Math.min(i, 6) * 0.04 }}
                            className="relative flex gap-4"
                          >
                            <time
                              dateTime={p.date_creation}
                              className={cn(
                                "relative z-[1] flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-background text-sm font-bold text-white",
                              )}
                              style={{ background: academic ? "var(--gradient-academic)" : "var(--gradient-primary)" }}
                            >
                              {DAY.format(new Date(p.date_creation))}
                            </time>
                            <Link
                              href={`/projet/${p.id}`}
                              className="group flex min-w-0 flex-1 items-center gap-4 rounded-2xl border border-border/60 bg-card/80 p-3 pr-4 shadow-sm transition hover:border-primary/30 hover:shadow-md"
                            >
                              <ProjectCover project={p} className="hidden h-14 w-20 shrink-0 rounded-xl sm:block" />
                              <div className="min-w-0 flex-1">
                                <div className="mb-1 flex flex-wrap items-center gap-2 text-xs">
                                  <span className={cn("inline-flex items-center gap-1 font-semibold uppercase tracking-wider", academic ? "text-academic" : "text-primary")}>
                                    {academic ? <GraduationCap className="h-3.5 w-3.5" /> : <Briefcase className="h-3.5 w-3.5" />}
                                    {p.categorie}
                                  </span>
                                  <span className={cn("rounded-full border px-2 py-0.5 font-medium", STATUS_COLORS[p.statut])}>
                                    {STATUS_LABELS[p.statut]}
                                  </span>
                                </div>
                                <p className="truncate font-semibold group-hover:text-primary">{p.titre}</p>
                                {p.description_courte && (
                                  <p className="line-clamp-1 text-sm text-muted-foreground">{p.description_courte}</p>
                                )}
                              </div>
                            </Link>
                          </motion.li>
                        );
                      })}
                    </ol>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </Layout>
  );
}
