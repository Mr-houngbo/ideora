"use client";

import { useState, useTransition } from "react";
import { Check, Copy, Eye, Link2, Loader2, Share2, ShieldOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { createShare, revokeShare } from "@/actions/shares";
import { formatIdeaDate } from "@/lib/idea-dates";
import { cn } from "@/lib/utils";
import type { ShareLink } from "@/types/project";

const EXPIRY: [string, number | null][] = [
  ["Sans expiration", null],
  ["7 jours", 7],
  ["30 jours", 30],
  ["90 jours", 90],
];

function shareUrl(token: string) {
  return `${window.location.origin}/partage/${token}`;
}

function status(s: ShareLink): { label: string; active: boolean } {
  if (s.revoque_le) return { label: `Coupé le ${formatIdeaDate(s.revoque_le)}`, active: false };
  if (s.expire_le && new Date(s.expire_le) <= new Date()) return { label: `Expiré le ${formatIdeaDate(s.expire_le)}`, active: false };
  return { label: s.expire_le ? `Actif jusqu’au ${formatIdeaDate(s.expire_le)}` : "Actif, sans expiration", active: true };
}

function CopyButton({ token }: { token: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(shareUrl(token));
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          toast.error("Copie impossible : sélectionne le lien à la main.");
        }
      }}
    >
      {copied ? <Check className="mr-1.5 h-3.5 w-3.5" /> : <Copy className="mr-1.5 h-3.5 w-3.5" />}
      {copied ? "Copié" : "Copier"}
    </Button>
  );
}

/** Creates, lists and cuts the private read-only links of a project (or of the portfolio when projectId is null). */
export function ShareManager({ projectId, shares: initial }: { projectId: string | null; shares: ShareLink[] }) {
  const [shares, setShares] = useState(initial);
  const [libelle, setLibelle] = useState("");
  const [expireDays, setExpireDays] = useState<number | null>(null);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const create = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const share = await createShare({ projectId, libelle, expireDays });
        setShares((list) => [share, ...list]);
        setLibelle("");
        try {
          await navigator.clipboard.writeText(shareUrl(share.token));
          toast.success("Lien créé et copié");
        } catch {
          toast.success("Lien créé");
        }
      } catch {
        toast.error("Impossible de créer le lien pour l’instant.");
      }
    });
  };

  const revoke = (id: string) => {
    if (confirming !== id) {
      setConfirming(id);
      setTimeout(() => setConfirming((c) => (c === id ? null : c)), 4000);
      return;
    }
    startTransition(async () => {
      const updated = await revokeShare(id).catch(() => null);
      if (updated) setShares((list) => list.map((s) => (s.id === id ? updated : s)));
      else toast.error("Impossible de couper le lien pour l’instant.");
      setConfirming(null);
    });
  };

  return (
    <div className="space-y-5">
      <form onSubmit={create} className="space-y-2">
        <Input
          value={libelle}
          onChange={(e) => setLibelle(e.target.value)}
          placeholder="Pour qui ? (ex. : Jury AIMS, un associé…)"
          aria-label="Destinataire du lien"
          maxLength={120}
        />
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={expireDays ?? ""}
            onChange={(e) => setExpireDays(e.target.value ? Number(e.target.value) : null)}
            className="h-9 rounded-xl border border-input bg-background px-3 text-sm"
            aria-label="Durée du lien"
          >
            {EXPIRY.map(([label, days]) => (
              <option key={label} value={days ?? ""}>
                {label}
              </option>
            ))}
          </select>
          <Button type="submit" variant="gradient" size="sm" disabled={pending} className="ml-auto">
            {pending ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Link2 className="mr-1.5 h-4 w-4" />}
            Créer un lien
          </Button>
        </div>
      </form>

      {shares.length > 0 && (
        <ul className="space-y-2">
          {shares.map((s) => {
            const st = status(s);
            return (
              <li key={s.id} className={cn("rounded-2xl border border-border p-3", !st.active && "opacity-60")}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{s.libelle || "Lien sans nom"}</p>
                    <p className="text-xs text-muted-foreground">
                      Créé le {formatIdeaDate(s.cree_le)} · {st.label} ·{" "}
                      <span className="inline-flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {s.vues} {s.vues > 1 ? "vues" : "vue"}
                      </span>
                    </p>
                  </div>
                  {st.active && (
                    <div className="flex gap-1.5">
                      <CopyButton token={s.token} />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => revoke(s.id)}
                        disabled={pending}
                        className={cn(confirming === s.id ? "bg-destructive/10 text-destructive" : "text-muted-foreground")}
                      >
                        <ShieldOff className="mr-1.5 h-3.5 w-3.5" />
                        {confirming === s.id ? "Couper ?" : "Couper"}
                      </Button>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/** "Partager" button of a project page, opening the share manager. */
export default function ShareDialog({ projectId, shares }: { projectId: string; shares: ShareLink[] }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Share2 className="mr-2 h-4 w-4" />
          Partager
          {shares.some((s) => status(s).active) && (
            <span className="ml-2 rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-semibold text-success">actif</span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Partager cette idée</DialogTitle>
          <DialogDescription>
            Un lien privé, en lecture seule, sans connexion. Il montre la fiche et les jalons, jamais tes notes ni tes
            promesses. Tu peux le couper à tout moment.
          </DialogDescription>
        </DialogHeader>
        <ShareManager projectId={projectId} shares={shares} />
      </DialogContent>
    </Dialog>
  );
}
