"use client";

import { useEffect, useState } from "react";
import { Mic2, Plus, Trash2, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import type { WorkspaceStore as Store, WorkspaceId as ID, Domain, ConferenceSession } from "@/types/workspace";
import { uid, PageHeader, EmptyState, Stat } from "./shared";

/* ───────────────────────── Conférence ───────────────────────── */
export function ConferenceView({ store, onChange }: { store: Store; onChange: (v: ConferenceSession[]) => void }) {
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
