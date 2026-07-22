"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { poppins, inter } from "./fonts";
import { Reveal, useCountUp, type ShowcaseComponentProps } from "./shared";
import styles from "./DahoShowcase.module.css";

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

const MODEL = [
  {
    num: "01",
    title: "Sélection par le mérite",
    items: ["Établissements publics ciblés (quartiers populaires)", "Épreuve unique pour tous les candidats", "100 meilleurs sélectionnés (CM2, 6e, 5e)", "Gratuit à 100% pour les enfants"],
  },
  {
    num: "02",
    title: "4 semaines immersives",
    items: ["S1-3 : école quotidienne (IA, Coding, IoT, Design)", "S4 : immersion totale, projet final, jury", "10 jeunes formateurs, 5 mentors", "Modèle « train-the-trainers »"],
  },
  {
    num: "03",
    title: "Communauté Daho",
    items: ["Accompagnement jusqu'au Bac (et au-delà)", "Plateforme e-learning permanente", "Parrainage alumni → nouveaux participants", "Challenges mensuels, rencontres trimestrielles"],
  },
];

const WEEKS = [
  { tag: "Semaine 1", title: "Alphabétisation numérique & IA", desc: "Qu'est-ce qu'un algorithme ? Comment l'IA transforme le monde. Mindset, objectifs personnels.", deliverable: "Carte mentale « Moi et la tech en 2030 »" },
  { tag: "Semaine 2", title: "Coding & Programmation", desc: "Scratch ou Python selon niveau. Logique, variables, boucles, conditions.", deliverable: "Petit jeu interactif ou chatbot simple" },
  { tag: "Semaine 3", title: "IoT, Électronique & Design", desc: "Arduino : capteurs, LEDs, moteurs. UI/UX basique, storytelling, pitch.", deliverable: "Prototype fonctionnel (alarme, station météo, robot)" },
  { tag: "Semaine 4", title: "Immersion & Réalisation", desc: "Hébergement complet. Groupes de 5, projet dans un domaine au choix.", deliverable: "Pitch de 3 min + slides + certificat" },
];

const ROADMAP = [
  { month: "Janvier", desc: "Constitution comité, association, négos partenaires" },
  { month: "Février", desc: "Finalisation partenariats (mairie, MTN, hôtel)" },
  { month: "Mars", desc: "Information établissements, lancement plateforme" },
  { month: "Avril-Mai", desc: "Recrutement formateurs, curriculum, supports" },
  { month: "Juin", desc: "Sélection, annonce des 100, formation formateurs" },
  { month: "Juil.-Août", desc: "Boot camp !" },
];

const BUDGET = [
  { poste: "Nourriture S1–3", detail: "100 enfants × 1500/j × 18j", montant: "2 700 000" },
  { poste: "Nourriture S4 immersion", detail: "115 pers. × 3000/j × 7j", montant: "2 415 000" },
  { poste: "Formation formateurs", detail: "10 formateurs logés/nourris 2 sem.", montant: "420 000" },
  { poste: "Mentors / experts", detail: "5 mentors × 100k", montant: "500 000" },
  { poste: "Kits IoT", detail: "20 kits Arduino × 15k", montant: "300 000" },
  { poste: "Supports pédagogiques", detail: "Impression, badges, certificats", montant: "200 000" },
  { poste: "Kits ressources", detail: "100 kits (livres, USB) × 5k", montant: "500 000" },
  { poste: "Laptops (meilleurs)", detail: "5 laptops × 150k", montant: "750 000" },
  { poste: "Box wifi 1 an", detail: "20 box × 50k", montant: "1 000 000" },
  { poste: "Communication", detail: "Flyers, médias, réseaux sociaux", montant: "300 000" },
  { poste: "Plateforme e-learning", detail: "Développement", montant: "500 000" },
  { poste: "Épreuve de sélection", detail: "Impression, correction", montant: "100 000" },
  { poste: "Imprévus", detail: "10% du total", montant: "1 150 000" },
];

const IMPACT = [
  {
    year: "2028 · Pilote",
    items: ["100 enfants initiés au code, IA, IoT", "20+ prototypes fonctionnels créés", "Taux de complétion >80%", "Communauté Daho lancée"],
  },
  {
    year: "2029-2030 · Scale",
    items: ["Déploiement Cotonou + Parakou", "300+ enfants formés cumulés", "Modèle économique pérenne validé", "Partenariats institutionnels solides"],
  },
  {
    year: "2035+ · Vision",
    items: ["Couverture nationale (12 départements)", "5000+ alumni actifs", "Premiers Daho en école d'ingé / startups", "Modèle répliqué en Afrique francophone"],
  },
];

