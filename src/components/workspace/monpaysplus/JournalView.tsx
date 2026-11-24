"use client";

import { useEffect, useState } from "react";
import { NotebookPen, Search, Plus, Trash2, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import type { WorkspaceStore as Store, WorkspaceId as ID, JournalEntry } from "@/types/workspace";
import { uid, fmt, PageHeader, EmptyState } from "./shared";

/* ───────────────────────── Journal ───────────────────────── */
export function JournalView({ store, onChange }: { store: Store; onChange: (v: JournalEntry[]) => void }) {
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
          <Button onClick={() => { setEditing(null); setOpen(true); }} variant="gradient">
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
  // A factory, not a constant: ids and timestamps must be fresh for each new item.
  const makeBlank = (): JournalEntry => ({
    id: uid(), title: "", content: "", mood: "reflective", tags: "", createdAt: Date.now(),
  });
  const [e, setE] = useState<JournalEntry>(() => initial || makeBlank());
  // Reset the form each time the dialog opens or switches item.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setE(initial || makeBlank()); }, [initial, open]);

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
            <Select value={e.mood} onValueChange={(v) => setE({ ...e, mood: v as JournalEntry["mood"] })}>
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
          <Button onClick={() => onSave(e)} variant="gradient">Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
