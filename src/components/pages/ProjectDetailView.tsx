"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarHeart,
  Check,
  ChevronDown,
  Edit2,
  LayoutDashboard,
  Sparkles,
  Trash2,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { deleteProject } from "@/actions/projects";
import {
  STATUS_LABELS,
  STATUS_COLORS,
  HORIZON_LABELS,
  isEducationCategory,
  type Project,
} from "@/types/project";
import { getAccentTheme } from "@/lib/accent-themes";
import { formatIdeaAge, formatIdeaDate } from "@/lib/idea-dates";
import { getMaturity } from "@/lib/maturity";
import { cn } from "@/lib/utils";
import RichMarkdown from "@/components/projects/RichMarkdown";
import ProjectCover from "@/components/projects/ProjectCover";
import ResourceList from "@/components/projects/ResourceList";
import { SHOWCASE_TEMPLATES } from "@/components/showcase";

interface ProjectDetailViewProps {
  project: Project;
}

function IdeaDate({ iso, className }: { iso: string; className?: string }) {
  return (
    <span className={className}>
      Idée née le <time dateTime={iso} className="font-semibold">{formatIdeaDate(iso)}</time>
      <span className="opacity-75" suppressHydrationWarning>
        {" "}· {formatIdeaAge(iso)}
      </span>
    </span>
  );
}

