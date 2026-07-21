"use client";

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView, useSpring } from 'framer-motion';
import {
  Shield, Crown, Coins, ScrollText, Gavel, BookOpen, Users, Lock,
  TrendingUp, Target, Sword, Eye, Flame, Building2, Sparkles, ArrowRight,
  Check, X, Compass, Star, Hexagon, Heart
} from 'lucide-react';
import Header from '@/components/layout/Header';

/* ============ Fonts ============ */
const FontLoader = () => {
  useEffect(() => {
    const l = document.createElement('link');
    l.href =
      'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';
    l.rel = 'stylesheet';
    document.head.appendChild(l);
    return () => { document.head.removeChild(l); };
  }, []);
  return null;
};

/* ============ Hooks ============ */
const useCountUp = (target: number, duration = 2000, start = false) => {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf: number; const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - t0) / duration, 1);
      setV(Math.floor(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return v;
};

const Reveal = ({ children, delay = 0, y = 40 }: any) => {
  const ref = useRef(null); const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
};

/* ============ Background SFX ============ */
const Constellation = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.18] pointer-events-none" viewBox="0 0 800 600" preserveAspectRatio="none">
    <defs>
      <radialGradient id="star">
        <stop offset="0%" stopColor="#F5C76A" stopOpacity="1" />
        <stop offset="100%" stopColor="#F5C76A" stopOpacity="0" />
      </radialGradient>
    </defs>
    {[[120,90],[210,140],[300,80],[380,180],[460,110],[560,200],[660,90],[720,180],[180,260],[340,300],[500,280],[620,340],[140,400],[280,440],[440,420],[580,460],[680,420],[760,500]].map(([x,y],i)=>(
      <g key={i}>
        <circle cx={x} cy={y} r="2" fill="url(#star)" />
        <circle cx={x} cy={y} r="0.8" fill="#F5C76A" />
      </g>
    ))}
    {[[[120,90],[210,140]],[[210,140],[300,80]],[[300,80],[380,180]],[[380,180],[460,110]],[[460,110],[560,200]],[[180,260],[340,300]],[[340,300],[500,280]],[[500,280],[620,340]]].map(([a,b],i)=>(
      <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#F5C76A" strokeWidth="0.4" opacity="0.5" />
    ))}
  </svg>
);

const GoldGrain = () => (
  <div className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.8'/%3E%3C/svg%3E\")" }} />
);

