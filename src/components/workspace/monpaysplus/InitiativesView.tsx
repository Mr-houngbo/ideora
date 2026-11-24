"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Lightbulb, Search, Plus, Trash2, Edit3, X, Pin, PinOff, Save, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import type { WorkspaceStore as Store, WorkspaceId as ID, Domain, Initiative } from "@/types/workspace";
import { uid, costLabel, statusLabel, PageHeader, EmptyState } from "./shared";

/* ───────────────────────── Initiatives ───────────────────────── */
export function InitiativesView({
  store, onChange, autoNew = false,
}: { store: Store; onChange: (v: Initiative[]) => void; autoNew?: boolean }) {
  const [open, setOpen] = useState(autoNew);
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
    toast.success(exists ? "Fiche mise à jour" : "Fiche ajoutée", exists ? undefined : { description: "Une de plus dans ta carte du monde." });
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
            variant="gradient"
          >
            <Plus className="h-4 w-4 mr-1" /> Nouvelle fiche
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
          <SelectTrigger className="w-full sm:w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les domaines</SelectItem>
            {store.domains.map((d) => (
              <SelectItem key={d.id} value={d.id}>{d.icon} {d.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-[160px]"><SelectValue /></SelectTrigger>
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
          action={<Button onClick={() => { setEditing(null); setOpen(true); }} variant="gradient">
            <Plus className="h-4 w-4 mr-1" /> Ajouter
          </Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
  // A factory, not a constant: ids and timestamps must be fresh for each new item.
  const makeBlank = (): Initiative => ({
    id: uid(), title: "", domainId: domains[0]?.id || "", country: "", countryCode: "",
    description: "", mechanism: "", conditions: "", obstacles: "",
    feasibility: 5, adaptation: "", cost: "medium", timelineYears: 3,
    status: "draft", pinned: false, sources: [], tags: [], createdAt: Date.now(),
  });
  const [data, setData] = useState<Initiative>(() => initial || makeBlank());
  // Reset the form each time the dialog opens or switches item.
  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { setData(initial || makeBlank()); }, [initial, open]);

  const set = <K extends keyof Initiative>(k: K, v: Initiative[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold tracking-tight">
            {initial ? "Modifier la fiche" : <>Nouvelle fiche <span className="gradient-text">MonPays+</span></>}
          </DialogTitle>
          <DialogDescription>
            Trois questions suffisent. Le reste peut attendre, tu le compléteras plus tard.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-2">
          <FormStep n={1} title="Ce que tu as vu" hint="Un programme, une réforme, une entreprise, une habitude.">
            <Input value={data.title} onChange={(e) => set("title", e.target.value)} autoFocus
              aria-label="Titre" className="h-12 text-base font-semibold"
              placeholder="ex : Méthode finlandaise d'évaluation des enseignants" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_90px]">
              <div>
                <Label className="mb-1.5 block text-xs text-muted-foreground">Domaine</Label>
                <Select value={data.domainId} onValueChange={(v) => set("domainId", v)}>
                  <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                  <SelectContent>
                    {domains.map((d) => (
                      <SelectItem key={d.id} value={d.id}>{d.icon} {d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-1.5 block text-xs text-muted-foreground">Pays d’origine</Label>
                <Input value={data.country} onChange={(e) => set("country", e.target.value)} placeholder="ex : Finlande" />
              </div>
              <div>
                <Label className="mb-1.5 block text-xs text-muted-foreground">Code</Label>
                <Input value={data.countryCode} onChange={(e) => set("countryCode", e.target.value.toUpperCase().slice(0,2))}
                  placeholder="FI" className="uppercase" />
              </div>
            </div>
          </FormStep>

          <FormStep n={2} title="En deux phrases" hint="Qu'est-ce que c'est, et qu'est-ce que ça change ?">
            <Textarea rows={3} value={data.description} onChange={(e) => set("description", e.target.value)}
              placeholder="Raconte-le comme à un ami." />
          </FormStep>

          <FormStep n={3} title="Et chez nous ?" hint="Ce qu'il faudrait changer pour que ça marche au Bénin.">
            <Textarea rows={3} value={data.adaptation} onChange={(e) => set("adaptation", e.target.value)}
              placeholder="Acteurs, coûts, freins, premier pas possible…" />
            <div>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Faisabilité au Bénin</span>
                <span className="font-bold tabular-nums text-primary">{data.feasibility}/10</span>
              </div>
              <input type="range" min={1} max={10} value={data.feasibility}
                onChange={(e) => set("feasibility", Number(e.target.value))}
                aria-label="Faisabilité au Bénin"
                className="w-full accent-[hsl(var(--primary))]" />
            </div>
          </FormStep>

          <details className="group rounded-2xl border border-border/70 bg-secondary/40 open:bg-transparent" open={Boolean(initial)}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold [&::-webkit-details-marker]:hidden">
              <span>
                Aller plus loin
                <span className="ml-2 font-normal text-muted-foreground">mécanisme, obstacles, coût, sources… (facultatif)</span>
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
            </summary>
            <div className="grid gap-4 px-4 pb-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <Label>Coût estimé</Label>
                  <Select value={data.cost} onValueChange={(v) => set("cost", v as Initiative["cost"])}>
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
                  <Select value={data.status} onValueChange={(v) => set("status", v as Initiative["status"])}>
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
                    className="text-xs font-semibold text-primary hover:underline"
                  >+ ajouter une source</button>
                </Label>
                <div className="mt-1 space-y-2">
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
          </details>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button
            onClick={() => {
              if (!data.title.trim()) { toast.error("Le titre est requis"); return; }
              onSave(data);
            }}
            variant="gradient"
          >
            <Save className="h-4 w-4 mr-1" /> Enregistrer la fiche
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FormStep({ n, title, hint, children }: { n: number; title: string; hint: string; children: React.ReactNode }) {
  return (
    <section className="flex gap-4">
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold text-white shadow-md"
        style={{ backgroundImage: "var(--gradient-primary)" }}
      >
        {n}
      </span>
      <div className="min-w-0 flex-1 space-y-3">
        <div>
          <h3 className="font-bold leading-tight">{title}</h3>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
        {children}
      </div>
    </section>
  );
}
