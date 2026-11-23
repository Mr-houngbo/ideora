"use client";

import { useEffect, useState } from "react";
import { Users, Plus, Trash2, Edit3, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import type { WorkspaceStore as Store, WorkspaceId as ID, Contact } from "@/types/workspace";
import { uid, relLabel, PageHeader, EmptyState } from "./shared";

/* ───────────────────────── Réseau ───────────────────────── */
export function NetworkView({
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
