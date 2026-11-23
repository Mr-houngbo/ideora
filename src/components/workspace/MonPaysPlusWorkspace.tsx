"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { updateProjectWorkspace } from "@/actions/workspace";
import { holdLightTheme } from "@/lib/theme";
import type { WorkspaceStore as Store } from "@/types/workspace";
import { Style, Sidebar, MobileNav } from "./monpaysplus/shared";
import type { Tab } from "./monpaysplus/shared";
import { DashboardView } from "./monpaysplus/DashboardView";
import { InitiativesView } from "./monpaysplus/InitiativesView";
import { DomainsView } from "./monpaysplus/DomainsView";
import { NetworkView } from "./monpaysplus/NetworkView";
import { RoadmapView } from "./monpaysplus/RoadmapView";
import { LibraryView } from "./monpaysplus/LibraryView";
import { JournalView } from "./monpaysplus/JournalView";
import { ConferenceView } from "./monpaysplus/ConferenceView";
import { SearchView } from "./monpaysplus/SearchView";

/* ───────────────────────── Page ───────────────────────── */
interface MonPaysPlusWorkspaceProps {
  projectId: string;
  initialStore: Store;
}

export default function MonPaysPlusWorkspace({ projectId, initialStore }: MonPaysPlusWorkspaceProps) {
  const [store, setStore] = useState<Store>(initialStore);
  const [tab, setTab] = useState<Tab>("dashboard");
  const isFirstRender = useRef(true);

  // Skip the very first run — `store` at that point is exactly what the
  // server just sent us, so persisting it back would be a wasted round-trip.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    updateProjectWorkspace(projectId, store).catch(() => {
      toast.error("Erreur", { description: "Impossible de sauvegarder l'espace de travail." });
    });
  }, [store, projectId]);
  // The workspace has its own light palette; keep the app's dark tokens away from its dialogs and inputs.
  useEffect(() => holdLightTheme(), []);
  useEffect(() => {
    document.title = "MonPays+ — Observer le monde. Construire le Bénin.";
  }, []);

  const update = <K extends keyof Store>(key: K, value: Store[K]) =>
    setStore((s) => ({ ...s, [key]: value }));

  return (
    <div className="min-h-screen" style={{ background: "var(--mpp-surface)" }}>
      <Style />
      <MobileNav tab={tab} onChange={setTab} backHref={`/projet/${projectId}`} />
      <div className="flex">
        <Sidebar tab={tab} onChange={setTab} store={store} backHref={`/projet/${projectId}`} />
        <main className="flex-1 min-h-screen p-6 md:p-10 lg:pl-12 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {tab === "dashboard" && <DashboardView store={store} onJump={setTab} />}
              {tab === "initiatives" && (
                <InitiativesView
                  store={store}
                  onChange={(v) => update("initiatives", v)}
                />
              )}
              {tab === "domains" && (
                <DomainsView store={store} onChange={(v) => update("domains", v)} />
              )}
              {tab === "network" && (
                <NetworkView store={store} onChange={(v) => update("contacts", v)} />
              )}
              {tab === "roadmap" && (
                <RoadmapView
                  store={store}
                  onChangeM={(v) => update("milestones", v)}
                  onChangeT={(v) => update("tasks", v)}
                />
              )}
              {tab === "library" && (
                <LibraryView store={store} onChange={(v) => update("library", v)} />
              )}
              {tab === "journal" && (
                <JournalView store={store} onChange={(v) => update("journal", v)} />
              )}
              {tab === "conference" && (
                <ConferenceView store={store} onChange={(v) => update("sessions", v)} />
              )}
              {tab === "search" && <SearchView store={store} onJump={setTab} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
