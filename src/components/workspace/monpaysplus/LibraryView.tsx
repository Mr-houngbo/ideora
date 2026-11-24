"use client";

import { useEffect, useState } from "react";
import { BookOpen, Plus, Trash2, Edit3, ExternalLink, Star, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import type { WorkspaceStore as Store, WorkspaceId as ID, Domain, LibraryItem } from "@/types/workspace";
import { uid, PageHeader, EmptyState } from "./shared";

/* ───────────────────────── Bibliothèque ───────────────────────── */
export function LibraryView({ store, onChange }: { store: Store; onChange: (v: LibraryItem[]) => void }) {
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
          <Button onClick={() => { setEditing(null); setOpen(true); }} variant="gradient">
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
  // A factory, not a constant: ids and timestamps must be fresh for each new item.
  const makeBlank = (): LibraryItem => ({
    id: uid(), title: "", author: "", type: "book", domainId: domains[0]?.id || "",
    url: "", summary: "", lessons: "", rating: 0, isRead: false, createdAt: Date.now(),
  });
  const [x, setX] = useState<LibraryItem>(() => initial || makeBlank());
  // Reset the form each time the dialog opens or switches item.
  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { setX(initial || makeBlank()); }, [initial, open]);

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
              <Select value={x.type} onValueChange={(v) => setX({ ...x, type: v as LibraryItem["type"] })}>
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
            variant="gradient">Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
