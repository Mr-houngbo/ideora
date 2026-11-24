"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Pin, ChevronRight, PenLine, Flame, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { WorkspaceStore as Store } from "@/types/workspace";
import { statusLabel, milestoneStatusLabel, fmt, PageHeader, Stat } from "./shared";
import type { Tab } from "./shared";
import { weeklyRitual } from "@/lib/weekly-ritual";
import { cn } from "@/lib/utils";

const GOAL = 12;
const DAY_FMT = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", timeZone: "UTC" });

/** The weekly ritual: one entry a week, twelve weeks in a row. */
function WeeklyRitualCard({ createdAt, onWrite }: { createdAt: number[]; onWrite: () => void }) {
  const [now] = useState(() => Date.now());
  const r = useMemo(() => weeklyRitual(createdAt, now, GOAL), [createdAt, now]);
  const total = createdAt.length;
  return (
    <section className="relative mb-8 overflow-hidden rounded-3xl border border-border/60 bg-card/80 p-6 shadow-card backdrop-blur-xl md:p-8">
      <div aria-hidden="true" className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
      <div aria-hidden="true" className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Le rituel de la semaine
          </p>
          <h2 className="mt-4 text-2xl font-extrabold leading-tight tracking-tight text-balance md:text-3xl">
            {r.doneThisWeek ? (
              <>Fiche de la semaine écrite. <span className="gradient-text">Bravo.</span></>
            ) : total === 0 ? (
              <>Une idée vue ailleurs, <span className="gradient-text">adaptée au Bénin.</span></>
            ) : (
              <>Quelle idée as-tu croisée <span className="gradient-text">cette semaine ?</span></>
            )}
          </h2>
          <p className="mt-2 max-w-xl text-muted-foreground">
            {r.doneThisWeek
              ? "Rendez-vous lundi pour la suivante. Tu peux toujours compléter tes fiches d'ici là."
              : "Trente minutes suffisent : ce que tu as vu, pourquoi ça marche, comment l'adapter chez nous."}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button variant={r.doneThisWeek ? "outline" : "gradient"} size="lg" onClick={onWrite}>
              <PenLine className="mr-2 h-4 w-4" />
              {r.doneThisWeek ? "Écrire une autre fiche" : total === 0 ? "Écrire ma première fiche" : "Écrire la fiche de la semaine"}
            </Button>
            {r.streak > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1.5 text-sm font-semibold text-accent">
                <Flame className="h-4 w-4" /> {r.streak} {r.streak > 1 ? "semaines" : "semaine"} d&apos;affilée
              </span>
            )}
          </div>
        </div>

        <div className="lg:w-[300px]">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-semibold">Défi des {GOAL} semaines</span>
            <span className="text-sm font-bold tabular-nums text-primary">
              {r.doneCount}/{GOAL}
            </span>
          </div>
          <ol className="mt-3 grid grid-cols-6 gap-2" aria-label="Semaines du défi">
            {r.weeks.map((w) => (
              <li
                key={w.start}
                title={`Semaine du ${DAY_FMT.format(new Date(`${w.start}T00:00:00Z`))}${w.done ? " : fiche écrite" : ""}`}
                className={cn(
                  "flex aspect-square items-center justify-center rounded-xl text-[10px] font-bold transition-colors",
                  w.done
                    ? "bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-md"
                    : "bg-secondary text-muted-foreground",
                  w.current && !w.done && "ring-2 ring-primary ring-offset-2 ring-offset-card",
                )}
              >
                {w.done ? <CheckCircle2 className="h-4 w-4" /> : DAY_FMT.format(new Date(`${w.start}T00:00:00Z`)).split(" ")[0]}
              </li>
            ))}
          </ol>
          <p className="mt-3 text-xs text-muted-foreground">
            {total} {total > 1 ? "fiches écrites" : "fiche écrite"} au total. Chaque case est une semaine, du lundi au dimanche.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Dashboard ───────────────────────── */
export function DashboardView({ store, onJump, onWrite }: { store: Store; onJump: (t: Tab) => void; onWrite: () => void }) {
  const avgFeas = useMemo(() => {
    if (!store.initiatives.length) return 0;
    return (
      store.initiatives.reduce((a, b) => a + b.feasibility, 0) / store.initiatives.length
    );
  }, [store.initiatives]);

  const coverage = useMemo(() => {
    return store.domains.map((d) => ({
      ...d,
      count: store.initiatives.filter((i) => i.domainId === d.id).length,
    }));
  }, [store.domains, store.initiatives]);

  const createdAt = useMemo(() => store.initiatives.map((i) => i.createdAt), [store.initiatives]);
  const maxCount = Math.max(1, ...coverage.map((c) => c.count));
  const pinned = store.initiatives.filter((i) => i.pinned).slice(0, 4);
  const recent = [...store.initiatives].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);
  const nextMilestones = [...store.milestones]
    .filter((m) => m.status !== "completed")
    .sort((a, b) => a.year - b.year || a.quarter - b.quarter)
    .slice(0, 4);

  return (
    <>
      <PageHeader
        title="Tableau de bord"
        subtitle="Vue d'ensemble de ton observation du monde, orientée Bénin."
      />

      <WeeklyRitualCard createdAt={createdAt} onWrite={onWrite} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Stat label="Initiatives" value={store.initiatives.length} hint="documentées" />
        <Stat label="Contacts" value={store.contacts.length} hint="réseau actif" />
        <Stat label="Ressources" value={store.library.length} hint="bibliothèque" />
        <Stat label="Faisabilité moy." value={avgFeas.toFixed(1)} hint="sur 10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="mpp-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="mpp-sub text-lg">Couverture par domaine</div>
            <button
              onClick={() => onJump("domains")}
              className="text-xs flex items-center gap-1 hover:underline"
              style={{ color: "var(--mpp-primary)" }}
            >
              Voir les domaines <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          <div className="space-y-3">
            {coverage.map((d) => (
              <div key={d.id}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="flex items-center gap-2">
                    <span>{d.icon}</span>
                    <span style={{ color: "var(--mpp-text)" }}>{d.name}</span>
                  </span>
                  <span className="mpp-mono text-xs" style={{ color: "var(--mpp-text-2)" }}>
                    {d.count}
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--mpp-surface-alt)" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(d.count / maxCount) * 100}%` }}
                    transition={{ duration: 0.6 }}
                    className="h-full rounded-full"
                    style={{ background: d.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mpp-card p-6">
          <div className="mpp-sub text-lg mb-4">Prochains jalons</div>
          {nextMilestones.length === 0 ? (
            <div className="text-sm" style={{ color: "var(--mpp-text-2)" }}>
              Aucun jalon planifié.
              <button
                onClick={() => onJump("roadmap")}
                className="block mt-2 underline"
                style={{ color: "var(--mpp-primary)" }}
              >
                Créer ta roadmap →
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {nextMilestones.map((m) => (
                <li key={m.id} className="flex items-start gap-3">
                  <div
                    className="mpp-mono text-[11px] px-2 py-1 rounded mt-0.5"
                    style={{ background: "var(--mpp-accent-soft)", color: "var(--mpp-primary-dark)" }}
                  >
                    A{m.year}T{m.quarter || 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate" style={{ color: "var(--mpp-text)" }}>
                      {m.title}
                    </div>
                    <div className="text-xs" style={{ color: "var(--mpp-text-2)" }}>
                      {milestoneStatusLabel[m.status]}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="mpp-card p-6">
          <div className="mpp-sub text-lg mb-4 flex items-center gap-2">
            <Pin className="h-4 w-4" /> Initiatives épinglées
          </div>
          {pinned.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--mpp-text-2)" }}>
              Épingle des initiatives clés depuis l’onglet Initiatives.
            </p>
          ) : (
            <div className="space-y-2">
              {pinned.map((i) => (
                <div key={i.id} className="p-3 rounded-lg" style={{ background: "var(--mpp-surface-alt)" }}>
                  <div className="text-sm font-medium" style={{ color: "var(--mpp-text)" }}>{i.title}</div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--mpp-text-2)" }}>
                    {i.country || "—"} · Faisabilité {i.feasibility}/10
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mpp-card p-6">
          <div className="mpp-sub text-lg mb-4">Récemment ajoutées</div>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">Tes fiches apparaîtront ici, de la plus récente à la plus ancienne.</p>
          ) : (
            <div className="space-y-2">
              {recent.map((i) => (
                <div key={i.id} className="flex items-center justify-between p-2 hover:bg-[var(--mpp-surface-alt)] rounded-lg">
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate" style={{ color: "var(--mpp-text)" }}>{i.title}</div>
                    <div className="text-xs" style={{ color: "var(--mpp-text-2)" }}>{i.country} · {fmt(i.createdAt)}</div>
                  </div>
                  <Badge variant="outline" className="mpp-mono text-[10px]">
                    {statusLabel[i.status]}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        className="relative mt-8 overflow-hidden rounded-3xl p-6 text-white shadow-glow md:p-8"
        style={{ backgroundImage: "var(--gradient-primary)" }}
      >
        <div aria-hidden="true" className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative text-xs font-bold uppercase tracking-[0.2em] text-white/80">Pensée du jour</div>
        <p className="relative mt-2 max-w-3xl text-xl font-bold leading-snug md:text-2xl">
          « Aucun pays ne s’est jamais développé en imitant aveuglément.
          Il s’agit d’observer, comprendre, adapter, patiemment. »
        </p>
      </div>
    </>
  );
}
