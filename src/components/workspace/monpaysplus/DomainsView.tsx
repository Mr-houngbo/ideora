"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit3, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import type { WorkspaceStore as Store, WorkspaceId as ID, Domain } from "@/types/workspace";
import { uid, PageHeader } from "./shared";

/* ───────────────────────── Domaines ───────────────────────── */
export function DomainsView({
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
