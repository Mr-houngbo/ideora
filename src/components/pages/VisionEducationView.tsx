"use client";

import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { ArrowDown } from 'lucide-react';

const START_DATE = new Date('2025-03-01');

const useCountUp = (end: number, duration = 1500, trigger = true) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration, trigger]);
  return count;
};

const FadeSection = ({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const diagnosticStats = [
  { value: 70, suffix: '%', label: 'des diplômés sans emploi adéquat' },
  { value: 2, suffix: '/10', label: 'élèves maîtrisent les compétences de base en fin de primaire' },
  { value: 45, suffix: '%', label: 'de fuite des cerveaux parmi les diplômés du supérieur' },
];

const StatBlock = ({ stat, index }: { stat: typeof diagnosticStats[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useCountUp(stat.value, 1500, isInView);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="flex flex-col items-center text-center py-8 md:py-12"
    >
      <p className="font-bold leading-none mb-4" style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(72px, 12vw, 120px)' }}>
        <span className="text-white">{count}</span>
        <span style={{ color: '#00A878' }}>{stat.suffix}</span>
      </p>
      <p className="text-sm md:text-base text-white/60 max-w-[240px] leading-relaxed" style={{ fontFamily: "'DM Mono', monospace" }}>
        {stat.label}
      </p>
    </motion.div>
  );
};

const pillars = [
  { num: '01', title: 'Le documentaire', tag: 'CRÉER L\'ÉMOTION', desc: 'Un film vu partout en Afrique, qui montre la réalité et inspire le changement. L\'émotion comme moteur de la viralité.' },
  { num: '02', title: 'Le livre', tag: 'DONNER LA PROFONDEUR', desc: 'Un manifeste qui propose un nouveau modèle éducatif, ancré dans les réalités béninoises et nourri des meilleures pratiques mondiales.' },
  { num: '03', title: 'Le groupe scolaire', tag: 'PROUVER PAR L\'ACTION', desc: 'Une école qui prouve que c\'est possible. Des résultats mesurables. Une preuve vivante que le modèle fonctionne.' },
];

const phases = [
  {
    num: 1, title: 'Fondations', years: 'Années 1–3', role: 'Étudiant chercheur', active: true,
    description: 'C\'est maintenant. Vous êtes étudiant, c\'est votre avantage. Lisez de manière obsessionnelle. Écrivez publiquement. Construisez votre communauté avant même d\'avoir un produit.',
    actions: ['Rapports PISA, réformes finlandaise et singapourienne', 'John Dewey, Ken Robinson, Paulo Freire', 'Blog, LinkedIn, X — poser votre voix'],
  },
  {
    num: 2, title: 'Création', years: 'Années 3–7', role: 'Auteur & cinéaste', active: false,
    description: 'Le documentaire et le livre sortent ensemble. Le livre donne la profondeur intellectuelle, le documentaire donne l\'émotion et la viralité. L\'un sans l\'autre est incomplet.',
    actions: ['Identifier les familles à suivre dès maintenant', 'Rédiger le manifeste en FR + EN', 'Viser Netflix Africa, coproducteurs, ONG'],
  },
  {
    num: 3, title: 'Expérimentation', years: 'Années 7–13', role: 'Fondateur', active: false,
    description: 'Une école pilote transforme votre discours en réalité. Sans elle, vous restez un théoricien. Avec elle, vous devenez un praticien crédible.',
    actions: ['1 école primaire selon votre modèle', 'Mesurer, documenter, ajuster chaque année', 'Publier des résultats vs système classique'],
  },
  {
    num: 4, title: 'Impact systémique', years: 'Années 13–20', role: 'Réformateur', active: false,
    description: 'Si les résultats sont là, le système vient à vous. Vous n\'avez plus à convaincre — vous montrez.',
    actions: ['Franchise / open-source du modèle', 'Collaboration avec le Ministère', 'Formation de la prochaine génération'],
  },
];

const motivationLines = [
  { text: "Je ne viens pas d'un milieu qui m'a tout donné.", highlight: "tout donné" },
  { text: "Je viens d'un pays où des millions d'enfants brillants sont éteints par un système qui ne sait pas les voir.", highlight: "éteints" },
  { text: "Je refuse d'accepter que le lieu de naissance détermine le plafond d'un esprit.", highlight: "le plafond d'un esprit" },
  { text: "Je ne fais pas ça pour être célèbre. Je fais ça parce que quelqu'un doit le faire.", highlight: "quelqu'un doit le faire" },
  { text: "Chaque jour que je travaille sur ce projet est un jour volé au statu quo.", highlight: "volé au statu quo" },
];

const VisionEducation = () => {
  const [dayCount, setDayCount] = useState(0);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.12], [0, -60]);
  const progressPercent = dayCount / 7300 * 100;

  useEffect(() => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - START_DATE.getTime()) / (1000 * 60 * 60 * 24));
    setDayCount(Math.max(1, diff));
  }, []);

  return (
    <Layout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&family=Inter:wght@300;400;500&display=swap');
      `}</style>

      {/* ═══════════════════ HERO ═══════════════════ */}
      <motion.section
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Dot grid texture */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, #00A878 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          opacity: 0.06,
        }} />

        {/* Ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[200px]" style={{ background: 'rgba(0,168,120,0.08)' }} />

        <div className="relative z-10 container max-w-5xl px-6 text-left w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block px-3 py-1.5 rounded-full text-[10px] tracking-[0.14em] uppercase font-medium mb-8"
              style={{ fontFamily: "'DM Mono', monospace", background: '#0A0908', color: '#fff' }}>
              Manifeste · Plan 20 ans
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="leading-[0.92] tracking-tight mb-10"
            style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}
          >
            <span className="block text-[clamp(40px,8vw,80px)]" style={{ color: '#0A0908', fontWeight: 400 }}>
              Je vais changer
            </span>
            <span className="block text-[clamp(44px,9vw,88px)]" style={{ color: '#00A878' }}>
              l'éducation au
            </span>
            <span className="block text-[clamp(48px,10vw,96px)]" style={{ color: '#0A0908' }}>
              Bénin<span style={{ color: '#00A878', fontSize: '120%' }}>.</span>
            </span>
          </motion.h1>

          {/* Progress bar counter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="max-w-md"
          >
            <div className="flex items-center justify-between mb-2" style={{ fontFamily: "'DM Mono', monospace" }}>
              <span className="text-xs tracking-wider" style={{ color: '#0A0908' }}>
                Jour <span className="font-bold" style={{ color: '#00A878' }}>{dayCount}</span>
              </span>
              <span className="text-xs tracking-wider text-[#999]">7 300</span>
            </div>
            <div className="w-full h-[3px] rounded-full overflow-hidden" style={{ background: '#E5E2DB' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ delay: 0.8, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-full"
                style={{ background: '#00A878' }}
              />
            </div>
          </motion.div>

          {/* Mandela quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-16 max-w-lg"
          >
            <p className="text-sm italic leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", color: '#999' }}>
              "L'éducation est l'arme la plus puissante qu'on puisse utiliser pour changer le monde."
            </p>
            <p className="mt-2 text-[10px] tracking-[0.16em] uppercase" style={{ fontFamily: "'DM Mono', monospace", color: '#bbb' }}>
              — Nelson Mandela
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <ArrowDown className="w-4 h-4 animate-bounce" style={{ color: '#bbb' }} />
        </motion.div>
      </motion.section>

      {/* ═══════════════════ DIAGNOSTIC (DARK) ═══════════════════ */}
      <section className="relative py-24 md:py-32 px-6" style={{ background: '#0A0908' }}>
        <FadeSection className="container max-w-5xl mb-16">
          <span className="block text-[10px] tracking-[0.18em] uppercase mb-4" style={{ fontFamily: "'DM Mono', monospace", color: '#00A878' }}>
            Le diagnostic
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight" style={{ fontFamily: "'Syne', sans-serif", color: '#fff' }}>
            Pourquoi le système
            <br />
            <span style={{ color: '#00A878' }}>béninois échoue.</span>
          </h2>
        </FadeSection>

        <div className="container max-w-5xl">
          <div className="grid md:grid-cols-3 relative">
            {diagnosticStats.map((stat, i) => (
              <div key={i} className="relative">
                {i > 0 && (
                  <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 h-24 w-px" style={{ background: '#00A878', opacity: 0.3 }} />
                )}
                <StatBlock stat={stat} index={i} />
              </div>
            ))}
          </div>
        </div>

        {/* Subtle glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full blur-[150px]" style={{ background: 'rgba(0,168,120,0.06)' }} />
      </section>

      {/* ═══════════════════ VISION / 3 PILIERS ═══════════════════ */}
      <section className="py-24 md:py-32 px-6" style={{ background: '#F4F2EC' }}>
        <div className="container max-w-5xl">
          <FadeSection>
            <span className="block text-[10px] tracking-[0.18em] uppercase mb-4" style={{ fontFamily: "'DM Mono', monospace", color: '#00A878' }}>
              La vision
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4" style={{ fontFamily: "'Syne', sans-serif", color: '#0A0908' }}>
              Trois piliers.
              <br />
              <span style={{ color: '#00A878' }}>Un même objectif.</span>
            </h2>
            <p className="text-base mb-16 max-w-xl" style={{ fontFamily: "'Inter', sans-serif", color: '#666', lineHeight: 1.8 }}>
              Prouver qu'une autre éducation est possible au Bénin — et la construire.
            </p>
          </FadeSection>

          <div className="grid md:grid-cols-3 gap-6">
            {pillars.map((p, i) => (
              <FadeSection key={i} delay={i * 0.12}>
                <div
                  className="group relative p-8 pt-10 transition-all duration-500 hover:-translate-y-1.5"
                  style={{
                    background: '#FAFAF7',
                    borderRadius: '12px',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                    overflow: 'hidden',
                  }}
                >
                  {/* Green top bar */}
                  <div className="absolute top-0 left-8 h-[3px] w-10 rounded-b-full transition-all duration-500 group-hover:w-20" style={{ background: '#00A878' }} />

                  {/* Watermark number */}
                  <span
                    className="absolute top-4 right-4 leading-none transition-opacity duration-500 group-hover:opacity-100 select-none pointer-events-none"
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 900,
                      fontSize: '80px',
                      color: '#00A878',
                      opacity: 0.08,
                    }}
                  >
                    {p.num}
                  </span>

                  <span className="block text-[9px] tracking-[0.16em] uppercase mb-3" style={{ fontFamily: "'DM Mono', monospace", color: '#00A878' }}>
                    {p.tag}
                  </span>
                  <h3 className="text-xl font-bold mb-3" style={{ fontFamily: "'Syne', sans-serif", color: '#0A0908' }}>
                    {p.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", color: '#666' }}>
                    {p.desc}
                  </p>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ FEUILLE DE ROUTE (DARK GREEN) ═══════════════════ */}
      <section className="relative py-24 md:py-32 px-6 overflow-hidden" style={{ background: '#003D2C' }}>
        <div className="container max-w-5xl relative z-10">
          <FadeSection>
            <span className="block text-[10px] tracking-[0.18em] uppercase mb-4" style={{ fontFamily: "'DM Mono', monospace", color: '#5DCAA5' }}>
              La feuille de route
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4" style={{ fontFamily: "'Syne', sans-serif", color: '#fff' }}>
              Le plan sur
              <span style={{ color: '#5DCAA5' }}> 20 ans.</span>
            </h2>
            <p className="text-base mb-16 max-w-xl" style={{ fontFamily: "'Inter', sans-serif", color: 'rgba(255,255,255,0.55)', lineHeight: 1.8 }}>
              Chaque phase nourrit la suivante — la recherche légitime le livre, le livre légitime l'école, l'école légitime la réforme.
            </p>
          </FadeSection>

          <div className="relative">
            {/* Vertical dashed line */}
            <div className="absolute left-[23px] md:left-[27px] top-0 bottom-0 w-px border-l border-dashed" style={{ borderColor: '#5DCAA5', opacity: 0.4 }} />

            <div className="space-y-6">
              {phases.map((phase, i) => (
                <FadeSection key={i} delay={i * 0.1}>
                  <div
                    className="relative pl-16 md:pl-20 py-8 pr-8 rounded-xl transition-all duration-300"
                    style={{
                      background: phase.active ? '#004F38' : 'transparent',
                      opacity: phase.active ? 1 : 0.65,
                    }}
                  >
                    {/* Phase number circle */}
                    <div className="absolute left-3 md:left-4 top-8 flex items-center justify-center">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2"
                        style={{
                          borderColor: phase.active ? '#00A878' : '#5DCAA5',
                          color: phase.active ? '#00A878' : '#5DCAA5',
                          background: phase.active ? 'rgba(0,168,120,0.1)' : 'transparent',
                          fontFamily: "'Syne', sans-serif",
                        }}
                      >
                        {phase.num}
                      </div>
                      {phase.active && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse" style={{ background: '#00A878', boxShadow: '0 0 12px #00A878' }} />
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-xl md:text-2xl font-bold" style={{ fontFamily: "'Syne', sans-serif", color: '#fff' }}>
                        {phase.title}
                      </h3>
                      {phase.active && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] tracking-[0.12em] uppercase font-medium"
                          style={{ fontFamily: "'DM Mono', monospace", background: 'rgba(0,168,120,0.2)', color: '#5DCAA5' }}>
                          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#00A878' }} />
                          En cours
                        </span>
                      )}
                    </div>

                    <p className="text-xs mb-3" style={{ fontFamily: "'DM Mono', monospace", color: '#5DCAA5' }}>
                      {phase.years} · {phase.role}
                    </p>

                    <p className="text-sm mb-5 max-w-2xl" style={{ fontFamily: "'Inter', sans-serif", color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
                      {phase.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {phase.actions.map((action, j) => (
                        <span key={j} className="inline-block px-3 py-1.5 rounded-lg text-[11px]"
                          style={{ fontFamily: "'DM Mono', monospace", background: 'rgba(93,202,165,0.1)', color: '#5DCAA5' }}>
                          {action}
                        </span>
                      ))}
                    </div>
                  </div>
                </FadeSection>
              ))}
            </div>
          </div>
        </div>

        {/* Ambient */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[180px]" style={{ background: 'rgba(0,168,120,0.08)' }} />
      </section>

      {/* ═══════════════════ CE QUI ME POUSSE ═══════════════════ */}
      <section className="py-24 md:py-32 px-6" style={{ background: '#F4F2EC' }}>
        <div className="container max-w-3xl">
          <FadeSection>
            <span className="block text-[10px] tracking-[0.18em] uppercase mb-4 text-center" style={{ fontFamily: "'DM Mono', monospace", color: '#00A878' }}>
              Le fuel personnel
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-16 text-center" style={{ fontFamily: "'Syne', sans-serif", color: '#0A0908' }}>
              Ce qui me
              <span style={{ color: '#00A878' }}> pousse.</span>
            </h2>
          </FadeSection>

          <div className="relative mx-auto max-w-[700px]">
            {/* Vertical green line */}
            <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full" style={{ background: '#00A878' }} />

            <div className="pl-8 md:pl-12 space-y-10">
              {motivationLines.map((line, i) => (
                <FadeSection key={i} delay={i * 0.1}>
                  <p className="text-xl sm:text-2xl md:text-[28px] font-medium leading-[1.6]" style={{ fontFamily: "'Syne', sans-serif", color: '#0A0908' }}>
                    {line.text.split(line.highlight).map((part, j, arr) => (
                      <span key={j}>
                        {part}
                        {j < arr.length - 1 && (
                          <span className="font-bold" style={{ color: '#00A878' }}>{line.highlight}</span>
                        )}
                      </span>
                    ))}
                  </p>
                </FadeSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <section className="py-20 px-6 text-center" style={{ background: '#0A0908' }}>
        <FadeSection>
          <p className="text-[10px] tracking-[0.2em] uppercase mb-6" style={{ fontFamily: "'DM Mono', monospace", color: '#555' }}>
            Créé le 1er mars 2025
          </p>
          <p className="text-xl sm:text-2xl font-semibold max-w-xl mx-auto leading-relaxed" style={{ fontFamily: "'Syne', sans-serif", color: '#888' }}>
            Ce projet n'appartient pas au futur.
            <br />
            <span className="font-bold" style={{ color: '#00A878' }}>
              Il commence aujourd'hui.
            </span>
          </p>
        </FadeSection>
      </section>
    </Layout>
  );
};

export default VisionEducation;
