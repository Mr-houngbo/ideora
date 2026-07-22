"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Crown, Coins, ScrollText, BookOpen, Gavel, Heart, Check, X } from "lucide-react";
import { cinzel, cormorantGaramond, jetbrainsMono } from "./fonts";
import styles from "./PerseusShowcase.module.css";

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function useCountUp(target: number, start: boolean, duration = 1400) {
  const [value, setValue] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!start) return;
    if (reduceMotion) {
      setValue(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const progress = Math.min((t - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start, reduceMotion]);

  return value;
}

function Stat({ target, label }: { target: number; label: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const value = useCountUp(target, inView);
  return (
    <div ref={ref} className={styles.stat}>
      <div className={styles.statNumber}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

function Crest() {
  return (
    <div className={styles.crest} aria-hidden="true">
      <svg viewBox="0 0 120 120" width="116" height="116">
        <defs>
          <linearGradient id="crestGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F0CE7A" />
            <stop offset="100%" stopColor="#6B551F" />
          </linearGradient>
        </defs>
        <g className={styles.ringOuter}>
          <circle cx="60" cy="60" r="56" fill="none" stroke="#6b551f" strokeWidth="0.6" strokeDasharray="1 7" />
        </g>
        <g className={styles.ringInner}>
          <circle cx="60" cy="60" r="46" fill="none" stroke="#c9a24c" strokeWidth="0.5" strokeDasharray="3 5" opacity="0.7" />
        </g>
        <polygon points="60,20 95,40 95,80 60,100 25,80 25,40" fill="none" stroke="url(#crestGold)" strokeWidth="1.4" />
        <polygon points="60,32 84,45 84,75 60,88 36,75 36,45" fill="none" stroke="#c9a24c" strokeWidth="0.6" opacity="0.55" />
        <text x="60" y="76" textAnchor="middle" fontFamily="var(--font-cinzel)" fontSize="38" fontWeight={700} fill="url(#crestGold)">
          &#928;
        </text>
      </svg>
    </div>
  );
}

function Stars() {
  const points: [number, number, number][] = [
    [120, 90, 2.2], [210, 140, 1.6], [300, 70, 1.8], [390, 180, 1.4], [470, 100, 2], [560, 210, 1.5],
    [660, 80, 1.9], [720, 190, 1.4], [180, 270, 1.6], [340, 310, 1.3], [500, 290, 1.8], [630, 350, 1.4],
    [140, 410, 1.5], [280, 450, 1.3], [440, 430, 1.7], [580, 470, 1.4], [690, 430, 1.6], [760, 510, 1.3],
  ];
  const lines: [number, number, number, number][] = [
    [120, 90, 210, 140], [210, 140, 300, 70], [300, 70, 390, 180], [470, 100, 560, 210], [180, 270, 340, 310], [340, 310, 500, 290],
  ];
  return (
    <svg className={styles.stars} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="star">
          <stop offset="0%" stopColor="#F0CE7A" stopOpacity="1" />
          <stop offset="100%" stopColor="#F0CE7A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g fill="url(#star)">
        {points.map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} />
        ))}
      </g>
      <g stroke="#C9A24C" strokeWidth="0.4" opacity="0.4">
        {lines.map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
        ))}
      </g>
    </svg>
  );
}

const COUNCIL = [
  { icon: Crown, num: "01", role: "Président", alias: "Le Fondateur", desc: "Garde la vision, tranche en dernier ressort." },
  { icon: Coins, num: "02", role: "Trésorier Général", alias: "Le Gardien des Coffres", desc: "Garde le capital, tient la comptabilité, signe les mouvements." },
  { icon: ScrollText, num: "03", role: "Secrétaire Général", alias: "La Voix du Cercle", desc: "Organise les réunions hebdomadaires, tient l'ordre du jour." },
  { icon: BookOpen, num: "04", role: "Archives & Mémoire", alias: "Le Chroniqueur", desc: "Conserve les procès-verbaux, les décisions, les lectures." },
  { icon: Gavel, num: "05", role: "Avocat du Club", alias: "Le Juriste", desc: "Veille au respect des règles, encadre les sorties et conflits." },
];

const ROADMAP = [
  { when: "6 Mois", title: "Le Fondement", desc: "Statuts, règlement intérieur, première bibliothèque commune. 12 livres lus, 4 certifications visées.", node: "I" },
  { when: "1 An", title: "L'Éducation", desc: "Maîtrise de la bourse, de l'économie africaine et mondiale. Chaque membre dispose d'un plan d'investissement à 10 ans.", node: "II" },
  { when: "3 Ans", title: "Le Capital", desc: "Cotisations régulières, portefeuille collectif diversifié. Premiers investissements dans des entreprises ciblées.", node: "III" },
  { when: "10 Ans", title: "L'Empire", desc: "Locaux, investissements dans les projets de nos membres contre des parts. Influence sur une économie entière.", node: "IV" },
];

