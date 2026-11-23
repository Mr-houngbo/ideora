"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Edit3, X, CheckCircle2, Circle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import type { WorkspaceStore as Store, WorkspaceId as ID, Milestone, WorkspaceTask as Task } from "@/types/workspace";
import { uid, milestoneStatusLabel, PageHeader } from "./shared";

/* ───────────────────────── Roadmap ───────────────────────── */
export function RoadmapView({
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
