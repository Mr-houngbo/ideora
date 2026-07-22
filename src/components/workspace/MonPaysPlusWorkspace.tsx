"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Lightbulb, Layers, Users, Map, BookOpen, NotebookPen,
  Mic2, Search, Plus, Trash2, Edit3, X, ExternalLink, Filter, Download,
  TrendingUp, Globe2, Star, CheckCircle2, Circle, Clock, AlertCircle,
  Pin, PinOff, ChevronRight, Save, Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { updateProjectWorkspace } from "@/actions/workspace";
import type {
  WorkspaceStore as Store,
  WorkspaceId as ID,
  Domain,
  Initiative,
  Contact,
  Milestone,
  WorkspaceTask as Task,
  LibraryItem,
  JournalEntry,
  ConferenceSession,
} from "@/types/workspace";

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

/* ───────────────────────── Constants & helpers ───────────────────────── */
const NAV = [
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
type Tab = typeof NAV[number]["id"];

const costLabel = { low: "Faible", medium: "Moyen", high: "Élevé", very_high: "Très élevé" } as const;
const statusLabel = { draft: "Brouillon", documented: "Documenté", analyzed: "Analysé", proposed: "Proposé" } as const;
const relLabel = { identified: "Identifié", contacted: "Contacté", connected: "Connecté", collaborator: "Collaborateur", speaker: "Intervenant" } as const;
const milestoneStatusLabel = { planned: "Planifié", in_progress: "En cours", completed: "Terminé", delayed: "Retardé" } as const;

const fmt = (t: number) => new Date(t).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

/* ───────────────────────── Page ───────────────────────── */
interface MonPaysPlusWorkspaceProps {
  projectId: string;
  initialStore: Store;
}

export default function MonPaysPlusWorkspace({ projectId, initialStore }: MonPaysPlusWorkspaceProps) {
  const [store, setStore] = useState<Store>(initialStore);
  const [tab, setTab] = useState<Tab>("dashboard");
  const isFirstRender = useRef(true);

  // Skip the very first run — `store` at that point is exactly what the
  // server just sent us, so persisting it back would be a wasted round-trip.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    updateProjectWorkspace(projectId, store).catch(() => {
      toast.error("Erreur", { description: "Impossible de sauvegarder l'espace de travail." });
    });
  }, [store, projectId]);
  useEffect(() => {
    document.title = "MonPays+ — Observer le monde. Construire le Bénin.";
  }, []);

  const update = <K extends keyof Store>(key: K, value: Store[K]) =>
    setStore((s) => ({ ...s, [key]: value }));

  return (
    <div className="min-h-screen" style={{ background: "var(--mpp-surface)" }}>
      <Style />
      <div className="flex">
        <Sidebar tab={tab} onChange={setTab} store={store} />
        <main className="flex-1 min-h-screen p-6 md:p-10 lg:pl-12 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {tab === "dashboard" && <DashboardView store={store} onJump={setTab} />}
              {tab === "initiatives" && (
                <InitiativesView
                  store={store}
                  onChange={(v) => update("initiatives", v)}
                />
              )}
              {tab === "domains" && (
                <DomainsView store={store} onChange={(v) => update("domains", v)} />
              )}
              {tab === "network" && (
                <NetworkView store={store} onChange={(v) => update("contacts", v)} />
              )}
              {tab === "roadmap" && (
                <RoadmapView
                  store={store}
                  onChangeM={(v) => update("milestones", v)}
                  onChangeT={(v) => update("tasks", v)}
                />
              )}
              {tab === "library" && (
                <LibraryView store={store} onChange={(v) => update("library", v)} />
              )}
              {tab === "journal" && (
                <JournalView store={store} onChange={(v) => update("journal", v)} />
              )}
              {tab === "conference" && (
                <ConferenceView store={store} onChange={(v) => update("sessions", v)} />
              )}
              {tab === "search" && <SearchView store={store} onJump={setTab} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

/* ───────────────────────── Style tokens (scoped) ───────────────────────── */
function Style() {
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
function Sidebar({
  tab, onChange, store,
}: { tab: Tab; onChange: (t: Tab) => void; store: Store }) {
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
        Données stockées localement.<br />Phase 1 — Solo.
      </div>
    </aside>
  );
}

/* ───────────────────────── Shared atoms ───────────────────────── */
function PageHeader({
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

function EmptyState({
  icon: Icon, title, hint, action,
}: { icon: any; title: string; hint: string; action?: React.ReactNode }) {
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

function Stat({ label, value, hint }: { label: string; value: React.ReactNode; hint?: string }) {
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

/* ───────────────────────── Dashboard ───────────────────────── */
function DashboardView({ store, onJump }: { store: Store; onJump: (t: Tab) => void }) {
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

/* ───────────────────────── Initiatives ───────────────────────── */
function InitiativesView({
  store, onChange,
}: { store: Store; onChange: (v: Initiative[]) => void }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Initiative | null>(null);
  const [filterDomain, setFilterDomain] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return store.initiatives.filter((i) => {
      if (filterDomain !== "all" && i.domainId !== filterDomain) return false;
      if (filterStatus !== "all" && i.status !== filterStatus) return false;
      if (q && !(i.title + " " + i.country + " " + i.description)
        .toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    }).sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.createdAt - a.createdAt);
  }, [store.initiatives, filterDomain, filterStatus, q]);

  const save = (data: Initiative) => {
    const exists = store.initiatives.some((i) => i.id === data.id);
    onChange(exists
      ? store.initiatives.map((i) => i.id === data.id ? data : i)
      : [data, ...store.initiatives]);
    toast.success(exists ? "Initiative mise à jour" : "Initiative ajoutée");
    setOpen(false); setEditing(null);
  };

  const remove = (id: ID) => {
    onChange(store.initiatives.filter((i) => i.id !== id));
    toast.success("Supprimée");
  };

  const togglePin = (id: ID) => {
    onChange(store.initiatives.map((i) => i.id === id ? { ...i, pinned: !i.pinned } : i));
  };

  return (
    <>
      <PageHeader
        title="Initiatives"
        subtitle="Le cœur du produit. Chaque fiche = une idée observée ailleurs, à adapter."
        action={
          <Button
            onClick={() => { setEditing(null); setOpen(true); }}
            style={{ background: "var(--mpp-primary)" }}
          >
            <Plus className="h-4 w-4 mr-1" /> Nouvelle initiative
          </Button>
        }
      />

      <div className="mpp-card p-4 mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--mpp-text-2)]" />
          <Input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher (titre, pays, description)…"
            className="pl-9"
          />
        </div>
        <Select value={filterDomain} onValueChange={setFilterDomain}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les domaines</SelectItem>
            {store.domains.map((d) => (
              <SelectItem key={d.id} value={d.id}>{d.icon} {d.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous statuts</SelectItem>
            {Object.entries(statusLabel).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Lightbulb}
          title="Aucune initiative"
          hint="Commence par en saisir une — un programme, une réforme, une idée vue ailleurs."
          action={<Button onClick={() => { setEditing(null); setOpen(true); }} style={{ background: "var(--mpp-primary)" }}>
            <Plus className="h-4 w-4 mr-1" /> Ajouter
          </Button>}
        />
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((i) => {
            const domain = store.domains.find((d) => d.id === i.domainId);
            return (
              <motion.div
                key={i.id} layout
                className="mpp-card p-5 flex flex-col"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 text-xs">
                    {domain && (
                      <span
                        className="px-2 py-0.5 rounded"
                        style={{ background: domain.color + "1a", color: domain.color }}
                      >
                        {domain.icon} {domain.name}
                      </span>
                    )}
                    {i.country && (
                      <span className="mpp-mono text-[10px]" style={{ color: "var(--mpp-text-2)" }}>
                        {i.countryCode || ""} {i.country}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => togglePin(i.id)} className="p-1.5 hover:bg-[var(--mpp-surface-alt)] rounded">
                      {i.pinned ? <Pin className="h-3.5 w-3.5" style={{ color: "var(--mpp-accent)" }} /> : <PinOff className="h-3.5 w-3.5 text-[var(--mpp-text-2)]" />}
                    </button>
                  </div>
                </div>

                <div className="mpp-sub text-lg leading-snug" style={{ color: "var(--mpp-text)" }}>
                  {i.title}
                </div>
                <p className="text-sm mt-2 line-clamp-3" style={{ color: "var(--mpp-text-2)" }}>
                  {i.description || "Aucune description."}
                </p>

                <div className="mt-3">
                  <div className="flex items-center justify-between text-[11px] mb-1" style={{ color: "var(--mpp-text-2)" }}>
                    <span>Faisabilité Bénin</span>
                    <span className="mpp-mono">{i.feasibility}/10</span>
                  </div>
                  <Progress value={i.feasibility * 10} className="h-1.5" />
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--mpp-border)]">
                  <div className="flex items-center gap-2 text-[11px]" style={{ color: "var(--mpp-text-2)" }}>
                    <Badge variant="outline" className="text-[10px]">{statusLabel[i.status]}</Badge>
                    <span>· Coût {costLabel[i.cost]}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => { setEditing(i); setOpen(true); }} className="p-1.5 hover:bg-[var(--mpp-surface-alt)] rounded">
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => remove(i.id)} className="p-1.5 hover:bg-[var(--mpp-surface-alt)] rounded">
                      <Trash2 className="h-3.5 w-3.5 text-[var(--mpp-danger)]" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <InitiativeDialog
        open={open}
        onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}
        initial={editing}
        domains={store.domains}
        onSave={save}
      />
    </>
  );
}

function InitiativeDialog({
  open, onOpenChange, initial, domains, onSave,
}: {
  open: boolean; onOpenChange: (v: boolean) => void;
  initial: Initiative | null; domains: Domain[];
  onSave: (i: Initiative) => void;
}) {
  const blank: Initiative = {
    id: uid(), title: "", domainId: domains[0]?.id || "", country: "", countryCode: "",
    description: "", mechanism: "", conditions: "", obstacles: "",
    feasibility: 5, adaptation: "", cost: "medium", timelineYears: 3,
    status: "draft", pinned: false, sources: [], tags: [], createdAt: Date.now(),
  };
  const [data, setData] = useState<Initiative>(initial || blank);
  useEffect(() => { setData(initial || { ...blank, id: uid(), createdAt: Date.now() }); /* eslint-disable-line */ }, [initial, open]);

  const set = <K extends keyof Initiative>(k: K, v: Initiative[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="mpp-sub text-2xl">
            {initial ? "Modifier l'initiative" : "Nouvelle initiative"}
          </DialogTitle>
          <DialogDescription>
            Documente précisément. Le détail aujourd'hui = la crédibilité demain.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div>
            <Label>Titre *</Label>
            <Input value={data.title} onChange={(e) => set("title", e.target.value)}
              placeholder="ex: Méthode finlandaise d'évaluation des enseignants" />
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            <div>
              <Label>Domaine</Label>
              <Select value={data.domainId} onValueChange={(v) => set("domainId", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {domains.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.icon} {d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Pays d'origine</Label>
              <Input value={data.country} onChange={(e) => set("country", e.target.value)}
                placeholder="ex: Finlande" />
            </div>
            <div>
              <Label>Code ISO</Label>
              <Input value={data.countryCode} onChange={(e) => set("countryCode", e.target.value.toUpperCase().slice(0,2))}
                placeholder="FI" className="mpp-mono uppercase" />
            </div>
          </div>

          <div>
            <Label>Description / résumé</Label>
            <Textarea rows={3} value={data.description} onChange={(e) => set("description", e.target.value)} />
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <Label>Mécanisme clé du succès</Label>
              <Textarea rows={3} value={data.mechanism} onChange={(e) => set("mechanism", e.target.value)}
                placeholder="Qu'est-ce qui fait que ça marche ?" />
            </div>
            <div>
              <Label>Conditions de réussite</Label>
              <Textarea rows={3} value={data.conditions} onChange={(e) => set("conditions", e.target.value)}
                placeholder="Contexte, prérequis…" />
            </div>
          </div>

          <div>
            <Label>Obstacles rencontrés</Label>
            <Textarea rows={2} value={data.obstacles} onChange={(e) => set("obstacles", e.target.value)} />
          </div>

          <div>
            <Label>Notes d'adaptation au Bénin</Label>
            <Textarea rows={3} value={data.adaptation} onChange={(e) => set("adaptation", e.target.value)}
              placeholder="Qu'est-ce qu'il faut changer pour notre contexte ?" />
          </div>

          <div className="grid md:grid-cols-4 gap-3">
            <div>
              <Label>Faisabilité ({data.feasibility}/10)</Label>
              <input type="range" min={1} max={10} value={data.feasibility}
                onChange={(e) => set("feasibility", Number(e.target.value))}
                className="w-full accent-[var(--mpp-primary)]" />
            </div>
            <div>
              <Label>Coût estimé</Label>
              <Select value={data.cost} onValueChange={(v: any) => set("cost", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(costLabel).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Durée (années)</Label>
              <Input type="number" min={1} max={20}
                value={data.timelineYears}
                onChange={(e) => set("timelineYears", Number(e.target.value))} />
            </div>
            <div>
              <Label>Statut</Label>
              <Select value={data.status} onValueChange={(v: any) => set("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(statusLabel).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="flex items-center justify-between">
              <span>Sources</span>
              <button
                type="button"
                onClick={() => set("sources", [...data.sources, { url: "", title: "" }])}
                className="text-xs underline" style={{ color: "var(--mpp-primary)" }}
              >+ ajouter une source</button>
            </Label>
            <div className="space-y-2 mt-1">
              {data.sources.map((s, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input value={s.title} onChange={(e) => {
                    const arr = [...data.sources]; arr[idx] = { ...s, title: e.target.value };
                    set("sources", arr);
                  }} placeholder="Titre" className="flex-1" />
                  <Input value={s.url} onChange={(e) => {
                    const arr = [...data.sources]; arr[idx] = { ...s, url: e.target.value };
                    set("sources", arr);
                  }} placeholder="https://…" className="flex-1" />
                  <Button variant="ghost" size="icon" onClick={() =>
                    set("sources", data.sources.filter((_, i) => i !== idx))
                  }><X className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Tags (séparés par virgule)</Label>
            <Input value={data.tags.join(", ")}
              onChange={(e) => set("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
              placeholder="réforme, public, scalable" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button
            onClick={() => {
              if (!data.title.trim()) { toast.error("Le titre est requis"); return; }
              onSave(data);
            }}
            style={{ background: "var(--mpp-primary)" }}
          >
            <Save className="h-4 w-4 mr-1" /> Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ───────────────────────── Domaines ───────────────────────── */
function DomainsView({
  store, onChange,
}: { store: Store; onChange: (v: Domain[]) => void }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Domain | null>(null);

  const save = (d: Domain) => {
    const exists = store.domains.some((x) => x.id === d.id);
    onChange(exists ? store.domains.map((x) => x.id === d.id ? d : x) : [...store.domains, d]);
    toast.success("Domaine enregistré");
    setOpen(false); setEditing(null);
  };
  const remove = (id: ID) => {
    onChange(store.domains.filter((d) => d.id !== id));
    toast.success("Domaine supprimé");
  };

  return (
    <>
      <PageHeader
        title="Domaines"
        subtitle="Les secteurs sur lesquels tu observes et tu construis."
        action={
          <Button onClick={() => { setEditing(null); setOpen(true); }}
            style={{ background: "var(--mpp-primary)" }}>
            <Plus className="h-4 w-4 mr-1" /> Nouveau domaine
          </Button>
        }
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {store.domains.sort((a,b)=>a.priority-b.priority).map((d) => {
          const count = store.initiatives.filter((i) => i.domainId === d.id).length;
          const gap = count < 5;
          return (
            <div key={d.id} className="mpp-card p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{d.icon}</div>
                  <div>
                    <div className="mpp-sub text-xl" style={{ color: d.color }}>{d.name}</div>
                    <div className="mpp-mono text-[10px] uppercase" style={{ color: "var(--mpp-text-2)" }}>
                      Priorité {d.priority}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditing(d); setOpen(true); }} className="p-1.5 hover:bg-[var(--mpp-surface-alt)] rounded">
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => remove(d.id)} className="p-1.5 hover:bg-[var(--mpp-surface-alt)] rounded">
                    <Trash2 className="h-3.5 w-3.5 text-[var(--mpp-danger)]" />
                  </button>
                </div>
              </div>
              <p className="text-sm mt-3" style={{ color: "var(--mpp-text-2)" }}>{d.description}</p>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--mpp-border)]">
                <span className="mpp-mono text-xs" style={{ color: "var(--mpp-text)" }}>
                  {count} initiatives
                </span>
                {gap && (
                  <span className="flex items-center gap-1 text-[11px]" style={{ color: "var(--mpp-warning)" }}>
                    <AlertCircle className="h-3 w-3" /> Sous-documenté
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <DomainDialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}
        initial={editing} onSave={save} />
    </>
  );
}

function DomainDialog({
  open, onOpenChange, initial, onSave,
}: { open: boolean; onOpenChange: (v: boolean) => void; initial: Domain | null; onSave: (d: Domain) => void }) {
  const blank: Domain = { id: uid(), name: "", slug: "", icon: "✦", color: "#6B3A2A", description: "", priority: 99 };
  const [d, setD] = useState<Domain>(initial || blank);
  useEffect(() => { setD(initial || { ...blank, id: uid() }); /* eslint-disable-line */ }, [initial, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mpp-sub text-2xl">{initial ? "Modifier" : "Nouveau"} domaine</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Icône</Label>
              <Input value={d.icon} onChange={(e) => setD({ ...d, icon: e.target.value })} maxLength={2} />
            </div>
            <div className="col-span-2">
              <Label>Nom *</Label>
              <Input value={d.name} onChange={(e) => setD({ ...d, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} />
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea rows={2} value={d.description} onChange={(e) => setD({ ...d, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Couleur</Label>
              <Input type="color" value={d.color} onChange={(e) => setD({ ...d, color: e.target.value })} className="h-10" />
            </div>
            <div>
              <Label>Priorité</Label>
              <Input type="number" value={d.priority} onChange={(e) => setD({ ...d, priority: Number(e.target.value) })} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={() => { if (!d.name.trim()) return toast.error("Nom requis"); onSave(d); }}
            style={{ background: "var(--mpp-primary)" }}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ───────────────────────── Réseau ───────────────────────── */
function NetworkView({
  store, onChange,
}: { store: Store; onChange: (v: Contact[]) => void }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [filterRel, setFilterRel] = useState("all");

  const filtered = store.contacts.filter((c) => filterRel === "all" || c.relationship === filterRel);

  const save = (c: Contact) => {
    const exists = store.contacts.some((x) => x.id === c.id);
    onChange(exists ? store.contacts.map((x) => x.id === c.id ? c : x) : [c, ...store.contacts]);
    toast.success("Contact enregistré");
    setOpen(false); setEditing(null);
  };
  const remove = (id: ID) => onChange(store.contacts.filter((c) => c.id !== id));

  return (
    <>
      <PageHeader title="Réseau" subtitle="Les personnes qui peuvent porter, financer ou amplifier."
        action={
          <Button onClick={() => { setEditing(null); setOpen(true); }} style={{ background: "var(--mpp-primary)" }}>
            <Plus className="h-4 w-4 mr-1" /> Ajouter un contact
          </Button>
        }
      />

      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", ...Object.keys(relLabel)].map((k) => (
          <button key={k} onClick={() => setFilterRel(k)}
            className="px-3 py-1.5 rounded-full text-xs border transition"
            style={{
              background: filterRel === k ? "var(--mpp-primary)" : "transparent",
              color: filterRel === k ? "#fff" : "var(--mpp-text)",
              borderColor: "var(--mpp-border)",
            }}>
            {k === "all" ? "Tous" : relLabel[k as keyof typeof relLabel]}
            {" "}({k === "all" ? store.contacts.length : store.contacts.filter((c) => c.relationship === k).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Users} title="Aucun contact" hint="Commence à cartographier ton futur cercle." />
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <div key={c.id} className="mpp-card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="mpp-sub text-lg">{c.name}</div>
                  <div className="text-sm" style={{ color: "var(--mpp-text-2)" }}>{c.role}</div>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3 w-3"
                      fill={i < c.potential ? "var(--mpp-accent)" : "none"}
                      stroke="var(--mpp-accent)" />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 text-xs flex-wrap">
                <Badge variant="outline" className="text-[10px]">{relLabel[c.relationship]}</Badge>
                {c.country && <span style={{ color: "var(--mpp-text-2)" }}>· {c.country}</span>}
              </div>
              {c.expertise && (
                <p className="text-xs mt-2" style={{ color: "var(--mpp-text-2)" }}>{c.expertise}</p>
              )}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--mpp-border)]">
                <div className="flex gap-2 text-xs">
                  {c.linkedin && <a href={c.linkedin} target="_blank" rel="noreferrer" className="hover:underline" style={{ color: "var(--mpp-primary)" }}>LinkedIn</a>}
                  {c.email && <a href={`mailto:${c.email}`} className="hover:underline" style={{ color: "var(--mpp-primary)" }}>Email</a>}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditing(c); setOpen(true); }} className="p-1.5 hover:bg-[var(--mpp-surface-alt)] rounded">
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => remove(c.id)} className="p-1.5 hover:bg-[var(--mpp-surface-alt)] rounded">
                    <Trash2 className="h-3.5 w-3.5 text-[var(--mpp-danger)]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ContactDialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}
        initial={editing} onSave={save} />
    </>
  );
}

function ContactDialog({
  open, onOpenChange, initial, onSave,
}: { open: boolean; onOpenChange: (v: boolean) => void; initial: Contact | null; onSave: (c: Contact) => void }) {
  const blank: Contact = {
    id: uid(), name: "", role: "", expertise: "", country: "",
    email: "", linkedin: "", relationship: "identified", potential: 3, notes: "", createdAt: Date.now(),
  };
  const [c, setC] = useState<Contact>(initial || blank);
  useEffect(() => { setC(initial || { ...blank, id: uid(), createdAt: Date.now() }); /* eslint-disable-line */ }, [initial, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="mpp-sub text-2xl">{initial ? "Modifier" : "Nouveau"} contact</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Nom complet *</Label><Input value={c.name} onChange={(e) => setC({ ...c, name: e.target.value })} /></div>
            <div><Label>Rôle / Titre</Label><Input value={c.role} onChange={(e) => setC({ ...c, role: e.target.value })} /></div>
          </div>
          <div><Label>Expertise</Label><Input value={c.expertise} onChange={(e) => setC({ ...c, expertise: e.target.value })} placeholder="économie, éducation…" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Pays</Label><Input value={c.country} onChange={(e) => setC({ ...c, country: e.target.value })} /></div>
            <div>
              <Label>Relation</Label>
              <Select value={c.relationship} onValueChange={(v: any) => setC({ ...c, relationship: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(relLabel).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Email</Label><Input type="email" value={c.email} onChange={(e) => setC({ ...c, email: e.target.value })} /></div>
            <div><Label>LinkedIn</Label><Input value={c.linkedin} onChange={(e) => setC({ ...c, linkedin: e.target.value })} /></div>
          </div>
          <div>
            <Label>Potentiel ({c.potential}/5)</Label>
            <input type="range" min={1} max={5} value={c.potential}
              onChange={(e) => setC({ ...c, potential: Number(e.target.value) })}
              className="w-full accent-[var(--mpp-accent)]" />
          </div>
          <div><Label>Notes</Label><Textarea rows={3} value={c.notes} onChange={(e) => setC({ ...c, notes: e.target.value })} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={() => { if (!c.name.trim()) return toast.error("Nom requis"); onSave(c); }}
            style={{ background: "var(--mpp-primary)" }}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ───────────────────────── Roadmap ───────────────────────── */
function RoadmapView({
  store, onChangeM, onChangeT,
}: {
  store: Store;
  onChangeM: (v: Milestone[]) => void;
  onChangeT: (v: Task[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Milestone | null>(null);

  const grouped = useMemo(() => {
    const byYear: Record<number, Milestone[]> = {};
    [1, 2, 3, 4, 5].forEach((y) => byYear[y] = []);
    store.milestones.forEach((m) => {
      if (!byYear[m.year]) byYear[m.year] = [];
      byYear[m.year].push(m);
    });
    Object.values(byYear).forEach((arr) => arr.sort((a, b) => a.quarter - b.quarter));
    return byYear;
  }, [store.milestones]);

  const total = store.milestones.length;
  const done = store.milestones.filter((m) => m.status === "completed").length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const save = (m: Milestone) => {
    const exists = store.milestones.some((x) => x.id === m.id);
    onChangeM(exists ? store.milestones.map((x) => x.id === m.id ? m : x) : [...store.milestones, m]);
    toast.success("Jalon enregistré");
    setOpen(false); setEditing(null);
  };
  const removeM = (id: ID) => {
    onChangeM(store.milestones.filter((m) => m.id !== id));
    onChangeT(store.tasks.filter((t) => t.milestoneId !== id));
  };

  const addTask = (milestoneId: ID, title: string) => {
    if (!title.trim()) return;
    onChangeT([...store.tasks, { id: uid(), milestoneId, title, status: "todo", dueDate: "" }]);
  };
  const cycleTask = (id: ID) => {
    const next = { todo: "in_progress", in_progress: "done", done: "todo" } as const;
    onChangeT(store.tasks.map((t) => t.id === id ? { ...t, status: next[t.status] } : t));
  };
  const removeTask = (id: ID) => onChangeT(store.tasks.filter((t) => t.id !== id));

  return (
    <>
      <PageHeader title="Roadmap" subtitle="5 ans. 4 trimestres. Une trajectoire claire."
        action={
          <Button onClick={() => { setEditing(null); setOpen(true); }} style={{ background: "var(--mpp-primary)" }}>
            <Plus className="h-4 w-4 mr-1" /> Nouveau jalon
          </Button>
        }
      />

      <div className="mpp-card p-5 mb-8">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="mpp-sub text-base">Progression globale</span>
          <span className="mpp-mono">{done}/{total} ({pct}%)</span>
        </div>
        <Progress value={pct} className="h-2" />
      </div>

      <div className="space-y-8">
        {[1, 2, 3, 4, 5].map((year) => (
          <div key={year}>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="mpp-mono text-xs px-3 py-1.5 rounded-full"
                style={{ background: "var(--mpp-primary-dark)", color: "var(--mpp-accent)" }}
              >
                ANNÉE {year}
              </div>
              <div className="flex-1 h-px" style={{ background: "var(--mpp-border)" }} />
            </div>

            {grouped[year].length === 0 ? (
              <p className="text-sm italic pl-2" style={{ color: "var(--mpp-text-2)" }}>
                Aucun jalon — ajoute-en un.
              </p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {grouped[year].map((m) => {
                  const tasks = store.tasks.filter((t) => t.milestoneId === m.id);
                  const tDone = tasks.filter((t) => t.status === "done").length;
                  return (
                    <div key={m.id} className="mpp-card p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="mpp-mono text-[10px] px-1.5 py-0.5 rounded"
                              style={{ background: "var(--mpp-accent-soft)", color: "var(--mpp-primary-dark)" }}>
                              T{m.quarter || 1}
                            </span>
                            <Badge variant="outline" className="text-[10px]">{milestoneStatusLabel[m.status]}</Badge>
                          </div>
                          <div className="mpp-sub text-lg mt-1">{m.title}</div>
                          {m.description && (
                            <p className="text-sm mt-1" style={{ color: "var(--mpp-text-2)" }}>{m.description}</p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => { setEditing(m); setOpen(true); }} className="p-1.5 hover:bg-[var(--mpp-surface-alt)] rounded">
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => removeM(m.id)} className="p-1.5 hover:bg-[var(--mpp-surface-alt)] rounded">
                            <Trash2 className="h-3.5 w-3.5 text-[var(--mpp-danger)]" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[var(--mpp-border)]">
                        <div className="text-[11px] uppercase tracking-wider mb-2" style={{ color: "var(--mpp-text-2)" }}>
                          Tâches ({tDone}/{tasks.length})
                        </div>
                        <ul className="space-y-1.5">
                          {tasks.map((t) => (
                            <li key={t.id} className="flex items-center gap-2 group">
                              <button onClick={() => cycleTask(t.id)}>
                                {t.status === "done" ? <CheckCircle2 className="h-4 w-4 text-[var(--mpp-success)]" /> :
                                  t.status === "in_progress" ? <Clock className="h-4 w-4 text-[var(--mpp-warning)]" /> :
                                  <Circle className="h-4 w-4 text-[var(--mpp-text-2)]" />}
                              </button>
                              <span className={"text-sm flex-1 " + (t.status === "done" ? "line-through opacity-60" : "")}
                                style={{ color: "var(--mpp-text)" }}>{t.title}</span>
                              <button onClick={() => removeTask(t.id)} className="opacity-0 group-hover:opacity-100">
                                <X className="h-3 w-3 text-[var(--mpp-text-2)]" />
                              </button>
                            </li>
                          ))}
                        </ul>
                        <AddTaskInline onAdd={(t) => addTask(m.id, t)} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      <MilestoneDialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}
        initial={editing} onSave={save} />
    </>
  );
}

function AddTaskInline({ onAdd }: { onAdd: (t: string) => void }) {
  const [v, setV] = useState("");
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onAdd(v); setV(""); }}
      className="flex gap-2 mt-2"
    >
      <Input value={v} onChange={(e) => setV(e.target.value)}
        placeholder="+ Ajouter une tâche…" className="h-8 text-sm" />
    </form>
  );
}

function MilestoneDialog({
  open, onOpenChange, initial, onSave,
}: { open: boolean; onOpenChange: (v: boolean) => void; initial: Milestone | null; onSave: (m: Milestone) => void }) {
  const blank: Milestone = { id: uid(), title: "", description: "", year: 1, quarter: 1, status: "planned" };
  const [m, setM] = useState<Milestone>(initial || blank);
  useEffect(() => { setM(initial || { ...blank, id: uid() }); /* eslint-disable-line */ }, [initial, open]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mpp-sub text-2xl">{initial ? "Modifier" : "Nouveau"} jalon</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div><Label>Titre *</Label><Input value={m.title} onChange={(e) => setM({ ...m, title: e.target.value })} /></div>
          <div><Label>Description</Label><Textarea rows={2} value={m.description} onChange={(e) => setM({ ...m, description: e.target.value })} /></div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Année</Label>
              <Select value={String(m.year)} onValueChange={(v) => setM({ ...m, year: Number(v) })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5].map((y) => <SelectItem key={y} value={String(y)}>An {y}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Trimestre</Label>
              <Select value={String(m.quarter)} onValueChange={(v) => setM({ ...m, quarter: Number(v) })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[1,2,3,4].map((q) => <SelectItem key={q} value={String(q)}>T{q}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Statut</Label>
              <Select value={m.status} onValueChange={(v: any) => setM({ ...m, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(milestoneStatusLabel).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={() => { if (!m.title.trim()) return toast.error("Titre requis"); onSave(m); }}
            style={{ background: "var(--mpp-primary)" }}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ───────────────────────── Bibliothèque ───────────────────────── */
function LibraryView({ store, onChange }: { store: Store; onChange: (v: LibraryItem[]) => void }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<LibraryItem | null>(null);
  const [filter, setFilter] = useState<"all" | "read" | "unread">("all");

  const items = store.library.filter((x) =>
    filter === "all" ? true : filter === "read" ? x.isRead : !x.isRead
  );

  const save = (x: LibraryItem) => {
    const exists = store.library.some((y) => y.id === x.id);
    onChange(exists ? store.library.map((y) => y.id === x.id ? x : y) : [x, ...store.library]);
    toast.success("Ressource enregistrée");
    setOpen(false); setEditing(null);
  };
  const toggleRead = (id: ID) =>
    onChange(store.library.map((x) => x.id === id ? { ...x, isRead: !x.isRead } : x));
  const remove = (id: ID) => onChange(store.library.filter((x) => x.id !== id));

  return (
    <>
      <PageHeader title="Bibliothèque" subtitle="Tout ce que tu lis, écoutes, regardes — et ce que tu en retiens."
        action={
          <Button onClick={() => { setEditing(null); setOpen(true); }} style={{ background: "var(--mpp-primary)" }}>
            <Plus className="h-4 w-4 mr-1" /> Nouvelle ressource
          </Button>
        }
      />

      <div className="flex gap-2 mb-6">
        {(["all", "unread", "read"] as const).map((k) => (
          <button key={k} onClick={() => setFilter(k)}
            className="px-3 py-1.5 rounded-full text-xs border"
            style={{
              background: filter === k ? "var(--mpp-primary)" : "transparent",
              color: filter === k ? "#fff" : "var(--mpp-text)",
              borderColor: "var(--mpp-border)",
            }}>
            {k === "all" ? "Tout" : k === "read" ? "Lu" : "Non lu"}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <EmptyState icon={BookOpen} title="Bibliothèque vide" hint="Ajoute ton premier livre, rapport ou podcast." />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((x) => {
            const domain = store.domains.find((d) => d.id === x.domainId);
            return (
              <div key={x.id} className="mpp-card p-5 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="mpp-sub text-base leading-snug">{x.title}</div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--mpp-text-2)" }}>
                      {x.author || "—"} · <span className="capitalize">{x.type}</span>
                    </div>
                  </div>
                  <button onClick={() => toggleRead(x.id)}>
                    {x.isRead ? <CheckCircle2 className="h-5 w-5 text-[var(--mpp-success)]" /> : <Circle className="h-5 w-5 text-[var(--mpp-text-2)]" />}
                  </button>
                </div>
                {domain && (
                  <div className="text-xs mt-2">
                    <span className="px-2 py-0.5 rounded" style={{ background: domain.color + "1a", color: domain.color }}>
                      {domain.icon} {domain.name}
                    </span>
                  </div>
                )}
                {x.lessons && (
                  <p className="text-sm mt-3 italic line-clamp-3" style={{ color: "var(--mpp-text-2)" }}>
                    « {x.lessons} »
                  </p>
                )}
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-[var(--mpp-border)]">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3 w-3"
                        fill={i < x.rating ? "var(--mpp-accent)" : "none"}
                        stroke="var(--mpp-accent)" />
                    ))}
                  </div>
                  <div className="flex gap-1">
                    {x.url && (
                      <a href={x.url} target="_blank" rel="noreferrer" className="p-1.5 hover:bg-[var(--mpp-surface-alt)] rounded">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                    <button onClick={() => { setEditing(x); setOpen(true); }} className="p-1.5 hover:bg-[var(--mpp-surface-alt)] rounded">
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => remove(x.id)} className="p-1.5 hover:bg-[var(--mpp-surface-alt)] rounded">
                      <Trash2 className="h-3.5 w-3.5 text-[var(--mpp-danger)]" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <LibraryDialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}
        initial={editing} domains={store.domains} onSave={save} />
    </>
  );
}

function LibraryDialog({
  open, onOpenChange, initial, domains, onSave,
}: { open: boolean; onOpenChange: (v: boolean) => void; initial: LibraryItem | null; domains: Domain[]; onSave: (x: LibraryItem) => void }) {
  const blank: LibraryItem = {
    id: uid(), title: "", author: "", type: "book", domainId: domains[0]?.id || "",
    url: "", summary: "", lessons: "", rating: 0, isRead: false, createdAt: Date.now(),
  };
  const [x, setX] = useState<LibraryItem>(initial || blank);
  useEffect(() => { setX(initial || { ...blank, id: uid(), createdAt: Date.now() }); /* eslint-disable-line */ }, [initial, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="mpp-sub text-2xl">{initial ? "Modifier" : "Nouvelle"} ressource</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div><Label>Titre *</Label><Input value={x.title} onChange={(e) => setX({ ...x, title: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Auteur</Label><Input value={x.author} onChange={(e) => setX({ ...x, author: e.target.value })} /></div>
            <div>
              <Label>Type</Label>
              <Select value={x.type} onValueChange={(v: any) => setX({ ...x, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["book","article","report","video","podcast","documentary","other"].map((t) =>
                    <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Domaine</Label>
              <Select value={x.domainId} onValueChange={(v) => setX({ ...x, domainId: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {domains.map((d) => <SelectItem key={d.id} value={d.id}>{d.icon} {d.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>URL</Label><Input value={x.url} onChange={(e) => setX({ ...x, url: e.target.value })} /></div>
          </div>
          <div><Label>Résumé</Label><Textarea rows={2} value={x.summary} onChange={(e) => setX({ ...x, summary: e.target.value })} /></div>
          <div><Label>Leçons applicables au Bénin</Label><Textarea rows={3} value={x.lessons} onChange={(e) => setX({ ...x, lessons: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3 items-end">
            <div>
              <Label>Note ({x.rating}/5)</Label>
              <input type="range" min={0} max={5} value={x.rating}
                onChange={(e) => setX({ ...x, rating: Number(e.target.value) })}
                className="w-full accent-[var(--mpp-accent)]" />
            </div>
            <div className="flex items-center gap-2 pb-2">
              <input type="checkbox" id="isread" checked={x.isRead} onChange={(e) => setX({ ...x, isRead: e.target.checked })} />
              <Label htmlFor="isread">Marquer comme lu</Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={() => { if (!x.title.trim()) return toast.error("Titre requis"); onSave(x); }}
            style={{ background: "var(--mpp-primary)" }}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ───────────────────────── Journal ───────────────────────── */
function JournalView({ store, onChange }: { store: Store; onChange: (v: JournalEntry[]) => void }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<JournalEntry | null>(null);
  const [q, setQ] = useState("");

  const entries = store.journal
    .filter((e) => !q || (e.title + " " + e.content).toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => b.createdAt - a.createdAt);

  const save = (e: JournalEntry) => {
    const exists = store.journal.some((x) => x.id === e.id);
    onChange(exists ? store.journal.map((x) => x.id === e.id ? e : x) : [e, ...store.journal]);
    toast.success("Entrée enregistrée");
    setOpen(false); setEditing(null);
  };
  const remove = (id: ID) => onChange(store.journal.filter((e) => e.id !== id));

  const moodColor = {
    motivated: "var(--mpp-accent)", reflective: "var(--mpp-primary-light)",
    doubtful: "var(--mpp-warning)", energized: "var(--mpp-success)", focused: "var(--mpp-primary-dark)",
  } as const;

  return (
    <>
      <PageHeader title="Journal stratégique" subtitle="Tes réflexions, doutes, décisions. À relire dans 5 ans."
        action={
          <Button onClick={() => { setEditing(null); setOpen(true); }} style={{ background: "var(--mpp-primary)" }}>
            <Plus className="h-4 w-4 mr-1" /> Nouvelle entrée
          </Button>
        }
      />

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--mpp-text-2)]" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher dans le journal…" className="pl-9" />
      </div>

      {entries.length === 0 ? (
        <EmptyState icon={NotebookPen} title="Journal vide" hint="Commence par noter ta première intuition." />
      ) : (
        <div className="space-y-4">
          {entries.map((e) => (
            <div key={e.id} className="mpp-card p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs" style={{ color: "var(--mpp-text-2)" }}>
                    <span>{fmt(e.createdAt)}</span>
                    <span className="px-2 py-0.5 rounded mpp-mono text-[10px] uppercase"
                      style={{ background: moodColor[e.mood] + "26", color: moodColor[e.mood] }}>
                      {e.mood}
                    </span>
                  </div>
                  {e.title && <div className="mpp-sub text-xl mt-1">{e.title}</div>}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditing(e); setOpen(true); }} className="p-1.5 hover:bg-[var(--mpp-surface-alt)] rounded">
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => remove(e.id)} className="p-1.5 hover:bg-[var(--mpp-surface-alt)] rounded">
                    <Trash2 className="h-3.5 w-3.5 text-[var(--mpp-danger)]" />
                  </button>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed" style={{ color: "var(--mpp-text)" }}>
                {e.content}
              </p>
              {e.tags && (
                <div className="flex gap-1 mt-3 flex-wrap">
                  {e.tags.split(",").filter((t) => t.trim()).map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded" style={{ background: "var(--mpp-surface-alt)", color: "var(--mpp-text-2)" }}>
                      #{t.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <JournalDialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}
        initial={editing} onSave={save} />
    </>
  );
}

function JournalDialog({
  open, onOpenChange, initial, onSave,
}: { open: boolean; onOpenChange: (v: boolean) => void; initial: JournalEntry | null; onSave: (e: JournalEntry) => void }) {
  const blank: JournalEntry = {
    id: uid(), title: "", content: "", mood: "reflective", tags: "", createdAt: Date.now(),
  };
  const [e, setE] = useState<JournalEntry>(initial || blank);
  useEffect(() => { setE(initial || { ...blank, id: uid(), createdAt: Date.now() }); /* eslint-disable-line */ }, [initial, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="mpp-sub text-2xl">{initial ? "Modifier" : "Nouvelle"} entrée</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div><Label>Titre</Label><Input value={e.title} onChange={(ev) => setE({ ...e, title: ev.target.value })} /></div>
          <div>
            <Label>Humeur</Label>
            <Select value={e.mood} onValueChange={(v: any) => setE({ ...e, mood: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["motivated","reflective","doubtful","energized","focused"].map((m) =>
                  <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div><Label>Contenu</Label><Textarea rows={10} value={e.content} onChange={(ev) => setE({ ...e, content: ev.target.value })} /></div>
          <div><Label>Tags</Label><Input value={e.tags} onChange={(ev) => setE({ ...e, tags: ev.target.value })} placeholder="vision, doute, idée…" /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={() => onSave(e)} style={{ background: "var(--mpp-primary)" }}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ───────────────────────── Conférence ───────────────────────── */
function ConferenceView({ store, onChange }: { store: Store; onChange: (v: ConferenceSession[]) => void }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ConferenceSession | null>(null);

  const save = (s: ConferenceSession) => {
    const exists = store.sessions.some((x) => x.id === s.id);
    onChange(exists ? store.sessions.map((x) => x.id === s.id ? s : x) : [...store.sessions, s]);
    toast.success("Session enregistrée");
    setOpen(false); setEditing(null);
  };
  const remove = (id: ID) => onChange(store.sessions.filter((s) => s.id !== id));

  const total = store.sessions.length;
  const finalized = store.sessions.filter((s) => s.status === "finalized").length;
  const totalMin = store.sessions.reduce((a, b) => a + (b.duration || 0), 0);

  return (
    <>
      <PageHeader title="Conférence" subtitle="Le rendez-vous final. Programme, intervenants, propositions."
        action={
          <Button onClick={() => { setEditing(null); setOpen(true); }} style={{ background: "var(--mpp-primary)" }}>
            <Plus className="h-4 w-4 mr-1" /> Nouvelle session
          </Button>
        }
      />

      <div className="grid grid-cols-3 gap-4 mb-8">
        <Stat label="Sessions" value={total} />
        <Stat label="Finalisées" value={`${finalized}/${total}`} />
        <Stat label="Durée totale" value={`${Math.floor(totalMin/60)}h${(totalMin%60).toString().padStart(2,"0")}`} />
      </div>

      {store.sessions.length === 0 ? (
        <EmptyState icon={Mic2} title="Aucune session" hint="Imagine déjà le programme — keynotes, panels, ateliers." />
      ) : (
        <div className="space-y-3">
          {store.sessions.map((s, idx) => {
            const domain = store.domains.find((d) => d.id === s.domainId);
            return (
              <div key={s.id} className="mpp-card p-5 flex items-center gap-4">
                <div className="mpp-mono text-2xl" style={{ color: "var(--mpp-accent)" }}>
                  {String(idx + 1).padStart(2, "0")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-[10px] uppercase">{s.type}</Badge>
                    <Badge variant="outline" className="text-[10px]">{s.status}</Badge>
                    {domain && <span className="text-xs" style={{ color: domain.color }}>{domain.icon} {domain.name}</span>}
                  </div>
                  <div className="mpp-sub text-lg">{s.title}</div>
                  {s.description && <p className="text-sm" style={{ color: "var(--mpp-text-2)" }}>{s.description}</p>}
                </div>
                <div className="mpp-mono text-sm" style={{ color: "var(--mpp-text-2)" }}>
                  {s.duration} min
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditing(s); setOpen(true); }} className="p-1.5 hover:bg-[var(--mpp-surface-alt)] rounded">
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => remove(s.id)} className="p-1.5 hover:bg-[var(--mpp-surface-alt)] rounded">
                    <Trash2 className="h-3.5 w-3.5 text-[var(--mpp-danger)]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <SessionDialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}
        initial={editing} domains={store.domains} onSave={save} />
    </>
  );
}

function SessionDialog({
  open, onOpenChange, initial, domains, onSave,
}: { open: boolean; onOpenChange: (v: boolean) => void; initial: ConferenceSession | null; domains: Domain[]; onSave: (s: ConferenceSession) => void }) {
  const blank: ConferenceSession = {
    id: uid(), title: "", description: "", type: "presentation", duration: 30,
    domainId: domains[0]?.id || "", status: "idea", speakerIds: [],
  };
  const [s, setS] = useState<ConferenceSession>(initial || blank);
  useEffect(() => { setS(initial || { ...blank, id: uid() }); /* eslint-disable-line */ }, [initial, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mpp-sub text-2xl">{initial ? "Modifier" : "Nouvelle"} session</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div><Label>Titre *</Label><Input value={s.title} onChange={(e) => setS({ ...s, title: e.target.value })} /></div>
          <div><Label>Description</Label><Textarea rows={3} value={s.description} onChange={(e) => setS({ ...s, description: e.target.value })} /></div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Type</Label>
              <Select value={s.type} onValueChange={(v: any) => setS({ ...s, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["keynote","panel","workshop","presentation"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Durée (min)</Label>
              <Input type="number" value={s.duration} onChange={(e) => setS({ ...s, duration: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Statut</Label>
              <Select value={s.status} onValueChange={(v: any) => setS({ ...s, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["idea","confirmed","finalized"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Domaine</Label>
            <Select value={s.domainId} onValueChange={(v) => setS({ ...s, domainId: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {domains.map((d) => <SelectItem key={d.id} value={d.id}>{d.icon} {d.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={() => { if (!s.title.trim()) return toast.error("Titre requis"); onSave(s); }}
            style={{ background: "var(--mpp-primary)" }}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ───────────────────────── Search ───────────────────────── */
function SearchView({ store, onJump }: { store: Store; onJump: (t: Tab) => void }) {
  const [q, setQ] = useState("");
  const ql = q.toLowerCase().trim();

  const results = useMemo(() => {
    if (!ql) return [];
    const hits: { type: string; label: string; sub: string; tab: Tab }[] = [];
    store.initiatives.forEach((i) => {
      if ((i.title + " " + i.description + " " + i.country).toLowerCase().includes(ql))
        hits.push({ type: "Initiative", label: i.title, sub: i.country, tab: "initiatives" });
    });
    store.contacts.forEach((c) => {
      if ((c.name + " " + c.role + " " + c.expertise).toLowerCase().includes(ql))
        hits.push({ type: "Contact", label: c.name, sub: c.role, tab: "network" });
    });
    store.library.forEach((x) => {
      if ((x.title + " " + x.author + " " + x.lessons).toLowerCase().includes(ql))
        hits.push({ type: "Ressource", label: x.title, sub: x.author, tab: "library" });
    });
    store.journal.forEach((e) => {
      if ((e.title + " " + e.content).toLowerCase().includes(ql))
        hits.push({ type: "Journal", label: e.title || "Entrée", sub: fmt(e.createdAt), tab: "journal" });
    });
    store.milestones.forEach((m) => {
      if ((m.title + " " + m.description).toLowerCase().includes(ql))
        hits.push({ type: "Jalon", label: m.title, sub: `An ${m.year}`, tab: "roadmap" });
    });
    return hits;
  }, [ql, store]);

  return (
    <>
      <PageHeader title="Recherche globale" subtitle="Tout MonPays+ en une recherche." />
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--mpp-text-2)]" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} autoFocus
          placeholder="Rechercher dans toutes les entités…" className="pl-10 h-12 text-base" />
      </div>

      {!ql ? (
        <p className="text-sm" style={{ color: "var(--mpp-text-2)" }}>
          Commence à taper pour rechercher dans initiatives, contacts, ressources, journal et jalons.
        </p>
      ) : results.length === 0 ? (
        <EmptyState icon={Search} title="Aucun résultat" hint={`Aucune correspondance pour « ${q} ».`} />
      ) : (
        <div className="space-y-2">
          {results.map((r, idx) => (
            <button key={idx} onClick={() => onJump(r.tab)}
              className="mpp-card w-full p-4 text-left flex items-center justify-between hover:border-[var(--mpp-primary)] transition">
              <div>
                <div className="text-[10px] uppercase mpp-mono" style={{ color: "var(--mpp-accent)" }}>{r.type}</div>
                <div className="mpp-sub text-base" style={{ color: "var(--mpp-text)" }}>{r.label}</div>
                <div className="text-xs" style={{ color: "var(--mpp-text-2)" }}>{r.sub}</div>
              </div>
              <ChevronRight className="h-4 w-4 text-[var(--mpp-text-2)]" />
            </button>
          ))}
        </div>
      )}
    </>
  );
}
