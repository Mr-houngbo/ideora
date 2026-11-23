"use client";

import Link from "next/link";
import { type LucideIcon, ArrowLeft, LayoutDashboard, Lightbulb, Layers, Users, Map, BookOpen, NotebookPen, Mic2, Search } from "lucide-react";
import type { WorkspaceStore as Store } from "@/types/workspace";

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

/* ───────────────────────── Constants & helpers ───────────────────────── */
export const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "initiatives", label: "Initiatives", icon: Lightbulb },
  { id: "domains", label: "Domaines", icon: Layers },
  { id: "network", label: "Réseau", icon: Users },
  { id: "roadmap", label: "Roadmap", icon: Map },
  { id: "library", label: "Bibliothèque", icon: BookOpen },
  { id: "journal", label: "Journal", icon: NotebookPen },
  { id: "conference", label: "Conférence", icon: Mic2 },
  { id: "search", label: "Recherche", icon: Search },
] as const;
export type Tab = typeof NAV[number]["id"];

export const costLabel = { low: "Faible", medium: "Moyen", high: "Élevé", very_high: "Très élevé" } as const;
export const statusLabel = { draft: "Brouillon", documented: "Documenté", analyzed: "Analysé", proposed: "Proposé" } as const;
export const relLabel = { identified: "Identifié", contacted: "Contacté", connected: "Connecté", collaborator: "Collaborateur", speaker: "Intervenant" } as const;
export const milestoneStatusLabel = { planned: "Planifié", in_progress: "En cours", completed: "Terminé", delayed: "Retardé" } as const;

export const fmt = (t: number) => new Date(t).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

/* ───────────────────────── Style tokens (scoped) ───────────────────────── */
export function Style() {
  return (
    <style>{`
      :root {
        --mpp-primary:#6B3A2A;
        --mpp-primary-light:#9C5A3C;
        --mpp-primary-dark:#3E1F13;
        --mpp-accent:#D4A853;
        --mpp-accent-soft:#F0D9A8;
        --mpp-surface:#FAF6F1;
        --mpp-surface-alt:#F0E8DC;
        --mpp-text:#1C1008;
        --mpp-text-2:#7A5C4A;
        --mpp-border:#E2D0BE;
        --mpp-success:#4A7C59;
        --mpp-warning:#C4742A;
        --mpp-danger:#A63228;
      }
      .mpp-h { font-family: 'Playfair Display', serif; letter-spacing:-0.01em; color: var(--mpp-text); }
      .mpp-sub { font-family: 'DM Serif Display', serif; color: var(--mpp-primary-dark); }
      .mpp-mono { font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace; }
      .mpp-card {
        background:#fff; border:1px solid var(--mpp-border); border-radius:16px;
        box-shadow: 0 1px 0 rgba(62,31,19,.04), 0 8px 24px -16px rgba(62,31,19,.18);
      }
      .mpp-pattern {
        background-image:
          radial-gradient(circle at 1px 1px, rgba(107,58,42,0.07) 1px, transparent 0);
        background-size: 18px 18px;
      }
    `}</style>
  );
}

