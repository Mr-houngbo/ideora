"use client";

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import {
  Rocket, Target, Sprout, ArrowDown, ArrowRight, Sparkles, Cpu, Code2, Wrench,
  Trophy, TrendingUp, BarChart3, Globe2, Users, Wallet, Server, Building2, Mail, Check, ChevronLeft,
} from 'lucide-react';

const ORANGE = '#FF6B35';
const ORANGE_SOFT = '#FF8C42';
const BLACK = '#0E0E0E';
const fontHead = { fontFamily: "'Poppins', sans-serif" };
const fontBody = { fontFamily: "'Inter', sans-serif" };

function useCountUp(target: number, duration = 1600, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return val;
}

const Stat = ({ value, label }: { value: number; label: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const n = useCountUp(value, 1800, inView);
  return (
    <div ref={ref} className="text-center">
      <div className="text-6xl md:text-7xl font-black tracking-tight" style={{ color: ORANGE }}>{n}</div>
      <div className="mt-2 text-sm md:text-base font-semibold uppercase tracking-wider text-neutral-800">{label}</div>
    </div>
  );
};

const Section = ({ children, className = '', id, style }: { children: React.ReactNode; className?: string; id?: string; style?: React.CSSProperties }) => (
  <section id={id} className={`px-6 md:px-12 lg:px-24 py-20 md:py-32 ${className}`} style={style}>
    <div className="max-w-7xl mx-auto">{children}</div>
  </section>
);

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
  >{children}</motion.div>
);

