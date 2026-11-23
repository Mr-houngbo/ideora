"use client";

import { useRef, type ComponentType, type ReactNode } from "react";
import { useInView } from "framer-motion";
import {
  BookOpen,
  Check,
  Coins,
  Crown,
  DoorClosed,
  DoorOpen,
  Gavel,
  Heart,
  Landmark,
  ScrollText,
  Sparkles,
  Target,
  Telescope,
  X,
  type LucideProps,
} from "lucide-react";
import { Reveal, useCountUp, type ShowcaseComponentProps } from "./shared";

/*
 * Perseus, drawn with Ideora's own identity: Plus Jakarta Sans, the violet →
 * rose gradient, glass cards, soft orbs, and the same light and dark themes as
 * the rest of the site. The content is the circle's charter.
 */

const COUNCIL = [
  { icon: Crown, role: "Président", alias: "Le Fondateur", desc: "Garde la vision, tranche en dernier ressort." },
  { icon: Coins, role: "Trésorier Général", alias: "Le Gardien des Coffres", desc: "Garde le capital, tient la comptabilité, signe les mouvements." },
  { icon: ScrollText, role: "Secrétaire Général", alias: "La Voix du Cercle", desc: "Organise les réunions hebdomadaires, tient l'ordre du jour." },
  { icon: BookOpen, role: "Archives & Mémoire", alias: "Le Chroniqueur", desc: "Conserve les procès-verbaux, les décisions, les lectures." },
  { icon: Gavel, role: "Avocat du Club", alias: "Le Juriste", desc: "Veille au respect des règles, encadre les sorties et conflits." },
];

const PILLARS = [
  { icon: Telescope, title: "Vision", desc: "Devenir le cercle de référence d'investisseurs africains éclairés : patients, disciplinés, redoutables." },
  { icon: Target, title: "Mission", desc: "Bâtir un capital intellectuel et financier commun par la lecture, le débat et l'investissement collectif." },
  { icon: Landmark, title: "But", desc: "Atteindre, en dix ans, une masse critique qui nous permette de diriger des projets, des entreprises, une économie." },
];

const ROADMAP = [
  { when: "6 mois", title: "Le Fondement", desc: "Statuts, règlement intérieur, première bibliothèque commune. 12 livres lus, 4 certifications visées." },
  { when: "1 an", title: "L'Éducation", desc: "Maîtrise de la bourse, de l'économie africaine et mondiale. Chaque membre dispose d'un plan d'investissement à 10 ans." },
  { when: "3 ans", title: "Le Capital", desc: "Cotisations régulières, portefeuille collectif diversifié. Premiers investissements dans des entreprises ciblées." },
  { when: "10 ans", title: "L'Empire", desc: "Locaux, investissements dans les projets de nos membres contre des parts. Influence sur une économie entière." },
];

const RITUALS = [
  { title: "Lecture obligatoire", desc: "Un livre par mois. Résumé écrit avant la réunion suivante." },
  { title: "Débat hebdomadaire", desc: "Une heure de discussion : macro, micro, géopolitique, valeur." },
  { title: "Suivi des plans", desc: "Chaque membre présente l'avancement de son plan d'investissement." },
  { title: "Cotisation collective", desc: "Versement mensuel au trésor commun pour les positions du cercle." },
  { title: "Formation & certification", desc: "CFA, AMF, Bloomberg, finance comportementale : niveau imposé." },
  { title: "Veille partagée", desc: "Chaque membre alimente la mémoire commune : signaux, risques." },
];

const DEVOIRS = [
  "Lire, débattre, écouter sans interrompre.",
  "Verser sa cotisation à date fixe, sans rappel.",
  "Présenter ses pertes avec la même clarté que ses gains.",
  "Parrainer une seule personne par an, et s'en porter garant.",
  "Élever le niveau du cercle, jamais le tirer vers le bas.",
];

const INTERDITS = [
  "Trahir le secret des décisions internes.",
  "Spéculer avec le capital commun sans vote.",
  "Mentir sur ses chiffres ou son avancement.",
  "Faire entrer un inconnu sans parrainage validé.",
  "Utiliser le cercle pour un intérêt strictement personnel.",
];

const PARRAINAGE = [
  "Un seul filleul par membre, par an.",
  "Le parrain se porte garant moralement et financièrement.",
  "Période d'observation de 3 mois avant vote final.",
  "Vote à l'unanimité du conseil pour l'admission.",
  "Faute grave du filleul = exclusion du parrain.",
];

const SORTIE = [
  "Restitution de la quote-part au prix de marché.",
  "Délai de remboursement fixé à 90 jours maximum.",
  "Clause de confidentialité maintenue à vie.",
  "Aucun impact sur les positions du cercle restant.",
  "Sortie volontaire ou exclusion : même procédure.",
];

const STATS = [
  { target: 12, label: "livres par an et par membre" },
  { target: 52, label: "réunions par an" },
  { target: 10, label: "ans d'horizon" },
  { target: 1, label: "filleul par membre et par an" },
];