export default function DahoShowcase(_props: ShowcaseComponentProps) {
  return (
    <div className={`${styles.showcase} ${poppins.variable} ${inter.variable}`}>
      <section className={styles.hero}>
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>Bootcamp Tech · Porto-Novo 2028</span>
          <h1 className={styles.heroTitle}>DAHO</h1>
          <p className={styles.heroTagline}>Former les géants de demain</p>
          <p className={styles.heroLede}>
            Un programme intensif de formation tech pour les enfants du Bénin — IA, Coding, IoT, Design.
          </p>
          <p className={styles.heroEtymology}>« Daho » = Grand en Fon</p>
        </div>
      </section>

      <section className={styles.bandA}>
        <Reveal>
          <div className={styles.wrapWide}>
            <div className={styles.sectionHeader}>
              <span className={styles.eyebrow}>La Vision</span>
              <h2>Rétablir les chances dès le bas âge</h2>
            </div>
            <div className={styles.contrastGrid}>
              <div className={styles.contrastCard}>
                <h3>Le constat</h3>
                <p>
                  Les élèves asiatiques sont très en avance sur les africains par manque d&apos;éducation et de moyens.
                  L&apos;accès à une éducation tech de haut niveau reste réservé aux familles aisées. Nos enfants démarrent
                  la course avec un handicap structurel.
                </p>
              </div>
              <div className={styles.contrastCard}>
                <h3>Notre ambition</h3>
                <p>
                  Créer la prochaine génération d&apos;innovateurs béninois capables de penser, créer et bâtir avec la
                  technologie. Commencer par Porto-Novo — mon village — et scaler à tout le Bénin.
                </p>
                <p className={styles.contrastQuote}>« Je dois rehausser le niveau de mes frères et sœurs du village. »</p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className={styles.bandB}>
        <Reveal>
          <div className={styles.wrapWide}>
            <div className={styles.sectionHeader}>
              <span className={styles.eyebrow}>Le Modèle</span>
              <h2>Un bootcamp intensif de 4 semaines</h2>
              <p className={styles.sectionSub}>Une communauté pour la vie.</p>
            </div>
            <div className={styles.featureGrid}>
              {MODEL.map((m) => (
                <div key={m.num} className={styles.featureCard}>
                  <span className={styles.featureNum}>{m.num}</span>
                  <h3>{m.title}</h3>
                  <ul>
                    {m.items.map((it) => (
                      <li key={it}>
                        <span className={styles.featureDot}>―</span>
                        <span>{it}</span>
                      </li>
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
          <div className={styles.wrapWide}>
            <div className={styles.sectionHeader}>
              <span className={styles.eyebrow}>Le Programme</span>
              <h2>Tous suivent le même parcours intégral</h2>
              <p className={styles.sectionSub}>La vie n&apos;a pas de tranches d&apos;âge.</p>
            </div>
            <div className={styles.weekGrid}>
              {WEEKS.map((w) => (
                <div key={w.tag} className={styles.weekCard}>
                  <span className={styles.weekTag}>{w.tag}</span>
                  <h3>{w.title}</h3>
                  <p>{w.desc}</p>
                  <p className={styles.weekDeliverable}>Livrable : {w.deliverable}</p>
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
              <span className={styles.eyebrow}>Phase Pilote — Porto-Novo 2028</span>
              <h2>Chiffres clés</h2>
            </div>
            <div className={styles.numbersGrid}>
              <Stat target={100} label="Enfants formés" />
              <Stat target={10} label="Formateurs" />
              <Stat target={5} label="Mentors / experts" />
              <Stat target={4} label="Semaines intensives" />
            </div>
          </div>
        </Reveal>
      </section>

      <section className={styles.bandA}>
        <Reveal>
          <div className={styles.wrapWide}>
            <div className={styles.sectionHeader}>
              <span className={styles.eyebrow}>Roadmap</span>
              <h2>Préparation du pilote</h2>
            </div>
            <div className={styles.roadmapGrid}>
              {ROADMAP.map((r) => (
                <div key={r.month} className={styles.roadmapItem}>
                  <span className={styles.roadmapMonth}>{r.month}</span>
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
              <span className={styles.eyebrow}>Budget Pilote</span>
              <h2>Estimation Porto-Novo 2028</h2>
              <p className={styles.sectionSub}>Scénario internat négocié — porteur de projet : 2M FCFA, partenaires à mobiliser : ~9,5M FCFA.</p>
            </div>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Poste</th>
                    <th>Détail</th>
                    <th>Montant (FCFA)</th>
                  </tr>
                </thead>
                <tbody>
                  {BUDGET.map((b) => (
                    <tr key={b.poste}>
                      <td>{b.poste}</td>
                      <td>{b.detail}</td>
                      <td>{b.montant}</td>
                    </tr>
                  ))}
                  <tr className={styles.total}>
                    <td>TOTAL</td>
                    <td></td>
                    <td>~11 500 000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      </section>

      <section className={styles.bandA}>
        <Reveal>
          <div className={styles.wrapWide}>
            <div className={styles.sectionHeader}>
              <span className={styles.eyebrow}>Impact Attendu</span>
              <h2>Court, moyen et long terme</h2>
            </div>
            <div className={styles.horizonGrid}>
              {IMPACT.map((h) => (
                <div key={h.year} className={styles.horizonCard}>
                  <span className={styles.horizonYear}>{h.year}</span>
                  <h3>{h.items[0]}</h3>
                  <ul>
                    {h.items.slice(1).map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section className={styles.cta}>
        <Reveal>
          <h2 className={styles.ctaTitle}>Rejoignez le mouvement</h2>
          <p className={styles.ctaBody}>
            Partenaire, mentor, sponsor, bénévole — chaque contribution compte pour former les géants de demain.
          </p>
          <p className={styles.ctaContact}>contact@daho.bj</p>
        </Reveal>
      </section>

      <footer className={styles.footer}>« Daho » — Grand en Fon · Association Daho · MMXXVIII</footer>
    </div>
  );
}
