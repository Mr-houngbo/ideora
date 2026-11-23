"use client";

import { useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Flag, Loader2, Lock, MailOpen, PenLine, Plus, RefreshCw, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { addJournalEntry, deleteJournalEntry, setJournalEntryDone } from "@/actions/journal";
import { formatIdeaDate, toDayString } from "@/lib/idea-dates";
import { dueState, formatDay, formatDue, isSealed } from "@/lib/journal";
import { cn } from "@/lib/utils";
import type { JournalEntry, JournalType } from "@/types/project";

type ComposerType = Exclude<JournalType, "statut">;

const COMPOSER: Record<ComposerType, { label: string; icon: typeof PenLine; title: string; body: string; date?: string }> = {
  note: { label: "Note", icon: PenLine, title: "Ce que tu as pensé, appris ou décidé", body: "Développe si tu veux (facultatif)" },
  jalon: { label: "Jalon", icon: Flag, title: "L’objectif à atteindre", body: "Comment tu sauras qu’il est atteint (facultatif)", date: "Pour le" },
  promesse: {
    label: "Promesse au moi futur",
    icon: Lock,
    title: "Ce que tu te promets",
    body: "Écris au toi de ce jour-là. Le texte restera scellé jusqu’à la date choisie.",
    date: "À relire le",
  },
};

const ICONS: Record<JournalType, typeof PenLine> = { note: PenLine, jalon: Flag, promesse: Lock, statut: RefreshCw };

function Composer({ projectId, onAdded }: { projectId: string; onAdded: (e: JournalEntry) => void }) {
  const [type, setType] = useState<ComposerType>("note");
  const [titre, setTitre] = useState("");
  const [contenu, setContenu] = useState("");
  const [day, setDay] = useState("");
  const [pending, startTransition] = useTransition();
  const cfg = COMPOSER[type];
  const [tomorrow] = useState(() => toDayString(new Date(Date.now() + 86_400_000)));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titre.trim()) return;
    if (type === "promesse" && !day) {
      toast.error("Choisis le jour où relire cette promesse.");
      return;
    }
    startTransition(async () => {
      try {
        const entry = await addJournalEntry(projectId, {
          type,
          titre,
          contenu,
          date_prevue: type === "note" ? null : day || null,
        });
        onAdded(entry);
        setTitre("");
        setContenu("");
        setDay("");
        toast.success(type === "promesse" ? "Promesse scellée" : "Ajouté au journal");
      } catch {
        toast.error("Impossible d’enregistrer pour l’instant.");
      }
    });
  };

  return (
    <form onSubmit={submit} className="space-y-3 rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Type d’entrée">
        {(Object.keys(COMPOSER) as ComposerType[]).map((key) => {
          const Icon = COMPOSER[key].icon;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={type === key}
              onClick={() => setType(key)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                type === key ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {COMPOSER[key].label}
            </button>
          );
        })}
      </div>
      <Input value={titre} onChange={(e) => setTitre(e.target.value)} placeholder={cfg.title} aria-label="Titre" maxLength={200} />
      <Textarea
        value={contenu}
        onChange={(e) => setContenu(e.target.value)}
        placeholder={cfg.body}
        aria-label="Texte"
        rows={type === "promesse" ? 4 : 2}
        className="resize-y"
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        {cfg.date ? (
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            {cfg.date}
            <Input
              type="date"
              value={day}
              min={type === "promesse" ? tomorrow : undefined}
              onChange={(e) => setDay(e.target.value)}
              className="h-9 w-44"
              required={type === "promesse"}
            />
          </label>
        ) : (
          <span className="text-xs text-muted-foreground">Datée d’aujourd’hui, automatiquement.</span>
        )}
        <Button type="submit" variant="gradient" size="sm" disabled={pending || !titre.trim()}>
          {pending ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Plus className="mr-1.5 h-4 w-4" />}
          {type === "promesse" ? "Sceller" : "Ajouter"}
        </Button>
      </div>
    </form>
  );
}