const Daho = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const id = 'daho-fonts';
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap';
      document.head.appendChild(link);
    }
    document.title = 'DAHO — Former les géants de demain';
  }, []);

  return (
    <div className="min-h-screen bg-white text-neutral-900" style={fontBody}>
      <div className="fixed top-6 left-6 z-50">
        <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md bg-white/80 border border-neutral-200 text-sm font-semibold text-neutral-800 hover:bg-white shadow-lg transition">
          <ChevronLeft className="w-4 h-4" /> Retour
        </Link>
      </div>

      {/* HERO */}
      <div ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: BLACK }}>
        <div className="absolute inset-0 opacity-[0.08]" style={{
          backgroundImage: `radial-gradient(${ORANGE} 1px, transparent 1px), radial-gradient(${ORANGE} 1px, transparent 1px)`,
          backgroundSize: '40px 40px', backgroundPosition: '0 0, 20px 20px',
        }} />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-3xl opacity-20" style={{ background: ORANGE }} />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full blur-3xl opacity-15" style={{ background: ORANGE_SOFT }} />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 text-center px-6 max-w-5xl">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-8"
            style={{ background: `linear-gradient(135deg, ${ORANGE}, ${ORANGE_SOFT})`, boxShadow: `0 20px 60px -10px ${ORANGE}80` }}
          >
            <Rocket className="w-10 h-10 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }}
            className="text-7xl md:text-9xl font-black tracking-tighter mb-6"
            style={{ ...fontHead, color: ORANGE, letterSpacing: '-0.04em' }}
          >DAHO</motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
            className="text-2xl md:text-3xl font-light text-white mb-4" style={fontHead}>
            Former les géants de demain
          </motion.p>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.9 }} transition={{ duration: 0.8, delay: 0.6 }}
            className="text-base md:text-lg text-white/85 max-w-2xl mx-auto mb-3 leading-relaxed">
            Un programme intensif de formation tech pour les enfants du Bénin — IA, Coding, IoT, Design.
          </motion.p>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.8 }}
            className="italic text-base mb-12" style={{ color: ORANGE }}>
            « Daho » = Grand en Fon
          </motion.p>

          <motion.a href="#vision"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1 }}
            whileHover={{ scale: 1.05, boxShadow: `0 0 40px ${ORANGE}` }} whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base"
            style={{ background: ORANGE, color: BLACK, ...fontHead }}>
            Découvrir le projet <ArrowDown className="w-4 h-4" />
          </motion.a>
        </motion.div>

        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50">
          <ArrowDown className="w-5 h-5" />
        </motion.div>
      </div>

      {/* VISION */}
      <Section id="vision" className="bg-white">
        <FadeIn>
          <h2 className="text-4xl md:text-5xl font-black mb-16 tracking-tight" style={fontHead}>
            La <span style={{ color: ORANGE }}>Vision</span>
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <FadeIn delay={0.1}>
            <h3 className="text-xl font-semibold mb-4" style={{ color: ORANGE, ...fontHead }}>Le constat</h3>
            <p className="text-lg leading-relaxed text-neutral-800">
              Les élèves asiatiques sont très en avance sur les africains par manque d'éducation et de moyens.
              L'accès à une éducation tech de haut niveau reste réservé aux familles aisées. Nos enfants démarrent
              la course avec un handicap structurel.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <h3 className="text-xl font-semibold mb-4" style={{ color: ORANGE, ...fontHead }}>Notre ambition</h3>
            <p className="text-lg leading-relaxed text-neutral-800">
              Rétablir les chances dès le bas âge. Créer la prochaine génération d'innovateurs béninois capables de
              penser, créer et bâtir avec la technologie. Commencer par Porto-Novo — mon village — et scaler à tout le Bénin.
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={0.3}>
          <div className="border-l-4 p-8 md:p-10 rounded-r-2xl" style={{ borderColor: ORANGE, background: `${ORANGE}15` }}>
            <p className="italic text-xl md:text-2xl text-neutral-900 leading-relaxed" style={fontHead}>
              « Je dois rehausser le niveau de mes frères et sœurs du village. »
            </p>
          </div>
        </FadeIn>
      </Section>

      {/* MODÈLE */}
      <Section className="bg-neutral-50">
        <FadeIn>
          <h2 className="text-4xl md:text-5xl font-black mb-3 tracking-tight" style={fontHead}>
            Le <span style={{ color: ORANGE }}>Modèle</span>
          </h2>
          <p className="text-xl text-neutral-600 mb-16">Un boot camp intensif de 4 semaines, une communauté pour la vie.</p>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Target, title: 'Sélection par le mérite', points: ['Établissements publics ciblés (quartiers populaires)', 'Épreuve unique pour tous les candidats', '100 meilleurs sélectionnés (CM2, 6ème, 5ème)', 'Gratuit à 100% pour les enfants'] },
            { icon: Rocket, title: '4 semaines immersives', points: ['S1-3 : École quotidienne (IA, Coding, IoT, Design, Géopolitique tech)', 'S4 : Immersion totale (hébergement, projet final, jury)', '10 jeunes formateurs encadrés par 5 mentors', 'Modèle "train-the-trainers" pour scalabilité'] },
            { icon: Sprout, title: 'Communauté Daho', points: ["Accompagnement jusqu'au Bac (et au-delà)", 'Plateforme e-learning permanente', 'Parrainage alumni → nouveaux participants', 'Challenges mensuels, rencontres trimestrielles'] },
          ].map((c, i) => {
            const Icon = c.icon;
            return (
              <FadeIn key={c.title} delay={i * 0.1}>
                <motion.div whileHover={{ y: -6 }}
                  className="h-full bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all border-l-4"
                  style={{ borderLeftColor: 'transparent' }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderLeftColor = ORANGE)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderLeftColor = 'transparent')}
                >
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ background: `${ORANGE}18` }}>
                    <Icon className="w-7 h-7" style={{ color: ORANGE }} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-neutral-900" style={fontHead}>{c.title}</h3>
                  <ul className="space-y-3">
                    {c.points.map((p) => (
                      <li key={p} className="flex gap-3 text-neutral-700 text-[15px] leading-relaxed">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: ORANGE }} />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </FadeIn>
            );
          })}
        </div>
      </Section>

      {/* CURRICULUM */}
      <Section className="bg-neutral-950 text-white">
        <FadeIn>
          <h2 className="text-4xl md:text-5xl font-black mb-3 tracking-tight" style={{ color: ORANGE, ...fontHead }}>Le Programme</h2>
          <p className="text-xl text-white/75 mb-16">Tous les participants suivent le même parcours intégral — la vie n'a pas de tranches d'âge.</p>
        </FadeIn>

        <div className="relative pl-10 md:pl-16">
          <div className="absolute left-3 md:left-6 top-2 bottom-2 w-0.5" style={{ background: `${ORANGE}60` }} />
          {[
            { week: 'SEMAINE 1', icon: Cpu, title: 'Alphabétisation numérique & IA', desc: "Qu'est-ce qu'un algorithme ? Comment l'IA transforme le monde. Tests de personnalité, mindset, objectifs personnels.", deliv: 'Carte mentale "Moi et la tech en 2030"' },
            { week: 'SEMAINE 2', icon: Code2, title: 'Coding & Programmation', desc: 'Scratch ou Python selon niveau. Logique, variables, boucles, conditions.', deliv: 'Petit jeu interactif ou chatbot simple' },
            { week: 'SEMAINE 3', icon: Wrench, title: 'IoT, Électronique & Design', desc: 'Arduino : capteurs, LEDs, moteurs. UI/UX basique, storytelling, pitch. Géopolitique de la tech.', deliv: 'Prototype fonctionnel (alarme, station météo, robot)' },
            { week: 'SEMAINE 4', icon: Trophy, title: 'Immersion & Réalisation', desc: 'Hébergement complet. Groupes de 5 enfants, projet dans 1 domaine au choix. Présentation devant jury.', deliv: 'Pitch de 3 min + slides + certificat' },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <FadeIn key={s.week} delay={i * 0.08}>
                <div className="relative pb-14 last:pb-0">
                  <div className="absolute -left-[34px] md:-left-[58px] top-1 w-7 h-7 rounded-full flex items-center justify-center ring-4 ring-neutral-950" style={{ background: ORANGE }}>
                    <Icon className="w-3.5 h-3.5 text-black" />
                  </div>
                  <div className="text-xs font-bold tracking-[0.25em] mb-2" style={{ color: ORANGE }}>{s.week}</div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3" style={fontHead}>{s.title}</h3>
                  <p className="text-white/85 text-[17px] leading-relaxed mb-3 max-w-3xl">{s.desc}</p>
                  <div className="inline-flex items-center gap-2 text-sm text-white/70">
                    <Check className="w-4 h-4" style={{ color: ORANGE }} />
                    <span><span className="font-semibold text-white">Livrable : </span>{s.deliv}</span>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </Section>

      {/* PHASE PILOTE */}
      <Section className="bg-white">
        <FadeIn>
          <h2 className="text-4xl md:text-5xl font-black mb-16 tracking-tight" style={fontHead}>
            Phase Pilote — <span style={{ color: ORANGE }}>Porto-Novo 2028</span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 py-10 border-y border-neutral-200">
            <Stat value={100} label="Enfants formés" />
            <Stat value={10} label="Formateurs" />
            <Stat value={5} label="Mentors / experts" />
            <Stat value={4} label="Semaines intensives" />
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <h3 className="text-2xl font-bold mb-8 text-neutral-900" style={fontHead}>Roadmap préparation</h3>
        </FadeIn>

        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-3 mb-16">
          {[
            ['Janvier', 'Constitution comité, association, négos partenaires'],
            ['Février', 'Finalisation partenariats (mairie, MTN, hôtel)'],
            ['Mars', 'Information établissements, lancement plateforme'],
            ['Avril-Mai', 'Recrutement formateurs, curriculum, supports'],
            ['Juin', 'Sélection, annonce 100 sélectionnés, formation formateurs'],
            ['Juil.-Août', 'Boot camp !'],
          ].map((m, i) => (
            <FadeIn key={m[0]} delay={i * 0.06}>
              <div className="relative h-full p-5 rounded-xl bg-neutral-50 border border-neutral-200 hover:border-orange-400 transition">
                <div className="text-xs font-bold tracking-wider mb-2" style={{ color: ORANGE }}>{m[0].toUpperCase()}</div>
                <p className="text-sm text-neutral-700 leading-relaxed">{m[1]}</p>
                {i < 5 && <ArrowRight className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: ORANGE }} />}
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.2}>
          <div className="rounded-2xl p-8 md:p-10" style={{ background: `${ORANGE}12` }}>
            <h3 className="text-xl font-semibold mb-4 text-neutral-900" style={fontHead}>Partenaires recherchés</h3>
            <p className="text-neutral-700 leading-relaxed">
              Mairie de Porto-Novo &nbsp;|&nbsp; MTN Benin &nbsp;|&nbsp; Moov / Celtis &nbsp;|&nbsp; Ministère de l'Éducation &nbsp;|&nbsp; Vendeurs d'ordinateurs &nbsp;|&nbsp; Hôtels &nbsp;|&nbsp; Restaurants
            </p>
          </div>
        </FadeIn>
      </Section>

      {/* BUDGET */}
      <Section className="bg-neutral-50">
        <FadeIn>
          <h2 className="text-4xl md:text-5xl font-black mb-3 tracking-tight" style={fontHead}>
            Budget <span style={{ color: ORANGE }}>Pilote</span>
          </h2>
          <p className="text-xl text-neutral-600 mb-12">Estimation phase pilote Porto-Novo 2028 (scénario internat négocié).</p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="overflow-x-auto rounded-2xl shadow-sm border border-neutral-200 bg-white">
            <table className="w-full text-left">
              <thead>
                <tr style={{ background: ORANGE }} className="text-white">
                  <th className="px-5 py-4 font-bold">Poste</th>
                  <th className="px-5 py-4 font-bold">Détail</th>
                  <th className="px-5 py-4 font-bold text-right">Montant (FCFA)</th>
                </tr>
              </thead>
              <tbody className="text-neutral-800">
                {[
                  ['Nourriture S1–3', '100 enfants × 1500/j × 18j', '2 700 000'],
                  ['Nourriture S4 immersion', '115 pers. × 3000/j × 7j', '2 415 000'],
                  ['Formation formateurs', '10 formateurs logés/nourris 2 sem.', '420 000'],
                  ['Mentors / experts', '5 mentors × 100k', '500 000'],
                  ['Kits IoT', '20 kits Arduino × 15k', '300 000'],
                  ['Supports pédagogiques', 'Impression, badges, certificats', '200 000'],
                  ['Kits ressources', '100 kits (livres, USB) × 5k', '500 000'],
                  ['Laptops (meilleurs)', '5 laptops × 150k', '750 000'],
                  ['Box wifi 1 an', '20 box × 50k', '1 000 000'],
                  ['Communication', 'Flyers, médias, réseaux sociaux', '300 000'],
                  ['Plateforme e-learning', 'Développement', '500 000'],
                  ['Épreuve de sélection', 'Impression, correction', '100 000'],
                  ['Imprévus', '10% du total', '1 150 000'],
                ].map((r, i) => (
                  <tr key={i} className="border-t border-neutral-100 hover:bg-neutral-50">
                    <td className="px-5 py-4 font-semibold">{r[0]}</td>
                    <td className="px-5 py-4 text-neutral-600">{r[1]}</td>
                    <td className="px-5 py-4 text-right font-mono">{r[2]}</td>
                  </tr>
                ))}
                <tr className="border-t-2 bg-neutral-900 text-white">
                  <td className="px-5 py-5 font-black" style={fontHead}>TOTAL</td>
                  <td className="px-5 py-5"></td>
                  <td className="px-5 py-5 text-right font-black text-xl" style={{ color: ORANGE }}>~11 500 000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="mt-10 rounded-2xl p-8 md:p-10 text-center text-white" style={{ background: `linear-gradient(135deg, ${ORANGE}, ${ORANGE_SOFT})` }}>
            <Wallet className="w-8 h-8 mx-auto mb-3" />
            <p className="text-lg md:text-xl font-semibold" style={fontHead}>
              Porteur de projet : <span className="font-black">2M FCFA</span> &nbsp;|&nbsp; Partenaires à mobiliser : <span className="font-black">~9,5M FCFA</span>
            </p>
          </div>
        </FadeIn>
      </Section>

      {/* IMPACT */}
      <Section className="bg-neutral-950">
        <FadeIn>
          <h2 className="text-4xl md:text-5xl font-black mb-16 tracking-tight" style={{ color: ORANGE, ...fontHead }}>Impact Attendu</h2>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: BarChart3, tag: 'Court terme — 2028', title: 'Pilote', points: ['100 enfants initiés au code, IA, IoT', '20+ prototypes fonctionnels créés', 'Taux de complétion >80%', 'Communauté Daho lancée'] },
            { icon: TrendingUp, tag: 'Moyen terme — 2029-2030', title: 'Scale', points: ['Déploiement Cotonou + Parakou', '300+ enfants formés cumulés', 'Modèle économique pérenne validé', 'Partenariats institutionnels solides'] },
            { icon: Globe2, tag: 'Long terme — 2035+', title: 'Vision', points: ['Couverture nationale (12 départements)', '5000+ alumni actifs', "Premiers Daho en école d'ingé / startups", 'Modèle répliqué en Afrique francophone'] },
          ].map((c, i) => {
            const Icon = c.icon;
            return (
              <FadeIn key={c.title} delay={i * 0.1}>
                <motion.div whileHover={{ y: -6 }} className="h-full rounded-2xl p-8" style={{ background: '#1F1F1F' }}>
                  <Icon className="w-10 h-10 mb-5" style={{ color: ORANGE }} />
                  <div className="text-xs uppercase tracking-[0.2em] text-white/50 mb-2">{c.tag}</div>
                  <h3 className="text-2xl font-bold mb-5" style={{ color: ORANGE, ...fontHead }}>{c.title}</h3>
                  <ul className="space-y-3">
                    {c.points.map((p) => (
                      <li key={p} className="flex gap-3 text-white/85 text-[15px] leading-relaxed">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: ORANGE }} />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </FadeIn>
            );
          })}
        </div>
      </Section>

      {/* PLATEFORME */}
      <Section className="bg-white">
        <FadeIn>
          <h2 className="text-4xl md:text-5xl font-black mb-3 tracking-tight" style={fontHead}>
            Plateforme <span style={{ color: ORANGE }}>Technologique</span>
          </h2>
          <p className="text-xl text-neutral-600 mb-12">Le cœur digital du programme — budget dev 500k FCFA.</p>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-10">
          <FadeIn delay={0.1}>
            <h3 className="text-xl font-bold mb-5 flex items-center gap-2" style={fontHead}>
              <Sparkles className="w-5 h-5" style={{ color: ORANGE }} />Fonctionnalités
            </h3>
            <ul className="space-y-3">
              {[
                'Espace curricula (cours, exercices, ressources vidéo)',
                'Parcours formation continue (alumni)',
                'Gestion privée des alumni (suivi individuel)',
                'Espace communauté (forum, challenges, parrainage)',
                'Vitrine publique (éditions, photos, témoignages)',
                'Back-office gestion éditions (inscriptions, planning)',
              ].map((p) => (
                <li key={p} className="flex gap-3 text-neutral-800 text-[15px]">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: ORANGE }} />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="rounded-2xl p-8 bg-neutral-50 border border-neutral-200">
              <h3 className="text-xl font-bold mb-5 flex items-center gap-2" style={fontHead}>
                <Server className="w-5 h-5" style={{ color: ORANGE }} />Stack technique
              </h3>
              <dl className="space-y-3 text-[15px]">
                {[
                  ['Frontend', 'WordPress + thème custom'],
                  ['LMS', 'LearnDash (espace formation)'],
                  ['Communauté', 'BuddyPress + bbPress'],
                  ['Gestion', 'Custom Post Types + ACF Pro'],
                  ['Hébergement', 'OVH VPS (50k/an)'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b border-neutral-200 pb-2">
                    <dt className="font-semibold text-neutral-900">{k}</dt>
                    <dd className="text-neutral-600 text-right">{v}</dd>
                  </div>
                ))}
                <div className="pt-3 text-base font-bold" style={{ color: ORANGE }}>Budget total : 500k FCFA</div>
              </dl>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* DÉPLOIEMENT */}
      <Section style={{ background: `${ORANGE}08` }}>
        <FadeIn>
          <h2 className="text-4xl md:text-5xl font-black mb-16 tracking-tight" style={fontHead}>
            Stratégie de <span style={{ color: ORANGE }}>Déploiement</span>
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { year: '2028', tag: 'PHASE 1', title: 'Pilote Porto-Novo', points: ['100 enfants', 'Validation du modèle', 'Métriques de référence', 'Capitalisation retours'] },
            { year: '2029', tag: 'PHASE 2', title: 'Expansion Cotonou', points: ['Porto-Novo édition 2 (100)', 'Cotonou édition 1 (100)', '200 enfants cumulés', 'Structuration association'] },
            { year: '2030', tag: 'PHASE 3', title: '3 Villes Simultanées', points: ['Porto-Novo édition 3', 'Cotonou édition 2', 'Parakou édition 1', '300 enfants/an', 'Recherche financement scale national'] },
          ].map((p, i) => (
            <FadeIn key={p.year} delay={i * 0.1}>
              <motion.div whileHover={{ y: -6 }} className="h-full bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition border-t-4" style={{ borderTopColor: ORANGE }}>
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-xs font-bold tracking-widest text-neutral-500">{p.tag}</span>
                  <span className="text-3xl font-black" style={{ color: ORANGE, ...fontHead }}>{p.year}</span>
                </div>
                <h3 className="text-2xl font-bold mb-5 text-neutral-900" style={fontHead}>{p.title}</h3>
                <ul className="space-y-2">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex gap-3 text-neutral-700 text-[15px]">
                      <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: ORANGE }} />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* GOUVERNANCE */}
      <Section className="bg-neutral-950 text-white">
        <FadeIn>
          <h2 className="text-4xl md:text-5xl font-black mb-16 tracking-tight" style={{ color: ORANGE, ...fontHead }}>
            Structure & Gouvernance
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-10">
          <FadeIn delay={0.1}>
            <div className="rounded-2xl p-8" style={{ background: '#1F1F1F' }}>
              <Building2 className="w-8 h-8 mb-4" style={{ color: ORANGE }} />
              <h3 className="text-xl font-bold mb-5" style={fontHead}>Statut juridique</h3>
              <dl className="space-y-3 text-[15px]">
                {[
                  ['Forme', 'Association loi 1901 (équivalent béninois)'],
                  ['Nom légal', 'Association Daho'],
                  ['Siège', 'Porto-Novo'],
                  ['Création', 'Janvier 2028'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b border-white/10 pb-2">
                    <dt className="font-semibold text-white/90">{k}</dt>
                    <dd className="text-white/70 text-right">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <Users className="w-8 h-8 mb-4" style={{ color: ORANGE }} />
            <h3 className="text-xl font-bold mb-5 text-white" style={fontHead}>Comité de pilotage</h3>
            <div className="space-y-3">
              {[
                ['Président', 'Vision stratégique, fundraising, représentation'],
                ['Directeur Pédagogique', 'Curriculum, formateurs, qualité'],
                ['Directeur Logistique', 'Partenariats, infrastructure'],
                ['Trésorier', 'Budget, comptabilité, reporting'],
                ['Resp. Communauté', 'Alumni, plateforme, suivi'],
              ].map(([role, mission]) => (
                <div key={role} className="bg-white rounded-xl p-4 border-l-4 text-neutral-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1" style={{ borderLeftColor: ORANGE }}>
                  <span className="font-bold" style={fontHead}>{role}</span>
                  <span className="text-sm text-neutral-600">{mission}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* CTA FINAL */}
      <section className="px-6 md:px-12 py-24 md:py-32 text-center" style={{ background: `linear-gradient(135deg, ${ORANGE}, ${ORANGE_SOFT})` }}>
        <FadeIn>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight" style={fontHead}>
            Rejoignez le mouvement
          </h2>
          <p className="text-lg md:text-xl text-white/95 max-w-2xl mx-auto mb-10 leading-relaxed">
            Partenaire, mentor, sponsor, bénévole — chaque contribution compte pour former les géants de demain.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a href="mailto:contact@daho.bj"
              whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }} whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white font-bold"
              style={{ color: ORANGE, ...fontHead }}>
              Devenir partenaire <ArrowRight className="w-4 h-4" />
            </motion.a>
            <motion.a href="mailto:contact@daho.bj"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-white text-white font-bold hover:bg-white hover:text-orange-500 transition-colors"
              style={fontHead}>
              <Mail className="w-4 h-4" /> Nous contacter
            </motion.a>
          </div>
        </FadeIn>
      </section>

      {/* FOOTER */}
      <footer className="bg-black text-white px-6 md:px-12 py-14">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-8 border-b border-white/10">
            <div>
              <div className="text-2xl font-black tracking-tight" style={{ color: ORANGE, ...fontHead }}>DAHO</div>
              <p className="text-white/60 text-sm mt-1">« Daho » — Grand en Fon &nbsp;|&nbsp; Former les géants de demain</p>
            </div>
            <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
              {['À propos', 'Vision', 'Programme', 'Partenariats', 'Contact'].map((l) => (
                <a key={l} href="#" className="hover:text-orange-400 transition">{l}</a>
              ))}
            </nav>
          </div>
          <p className="text-center text-white/40 text-xs mt-6">© 2028 Association Daho. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Daho;
