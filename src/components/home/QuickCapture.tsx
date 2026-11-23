"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Zap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { captureIdea } from "@/actions/projects";

/** Note an idea in seconds, before it slips away; it is dated now and can be fleshed out later. */
export default function QuickCapture({ academic = false }: { academic?: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [titre, setTitre] = useState("");
  const [phrase, setPhrase] = useState("");
  const [pending, startTransition] = useTransition();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titre.trim()) return;
    startTransition(async () => {
      try {
        const { id } = await captureIdea({ titre, phrase, academic });
        toast.success("Idée consignée", { description: "Datée d’aujourd’hui. Tu pourras l’enrichir quand tu veux." });
        setOpen(false);
        setTitre("");
        setPhrase("");
        router.push(`/projet/${id}`);
      } catch {
        toast.error("Impossible d’enregistrer l’idée pour l’instant.");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Zap className="h-4 w-4" />
          Capture rapide
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Une idée vient de naître ?</DialogTitle>
          <DialogDescription>Un titre et une phrase suffisent. Elle sera datée d’aujourd’hui.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <Input
            autoFocus
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            placeholder={academic ? "Ex. : Certification en data science" : "Ex. : Une coopérative de livraison à vélo"}
            aria-label="Titre de l’idée"
            maxLength={200}
          />
          <Textarea
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            placeholder="En une phrase, ce que c’est (facultatif)"
            aria-label="Une phrase"
            rows={3}
            maxLength={500}
          />
          <div className="flex justify-end">
            <Button type="submit" variant="gradient" disabled={pending || !titre.trim()}>
              {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Consigner l’idée
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