/* ============ HERO ============ */
const Hero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const op = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden flex items-center justify-center"
      style={{ background: 'radial-gradient(ellipse at 50% 30%, #1a1410 0%, #0a0805 70%)' }}>
      <Constellation />
      <GoldGrain />

      {/* Sun / Aegis */}
      <motion.div style={{ y: y2 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-[640px] h-[640px] max-w-[90vw] max-h-[90vw]">
          {/* outer glow */}
          <div className="absolute inset-0 rounded-full" style={{
            background: 'radial-gradient(circle, rgba(245,199,106,0.25) 0%, rgba(245,199,106,0.05) 40%, transparent 70%)'
          }} />
          {/* rotating rings */}
          <motion.svg viewBox="0 0 400 400" className="absolute inset-0"
            animate={{ rotate: 360 }} transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}>
            <circle cx="200" cy="200" r="180" fill="none" stroke="#C9A24C" strokeWidth="0.6" strokeDasharray="2 8" />
            <circle cx="200" cy="200" r="160" fill="none" stroke="#C9A24C" strokeWidth="0.4" strokeDasharray="1 12" />
          </motion.svg>
          <motion.svg viewBox="0 0 400 400" className="absolute inset-0"
            animate={{ rotate: -360 }} transition={{ duration: 180, repeat: Infinity, ease: 'linear' }}>
            <circle cx="200" cy="200" r="140" fill="none" stroke="#F5C76A" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.6" />
          </motion.svg>
          {/* hexagon emblem */}
          <svg viewBox="0 0 400 400" className="absolute inset-0">
            <defs>
              <linearGradient id="hexG" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F5C76A" />
                <stop offset="100%" stopColor="#8B6914" />
              </linearGradient>
            </defs>
            <polygon points="200,80 305,140 305,260 200,320 95,260 95,140"
              fill="none" stroke="url(#hexG)" strokeWidth="1.2" />
            <polygon points="200,110 280,154 280,246 200,290 120,246 120,154"
              fill="none" stroke="#F5C76A" strokeWidth="0.6" opacity="0.5" />
            {/* P monogram */}
            <text x="200" y="225" textAnchor="middle"
              style={{ fontFamily: 'Cinzel', fontSize: 110, fontWeight: 800, fill: '#F5C76A', letterSpacing: 4 }}>
              Π
            </text>
          </svg>
        </motion.div>
      </motion.div>

      {/* Content */}
      <motion.div style={{ y: y1, opacity: op }} className="relative z-10 text-center px-6 max-w-5xl">
        <Reveal>
          <div className="inline-flex items-center gap-3 mb-8 px-5 py-2 rounded-full border border-[#C9A24C]/30 backdrop-blur-sm">
            <Shield className="w-3.5 h-3.5 text-[#F5C76A]" />
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 3 }} className="text-[#F5C76A] uppercase">Club Privé · Fondé 2025</span>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <h1 style={{ fontFamily: 'Cinzel', fontWeight: 900, letterSpacing: '0.18em' }}
              className="text-7xl md:text-9xl text-transparent bg-clip-text mb-6"
              >
            <span style={{ background: 'linear-gradient(180deg, #F5C76A 0%, #C9A24C 50%, #8B6914 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>
              PERSEUS
            </span>
          </h1>
        </Reveal>

        <Reveal delay={0.4}>
          <p style={{ fontFamily: 'Cormorant Garamond', fontStyle: 'italic' }}
             className="text-2xl md:text-3xl text-[#E8D9B0] mb-4 font-light">
            « Couper la tête de Méduse — vaincre l'ignorance financière. »
          </p>
        </Reveal>

        <Reveal delay={0.6}>
          <p className="text-sm md:text-base text-[#9A8C6E] max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'Inter' }}>
            Un cercle fermé d'éducation financière et d'investissement. Nous lisons, nous débattons,
            nous capitalisons. Ensemble, nous bâtissons des fortunes patientes et une mémoire commune.
          </p>
        </Reveal>

        <Reveal delay={0.8}>
          <div className="mt-16 flex flex-col items-center gap-3">
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: 4 }} className="text-[#9A8C6E] uppercase">En hommage à mon petit frère</span>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <div className="w-px h-12 bg-gradient-to-b from-[#C9A24C] to-transparent" />
            </motion.div>
          </div>
        </Reveal>
      </motion.div>
    </section>
  );
};

/* ============ Manifesto ============ */
const Manifesto = () => (
  <section className="relative py-32 px-6" style={{ background: '#0a0805' }}>
    <GoldGrain />
    <div className="max-w-4xl mx-auto relative z-10">
      <Reveal>
        <div className="text-center mb-16">
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 4 }} className="text-[#C9A24C] uppercase">I · Le Serment</span>
          <div className="w-12 h-px bg-[#C9A24C] mx-auto mt-4" />
        </div>
      </Reveal>
      <Reveal delay={0.2}>
        <blockquote style={{ fontFamily: 'Cormorant Garamond', fontSize: '2rem', lineHeight: 1.5 }}
          className="text-[#E8D9B0] text-center font-light italic">
          « Nous ne sommes pas des spéculateurs.
          <br />Nous sommes des <span className="text-[#F5C76A] not-italic font-semibold">bâtisseurs patients</span>.
          <br />Nous lisons ce que la foule ignore.
          <br />Nous capitalisons quand la foule consomme.
          <br />Nous construisons une fortune qui survit à nos noms. »
        </blockquote>
      </Reveal>
      <Reveal delay={0.4}>
        <p className="text-center mt-16 text-sm text-[#9A8C6E]" style={{ fontFamily: 'Cinzel', letterSpacing: 4 }}>
          — LE CERCLE PERSEUS —
        </p>
      </Reveal>
    </div>
  </section>
);