/* ───────────────────────── Sidebar ───────────────────────── */
export function Sidebar({
  tab, onChange, store, backHref,
}: { tab: Tab; onChange: (t: Tab) => void; store: Store; backHref: string }) {
  const counts: Record<string, number> = {
    initiatives: store.initiatives.length,
    domains: store.domains.length,
    network: store.contacts.length,
    roadmap: store.milestones.length,
    library: store.library.length,
    journal: store.journal.length,
    conference: store.sessions.length,
  };
  return (
    <aside
      className="hidden md:flex flex-col w-64 shrink-0 min-h-screen p-5 gap-1 sticky top-0"
      style={{ background: "var(--mpp-primary-dark)", color: "#F0E8DC" }}
    >
      <Link
        href={backHref}
        className="mb-5 inline-flex items-center gap-1.5 text-xs opacity-70 hover:opacity-100 transition-opacity"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Retour à la fiche Ideora
      </Link>
      <div className="mb-6">
        <div className="mpp-sub text-2xl" style={{ color: "var(--mpp-accent)" }}>
          MonPays<span style={{ color: "#fff" }}>+</span>
        </div>
        <div className="text-[11px] mt-1 opacity-70 tracking-wide uppercase">
          Observer · Construire
        </div>
      </div>

      {NAV.map(({ id, label, icon: Icon }) => {
        const active = tab === id;
        const count = counts[id];
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
            style={{
              background: active ? "rgba(212,168,83,0.16)" : "transparent",
              color: active ? "var(--mpp-accent)" : "#F0E8DC",
            }}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-left">{label}</span>
            {count != null && count > 0 && (
              <span
                className="mpp-mono text-[10px] px-1.5 py-0.5 rounded"
                style={{
                  background: active ? "var(--mpp-accent)" : "rgba(255,255,255,0.08)",
                  color: active ? "var(--mpp-primary-dark)" : "#F0E8DC",
                }}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}

      <div className="mt-auto pt-4 border-t border-white/10 text-[11px] opacity-60">
        Enregistré automatiquement dans Ideora.<br />Phase 1 — Solo.
      </div>
    </aside>
  );
}

/* ───────────────────────── Shared atoms ───────────────────────── */
export function PageHeader({
  title, subtitle, action,
}: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4 flex-wrap mb-8">
      <div>
        <h1 className="mpp-h text-3xl md:text-4xl">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-sm" style={{ color: "var(--mpp-text-2)" }}>
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  icon: Icon, title, hint, action,
}: { icon: LucideIcon; title: string; hint: string; action?: React.ReactNode }) {
  return (
    <div className="mpp-card p-12 text-center">
      <div
        className="mx-auto h-14 w-14 rounded-full grid place-items-center mb-4"
        style={{ background: "var(--mpp-accent-soft)", color: "var(--mpp-primary-dark)" }}
      >
        <Icon className="h-7 w-7" />
      </div>
      <div className="mpp-sub text-xl">{title}</div>
      <p className="mt-1 text-sm" style={{ color: "var(--mpp-text-2)" }}>{hint}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Stat({ label, value, hint }: { label: string; value: React.ReactNode; hint?: string }) {
  return (
    <div className="mpp-card p-5">
      <div className="text-[11px] uppercase tracking-wider" style={{ color: "var(--mpp-text-2)" }}>
        {label}
      </div>
      <div className="mpp-mono text-3xl mt-2" style={{ color: "var(--mpp-primary-dark)" }}>
        {value}
      </div>
      {hint && <div className="text-xs mt-1" style={{ color: "var(--mpp-text-2)" }}>{hint}</div>}
    </div>
  );
}

/** Top bar shown below the md breakpoint, where the sidebar is hidden. */
export function MobileNav({
  tab, onChange, backHref,
}: { tab: Tab; onChange: (t: Tab) => void; backHref: string }) {
  return (
    <div
      className="md:hidden sticky top-0 z-30"
      style={{ background: "var(--mpp-primary-dark)", color: "#F0E8DC" }}
    >
      <div className="flex items-center justify-between px-4 pt-3">
        <Link href={backHref} className="inline-flex items-center gap-1.5 text-xs opacity-80">
          <ArrowLeft className="h-3.5 w-3.5" /> Ideora
        </Link>
        <div className="mpp-sub text-lg" style={{ color: "var(--mpp-accent)" }}>
          MonPays<span style={{ color: "#fff" }}>+</span>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 py-2.5 [scrollbar-width:none]">
        {NAV.map(({ id, label, icon: Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-colors"
              style={{
                background: active ? "var(--mpp-accent)" : "rgba(255,255,255,0.08)",
                color: active ? "var(--mpp-primary-dark)" : "#F0E8DC",
              }}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