function EntryItem({
  entry,
  onChange,
  onDelete,
}: {
  entry: JournalEntry;
  onChange: (e: JournalEntry) => void;
  onDelete: (id: string) => void;
}) {
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const Icon = ICONS[entry.type];
  const sealed = isSealed(entry);
  const done = Boolean(entry.fait_le);

  const toggle = () =>
    startTransition(async () => {
      const updated = await setJournalEntryDone(entry.id, !done).catch(() => null);
      if (updated) onChange(updated);
      else toast.error("Impossible d’enregistrer pour l’instant.");
    });

  const remove = () => {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 4000);
      return;
    }
    startTransition(async () => {
      try {
        await deleteJournalEntry(entry.id);
        onDelete(entry.id);
      } catch {
        toast.error("Impossible de supprimer pour l’instant.");
      }
    });
  };

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      className="group relative pb-7 pl-10"
    >
      <span
        className={cn(
          "absolute left-0 top-0.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-background",
          entry.type === "promesse"
            ? "bg-accent text-accent-foreground"
            : entry.type === "jalon"
              ? done
                ? "bg-success text-success-foreground"
                : "bg-primary text-primary-foreground"
              : entry.type === "statut"
                ? "bg-muted text-muted-foreground"
                : "bg-secondary text-secondary-foreground",
        )}
      >
        {entry.type === "jalon" && done ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
      </span>

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <time dateTime={entry.ecrit_le} className="text-xs font-medium text-muted-foreground">
            {formatIdeaDate(entry.ecrit_le)}
          </time>
          <p className={cn("mt-0.5 font-semibold leading-snug", entry.type === "statut" && "font-medium text-muted-foreground")}>
            {entry.type === "statut" ? `Statut : ${entry.titre}` : entry.titre}
          </p>
        </div>
        {entry.type !== "statut" && (
          <button
            type="button"
            onClick={remove}
            disabled={pending}
            className={cn(
              "shrink-0 rounded-lg px-2 py-1 text-xs transition",
              confirming
                ? "bg-destructive/10 text-destructive"
                : "text-muted-foreground opacity-0 hover:text-destructive focus-visible:opacity-100 group-hover:opacity-100",
            )}
            title="Supprimer"
          >
            {confirming ? "Supprimer ?" : <Trash2 className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>

      {sealed ? (
        <div className="mt-2 rounded-2xl border border-dashed border-accent/40 bg-accent/5 px-4 py-3 text-sm text-muted-foreground">
          <Lock className="mr-1.5 inline h-3.5 w-3.5 text-accent" />
          Scellée jusqu’au <strong className="text-foreground">{formatDay(entry.date_prevue!)}</strong>. Le moi de ce jour-là la lira.
        </div>
      ) : (
        entry.contenu && (
          <p
            className={cn(
              "mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground/80",
              entry.type === "promesse" && "rounded-2xl border border-accent/30 bg-accent/5 px-4 py-3 font-medium italic",
            )}
          >
            {entry.contenu}
          </p>
        )
      )}

      {entry.type === "jalon" && (
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
          <button
            type="button"
            onClick={toggle}
            disabled={pending}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-medium transition",
              done ? "border-success/40 bg-success/10 text-success" : "border-border hover:border-primary/50 hover:text-primary",
            )}
          >
            {pending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
            {done ? `Atteint le ${formatIdeaDate(entry.fait_le!)}` : "Marquer comme atteint"}
          </button>
          {!done && entry.date_prevue && (
            <span
              className={cn(dueState(entry.date_prevue) === "late" ? "text-destructive" : "text-muted-foreground")}
              suppressHydrationWarning
            >
              Prévu le {formatDay(entry.date_prevue)} · {formatDue(entry.date_prevue)}
            </span>
          )}
        </div>
      )}

      {entry.type === "promesse" && !sealed && (
        <div className="mt-2 text-xs">
          {done ? (
            <span className="text-muted-foreground">Relue le {formatIdeaDate(entry.fait_le!)}</span>
          ) : (
            <button
              type="button"
              onClick={toggle}
              disabled={pending}
              className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 px-3 py-1 font-medium text-accent transition hover:bg-accent/10"
            >
              <MailOpen className="h-3 w-3" />
              Je l’ai relue
            </button>
          )}
        </div>
      )}
    </motion.li>
  );
}

/**
 * "Évolution": the dated life of an idea after its birth. Notes, milestones,
 * status changes and sealed promises to the future self, newest first, down
 * to the day the idea was born.
 */
export default function Journal({
  projectId,
  entries: initial,
  bornAt,
}: {
  projectId: string;
  entries: JournalEntry[];
  bornAt: string;
}) {
  const [entries, setEntries] = useState(initial);
  const milestones = entries.filter((e) => e.type === "jalon");
  const reached = milestones.filter((e) => e.fait_le).length;

  return (
    <div className="space-y-6">
      {milestones.length > 0 && (
        <div className="flex items-center gap-3 text-sm">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${(reached / milestones.length) * 100}%`, background: "var(--gradient-primary)" }}
            />
          </div>
          <span className="shrink-0 text-muted-foreground">
            {reached}/{milestones.length} {milestones.length > 1 ? "jalons atteints" : "jalon atteint"}
          </span>
        </div>
      )}

      <Composer projectId={projectId} onAdded={(e) => setEntries((list) => [e, ...list])} />

      <ol className="relative before:absolute before:bottom-3 before:left-[13px] before:top-2 before:w-px before:bg-border">
        <AnimatePresence initial={false}>
          {entries.map((entry) => (
            <EntryItem
              key={entry.id}
              entry={entry}
              onChange={(updated) => setEntries((list) => list.map((e) => (e.id === updated.id ? updated : e)))}
              onDelete={(id) => setEntries((list) => list.filter((e) => e.id !== id))}
            />
          ))}
        </AnimatePresence>
        <li className="relative pl-10">
          <span
            className="absolute left-0 top-0.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-background text-white"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <time dateTime={bornAt} className="text-xs font-medium text-muted-foreground">
            {formatIdeaDate(bornAt)}
          </time>
          <p className="mt-0.5 font-semibold">L’idée est née</p>
        </li>
      </ol>
    </div>
  );
}