function Stat({ target, label }: { target: number; label: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const value = useCountUp(target, inView);
  return (
    <div ref={ref} className="glass rounded-2xl px-5 py-4 shadow-card">
      <div className="gradient-text text-3xl font-extrabold tabular-nums md:text-4xl">{value}</div>
      <div className="mt-1 text-xs font-medium leading-snug text-muted-foreground">{label}</div>
    </div>
  );
}

/** The circle's mark: a Π in a hexagon, in the site's gradient. */
function Crest({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="perseusCrest" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(265 85% 60%)" />
          <stop offset="55%" stopColor="hsl(290 80% 62%)" />
          <stop offset="100%" stopColor="hsl(350 85% 62%)" />
        </linearGradient>
      </defs>
      <polygon points="60,6 107,33 107,87 60,114 13,87 13,33" fill="url(#perseusCrest)" />
      <polygon points="60,20 95,40 95,80 60,100 25,80 25,40" fill="none" stroke="white" strokeOpacity="0.35" strokeWidth="1.2" />
      <text x="60" y="76" textAnchor="middle" fontSize="44" fontWeight={800} fill="white" fontFamily="inherit">
        &#928;
      </text>
    </svg>
  );
}

function IconTile({ icon: Icon, className }: { icon: ComponentType<LucideProps>; className?: string }) {
  return (
    <span
      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-glow ${className ?? ""}`}
      style={{ backgroundImage: "var(--gradient-primary)" }}
    >
      <Icon className="h-5 w-5" />
    </span>
  );
}

function Section({ index, eyebrow, title, sub, children }: { index: string; eyebrow: string; title: string; sub?: string; children: ReactNode }) {
  return (
    <section className="container max-w-6xl py-14 md:py-20">
      <Reveal>
        <header className="mb-10 max-w-2xl">
          <p className="mb-3 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-primary">
            <span className="tabular-nums text-muted-foreground">{index}</span>
            <span className="h-px w-8 bg-primary/40" />
            {eyebrow}
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-balance md:text-4xl">{title}</h2>
          {sub && <p className="mt-3 text-muted-foreground">{sub}</p>}
        </header>
        {children}
      </Reveal>
    </section>
  );
}

export default function PerseusShowcase(_props: ShowcaseComponentProps) {
  return (
    <div className="relative overflow-x-clip">
      {/* Hero */}
      <section className="hero-premium relative isolate">
        <div className="orb orb-1 -z-10" />
        <div className="orb orb-2 -z-10" />
        <div className="container max-w-6xl pb-16 pt-14 md:pb-24 md:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div>
              <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-primary shadow-card">
                <Sparkles className="h-3.5 w-3.5" />
                Club privé · Fondé en 2025
              </span>
              <h1 className="mt-6 text-6xl font-extrabold leading-none tracking-tight md:text-8xl">
                <span className="gradient-text">Perseus</span>
              </h1>
              <p className="mt-6 max-w-2xl text-xl font-semibold leading-snug text-foreground text-balance md:text-2xl">
                Couper la tête de Méduse : vaincre l&apos;ignorance financière.
              </p>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Un cercle fermé d&apos;éducation financière et d&apos;investissement. Nous lisons, nous débattons, nous
                capitalisons. Ensemble, nous bâtissons des fortunes patientes et une mémoire commune.
              </p>
              <p className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent">
                <Heart className="h-4 w-4 fill-current" />
                En hommage à mon petit frère
              </p>
            </div>
            <div className="mx-auto w-full max-w-[340px]">
              <div className="glass-strong relative rounded-3xl p-8 shadow-card-hover">
                <Crest className="mx-auto h-28 w-28 drop-shadow-xl" />
                <p className="mt-5 text-center text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">Sub rosa</p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {STATS.map((s) => (
                    <Stat key={s.label} target={s.target} label={s.label} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* I. The oath */}
      <Section index="01" eyebrow="Le serment" title="Ce que nous sommes">
        <figure className="card-premium relative rounded-3xl border border-border/60 p-8 shadow-card md:p-12">
          <div className="absolute inset-y-0 left-0 w-1.5" style={{ backgroundImage: "var(--gradient-primary)" }} />
          <blockquote className="space-y-2 text-2xl font-semibold leading-snug tracking-tight md:text-3xl">
            <p>Nous ne sommes pas des spéculateurs.</p>
            <p>
              Nous sommes des <span className="gradient-text">bâtisseurs patients</span>.
            </p>
            <p className="text-muted-foreground">Nous lisons ce que la foule ignore.</p>
            <p className="text-muted-foreground">Nous capitalisons quand la foule consomme.</p>
            <p>Nous construisons une fortune qui survit à nos noms.</p>
          </blockquote>
          <figcaption className="mt-8 text-sm font-semibold text-primary">Le Cercle Perseus</figcaption>
        </figure>
      </Section>

      {/* II. Pillars */}
      <Section index="02" eyebrow="Les trois piliers" title="Vision, mission, but">
        <div className="grid gap-5 md:grid-cols-3">
          {PILLARS.map((p) => (
            <article key={p.title} className="glass rounded-3xl p-7 shadow-card transition-shadow hover:shadow-card-hover">
              <IconTile icon={p.icon} />
              <h3 className="mt-5 text-xl font-bold">{p.title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{p.desc}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* III. Council */}
      <Section index="03" eyebrow="Le conseil" title="Les cinq postes" sub="Évolutifs avec la croissance du cercle.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {COUNCIL.map((c, i) => (
            <article key={c.role} className="glass flex flex-col rounded-2xl p-5 shadow-card transition-transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <c.icon className="h-5 w-5" />
                </span>
                <span className="text-xs font-bold tabular-nums text-muted-foreground">0{i + 1}</span>
              </div>
              <h3 className="mt-4 font-bold leading-tight">{c.role}</h3>
              <p className="mt-0.5 text-xs font-semibold text-accent">{c.alias}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* IV. Trajectory */}
      <Section index="04" eyebrow="La trajectoire" title="Dix années">
        <ol className="relative grid gap-6 md:grid-cols-4 md:gap-5">
          <div
            aria-hidden="true"
            className="absolute left-[19px] top-2 bottom-2 w-0.5 rounded-full opacity-60 md:left-5 md:right-[calc(25%-1.5rem)] md:top-[19px] md:bottom-auto md:h-0.5 md:w-auto"
            style={{ backgroundImage: "var(--gradient-primary)" }}
          />
          {ROADMAP.map((r, i) => (
            <li key={r.title} className="relative flex gap-4 md:block">
              <span
                className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-extrabold text-white shadow-glow ring-4 ring-background"
                style={{ backgroundImage: "var(--gradient-primary)" }}
              >
                {i + 1}
              </span>
              <div className="glass rounded-2xl p-5 shadow-card md:mt-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{r.when}</p>
                <h3 className="mt-1 text-lg font-bold">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* V. Rituals */}
      <Section index="05" eyebrow="Les rituels" title="Le travail du cercle">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {RITUALS.map((r, i) => (
            <article key={r.title} className="group flex gap-4 rounded-2xl border border-border/60 bg-card/60 p-5 transition-colors hover:border-primary/40">
              <span className="gradient-text text-2xl font-extrabold tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="font-bold">{r.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{r.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* VI. Code */}
      <Section index="06" eyebrow="Le code" title="Devoirs et interdits">
        <div className="grid gap-5 md:grid-cols-2">
          <article className="glass rounded-3xl p-7 shadow-card">
            <h3 className="flex items-center gap-2 text-lg font-bold">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-success/15 text-success">
                <Check className="h-4 w-4" />
              </span>
              Les devoirs
            </h3>
            <ul className="mt-5 space-y-3">
              {DEVOIRS.map((d) => (
                <li key={d} className="flex gap-3 leading-relaxed">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-success" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </article>
          <article className="glass rounded-3xl p-7 shadow-card">
            <h3 className="flex items-center gap-2 text-lg font-bold">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/15 text-destructive">
                <X className="h-4 w-4" />
              </span>
              Les interdits
            </h3>
            <ul className="mt-5 space-y-3">
              {INTERDITS.map((d) => (
                <li key={d} className="flex gap-3 leading-relaxed">
                  <X className="mt-1 h-4 w-4 shrink-0 text-destructive" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </Section>

      {/* VII. The door */}
      <Section index="07" eyebrow="La porte" title="Entrer, sortir">
        <div className="grid gap-5 md:grid-cols-2">
          {[
            { icon: DoorOpen, title: "Parrainage", steps: PARRAINAGE },
            { icon: DoorClosed, title: "Sortie propre", steps: SORTIE },
          ].map((g) => (
            <article key={g.title} className="glass rounded-3xl p-7 shadow-card">
              <div className="flex items-center gap-3">
                <IconTile icon={g.icon} />
                <h3 className="text-lg font-bold">{g.title}</h3>
              </div>
              <ol className="mt-6 space-y-3">
                {g.steps.map((s, i) => (
                  <li key={s} className="flex gap-3 leading-relaxed">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </Section>

      {/* Dedication */}
      <section className="container max-w-6xl pb-16 pt-4 md:pb-24">
        <Reveal>
          <div
            className="relative overflow-hidden rounded-3xl px-8 py-14 text-center text-white shadow-glow md:px-16 md:py-20"
            style={{ backgroundImage: "var(--gradient-primary)" }}
          >
            <div aria-hidden="true" className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <div aria-hidden="true" className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-black/10 blur-2xl" />
            <Heart className="mx-auto h-8 w-8 fill-white/90" />
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.3em] text-white/80">En hommage à</p>
            <h2 className="mt-2 text-5xl font-extrabold tracking-tight md:text-6xl">Perseus</h2>
            <blockquote className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-relaxed text-white/95 md:text-xl">
              « Ce cercle porte ton nom. Chaque livre lu, chaque décision prise, chaque fortune bâtie sera une lettre
              écrite à ta mémoire. »
            </blockquote>
          </div>
        </Reveal>
        <p className="mt-8 text-center text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Cercle Perseus · 2025 · Sub rosa
        </p>
      </section>
    </div>
  );
}
