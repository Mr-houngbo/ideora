"use client";

import { useMemo, useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { WorkspaceStore as Store } from "@/types/workspace";
import { fmt, PageHeader, EmptyState } from "./shared";
import type { Tab } from "./shared";

/* ───────────────────────── Search ───────────────────────── */
export function SearchView({ store, onJump }: { store: Store; onJump: (t: Tab) => void }) {
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
