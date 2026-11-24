"use client";

import Link from "next/link";
import { type LucideIcon, ArrowLeft, LayoutDashboard, Lightbulb, Layers, Users, Map, BookOpen, NotebookPen, Mic2, Search } from "lucide-react";
import type { WorkspaceStore as Store } from "@/types/workspace";
import { cn } from "@/lib/utils";

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

/* ───────────────────────── Constants & helpers ───────────────────────── */
export const NAV = [
  { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
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

/* ───────────────────────── Style tokens (scoped) ─────────────────────────
 * The workspace speaks Ideora's language: every --mpp-* token maps onto the
 * site's own theme tokens, so it follows light and dark mode like any page.
 */
export function Style() {
  return (
    <style>{`
      :root {
        --mpp-primary: hsl(var(--primary));
        --mpp-primary-light: hsl(var(--primary-glow));
        --mpp-primary-dark: hsl(var(--primary-dark));
        --mpp-accent: hsl(var(--accent));
        --mpp-accent-soft: hsl(var(--primary) / 0.12);
        --mpp-surface: hsl(var(--background));
        --mpp-surface-alt: hsl(var(--secondary));
        --mpp-text: hsl(var(--foreground));
        --mpp-text-2: hsl(var(--muted-foreground));
        --mpp-border: hsl(var(--border));
        --mpp-success: hsl(var(--success));
        --mpp-warning: hsl(var(--warning));
        --mpp-danger: hsl(var(--destructive));
      }
      .mpp-h { font-weight: 800; letter-spacing: -0.025em; color: var(--mpp-text); }
      .mpp-sub { font-weight: 700; letter-spacing: -0.015em; color: var(--mpp-text); }
      .mpp-mono { font-variant-numeric: tabular-nums; font-weight: 600; }
      .mpp-card {
        background: hsl(var(--card) / 0.75);
        backdrop-filter: blur(24px);
        border: 1px solid hsl(var(--border) / 0.6);
        border-radius: 1.25rem;
        box-shadow: var(--shadow-card);
      }
    `}</style>
  );
}

function useCounts(store: Store): Record<string, number> {
  return {
    initiatives: store.initiatives.length,
    domains: store.domains.length,
    network: store.contacts.length,
    roadmap: store.milestones.length,
    library: store.library.length,
    journal: store.journal.length,
    conference: store.sessions.length,
  };
}

function Brand({ className }: { className?: string }) {
  return (
    <span className={cn("font-extrabold tracking-tight", className)}>
      <span className="gradient-text">MonPays</span>
      <span className="text-accent">+</span>
    </span>
  );
}

/* ───────────────────────── Sidebar ───────────────────────── */
export function Sidebar({
  tab, onChange, store, backHref,
}: { tab: Tab; onChange: (t: Tab) => void; store: Store; backHref: string }) {
  const counts = useCounts(store);
  return (
    <aside className="hidden md:block w-60 shrink-0">
      <div className="glass sticky top-24 flex flex-col gap-1 rounded-3xl p-4 shadow-card">
        <Link
          href={backHref}
          className="mb-4 inline-flex items-center gap-1.5 px-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Retour à la fiche
        </Link>
        <div className="mb-5 px-2">
          <Brand className="text-2xl" />
          <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
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
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md"
                  : "text-foreground/80 hover:bg-secondary hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">{label}</span>
              {count != null && count > 0 && (
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums",
                    active ? "bg-white/25 text-primary-foreground" : "bg-primary/10 text-primary",
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}

        <div className="mt-4 border-t border-border/60 px-2 pt-4 text-[11px] leading-relaxed text-muted-foreground">
          Enregistré automatiquement dans Ideora.
        </div>
      </div>
    </aside>
  );
}

/* ───────────────────────── Shared atoms ───────────────────────── */
export function PageHeader({
  title, subtitle, action,
}: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{title}</h1>
        {subtitle && <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  icon: Icon, title, hint, action,
}: { icon: LucideIcon; title: string; hint: string; action?: React.ReactNode }) {
  return (
    <div className="mpp-card relative overflow-hidden p-10 text-center md:p-12">
      <div aria-hidden="true" className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
      <div
        className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl text-white shadow-glow"
        style={{ backgroundImage: "var(--gradient-primary)" }}
      >
        <Icon className="h-6 w-6" />
      </div>
      <div className="text-xl font-bold">{title}</div>
      <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">{hint}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function Stat({ label, value, hint }: { label: string; value: React.ReactNode; hint?: string }) {
  return (
    <div className="mpp-card p-5">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="gradient-text mt-2 text-3xl font-extrabold tabular-nums">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

/** Pill navigation shown below the md breakpoint, where the sidebar is hidden. */
export function MobileNav({
  tab, onChange, backHref,
}: { tab: Tab; onChange: (t: Tab) => void; backHref: string }) {
  return (
    <div className="md:hidden mb-6">
      <div className="mb-3 flex items-center justify-between">
        <Link href={backHref} className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Retour à la fiche
        </Link>
        <Brand className="text-lg" />
      </div>
      <nav className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
        {NAV.map(({ id, label, icon: Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium transition-colors",
                active
                  ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md"
                  : "glass text-foreground/80",
              )}
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
