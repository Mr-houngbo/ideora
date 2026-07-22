"use client";

import { archivoBlack, sourceSerif } from "./fonts";
import { Reveal, useCountdownDays, type ShowcaseComponentProps } from "./shared";
import styles from "./VisionEducationShowcase.module.css";

const DIAGNOSTIC = [
  { number: "70%", desc: "des diplômés sans emploi adéquat" },
  { number: "2/10", desc: "élèves maîtrisent les compétences de base en fin de primaire" },
  { number: "45%", desc: "de fuite des cerveaux parmi les diplômés du supérieur" },
];

const PILLARS = [
  { num: "01", title: "Le documentaire — Créer l'émotion", desc: "Un film vu partout en Afrique, qui montre la réalité et inspire le changement. L'émotion comme moteur de la viralité." },
  { num: "02", title: "Le livre — Donner la profondeur", desc: "Un manifeste qui propose un nouveau modèle éducatif, ancré dans les réalités béninoises et nourri des meilleures pratiques mondiales." },
  { num: "03", title: "Le groupe scolaire — Prouver par l'action", desc: "Une école qui prouve que c'est possible. Des résultats mesurables. Une preuve vivante que le modèle fonctionne." },
];

const PHASES = [
  { years: "Années 1–3", title: "Fondations", role: "Étudiant chercheur", current: true, items: ["Rapports PISA, réformes finlandaise et singapourienne", "John Dewey, Ken Robinson, Paulo Freire", "Blog, LinkedIn, X — poser sa voix"] },
  { years: "Années 3–7", title: "Création", role: "Auteur & cinéaste", current: false, items: ["Identifier les familles à suivre dès maintenant", "Rédiger le manifeste en FR + EN", "Viser Netflix Africa, coproducteurs, ONG"] },
  { years: "Années 7–13", title: "Expérimentation", role: "Fondateur", current: false, items: ["1 école primaire selon le modèle", "Mesurer, documenter, ajuster chaque année", "Publier des résultats vs système classique"] },
  { years: "Années 13–20", title: "Impact systémique", role: "Réformateur", current: false, items: ["Franchise / open-source du modèle", "Collaboration avec le Ministère", "Formation de la prochaine génération"] },
];

const FUEL = [
  <>Je ne viens pas d&apos;un milieu qui m&apos;a <em>tout donné</em>.</>,
  <>Je viens d&apos;un pays où des millions d&apos;enfants brillants sont <em>éteints</em> par un système qui ne sait pas les voir.</>,
  <>Je refuse d&apos;accepter que le lieu de naissance détermine <em>le plafond d&apos;un esprit</em>.</>,
  <>Je ne fais pas ça pour être célèbre. Je fais ça parce que <em>quelqu&apos;un doit le faire</em>.</>,
  <>Chaque jour que je travaille sur ce projet est un jour <em>volé au statu quo</em>.</>,
];

export default function VisionEducationShowcase(_props: ShowcaseComponentProps) {
  const days = useCountdownDays("2025-03-01");

  return (
    <div className={`${styles.showcase} ${archivoBlack.variable} ${sourceSerif.variable}`}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>Manifeste · Plan 20 ans</span>
          <h1 className={styles.heroTitle}>
            Je vais changer <span className={styles.red}>l&apos;éducation</span> au Bénin.
          </h1>
          <div className={styles.dayCounter}>
            <span className={styles.dayCounterNumber}>{days}</span>
            <span className={styles.dayCounterLabel}>
              jours depuis le 1er mars 2025
              <br />
              sur un horizon de 20 ans
            </span>
          </div>
          <p className={styles.mandela}>
            « L&apos;éducation est l&apos;arme la plus puissante qu&apos;on puisse utiliser pour changer le monde. »
            <span className={styles.mandelaAttr}>— Nelson Mandela</span>
          </p>
        </div>
      </section>

      <section className={styles.bandB}>
        <Reveal>
          <div className={styles.wrapWide}>
            <div className={styles.sectionHeader}>
              <span className={styles.eyebrow}>Le Diagnostic</span>
              <h2>Pourquoi le système béninois échoue</h2>
            </div>
            <div className={styles.diagGrid}>
              {DIAGNOSTIC.map((d) => (
                <div key={d.desc} className={styles.diagCard}>
                  <div className={styles.diagNumber}>{d.number}</div>
                  <p>{d.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section className={styles.bandA}>
        <Reveal>
          <div className={styles.wrap}>
            <div className={styles.sectionHeader}>
              <span className={styles.eyebrow}>La Vision</span>
              <h2>Trois piliers. Un même objectif.</h2>
              <p className={styles.sectionSub}>Prouver qu&apos;une autre éducation est possible au Bénin — et la construire.</p>
            </div>
            <div className={styles.pillarList}>
              {PILLARS.map((p) => (
                <div key={p.num} className={styles.pillarRow}>
                  <span className={styles.pillarNum}>{p.num}</span>
                  <div className={styles.pillarBody}>
                    <h3>{p.title}</h3>
                    <p>{p.desc}</p>
                  </div>
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
              <span className={styles.eyebrow}>La Feuille de Route</span>
              <h2>Le plan sur 20 ans</h2>
              <p className={styles.sectionSub}>
                Chaque phase nourrit la suivante — la recherche légitime le livre, le livre légitime l&apos;école, l&apos;école
                légitime la réforme.
              </p>
            </div>
            <div className={styles.phaseGrid}>
              {PHASES.map((p) => (
                <div key={p.title} className={styles.phaseCard}>
                  <span className={styles.phaseYears}>
                    {p.years}
                    {p.current && <span className={styles.phaseBadge}>En cours</span>}
                  </span>
                  <h3>{p.title}</h3>
                  <p className={styles.phaseRole}>{p.role}</p>
                  <ul>
                    {p.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section className={styles.bandA}>
        <Reveal>
          <div className={styles.wrap}>
            <div className={styles.sectionHeader}>
              <span className={styles.eyebrow}>Le Fuel Personnel</span>
              <h2>Ce qui me pousse</h2>
            </div>
            <div className={styles.fuelList}>
              {FUEL.map((item, i) => (
                <p key={i} className={styles.fuelItem}>
                  {item}
                </p>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerTitle}>Ce projet n&apos;appartient pas au futur. Il commence aujourd&apos;hui.</div>
        <p>Créé le 1er mars 2025</p>
      </footer>
    </div>
  );
}
