import { CalendarHeart, Check, Flag } from "lucide-react";
import RichMarkdown from "@/components/projects/RichMarkdown";
import ProjectCover from "@/components/projects/ProjectCover";
import ResourceList from "@/components/projects/ResourceList";
import { SHOWCASE_TEMPLATES } from "@/components/showcase";
import SharedFrame from "@/components/share/SharedFrame";
import { getAccentTheme } from "@/lib/accent-themes";
import { formatIdeaDate } from "@/lib/idea-dates";
import { formatDay } from "@/lib/journal";
import { HORIZON_LABELS, STATUS_COLORS, STATUS_LABELS, isEducationCategory, type JournalEntry, type Project } from "@/types/project";
import { cn } from "@/lib/utils";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">{children}</h2>;
}

function Milestones({ items }: { items: JournalEntry[] }) {
  if (items.length === 0) return null;
  const reached = items.filter((m) => m.fait_le).length;
  return (
    <section>
      <SectionTitle>
        Jalons · {reached}/{items.length} atteints
      </SectionTitle>
      <ol className="space-y-3">
        {[...items].reverse().map((m) => (
          <li key={m.id} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
            <span
              className={cn(
                "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                m.fait_le ? "bg-success text-success-foreground" : "bg-primary/10 text-primary",
              )}
            >
              {m.fait_le ? <Check className="h-3.5 w-3.5" /> : <Flag className="h-3.5 w-3.5" />}
            </span>
            <div>
              <p className="font-semibold">{m.titre}</p>
              {m.contenu && <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{m.contenu}</p>}
              <p className="mt-1 text-xs text-muted-foreground">
                {m.fait_le
                  ? `Atteint le ${formatIdeaDate(m.fait_le)}`
                  : m.date_prevue
                    ? `Prévu pour le ${formatDay(m.date_prevue)}`
                    : `Fixé le ${formatIdeaDate(m.ecrit_le)}`}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** Read-only page of one idea, opened by a share link. Expects a project already passed through toPublicProject. */
export default function SharedProjectView({
  project,
  milestones,
  backHref,
}: {
  project: Project;
  milestones: JournalEntry[];
  backHref?: string;
}) {
  const theme = getAccentTheme(project.accent_theme);
  const accent = project.accent_theme ? theme.solid : isEducationCategory(project.categorie) ? "hsl(var(--academic))" : "hsl(var(--primary))";
  const Showcase = project.custom_template ? SHOWCASE_TEMPLATES[project.custom_template] : null;
  const born = (
    <span className="inline-flex items-center gap-2">
      <CalendarHeart className="h-4 w-4" />
      Idée née le <time dateTime={project.date_creation} className="font-semibold">{formatIdeaDate(project.date_creation)}</time>
    </span>
  );

  if (Showcase) {
    return (
      <SharedFrame backHref={backHref}>
        <Showcase project={project} />
        <div className="container max-w-3xl space-y-10 py-12">
          <p className="text-sm text-muted-foreground">{born}</p>
          {project.contenu_riche && (
            <section>
              <SectionTitle>Le dossier complet</SectionTitle>
              <div className="rounded-3xl border border-border bg-card p-6 md:p-10" style={{ borderTop: `3px solid ${theme.solid}` }}>
                <RichMarkdown content={project.contenu_riche} theme={theme} />
              </div>
            </section>
          )}
          <Milestones items={milestones} />
        </div>
      </SharedFrame>
    );
  }

  return (
    <SharedFrame backHref={backHref}>
      <header className="relative isolate overflow-hidden">
        <ProjectCover project={project} eager className="absolute inset-0 -z-10 h-full w-full" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
        <div className="container max-w-5xl pb-12 pt-24 md:pb-16 md:pt-32">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/75">
            {project.categorie} · {HORIZON_LABELS[project.horizon_temps]}
          </p>
          <h1 className="max-w-4xl break-words text-4xl font-extrabold leading-[1.05] tracking-tight text-white text-balance hyphens-auto md:text-6xl">
            {project.titre}
          </h1>
          {project.description_courte && (
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85 md:text-xl">{project.description_courte}</p>
          )}
          <div className="mt-7 flex flex-wrap items-center gap-3 text-sm text-white/85">
            <span className={cn("rounded-full border bg-white/90 px-3 py-1 text-xs font-semibold", STATUS_COLORS[project.statut])}>
              {STATUS_LABELS[project.statut]}
            </span>
            {born}
          </div>
        </div>
      </header>

      <article className="container max-w-3xl space-y-14 py-12 md:py-16">
        {project.motivation && (
          <section>
            <SectionTitle>Pourquoi cette idée</SectionTitle>
            <blockquote className="border-l-4 pl-6 md:pl-8" style={{ borderColor: accent }}>
              <p className="whitespace-pre-line text-xl font-medium leading-relaxed md:text-2xl">{project.motivation}</p>
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
        <Milestones items={milestones} />
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <span key={t} className="tag-chip">
                {t}
              </span>
            ))}
          </div>
        )}
      </article>
    </SharedFrame>
  );
}
