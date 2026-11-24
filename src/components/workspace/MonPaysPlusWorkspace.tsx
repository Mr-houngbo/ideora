"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { updateProjectWorkspace } from "@/actions/workspace";
import Layout from "@/components/layout/Layout";
import { refreshDomainColors, type WorkspaceStore as Store } from "@/types/workspace";
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
  const [store, setStore] = useState<Store>(() => refreshDomainColors(initialStore));
  const [tab, setTab] = useState<Tab>("dashboard");
  // Bumped to open the "new initiative" form straight away (from the weekly ritual).
  const [newInitiative, setNewInitiative] = useState(0);
  const writeThisWeek = () => {
    setTab("initiatives");
    setNewInitiative((n) => n + 1);
  };
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
  useEffect(() => {
    document.title = "MonPays+ — Observer le monde. Construire le Bénin.";
  }, []);

  const update = <K extends keyof Store>(key: K, value: Store[K]) =>
    setStore((s) => ({ ...s, [key]: value }));

  return (
    <Layout>
      <div className="mpp relative">
        <Style />
        <div className="container max-w-7xl py-8 md:py-10">
          <MobileNav tab={tab} onChange={setTab} backHref={`/projet/${projectId}`} />
          <div className="flex gap-8">
            <Sidebar tab={tab} onChange={setTab} store={store} backHref={`/projet/${projectId}`} />
            <main className="min-w-0 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {tab === "dashboard" && <DashboardView store={store} onJump={setTab} onWrite={writeThisWeek} />}
              {tab === "initiatives" && (
                <InitiativesView
                  key={newInitiative}
                  autoNew={newInitiative > 0}
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
      </div>
    </Layout>
  );
}
