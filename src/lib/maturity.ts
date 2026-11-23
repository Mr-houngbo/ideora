import type { Project } from "@/types/project";

export interface MaturityCheck {
  key: string;
  label: string;
  done: boolean;
}

export interface Maturity {
  score: number; // 0..checks.length
  total: number;
  level: "Esquisse" | "Décrite" | "Approfondie" | "Documentée";
  checks: MaturityCheck[];
}

/**
 * How far an idea's page has been fleshed out, from what is filled in. It is
 * an invitation to enrich one-line ideas, not a judgement on the idea.
 */
export function getMaturity(p: Project): Maturity {
  const checks: MaturityCheck[] = [
    { key: "resume", label: "Un résumé", done: p.description_courte.trim().length >= 20 },
    { key: "description", label: "Une description détaillée", done: p.description_detaillee.trim().length >= 200 },
    { key: "motivation", label: "Ta motivation", done: p.motivation.trim().length >= 40 },
    { key: "ressources", label: "Des ressources", done: p.ressources.trim().length > 0 },
    { key: "tags", label: "Au moins 3 tags", done: p.tags.length >= 3 },
    { key: "visuel", label: "Une image ou un dossier riche", done: Boolean(p.image_url) || p.contenu_riche.trim().length > 0 },
  ];
  const score = checks.filter((c) => c.done).length;
  const level = score <= 1 ? "Esquisse" : score <= 3 ? "Décrite" : score <= 5 ? "Approfondie" : "Documentée";
  return { score, total: checks.length, level, checks };
}
