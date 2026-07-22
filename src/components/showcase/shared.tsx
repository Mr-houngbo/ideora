"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import type { Project } from "@/types/project";

export interface ShowcaseComponentProps {
  project: Project;
}

export function Reveal({ children, delay = 0, y = 32 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function useCountUp(target: number, start: boolean, duration = 1400) {
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

export function useCountdownDays(sinceIso: string) {
  const [days, setDays] = useState(0);
  useEffect(() => {
    const since = new Date(sinceIso).getTime();
    setDays(Math.max(0, Math.floor((Date.now() - since) / (1000 * 60 * 60 * 24))));
  }, [sinceIso]);
  return days;
}
