import { Link2Off } from "lucide-react";
import SharedFrame from "@/components/share/SharedFrame";

export default function ShareUnavailable() {
  return (
    <SharedFrame>
      <div className="container flex max-w-lg flex-col items-center py-24 text-center">
        <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <Link2Off className="h-7 w-7" />
        </span>
        <h1 className="mb-3 text-2xl font-bold">Ce lien n’est plus actif</h1>
        <p className="text-muted-foreground">Il a expiré ou a été coupé par son auteur. Demande-lui un nouveau lien.</p>
      </div>
    </SharedFrame>
  );
}
