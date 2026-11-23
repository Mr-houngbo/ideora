import type { WorkspaceStore } from './workspace';

export type ProjectStatus = 'idee' | 'en_cours' | 'en_pause' | 'termine' | 'abandonne';
export type TimeHorizon = 'court_terme' | 'moyen_terme' | 'long_terme';

export interface Project {
  id: string;
  titre: string;
  categorie: string;
  description_courte: string;
  description_detaillee: string;
  statut: ProjectStatus;
  horizon_temps: TimeHorizon;
  tags: string[];
  motivation: string;
  ressources: string;
  date_creation: string;
  image_url: string | null;
  contenu_riche: string;
  accent_theme: string | null;
  est_espace_travail: boolean;
  workspace_data: WorkspaceStore | null;
  custom_template: string | null;
  /** The next concrete action ("" when none). */
  prochaine_etape: string;
  /** Its target day, YYYY-MM-DD. */
  prochaine_etape_date: string | null;
  /** Picked by hand for the home page "À la une". */
  a_la_une: boolean;
  mis_a_jour_le: string;
}

export type JournalType = 'note' | 'jalon' | 'statut' | 'promesse';

export interface JournalEntry {
  id: string;
  project_id: string;
  type: JournalType;
  titre: string;
  contenu: string;
  /** jalon: target day; promesse: day to read it again (YYYY-MM-DD). */
  date_prevue: string | null;
  /** jalon reached, or promesse read again. */
  fait_le: string | null;
  ecrit_le: string;
}

export const JOURNAL_LABELS: Record<JournalType, string> = {
  note: 'Note',
  jalon: 'Jalon',
  statut: 'Statut',
  promesse: 'Promesse au moi futur',
};

export type ProjectFormData = Omit<Project, 'id' | 'date_creation' | 'workspace_data' | 'custom_template' | 'mis_a_jour_le'> & {
  /** Day the idea was first recorded, as YYYY-MM-DD. */
  date_idee: string;
};

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  idee: 'Idée',
  en_cours: 'En cours',
  en_pause: 'En pause',
  termine: 'Terminé',
  abandonne: 'Abandonné',
};

export const STATUS_COLORS: Record<ProjectStatus, string> = {
  idee: 'bg-info/10 text-info border-info/20',
  en_cours: 'bg-success/10 text-success border-success/20',
  en_pause: 'bg-warning/10 text-warning border-warning/20',
  termine: 'bg-primary/10 text-primary border-primary/20',
  abandonne: 'bg-muted text-muted-foreground border-muted',
};

export const HORIZON_LABELS: Record<TimeHorizon, string> = {
  court_terme: 'Court terme',
  moyen_terme: 'Moyen terme',
  long_terme: 'Long terme',
};

export const HORIZON_COLORS: Record<TimeHorizon, string> = {
  court_terme: 'bg-accent/10 text-accent',
  moyen_terme: 'bg-primary/10 text-primary',
  long_terme: 'bg-secondary text-secondary-foreground',
};

export const CATEGORIES_ENTREPRISE = [
  'Tech',
  'Business',
  'Créatif',
  'Personnel',
  'Santé',
  'Social',
  'Éducation',
  'Autre',
];

export const CATEGORIES_EDUCATION = [
  'Master',
  'Certification',
  'Formation',
  'Cours en ligne',
  'Bootcamp',
];

export const CATEGORIES = [...CATEGORIES_ENTREPRISE, ...CATEGORIES_EDUCATION];

export const isEducationCategory = (category: string): boolean =>
  CATEGORIES_EDUCATION.includes(category);