/* ============ Mission / Vision / But ============ */
const Pillars = () => {
  const items = [
    { icon: Eye, title: 'Vision', text: 'Devenir le cercle de référence d\'investisseurs africains éclairés — patients, disciplinés, redoutables.' },
    { icon: Target, title: 'Mission', text: 'Bâtir un capital intellectuel et financier commun par la lecture, le débat et l\'investissement collectif.' },
    { icon: Flame, title: 'But', text: 'Atteindre, en dix ans, une masse critique qui nous permette de diriger des projets, des entreprises, une économie.' },
  ];
  return (
    <section className="relative py-32 px-6" style={{ background: 'linear-gradient(180deg, #0a0805 0%, #110c08 100%)' }}>
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="text-center mb-20">
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 4 }} className="text-[#C9A24C] uppercase">II · Les Trois Piliers</span>
            <h2 style={{ fontFamily: 'Cinzel', letterSpacing: '0.1em' }} className="text-5xl md:text-6xl text-[#F5C76A] mt-4">Vision · Mission · But</h2>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-8">
          {items.map((p, i) => (
            <Reveal key={i} delay={i * 0.15}>
              <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.4 }}
                className="relative p-10 rounded-2xl border border-[#C9A24C]/20 h-full group overflow-hidden"
                style={{ background: 'linear-gradient(180deg, rgba(201,162,76,0.04) 0%, transparent 100%)' }}>
                <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-[#F5C76A]/5 group-hover:bg-[#F5C76A]/10 transition-all duration-700" />
                <p.icon className="w-10 h-10 text-[#F5C76A] mb-6 relative z-10" strokeWidth={1.2} />
                <h3 style={{ fontFamily: 'Cinzel', letterSpacing: 3 }} className="text-2xl text-[#F5C76A] mb-4 relative z-10 uppercase">{p.title}</h3>
                <p style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.15rem', lineHeight: 1.6 }} className="text-[#C8B98F] italic relative z-10">{p.text}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============ Roles (Conseil) ============ */
const Council = () => {
  const roles = [
    { icon: Crown, title: 'Président', desc: 'Garde la vision, tranche en dernier ressort.', name: 'Le Fondateur' },
    { icon: Coins, title: 'Trésorier Général', desc: 'Garde le capital, tient la comptabilité, signe les mouvements.', name: 'Le Gardien des Coffres' },
    { icon: ScrollText, title: 'Secrétaire Général', desc: 'Organise les réunions hebdomadaires, tient l\'ordre du jour.', name: 'La Voix du Cercle' },
    { icon: BookOpen, title: 'Archives & Mémoire', desc: 'Conserve les procès-verbaux, les décisions, les lectures.', name: 'Le Chroniqueur' },
    { icon: Gavel, title: 'Avocat du Club', desc: 'Veille au respect des règles, encadre les sorties et conflits.', name: 'Le Juriste' },
  ];
  return (
    <section className="relative py-32 px-6 overflow-hidden" style={{ background: '#110c08' }}>
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="text-center mb-20">
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 4 }} className="text-[#C9A24C] uppercase">III · Le Conseil</span>
            <h2 style={{ fontFamily: 'Cinzel', letterSpacing: '0.1em' }} className="text-5xl md:text-6xl text-[#F5C76A] mt-4">Les Cinq Postes</h2>
            <p style={{ fontFamily: 'Cormorant Garamond' }} className="text-lg text-[#9A8C6E] italic mt-4">Évolutifs avec la croissance du cercle.</p>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((r, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <motion.div whileHover={{ scale: 1.02, borderColor: 'rgba(245,199,106,0.5)' }}
                className="relative p-8 rounded-xl border border-[#C9A24C]/20 h-full"
                style={{ background: 'radial-gradient(circle at top right, rgba(245,199,106,0.06) 0%, transparent 60%)' }}>
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 rounded-full border border-[#C9A24C]/40 flex items-center justify-center"
                    style={{ background: 'radial-gradient(circle, rgba(245,199,106,0.15) 0%, transparent 70%)' }}>
                    <r.icon className="w-6 h-6 text-[#F5C76A]" strokeWidth={1.2} />
                  </div>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: 2 }} className="text-[#9A8C6E]">0{i+1}</span>
                </div>
                <h3 style={{ fontFamily: 'Cinzel', letterSpacing: 2 }} className="text-xl text-[#F5C76A] mb-2 uppercase">{r.title}</h3>
                <p style={{ fontFamily: 'Cormorant Garamond' }} className="text-[#C8B98F]/70 italic text-sm mb-4">« {r.name} »</p>
                <p style={{ fontFamily: 'Inter' }} className="text-sm text-[#9A8C6E] leading-relaxed">{r.desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============ Roadmap ============ */
const Roadmap = () => {
  const phases = [
    { h: '6 MOIS', t: 'Le Fondement', d: 'Statuts, règlement intérieur, première bibliothèque commune. 12 livres lus, 4 certifications visées.', icon: Compass },
    { h: '1 AN', t: 'L\'Éducation', d: 'Maîtrise de la bourse, de l\'économie africaine et mondiale. Chaque membre dispose d\'un plan d\'investissement à 10 ans.', icon: BookOpen },
    { h: '3 ANS', t: 'Le Capital', d: 'Cotisations régulières, portefeuille collectif diversifié. Premiers investissements dans des entreprises ciblées.', icon: TrendingUp },
    { h: '10 ANS', t: 'L\'Empire', d: 'Locaux, investissements dans les projets de nos membres contre des parts. Influence sur une économie entière.', icon: Building2 },
  ];
  return (
    <section className="relative py-32 px-6" style={{ background: '#0a0805' }}>
      <GoldGrain />
      <div className="max-w-5xl mx-auto relative z-10">
        <Reveal>
          <div className="text-center mb-24">
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 4 }} className="text-[#C9A24C] uppercase">IV · La Trajectoire</span>
            <h2 style={{ fontFamily: 'Cinzel', letterSpacing: '0.1em' }} className="text-5xl md:text-6xl text-[#F5C76A] mt-4">Dix Années</h2>
          </div>
        </Reveal>

        <div className="relative">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#C9A24C]/60 to-transparent" />
          {phases.map((p, i) => (
            <Reveal key={i} delay={i * 0.15}>
              <div className={`relative flex items-center mb-20 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className="md:w-1/2 md:px-12">
                  <div className="p-8 rounded-2xl border border-[#C9A24C]/20"
                    style={{ background: 'linear-gradient(135deg, rgba(245,199,106,0.06), transparent)' }}>
                    <span style={{ fontFamily: 'JetBrains Mono', letterSpacing: 3, fontSize: 12 }} className="text-[#F5C76A]">{p.h}</span>
                    <h3 style={{ fontFamily: 'Cinzel', letterSpacing: 2 }} className="text-3xl text-[#F5C76A] mt-2 mb-4">{p.t}</h3>
                    <p style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.15rem' }} className="text-[#C8B98F] italic leading-relaxed">{p.d}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-2 border-[#C9A24C] flex items-center justify-center z-10"
                  style={{ background: '#0a0805', boxShadow: '0 0 30px rgba(245,199,106,0.3)' }}>
                  <p.icon className="w-5 h-5 text-[#F5C76A]" strokeWidth={1.5} />
                </div>
                <div className="md:w-1/2" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============ Rituals (weekly) ============ */
const Rituals = () => {
  const r = [
    { n: '01', t: 'Lecture obligatoire', d: 'Un livre par mois. Résumé écrit avant la réunion suivante.' },
    { n: '02', t: 'Débat hebdomadaire', d: 'Une heure de discussion sur un thème : macro, micro, géopolitique, valeur.' },
    { n: '03', t: 'Suivi des plans', d: 'Chaque membre présente l\'avancement de son plan d\'investissement personnel.' },
    { n: '04', t: 'Cotisation collective', d: 'Versement mensuel au trésor commun pour les positions du cercle.' },
    { n: '05', t: 'Formation & certification', d: 'CFA, AMF, Bloomberg, finance comportementale — niveau imposé.' },
    { n: '06', t: 'Veille partagée', d: 'Chaque membre alimente la mémoire commune : signaux, opportunités, risques.' },
  ];
  return (
    <section className="relative py-32 px-6" style={{ background: 'linear-gradient(180deg, #0a0805 0%, #110c08 100%)' }}>
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="text-center mb-20">
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 4 }} className="text-[#C9A24C] uppercase">V · Les Rituels</span>
            <h2 style={{ fontFamily: 'Cinzel', letterSpacing: '0.1em' }} className="text-5xl md:text-6xl text-[#F5C76A] mt-4">Le Travail du Cercle</h2>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#C9A24C]/10 border border-[#C9A24C]/10 rounded-2xl overflow-hidden">
          {r.map((x, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="p-10 h-full" style={{ background: '#0d0906' }}>
                <span style={{ fontFamily: 'Cinzel', fontSize: 40, fontWeight: 300 }} className="text-[#F5C76A]/30">{x.n}</span>
                <h3 style={{ fontFamily: 'Cinzel', letterSpacing: 2 }} className="text-xl text-[#F5C76A] mt-2 mb-3 uppercase">{x.t}</h3>
                <p style={{ fontFamily: 'Inter' }} className="text-sm text-[#9A8C6E] leading-relaxed">{x.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============ Rules : Commandements & Interdits ============ */
const Code = () => {
  const allow = [
    'Lire, débattre, écouter sans interrompre.',
    'Verser sa cotisation à date fixe, sans rappel.',
    'Présenter ses pertes avec la même clarté que ses gains.',
    'Parrainer une seule personne par an, et s\'en porter garant.',
    'Élever le niveau du cercle, jamais le tirer vers le bas.',
  ];
  const forbid = [
    'Trahir le secret des décisions internes.',
    'Spéculer avec le capital commun sans vote.',
    'Mentir sur ses chiffres ou son avancement.',
    'Faire entrer un inconnu sans parrainage validé.',
    'Utiliser le cercle pour un intérêt strictement personnel.',
  ];

  return (
    <section className="relative py-32 px-6" style={{ background: '#0a0805' }}>
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="text-center mb-20">
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 4 }} className="text-[#C9A24C] uppercase">VI · Le Code</span>
            <h2 style={{ fontFamily: 'Cinzel', letterSpacing: '0.1em' }} className="text-5xl md:text-6xl text-[#F5C76A] mt-4">Commandements & Interdits</h2>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-8">
          <Reveal>
            <div className="p-10 rounded-2xl border border-[#C9A24C]/30" style={{ background: 'linear-gradient(180deg, rgba(245,199,106,0.05), transparent)' }}>
              <div className="flex items-center gap-3 mb-8">
                <Star className="w-6 h-6 text-[#F5C76A]" strokeWidth={1.2} />
                <h3 style={{ fontFamily: 'Cinzel', letterSpacing: 3 }} className="text-2xl text-[#F5C76A] uppercase">Les Devoirs</h3>
              </div>
              <ul className="space-y-5">
                {allow.map((t, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <Check className="w-5 h-5 text-[#F5C76A] mt-1 shrink-0" strokeWidth={1.5} />
                    <span style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.15rem' }} className="text-[#C8B98F] italic leading-relaxed">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="p-10 rounded-2xl border border-red-900/30" style={{ background: 'linear-gradient(180deg, rgba(139,30,30,0.06), transparent)' }}>
              <div className="flex items-center gap-3 mb-8">
                <Sword className="w-6 h-6 text-red-400" strokeWidth={1.2} />
                <h3 style={{ fontFamily: 'Cinzel', letterSpacing: 3 }} className="text-2xl text-red-300 uppercase">Les Interdits</h3>
              </div>
              <ul className="space-y-5">
                {forbid.map((t, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <X className="w-5 h-5 text-red-400 mt-1 shrink-0" strokeWidth={1.5} />
                    <span style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.15rem' }} className="text-[#C8B98F] italic leading-relaxed">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

/* ============ Entry & Exit ============ */
const Gate = () => (
  <section className="relative py-32 px-6" style={{ background: 'linear-gradient(180deg, #110c08 0%, #0a0805 100%)' }}>
    <div className="max-w-5xl mx-auto">
      <Reveal>
        <div className="text-center mb-20">
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 4 }} className="text-[#C9A24C] uppercase">VII · La Porte</span>
          <h2 style={{ fontFamily: 'Cinzel', letterSpacing: '0.1em' }} className="text-5xl md:text-6xl text-[#F5C76A] mt-4">Entrer · Sortir</h2>
        </div>
      </Reveal>
      <div className="grid md:grid-cols-2 gap-8">
        <Reveal>
          <div className="p-10 rounded-2xl border border-[#C9A24C]/20" style={{ background: '#0d0906' }}>
            <Users className="w-8 h-8 text-[#F5C76A] mb-6" strokeWidth={1.2} />
            <h3 style={{ fontFamily: 'Cinzel', letterSpacing: 2 }} className="text-2xl text-[#F5C76A] uppercase mb-6">Parrainage</h3>
            <ol className="space-y-4 text-[#C8B98F]" style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: 1.7 }}>
              <li><span className="text-[#F5C76A] font-mono mr-3">01.</span> Un seul filleul par membre, par an.</li>
              <li><span className="text-[#F5C76A] font-mono mr-3">02.</span> Le parrain se porte garant moralement et financièrement.</li>
              <li><span className="text-[#F5C76A] font-mono mr-3">03.</span> Période d'observation de 3 mois avant vote final.</li>
              <li><span className="text-[#F5C76A] font-mono mr-3">04.</span> Vote à l'unanimité du conseil pour l'admission.</li>
              <li><span className="text-[#F5C76A] font-mono mr-3">05.</span> Faute grave du filleul = exclusion du parrain.</li>
            </ol>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="p-10 rounded-2xl border border-[#C9A24C]/20" style={{ background: '#0d0906' }}>
            <Lock className="w-8 h-8 text-[#F5C76A] mb-6" strokeWidth={1.2} />
            <h3 style={{ fontFamily: 'Cinzel', letterSpacing: 2 }} className="text-2xl text-[#F5C76A] uppercase mb-6">Sortie Propre</h3>
            <ol className="space-y-4 text-[#C8B98F]" style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: 1.7 }}>
              <li><span className="text-[#F5C76A] font-mono mr-3">01.</span> Restitution de la quote-part au prix de marché.</li>
              <li><span className="text-[#F5C76A] font-mono mr-3">02.</span> Délai de remboursement fixé à 90 jours maximum.</li>
              <li><span className="text-[#F5C76A] font-mono mr-3">03.</span> Clause de confidentialité maintenue à vie.</li>
              <li><span className="text-[#F5C76A] font-mono mr-3">04.</span> Aucun impact sur les positions du cercle restant.</li>
              <li><span className="text-[#F5C76A] font-mono mr-3">05.</span> Sortie volontaire ou exclusion : même procédure.</li>
            </ol>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ============ Numbers ============ */
const Numbers = () => {
  const ref = useRef(null); const inView = useInView(ref, { once: true, margin: '-100px' });
  const a = useCountUp(12, 2000, inView);
  const b = useCountUp(52, 2000, inView);
  const c = useCountUp(10, 2000, inView);
  const d = useCountUp(1, 1500, inView);
  return (
    <section ref={ref} className="relative py-32 px-6" style={{ background: '#0a0805' }}>
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="text-center mb-20">
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 4 }} className="text-[#C9A24C] uppercase">VIII · La Mesure</span>
            <h2 style={{ fontFamily: 'Cinzel', letterSpacing: '0.1em' }} className="text-5xl md:text-6xl text-[#F5C76A] mt-4">Les Chiffres du Cercle</h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#C9A24C]/10 rounded-2xl overflow-hidden border border-[#C9A24C]/10">
          {[
            { v: a, suf: '', l: 'Livres / an / membre' },
            { v: b, suf: '', l: 'Réunions par an' },
            { v: c, suf: ' ans', l: 'Horizon stratégique' },
            { v: d, suf: ' filleul', l: 'Par membre par an' },
          ].map((s, i) => (
            <div key={i} className="p-10 text-center" style={{ background: '#0d0906' }}>
              <div style={{ fontFamily: 'Cinzel', fontWeight: 700 }} className="text-5xl md:text-6xl text-[#F5C76A]">
                {s.v}{s.suf}
              </div>
              <p style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: 2 }} className="text-[#9A8C6E] uppercase mt-4">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============ Dedication ============ */
const Dedication = () => (
  <section className="relative py-40 px-6 overflow-hidden" style={{ background: 'radial-gradient(ellipse at center, #1a1410 0%, #0a0805 70%)' }}>
    <Constellation />
    <div className="max-w-3xl mx-auto text-center relative z-10">
      <Reveal>
        <Heart className="w-10 h-10 text-[#F5C76A] mx-auto mb-8" strokeWidth={1} />
      </Reveal>
      <Reveal delay={0.2}>
        <p style={{ fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 4 }} className="text-[#C9A24C] uppercase mb-8">En hommage à</p>
      </Reveal>
      <Reveal delay={0.3}>
        <h2 style={{ fontFamily: 'Cinzel', letterSpacing: '0.2em', fontWeight: 700 }} className="text-5xl md:text-7xl text-[#F5C76A] mb-10">
          PERSEUS
        </h2>
      </Reveal>
      <Reveal delay={0.5}>
        <p style={{ fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontSize: '1.5rem', lineHeight: 1.6 }} className="text-[#E8D9B0]">
          « Ce cercle porte ton nom.
          <br />Chaque livre lu, chaque décision prise, chaque fortune bâtie
          <br />sera une lettre écrite à ta mémoire. »
        </p>
      </Reveal>
      <Reveal delay={0.7}>
        <div className="mt-16 flex items-center justify-center gap-4">
          <div className="w-16 h-px bg-[#C9A24C]" />
          <Sparkles className="w-4 h-4 text-[#F5C76A]" />
          <div className="w-16 h-px bg-[#C9A24C]" />
        </div>
      </Reveal>
    </div>
  </section>
);

/* ============ MAIN ============ */
const Perseus = () => {
  return (
    <div className="min-h-screen" style={{ background: '#0a0805' }}>
      <FontLoader />
      <Header />
      <Hero />
      <Manifesto />
      <Pillars />
      <Council />
      <Roadmap />
      <Rituals />
      <Code />
      <Gate />
      <Numbers />
      <Dedication />
      <footer className="py-10 text-center border-t border-[#C9A24C]/10" style={{ background: '#0a0805' }}>
        <p style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: 3 }} className="text-[#9A8C6E] uppercase">
          Cercle Perseus · MMXXV · Sub Rosa
        </p>
      </footer>
    </div>
  );
};

export default Perseus;
