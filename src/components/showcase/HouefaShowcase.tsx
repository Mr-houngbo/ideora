"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { spaceGrotesk, ibmPlexSans } from "./fonts";
import { Reveal, useCountUp, type ShowcaseComponentProps } from "./shared";
import styles from "./HouefaShowcase.module.css";

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

function useCountdownTo(targetIso: string) {
  const [remaining, setRemaining] = useState({ days: 0, months: 0, years: 0 });
  useEffect(() => {
    const target = new Date(targetIso).getTime();
    const diffMs = Math.max(0, target - Date.now());
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    setRemaining({
      years: Math.floor(totalDays / 365),
      months: Math.floor((totalDays % 365) / 30),
      days: totalDays % 30,
    });
  }, [targetIso]);
  return remaining;
}

const DIMENSIONS = [
  { title: "Hébergement", desc: "Logements modernes, meublés, tout inclus." },
  { title: "Technologie", desc: "SuperApp, identité numérique, paiements." },
  { title: "Formation", desc: "Accès plateformes, mentorat, bootcamps." },
];

const PILLARS = [
  {
    num: "Pilier 01",
    title: "Infrastructure Physique",
    items: ["10 Studios Solo (15m²) — 50 000 FCFA", "20 T2 Duo (30m²) — 75 000 FCFA", "10 T3 Trio (40m²) — 90 000 FCFA", "5 T4 Coloc (50m²) — 100 000 FCFA"],
  },
  {
    num: "Pilier 02",
    title: "Écosystème Numérique",
    items: ["Identité numérique & carte résident", "Paiements Mobile Money intégrés", "Réservation espaces & signalements", "Accès JSTOR, Coursera, edX, GitHub"],
  },
  {
    num: "Pilier 03",
    title: "Services & Bien-être",
    items: ["Restaurant subventionné à prix étudiants", "Infirmerie / point santé", "Vélos électriques en location", "WiFi gratuit partout"],
  },
  {
    num: "Pilier 04",
    title: "Impact & Mission Sociale",
    items: ["40% logements à tarif accessible (25-30k)", "Sélection sur potentiel, pas les moyens", "Bourses pour étudiants d'excellence modestes", "Mentorat croisé (aisés ↔ modestes)"],
  },
];

const REVENUS = [
  { type: "Studios Solo", unites: "10", prix: "50 000", total: "500 000" },
  { type: "T2 Duo", unites: "20", prix: "75 000", total: "1 500 000" },
  { type: "T3 Trio", unites: "10", prix: "90 000", total: "900 000" },
  { type: "T4 Coloc", unites: "5", prix: "100 000", total: "500 000" },
];

const ROADMAP = [
  { year: "2025-2026", title: "Préparation", desc: "Structure juridique SARL, étude de marché UAC, plans architecturaux, mobiliser 100-150M FCFA.", node: "I" },
  { year: "2027", title: "Mobilisation & Travaux", desc: "Achat terrain, mobilisation 300-500M FCFA, permis de construire, lancement chantier.", node: "II" },
  { year: "2028", title: "Construction & Marketing", desc: "Achever construction, finaliser SuperApp, campagne UAC, pré-réservations 70%.", node: "III" },
  { year: "2029", title: "Ouverture", desc: "Inauguration août 2029, emménagement 1ère cohorte, 100% occupation en 6 mois.", node: "IV" },
];

const TEAM = [
  { name: "Calixte", role: "Fondateur & Gérant Majoritaire (60-70%)", desc: "Vision & stratégie, gestion opérationnelle, relations investisseurs." },
  { name: "Associé 1", role: "Directeur Financier (10-15%)", desc: "Comptabilité, finance, trésorerie." },
  { name: "Associé 2", role: "Directeur Tech (10-15%)", desc: "Dev SuperApp, infrastructure IT, sécurité." },
  { name: "Associé 3", role: "Directeur Marketing & Ops (5-10%)", desc: "Remplissage résidence, communication, opérations." },
];

