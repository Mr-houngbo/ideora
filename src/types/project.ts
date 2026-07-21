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
  est_public: boolean;
  image_url: string | null;
}

export type ProjectFormData = Omit<Project, 'id' | 'date_creation'>;

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