function DeleteButton({ onConfirm, className }: { onConfirm: () => void; className?: string }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="glass" size="icon-sm" className={className} title="Supprimer">
          <Trash2 className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer ce projet ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. Le projet et sa date d’origine seront définitivement supprimés.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Supprimer</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/** Slim translucent bar for hand-built showcases, so the Ideora chrome doesn't break their immersion. */
function ShowcaseBar({ project, onDelete }: { project: Project; onDelete: () => void }) {
  const router = useRouter();
  return (
    <div className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/90 text-white backdrop-blur-xl">
      <div className="container flex h-12 items-center justify-between gap-3">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-medium text-white/75 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Ideora</span>
        </button>
        <IdeaDate iso={project.date_creation} className="truncate text-xs text-white/70" />
        <div className="flex items-center gap-1.5">
          <Link href={`/edit/${project.id}`}>
            <Button variant="ghost" size="icon-sm" className="text-white/80 hover:bg-white/10 hover:text-white" title="Modifier">
              <Edit2 className="h-4 w-4" />
            </Button>
          </Link>
          <DeleteButton onConfirm={onDelete} className="border-white/10 bg-white/5 text-white/80 hover:bg-white/10" />
        </div>
      </div>
    </div>
  );
}

/** The full Markdown file of a showcase: everything the hand-built page leaves out stays one click away. */
function FullDossier({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  const theme = getAccentTheme(project.accent_theme);
  return (
    <section className="border-t border-border bg-background">
      <div className="container max-w-4xl py-12">
        <button
          onClick={() => setOpen((v) => !v)}
          className="mx-auto flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold shadow-sm transition hover:shadow-md"
          aria-expanded={open}
        >
          {open ? "Replier le dossier complet" : "Lire le dossier complet"}
          <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
        </button>
        {open && (
          <div className="mt-8 rounded-3xl border border-border bg-card p-6 md:p-12" style={{ borderTop: `3px solid ${theme.solid}` }}>
            <RichMarkdown content={project.contenu_riche} theme={theme} />
          </div>
        )}
      </div>
    </section>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">{children}</h2>;
}

const ProjectDetailView = ({ project }: ProjectDetailViewProps) => {
  const router = useRouter();
  const theme = getAccentTheme(project.accent_theme);
  const isAcademic = isEducationCategory(project.categorie);
  const accent = project.accent_theme ? theme.solid : isAcademic ? "hsl(var(--academic))" : "hsl(var(--primary))";
  const CustomShowcase = project.custom_template ? SHOWCASE_TEMPLATES[project.custom_template] : null;
  const maturity = getMaturity(project);

  const handleDelete = async () => {
    try {
      await deleteProject(project.id);
      toast.success("Projet supprimé", { description: "Le projet a été supprimé définitivement." });
      router.push(isAcademic ? "/education" : "/");
    } catch {
      toast.error("Erreur", { description: "Impossible de supprimer le projet." });
    }
  };

  if (CustomShowcase) {
    return (
      <>
        <ShowcaseBar project={project} onDelete={handleDelete} />
        <CustomShowcase project={project} />
        {project.contenu_riche && <FullDossier project={project} />}
      </>
    );
  }

  const hasBody = Boolean(project.motivation || project.description_detaillee || project.contenu_riche || project.ressources);

  return (
    <Layout>
      {/* Hero: the title lives here, once. */}
      <header className="relative isolate overflow-hidden">
        <ProjectCover project={project} eager className="absolute inset-0 -z-10 h-full w-full" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />

        <div className="container flex items-center justify-between pt-5">
          <Button variant="glass" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div className="flex gap-2">
            <Link href={`/edit/${project.id}`}>
              <Button variant="glass" size="icon-sm" title="Modifier">
                <Edit2 className="w-4 h-4" />
              </Button>
            </Link>
            <DeleteButton onConfirm={handleDelete} />
          </div>
        </div>

        <div className="container max-w-6xl pb-12 pt-28 md:pb-16 md:pt-40">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/75">
            {project.categorie} · {HORIZON_LABELS[project.horizon_temps]}
          </p>
          <h1 className="max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-tight text-white text-balance drop-shadow-sm md:text-6xl">
            {project.titre}
          </h1>
          {project.description_courte && (
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85 md:text-xl">{project.description_courte}</p>
          )}
          <div className="mt-7 flex flex-wrap items-center gap-3 text-sm text-white/85">
            <span className={cn("rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-sm bg-white/90", STATUS_COLORS[project.statut])}>
              {STATUS_LABELS[project.statut]}
            </span>
            <span className="inline-flex items-center gap-2">
              <CalendarHeart className="h-4 w-4" />
              <IdeaDate iso={project.date_creation} />
            </span>
          </div>
        </div>
      </header>

      <div className="container max-w-6xl py-12 md:py-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
          <article className="min-w-0 space-y-14">
            {project.motivation && (
              <section>
                <SectionTitle>Pourquoi cette idée</SectionTitle>
                <blockquote className="relative border-l-4 pl-6 md:pl-8" style={{ borderColor: accent }}>
                  <p className="whitespace-pre-line text-xl font-medium leading-relaxed text-foreground md:text-2xl">
                    {project.motivation}
                  </p>
                </blockquote>
              </section>
            )}

            {project.description_detaillee && (
              <section>
                <SectionTitle>Le projet</SectionTitle>
                <div className="whitespace-pre-line text-[17px] leading-[1.8] text-foreground/80">{project.description_detaillee}</div>
              </section>
            )}

            {project.contenu_riche && (
              <section>
                <SectionTitle>Le dossier</SectionTitle>
                <div className="rounded-3xl border border-border bg-card p-6 md:p-10" style={{ borderTop: `3px solid ${theme.solid}` }}>
                  <RichMarkdown content={project.contenu_riche} theme={theme} />
                </div>
              </section>
            )}

            {project.ressources && (
              <section>
                <SectionTitle>Ressources</SectionTitle>
                <ResourceList text={project.ressources} />
              </section>
            )}

            {!hasBody && (
              <section className="rounded-3xl border border-dashed border-border p-10 text-center">
                <Sparkles className="mx-auto mb-4 h-8 w-8" style={{ color: accent }} />
                <h2 className="text-xl font-bold">Cette idée tient encore en une ligne</h2>
                <p className="mx-auto mt-2 max-w-md text-muted-foreground">
                  Note pourquoi elle compte pour toi et à quoi elle ressemblerait. Le futur toi te remerciera.
                </p>
                <Link href={`/edit/${project.id}`}>
                  <Button variant="gradient" className="mt-6">
                    <Edit2 className="mr-2 h-4 w-4" />
                    Enrichir la fiche
                  </Button>
                </Link>
              </section>
            )}
          </article>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="space-y-6 rounded-3xl border border-border bg-card p-6 shadow-sm">
              <dl className="space-y-4 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Statut</dt>
                  <dd className="font-semibold">{STATUS_LABELS[project.statut]}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Horizon</dt>
                  <dd className="font-semibold">{HORIZON_LABELS[project.horizon_temps]}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Catégorie</dt>
                  <dd className="font-semibold">{project.categorie}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Date de l’idée</dt>
                  <dd className="text-right font-semibold">{formatIdeaDate(project.date_creation)}</dd>
                </div>
              </dl>

              {project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 border-t border-border pt-5">
                  {project.tags.map((tag) => (
                    <span key={tag} className="tag-chip">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="border-t border-border pt-5">
                <div className="mb-2 flex items-baseline justify-between">
                  <span className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">Maturité de la fiche</span>
                  <span className="text-sm font-semibold" style={{ color: accent }}>
                    {maturity.level}
                  </span>
                </div>
                <div className="flex gap-1" aria-label={`${maturity.score} sur ${maturity.total}`}>
                  {maturity.checks.map((c) => (
                    <span
                      key={c.key}
                      className="h-1.5 flex-1 rounded-full"
                      style={{ background: c.done ? accent : "hsl(var(--muted))" }}
                    />
                  ))}
                </div>
                {maturity.score < maturity.total && (
                  <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                    {maturity.checks
                      .filter((c) => !c.done)
                      .slice(0, 3)
                      .map((c) => (
                        <li key={c.key} className="flex items-center gap-1.5">
                          <span className="h-1 w-1 rounded-full bg-muted-foreground/60" />À ajouter : {c.label.toLowerCase()}
                        </li>
                      ))}
                  </ul>
                )}
                {maturity.score === maturity.total && (
                  <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Check className="h-3.5 w-3.5" /> Fiche complète
                  </p>
                )}
              </div>

              {project.est_espace_travail && (
                <Link href={`/projet/${project.id}/workspace`} className="block">
                  <Button variant="gradient" className="w-full">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Ouvrir l’espace de travail
                  </Button>
                </Link>
              )}
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetailView;
