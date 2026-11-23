"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Lightbulb, Plus, Pin, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { WorkspaceStore as Store } from "@/types/workspace";
import { statusLabel, milestoneStatusLabel, fmt, PageHeader, EmptyState, Stat } from "./shared";
import type { Tab } from "./shared";

/* ───────────────────────── Dashboard ───────────────────────── */
export function DashboardView({ store, onJump }: { store: Store; onJump: (t: Tab) => void }) {
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Stat label="Initiatives" value={store.initiatives.length} hint="documentées" />
        <Stat label="Contacts" value={store.contacts.length} hint="réseau actif" />
        <Stat label="Ressources" value={store.library.length} hint="bibliothèque" />
        <Stat label="Faisabilité moy." value={avgFeas.toFixed(1)} hint="sur 10" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
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

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="mpp-card p-6">
          <div className="mpp-sub text-lg mb-4 flex items-center gap-2">
            <Pin className="h-4 w-4" /> Initiatives épinglées
          </div>
          {pinned.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--mpp-text-2)" }}>
              Épingle des initiatives clés depuis l'onglet Initiatives.
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
            <EmptyState
              icon={Lightbulb}
              title="Aucune initiative encore"
              hint="Commence par documenter ce qui marche ailleurs."
              action={<Button onClick={() => onJump("initiatives")} style={{ background: "var(--mpp-primary)" }}>
                <Plus className="h-4 w-4 mr-1" /> Ajouter une initiative
              </Button>}
            />
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
        className="mt-8 p-6 md:p-8 rounded-2xl border"
        style={{
          background: "linear-gradient(135deg, var(--mpp-primary-dark), var(--mpp-primary))",
          borderColor: "var(--mpp-primary-dark)",
        }}
      >
        <div className="mpp-sub text-sm tracking-wide" style={{ color: "var(--mpp-accent)" }}>
          ✦ Pensée du jour
        </div>
        <p className="mpp-h text-xl md:text-2xl mt-2 max-w-3xl" style={{ color: "#FAF6F1" }}>
          « Aucun pays ne s'est jamais développé en imitant aveuglément.
          Il s'agit d'observer, comprendre, adapter — patiemment. »
        </p>
      </div>
    </>
  );
}