export default function HouefaShowcase({ project }: ShowcaseComponentProps) {
  const countdown = useCountdownTo("2029-09-01");

  return (
    <div className={`${styles.showcase} ${spaceGrotesk.variable} ${ibmPlexSans.variable}`}>
      <section className={styles.hero}>
        {project.image_url ? (
          <img src={project.image_url} alt="Houefa" className={styles.heroImage} />
        ) : (
          <div className={styles.heroFallback} />
        )}
        <div className={styles.heroScrim} />
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>Résidences Étudiantes Intelligentes · Abomey-Calavi</span>
          <h1 className={styles.heroTitle}>HOUEFA</h1>
          <p className={styles.heroTagline}>« Maison paisible, apaisée et apaisante »</p>
          <p className={styles.heroLede}>Plus qu&apos;un toit, un écosystème pour ta réussite.</p>
          <div className={styles.countdown}>
            <div className={styles.countdownUnit}>
              <div className={styles.countdownNumber}>{countdown.years}</div>
              <div className={styles.countdownLabel}>Ans</div>
            </div>
            <div className={styles.countdownUnit}>
              <div className={styles.countdownNumber}>{countdown.months}</div>
              <div className={styles.countdownLabel}>Mois</div>
            </div>
            <div className={styles.countdownUnit}>
              <div className={styles.countdownNumber}>{countdown.days}</div>
              <div className={styles.countdownLabel}>Jours</div>
            </div>
            <div className={styles.countdownUnit}>
              <div className={styles.countdownNumber} style={{ fontSize: "0.95rem" }}>
                Sept 2029
              </div>
              <div className={styles.countdownLabel}>Ouverture cible</div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.bandA}>
        <Reveal>
          <div className={styles.wrap} style={{ textAlign: "center" }}>
            <span className={styles.eyebrow}>Vision & Identité</span>
            <blockquote className={styles.quoteBlock}>
              « Je ne construis pas une résidence, je construis des destins. »
              <span className={styles.quoteAttribution}>— Calixte, Fondateur</span>
            </blockquote>
          </div>
        </Reveal>
      </section>

      <section className={styles.bandB}>
        <Reveal>
          <div className={styles.wrapWide}>
            <div className={styles.sectionHeader}>
              <span className={styles.eyebrow}>Qu&apos;est-ce que Houefa ?</span>
              <h2>Trois dimensions</h2>
            </div>
            <div className={styles.dimGrid}>
              {DIMENSIONS.map((d) => (
                <div key={d.title} className={styles.dimCard}>
                  <h3>{d.title}</h3>
                  <p>{d.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section className={styles.bandA}>
        <Reveal>
          <div className={styles.wrap} style={{ textAlign: "center" }}>
            <span className={styles.eyebrow}>Pourquoi ce projet</span>
            <p style={{ margin: "1.2rem auto", maxWidth: "58ch" }}>
              Le logement étudiant en Afrique — et à l&apos;UAC en particulier — est catastrophique. Des étudiants brillants
              échouent non pas par manque de talent, mais parce que leurs conditions de vie les empêchent de se concentrer.
            </p>
            <blockquote className={styles.quoteBlock}>
              « J&apos;ai fait l&apos;UAC. J&apos;ai vu de mes propres yeux comment l&apos;environnement influence massivement les
              résultats des étudiants. Houefa, c&apos;est la résidence que j&apos;aurais voulu avoir. »
              <span className={styles.quoteAttribution}>— Calixte</span>
            </blockquote>
          </div>
        </Reveal>
      </section>

      <section className={styles.bandB}>
        <Reveal>
          <div className={styles.wrapWide}>
            <div className={styles.sectionHeader}>
              <span className={styles.eyebrow}>Les 4 Piliers</span>
              <h2>Un écosystème complet</h2>
            </div>
            <div className={styles.pillarGrid}>
              {PILLARS.map((p) => (
                <div key={p.num} className={styles.pillarCard}>
                  <span className={styles.pillarNum}>{p.num}</span>
                  <h3>{p.title}</h3>
                  <ul>
                    {p.items.map((it) => (
                      <li key={it}>
                        <span className={styles.pillarDot}>—</span>
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
              <span className={styles.eyebrow}>Modèle Économique</span>
              <h2>Revenus An 1 (100 étudiants)</h2>
              <p className={styles.sectionSub}>Profit net An 1 estimé à 14,2M FCFA — rentable dès la première année.</p>
            </div>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Unités</th>
                    <th>Prix / mois</th>
                    <th>Total / mois</th>
                  </tr>
                </thead>
                <tbody>
                  {REVENUS.map((r) => (
                    <tr key={r.type}>
                      <td>{r.type}</td>
                      <td>{r.unites}</td>
                      <td>{r.prix}</td>
                      <td>{r.total}</td>
                    </tr>
                  ))}
                  <tr className={styles.total}>
                    <td>Total mensuel</td>
                    <td>45</td>
                    <td></td>
                    <td>3 400 000 FCFA</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      </section>

      <section className={styles.bandB}>
        <Reveal>
          <div className={styles.wrapWide} style={{ position: "relative" }}>
            <div className={styles.sectionHeader}>
              <span className={styles.eyebrow}>Roadmap</span>
              <h2>5 ans</h2>
            </div>
            <div style={{ position: "relative" }}>
              <div className={styles.spine} />
              {ROADMAP.map((r, i) => (
                <div key={r.node} className={`${styles.rmRow} ${i % 2 === 0 ? styles.rmRowLeft : styles.rmRowRight}`}>
                  <div className={styles.rmCard}>
                    <span className={styles.rmYear}>{r.year}</span>
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
              <span className={styles.eyebrow}>L&apos;Équipe</span>
              <h2>Fondateur & associés</h2>
            </div>
            <div className={styles.teamGrid}>
              {TEAM.map((t) => (
                <div key={t.name} className={styles.teamCard}>
                  <div className={styles.teamName}>{t.name}</div>
                  <div className={styles.teamRole}>{t.role}</div>
                  <p>{t.desc}</p>
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
              <span className={styles.eyebrow}>Indicateurs de Succès</span>
              <h2>Objectifs An 1</h2>
            </div>
            <div className={styles.kpiGrid}>
              <Stat target={90} label="Taux d'occupation %" />
              <Stat target={50} label="NPS visé" />
              <Stat target={20} label="Bourses d'excellence" />
              <Stat target={10} label="Partenariats actifs" />
            </div>
          </div>
        </Reveal>
      </section>

      <footer className={styles.footer}>
        Houefa · Version 2.0
        <span className={styles.confidential}>Projet confidentiel — ne pas diffuser sans autorisation</span>
      </footer>
    </div>
  );
}