const RITUALS = [
  { num: "01", title: "Lecture obligatoire", desc: "Un livre par mois. Résumé écrit avant la réunion suivante." },
  { num: "02", title: "Débat hebdomadaire", desc: "Une heure de discussion : macro, micro, géopolitique, valeur." },
  { num: "03", title: "Suivi des plans", desc: "Chaque membre présente l'avancement de son plan d'investissement." },
  { num: "04", title: "Cotisation collective", desc: "Versement mensuel au trésor commun pour les positions du cercle." },
  { num: "05", title: "Formation & certification", desc: "CFA, AMF, Bloomberg, finance comportementale — niveau imposé." },
  { num: "06", title: "Veille partagée", desc: "Chaque membre alimente la mémoire commune : signaux, risques." },
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

export default function PerseusShowcase() {
  return (
    <div className={`${styles.showcase} ${cinzel.variable} ${cormorantGaramond.variable} ${jetbrainsMono.variable}`}>
      <div className={styles.grain} aria-hidden="true" />

      <section className={styles.hero}>
        <Stars />
        <div className={styles.heroInner}>
          <Crest />
          <span className={styles.eyebrowRow}>
            <span className={styles.eyebrow}>Club Privé · Fondé 2025</span>
          </span>
          <h1 className={styles.heroTitle}>PERSEUS</h1>
          <p className={styles.motto}>&laquo;&nbsp;Couper la tête de Méduse — vaincre l&apos;ignorance financière.&nbsp;&raquo;</p>
          <p className={styles.lede}>
            Un cercle fermé d&apos;éducation financière et d&apos;investissement. Nous lisons, nous débattons, nous capitalisons.
            Ensemble, nous bâtissons des fortunes patientes et une mémoire commune.
          </p>
          <p className={styles.hommage}>En hommage à mon petit frère</p>
          <div className={styles.scrollCue} />
        </div>
      </section>

      <section className={styles.bandA}>
        <Reveal>
          <div className={`${styles.wrap} ${styles.center}`}>
            <div className={styles.sectionHeader}>
              <span className={styles.eyebrow}>I · Le Serment</span>
              <div className={styles.divider} />
            </div>
            <div className={styles.markOpen} aria-hidden="true">&laquo;</div>
            <blockquote className={styles.manifestoQuote}>
              Nous ne sommes pas des spéculateurs.
              <br />
              Nous sommes des <span className={styles.accent}>bâtisseurs patients</span>.
              <br />
              Nous lisons ce que la foule ignore.
              <br />
              Nous capitalisons quand la foule consomme.
              <br />
              Nous construisons une fortune qui survit à nos noms.
            </blockquote>
            <p className={styles.attribution}>— Le Cercle Perseus —</p>
          </div>
        </Reveal>
      </section>

      <section className={styles.bandB}>
        <Reveal>
          <div className={styles.wrapWide}>
            <div className={styles.sectionHeader}>
              <span className={styles.eyebrow}>II · Les Trois Piliers</span>
              <h2>Vision · Mission · But</h2>
            </div>
            <div className={styles.pillarsGrid}>
              <div className={styles.pillar}>
                <span className={styles.pillarGlyph}>◆</span>
                <h3>Vision</h3>
                <p>Devenir le cercle de référence d&apos;investisseurs africains éclairés — patients, disciplinés, redoutables.</p>
              </div>
              <div className={styles.pillar}>
                <span className={styles.pillarGlyph}>◇</span>
                <h3>Mission</h3>
                <p>Bâtir un capital intellectuel et financier commun par la lecture, le débat et l&apos;investissement collectif.</p>
              </div>
              <div className={styles.pillar}>
                <span className={styles.pillarGlyph}>✦</span>
                <h3>But</h3>
                <p>Atteindre, en dix ans, une masse critique qui nous permette de diriger des projets, des entreprises, une économie.</p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className={styles.bandA}>
        <Reveal>
          <div className={styles.wrapWide}>
            <div className={styles.sectionHeader}>
              <span className={styles.eyebrow}>III · Le Conseil</span>
              <h2>Les Cinq Postes</h2>
              <p className={styles.sectionSub}>Évolutifs avec la croissance du cercle.</p>
            </div>
            <div className={styles.councilGrid}>
              {COUNCIL.map((c) => (
                <div key={c.num} className={styles.councilCard}>
                  <c.icon className={styles.councilIcon} />
                  <span className={styles.councilNum}>{c.num}</span>
                  <h3>{c.role}</h3>
                  <p className={styles.councilAlias}>{c.alias}</p>
                  <p>{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section className={styles.bandB}>
        <Reveal>
          <div className={styles.wrapWide} style={{ position: "relative" }}>
            <div className={styles.sectionHeader}>
              <span className={styles.eyebrow}>IV · La Trajectoire</span>
              <h2>Dix Années</h2>
            </div>
            <div style={{ position: "relative" }}>
              <div className={styles.spine} />
              {ROADMAP.map((r, i) => (
                <div key={r.node} className={`${styles.rmRow} ${i % 2 === 0 ? styles.rmRowLeft : styles.rmRowRight}`}>
                  <div className={styles.rmCard}>
                    <span className={styles.rmWhen}>{r.when}</span>
                    <h3>{r.title}</h3>
                    <p>{r.desc}</p>
                  </div>
                  <div className={styles.rmNode}>{r.node}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section className={styles.bandA}>
        <Reveal>
          <div className={styles.wrapWide}>
            <div className={styles.sectionHeader}>
              <span className={styles.eyebrow}>V · Les Rituels</span>
              <h2>Le Travail du Cercle</h2>
            </div>
            <div className={styles.ritualsGrid}>
              {RITUALS.map((r) => (
                <div key={r.num} className={styles.ritual}>
                  <span className={styles.ritualNum}>{r.num}</span>
                  <h3>{r.title}</h3>
                  <p>{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section className={styles.bandB}>
        <Reveal>
          <div className={styles.wrapWide}>
            <div className={styles.sectionHeader}>
              <span className={styles.eyebrow}>VI · Le Code</span>
              <h2>Commandements &amp; Interdits</h2>
            </div>
            <div className={styles.codeGrid}>
              <div className={`${styles.codeCard} ${styles.codeCardDevoirs}`}>
                <h3>Les Devoirs</h3>
                <ul>
                  {DEVOIRS.map((d) => (
                    <li key={d}>
                      <Check className={styles.codeMark} size={16} />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`${styles.codeCard} ${styles.codeCardInterdits}`}>
                <h3>Les Interdits</h3>
                <ul>
                  {INTERDITS.map((d) => (
                    <li key={d}>
                      <X className={styles.codeMark} size={16} />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className={styles.bandA}>
        <Reveal>
          <div className={styles.wrapWide}>
            <div className={styles.sectionHeader}>
              <span className={styles.eyebrow}>VII · La Porte</span>
              <h2>Entrer · Sortir</h2>
            </div>
            <div className={styles.gateGrid}>
              <div className={styles.gateCard}>
                <h3>Parrainage</h3>
                <ol>
                  <li>Un seul filleul par membre, par an.</li>
                  <li>Le parrain se porte garant moralement et financièrement.</li>
                  <li>Période d&apos;observation de 3 mois avant vote final.</li>
                  <li>Vote à l&apos;unanimité du conseil pour l&apos;admission.</li>
                  <li>Faute grave du filleul = exclusion du parrain.</li>
                </ol>
              </div>
              <div className={styles.gateCard}>
                <h3>Sortie Propre</h3>
                <ol>
                  <li>Restitution de la quote-part au prix de marché.</li>
                  <li>Délai de remboursement fixé à 90 jours maximum.</li>
                  <li>Clause de confidentialité maintenue à vie.</li>
                  <li>Aucun impact sur les positions du cercle restant.</li>
                  <li>Sortie volontaire ou exclusion : même procédure.</li>
                </ol>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className={styles.bandB}>
        <Reveal>
          <div className={styles.wrapWide}>
            <div className={styles.sectionHeader}>
              <span className={styles.eyebrow}>VIII · La Mesure</span>
              <h2>Les Chiffres du Cercle</h2>
            </div>
            <div className={styles.numbersGrid}>
              <Stat target={12} label="Livres / an / membre" />
              <Stat target={52} label="Réunions par an" />
              <Stat target={10} label="Ans d'horizon" />
              <Stat target={1} label="Filleul / membre / an" />
            </div>
          </div>
        </Reveal>
      </section>

      <section className={styles.dedication}>
        <Reveal>
          <Heart className={styles.dedicationGlyph} size={32} />
          <span className={styles.eyebrow}>En hommage à</span>
          <h2 className={styles.dedicationTitle}>PERSEUS</h2>
          <blockquote className={styles.dedicationQuote}>
            &laquo;&nbsp;Ce cercle porte ton nom.
            <br />
            Chaque livre lu, chaque décision prise, chaque fortune bâtie
            <br />
            sera une lettre écrite à ta mémoire.&nbsp;&raquo;
          </blockquote>
          <div className={styles.rule} />
        </Reveal>
      </section>

      <footer className={styles.footer}>Cercle Perseus · MMXXV · Sub Rosa</footer>
    </div>
  );
}
